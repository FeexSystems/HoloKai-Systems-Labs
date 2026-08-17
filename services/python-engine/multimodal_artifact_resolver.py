from __future__ import annotations

import json
import os
import re
from dataclasses import dataclass
from typing import Any, Iterable

from .fixtures.artifact_seed_fixtures import DEVELOPMENT_SEED_ARTIFACTS


@dataclass
class Candidate:
    entity_id: str
    label: str
    score: float
    sources: list[dict[str, Any]]
    knowledge: dict[str, Any]
    conflicts: list[dict[str, Any]]


class PgVectorRetriever:
    """PGVector retrieval over HoloKai embeddings table."""

    def __init__(self) -> None:
        self.database_url = os.getenv('DATABASE_URL')
        self.table = os.getenv('HOLOKAI_PGVECTOR_TABLE', 'holokai_embeddings')

    def is_available(self) -> bool:
        return bool(self.database_url and self.database_url.strip())

    def search(self, embedding: list[float], limit: int = 8) -> tuple[list[dict[str, Any]], str]:
        if not self.is_available() or not embedding:
            return [], 'VECTOR_UNAVAILABLE' if not self.is_available() else 'NO_EMBEDDING'
        
        try:
            import psycopg
            from psycopg.rows import dict_row
            vector = '[' + ','.join(str(float(x)) for x in embedding) + ']'
            query = f'''SELECT entity_id, content, metadata,
                               1 - (embedding <=> %s::vector) AS score
                        FROM {self.table}
                        ORDER BY embedding <=> %s::vector
                        LIMIT %s'''
            with psycopg.connect(self.database_url, row_factory=dict_row) as conn:
                with conn.cursor() as cur:
                    cur.execute(query, (vector, vector, limit))
                    return [dict(row) for row in cur.fetchall()], 'AVAILABLE'
        except Exception:
            return [], 'VECTOR_UNAVAILABLE'


class KnowledgeGraphRetriever:
    """Neo4j neighborhood & relationship retrieval."""

    def __init__(self) -> None:
        self.uri = os.getenv('NEO4J_URI')
        self.user = os.getenv('NEO4J_USER')
        self.password = os.getenv('NEO4J_PASSWORD')

    def is_available(self) -> bool:
        return bool(self.uri and self.user and self.password)

    def neighborhood(self, entity_ids: Iterable[str], limit: int = 12) -> tuple[list[dict[str, Any]], str]:
        if not self.is_available():
            return [], 'GRAPH_UNAVAILABLE'
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
            return rows, 'AVAILABLE'
        except Exception:
            return [], 'GRAPH_UNAVAILABLE'


class MetadataAliasRetriever:
    """Lexical matching over canonical entities and aliases."""

    def __init__(self, records: list[dict[str, Any]] | None = None) -> None:
        self.records = records if records is not None else DEVELOPMENT_SEED_ARTIFACTS

    @staticmethod
    def _tokens(text: str) -> set[str]:
        return {x for x in re.findall(r'[a-z0-9]+', text.lower()) if len(x) > 2}

    def search(self, query: str, limit: int = 12) -> list[dict[str, Any]]:
        q = self._tokens(query)
        scored: list[tuple[float, dict[str, Any]]] = []
        for record in self.records:
            aliases = record.get('aliases', [])
            text = ' '.join([
                str(record.get('canonical_name', record.get('name', ''))),
                str(record.get('label', '')),
                *map(str, aliases),
            ])
            tokens = self._tokens(text)
            if not q or not tokens:
                continue
            overlap = len(q & tokens) / max(1, len(q))
            exact = 1.0 if query.strip().lower() in text.lower() else 0.0
            score = min(1.0, 0.7 * overlap + 0.3 * exact)
            if score > 0:
                scored.append((score, record))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [{**record, 'score': score, 'status': 'AVAILABLE'} for score, record in scored[:limit]]


class EvidenceFusion:
    """Fuse multi-channel evidence with explicit weights and conflict deductions."""

    WEIGHTS = {
        'vector': 0.35,
        'graph': 0.25,
        'metadata': 0.25,
        'provenance': 0.15,
    }

    def rank(
        self,
        perception: dict[str, Any],
        vector_rows: list[dict[str, Any]],
        graph_rows: list[dict[str, Any]],
        metadata_rows: list[dict[str, Any]],
        vector_status: str = 'AVAILABLE',
        graph_status: str = 'AVAILABLE',
    ) -> list[Candidate]:
        buckets: dict[str, Candidate] = {}
        perception_label = str(perception.get('label', perception.get('detection', {}).get('label', '')))
        perception_conf = max(0.0, min(1.0, float(perception.get('confidence', perception.get('detector', {}).get('confidence', 0.0)))))

        def ensure(entity_id: str, label: str = 'unknown') -> Candidate:
            if entity_id not in buckets:
                buckets[entity_id] = Candidate(entity_id, label, 0.0, [], {}, [])
            return buckets[entity_id]

        for row in vector_rows:
            entity_id = str(row.get('entity_id') or row.get('candidateId') or '')
            if not entity_id:
                continue
            c = ensure(entity_id, str(row.get('metadata', {}).get('name', row.get('canonical_name', entity_id))))
            score = max(0.0, min(1.0, float(row.get('score', 0.0))))
            c.sources.append({'source': 'vector', 'score': score, 'status': vector_status, 'payload': row})
            c.knowledge.update(row.get('metadata') or {})

        for row in metadata_rows:
            entity_id = str(row.get('id') or row.get('entity_id') or row.get('candidateId') or '')
            if not entity_id:
                continue
            c = ensure(entity_id, str(row.get('canonical_name', row.get('label', entity_id))))
            score = max(0.0, min(1.0, float(row.get('score', 0.0))))
            c.sources.append({'source': 'metadata', 'score': score, 'status': 'AVAILABLE', 'payload': row})
            c.knowledge.update(row)

        graph_by_entity: dict[str, int] = {}
        for row in graph_rows:
            entity_id = str(row.get('entity_id', ''))
            if entity_id:
                graph_by_entity[entity_id] = graph_by_entity.get(entity_id, 0) + 1
        for entity_id, count in graph_by_entity.items():
            c = ensure(entity_id)
            score = min(1.0, count / 4.0)
            c.sources.append({'source': 'graph', 'score': score, 'status': graph_status, 'neighborCount': count})

        for candidate_id, c in buckets.items():
            scores_by_channel = {s['source']: s['score'] for s in c.sources if s.get('status') == 'AVAILABLE'}
            available_weights = sum(self.WEIGHTS[k] for k in scores_by_channel)
            evidence_fused = (
                sum(self.WEIGHTS[k] * scores_by_channel[k] for k in scores_by_channel) / available_weights
                if available_weights > 0 else 0.0
            )

            # Conflict checking
            conflict_penalty = 0.0
            cand_lower = candidate_id.lower()
            if perception_label and ('nok' in perception_label.lower()) and ('ife' in cand_lower):
                conflict_penalty = 0.25
                c.conflicts.append({
                    'type': 'CIVILIZATION_MISMATCH',
                    'detail': f"Perception label '{perception_label}' conflicts with candidate civilization in '{candidate_id}'",
                    'penalty': 0.25,
                })

            final_fused = max(0.0, min(1.0, (0.65 * evidence_fused + 0.35 * perception_conf) - conflict_penalty))
            c.score = final_fused

        return sorted(buckets.values(), key=lambda x: x.score, reverse=True)


class MultimodalArtifactResolver:
    """Multimodal Artifact Resolver combining PGVector, Neo4j, Metadata, and Evidence Fusion."""

    def __init__(self, records: list[dict[str, Any]] | None = None) -> None:
        self.vector = PgVectorRetriever()
        self.graph = KnowledgeGraphRetriever()
        self.metadata = MetadataAliasRetriever(records)
        self.fusion = EvidenceFusion()

    def resolve(self, perception: dict[str, Any], embedding: list[float] | None = None) -> dict[str, Any]:
        query = ' '.join(str(x) for x in [
            perception.get('label', ''),
            perception.get('detection', {}).get('label', ''),
            perception.get('semanticType', ''),
            perception.get('ocrText', ''),
        ] if x)

        vector_rows, vector_status = self.vector.search(embedding or [], limit=8)
        metadata_rows = self.metadata.search(query, limit=12)
        seed_ids = [str(x.get('id') or x.get('entity_id')) for x in (vector_rows + metadata_rows) if x.get('id') or x.get('entity_id')]
        graph_rows, graph_status = self.graph.neighborhood(seed_ids, limit=16)

        ranked = self.fusion.rank(
            perception=perception,
            vector_rows=vector_rows,
            graph_rows=graph_rows,
            metadata_rows=metadata_rows,
            vector_status=vector_status,
            graph_status=graph_status,
        )

        if not ranked:
            status = 'UNRESOLVED'
            top = None
            candidate_ids = []
        else:
            top = ranked[0]
            second_score = ranked[1].score if len(ranked) > 1 else 0.0
            margin = top.score - second_score
            candidate_ids = [c.entity_id for c in ranked]

            if len(ranked) > 1 and margin < 0.06 and top.score >= 0.50:
                status = 'AMBIGUOUS'
            elif top.conflicts and top.score < 0.82:
                status = 'AMBIGUOUS' if len(ranked) > 1 else 'UNRESOLVED'
            elif top.score < 0.82:
                status = 'UNRESOLVED'
            else:
                status = 'RESOLVED'

        return {
            'status': status,
            'entityId': top.entity_id if (top and status == 'RESOLVED') else None,
            'entity': None if top is None else {
                'entityId': top.entity_id,
                'name': top.label,
                'civilization': top.knowledge.get('civilization'),
                'epistemicStatus': top.knowledge.get('epistemic_status', 'ESTABLISHED'),
                'matchScore': round(min(1.0, top.score), 4),
                'knowledge': top.knowledge,
                'evidence': top.sources,
            },
            'candidates': [
                {'entityId': c.entity_id, 'name': c.label, 'score': round(min(1.0, c.score), 4)}
                for c in ranked[:8]
            ],
            'candidateIds': candidate_ids,
            'matchScore': round(top.score, 4) if top else 0.0,
            'vectorStatus': vector_status,
            'graphStatus': graph_status,
            'resolver': 'holokai-multimodal-artifact-resolver-v2.2',
        }
