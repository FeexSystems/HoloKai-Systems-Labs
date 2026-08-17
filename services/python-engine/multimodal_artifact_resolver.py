from __future__ import annotations

import json
import math
import os
import re
from dataclasses import dataclass
from typing import Any, Iterable

import psycopg
from psycopg.rows import dict_row


@dataclass
class Candidate:
    entity_id: str
    label: str
    score: float
    sources: list[dict[str, Any]]
    knowledge: dict[str, Any]


class PgVectorRetriever:
    """Optional PGVector retrieval over a HoloKai embeddings table.

    Expected table columns: entity_id, content, embedding, metadata (jsonb).
    Configure DATABASE_URL and HOLOKAI_PGVECTOR_TABLE. The embedding provider
    is injected by the caller so this component stays model-agnostic.
    """

    def __init__(self) -> None:
        self.database_url = os.getenv('DATABASE_URL')
        self.table = os.getenv('HOLOKAI_PGVECTOR_TABLE', 'holokai_embeddings')

    def search(self, embedding: list[float], limit: int = 8) -> list[dict[str, Any]]:
        if not self.database_url or not embedding:
            return []
        vector = '[' + ','.join(str(float(x)) for x in embedding) + ']'
        query = f'''SELECT entity_id, content, metadata,
                           1 - (embedding <=> %s::vector) AS score
                    FROM {self.table}
                    ORDER BY embedding <=> %s::vector
                    LIMIT %s'''
        try:
            with psycopg.connect(self.database_url, row_factory=dict_row) as conn:
                with conn.cursor() as cur:
                    cur.execute(query, (vector, vector, limit))
                    return [dict(row) for row in cur.fetchall()]
        except Exception:
            return []


class KnowledgeGraphRetriever:
    """Optional Neo4j neighborhood retrieval.

    Configure NEO4J_URI, NEO4J_USER and NEO4J_PASSWORD. The query is deliberately
    small and read-only: identity resolution must not mutate the graph.
    """

    def __init__(self) -> None:
        self.uri = os.getenv('NEO4J_URI')
        self.user = os.getenv('NEO4J_USER')
        self.password = os.getenv('NEO4J_PASSWORD')

    def neighborhood(self, entity_ids: Iterable[str], limit: int = 12) -> list[dict[str, Any]]:
        if not (self.uri and self.user and self.password):
            return []
        try:
            from neo4j import GraphDatabase
            driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))
            ids = list(entity_ids)
            query = '''
            MATCH (e)
            WHERE e.id IN $ids
            OPTIONAL MATCH (e)-[r]-(n)
            RETURN e.id AS entity_id, type(r) AS relation,
                   n.id AS neighbor_id, n.name AS neighbor_name,
                   n.civilization AS civilization
            LIMIT $limit
            '''
            with driver.session() as session:
                rows = [dict(x) for x in session.run(query, ids=ids, limit=limit)]
            driver.close()
            return rows
        except Exception:
            return []


class MetadataAliasRetriever:
    """Fast lexical candidate generation from normalized artifact metadata."""

    def __init__(self, records: list[dict[str, Any]] | None = None) -> None:
        self.records = records or []

    @staticmethod
    def _tokens(text: str) -> set[str]:
        return {x for x in re.findall(r'[a-z0-9]+', text.lower()) if len(x) > 2}

    def search(self, query: str, limit: int = 12) -> list[dict[str, Any]]:
        q = self._tokens(query)
        scored: list[tuple[float, dict[str, Any]]] = []
        for record in self.records:
            aliases = record.get('aliases', [])
            text = ' '.join([str(record.get('name', '')), str(record.get('label', '')), *map(str, aliases)])
            tokens = self._tokens(text)
            if not q or not tokens:
                continue
            overlap = len(q & tokens) / max(1, len(q))
            exact = 1.0 if query.strip().lower() in text.lower() else 0.0
            score = min(1.0, 0.7 * overlap + 0.3 * exact)
            if score > 0:
                scored.append((score, record))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [{**record, 'score': score} for score, record in scored[:limit]]


class EvidenceFusion:
    """Fuse independent retrieval channels without conflating evidence with truth."""

    WEIGHTS = {'vector': 0.40, 'graph': 0.25, 'metadata': 0.20, 'perception': 0.15}

    def rank(
        self,
        perception: dict[str, Any],
        vector_rows: list[dict[str, Any]],
        graph_rows: list[dict[str, Any]],
        metadata_rows: list[dict[str, Any]],
    ) -> list[Candidate]:
        buckets: dict[str, Candidate] = {}

        def ensure(entity_id: str, label: str = 'unknown') -> Candidate:
            if entity_id not in buckets:
                buckets[entity_id] = Candidate(entity_id, label, 0.0, [], {})
            return buckets[entity_id]

        for row in vector_rows:
            entity_id = str(row.get('entity_id', ''))
            if not entity_id:
                continue
            c = ensure(entity_id, str(row.get('metadata', {}).get('name', row.get('content', 'unknown'))))
            score = float(row.get('score', 0.0) or 0.0)
            c.score += self.WEIGHTS['vector'] * max(0.0, min(1.0, score))
            c.sources.append({'type': 'pgvector', 'score': score, 'content': row.get('content')})
            c.knowledge.update(row.get('metadata') or {})

        for row in metadata_rows:
            entity_id = str(row.get('entity_id') or row.get('id') or '')
            if not entity_id:
                continue
            c = ensure(entity_id, str(row.get('name', row.get('label', 'unknown'))))
            score = float(row.get('score', 0.0) or 0.0)
            c.score += self.WEIGHTS['metadata'] * max(0.0, min(1.0, score))
            c.sources.append({'type': 'metadata_alias', 'score': score})
            c.knowledge.update(row)

        graph_by_entity: dict[str, int] = {}
        for row in graph_rows:
            entity_id = str(row.get('entity_id', ''))
            if entity_id:
                graph_by_entity[entity_id] = graph_by_entity.get(entity_id, 0) + 1
        for entity_id, count in graph_by_entity.items():
            c = ensure(entity_id)
            graph_score = min(1.0, count / 4.0)
            c.score += self.WEIGHTS['graph'] * graph_score
            c.sources.append({'type': 'knowledge_graph', 'neighborCount': count})

        perception_score = float(perception.get('confidence', 0.0) or 0.0)
        label = str(perception.get('label', 'unknown'))
        for c in buckets.values():
            c.score += self.WEIGHTS['perception'] * max(0.0, min(1.0, perception_score))
            if c.label == 'unknown':
                c.label = label
        return sorted(buckets.values(), key=lambda x: x.score, reverse=True)


class MultimodalArtifactResolver:
    def __init__(self, records: list[dict[str, Any]] | None = None) -> None:
        self.vector = PgVectorRetriever()
        self.graph = KnowledgeGraphRetriever()
        self.metadata = MetadataAliasRetriever(records)
        self.fusion = EvidenceFusion()

    def resolve(self, perception: dict[str, Any], embedding: list[float] | None = None) -> dict[str, Any]:
        query = ' '.join(str(x) for x in [perception.get('label', ''), perception.get('semanticType', ''), perception.get('ocrText', '')] if x)
        vector_rows = self.vector.search(embedding or [], limit=8)
        metadata_rows = self.metadata.search(query, limit=12)
        seed_ids = [str(x.get('entity_id') or x.get('id')) for x in vector_rows + metadata_rows if x.get('entity_id') or x.get('id')]
        graph_rows = self.graph.neighborhood(seed_ids, limit=16)
        ranked = self.fusion.rank(perception, vector_rows, graph_rows, metadata_rows)

        if not ranked:
            status = 'UNRESOLVED'
            top = None
        else:
            top = ranked[0]
            second = ranked[1].score if len(ranked) > 1 else 0.0
            margin = top.score - second
            status = 'RESOLVED' if top.score >= 0.65 and margin >= 0.08 else 'AMBIGUOUS'

        return {
            'status': status,
            'entity': None if top is None else {
                'entityId': top.entity_id,
                'name': top.label,
                'matchScore': round(min(1.0, top.score), 4),
                'knowledge': top.knowledge,
                'evidence': top.sources,
            },
            'candidates': [
                {'entityId': c.entity_id, 'name': c.label, 'score': round(min(1.0, c.score), 4)}
                for c in ranked[:8]
            ],
            'resolver': 'holokai-multimodal-artifact-resolver-v2.1',
        }
