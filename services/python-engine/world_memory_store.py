"""HoloKai World Model v1 Persistent Memory Store.

Manages persistent operational storage of cultural artifact entities,
physical observations, multi-channel evidence trails, and state events.
Uses PostgreSQL / Supabase when configured, with deterministic local fallback.
"""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


class WorldMemoryStore:
    def __init__(self, database_url: str | None = None, local_db_path: str | None = None) -> None:
        self.database_url = database_url or os.getenv('DATABASE_URL')
        self.local_db_path = local_db_path or os.getenv(
            'HOLOKAI_LOCAL_MEMORY_DB',
            str(Path(__file__).parent / 'world_memory_local.db')
        )
        self._init_local_db()

    def _get_connection(self) -> sqlite3.Connection:
        return sqlite3.connect(self.local_db_path)

    def _init_local_db(self) -> None:
        """Initialize local SQLite tables to guarantee persistence even without live Postgres."""
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                CREATE TABLE IF NOT EXISTS artifact_world_entities (
                    id TEXT PRIMARY KEY,
                    entity_type TEXT NOT NULL,
                    canonical_name TEXT NOT NULL,
                    civilization TEXT,
                    historical_period TEXT,
                    epistemic_status TEXT NOT NULL,
                    metadata TEXT NOT NULL,
                    provenance TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS artifact_observations (
                    observation_id TEXT PRIMARY KEY,
                    entity_id TEXT,
                    observed_at TEXT NOT NULL,
                    frame_id TEXT NOT NULL,
                    spatial_status TEXT NOT NULL,
                    pose6d TEXT NOT NULL,
                    perception TEXT NOT NULL,
                    identity TEXT NOT NULL,
                    epistemic TEXT NOT NULL,
                    provenance TEXT NOT NULL,
                    raw_observation TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS artifact_resolutions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    observation_id TEXT NOT NULL,
                    entity_id TEXT,
                    status TEXT NOT NULL,
                    match_score REAL NOT NULL,
                    channel_scores TEXT NOT NULL,
                    conflict_penalty REAL NOT NULL,
                    policy_version TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS artifact_evidence (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    observation_id TEXT NOT NULL,
                    candidate_id TEXT NOT NULL,
                    source_type TEXT NOT NULL,
                    score REAL NOT NULL,
                    source_reference TEXT,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            conn.commit()
        finally:
            conn.close()

    def save_entity(self, entity: dict[str, Any]) -> str:
        entity_id = str(entity.get('id') or entity.get('entityId'))
        now = datetime.now(timezone.utc).isoformat()
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO artifact_world_entities (
                    id, entity_type, canonical_name, civilization, historical_period,
                    epistemic_status, metadata, provenance, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    canonical_name=excluded.canonical_name,
                    civilization=excluded.civilization,
                    historical_period=excluded.historical_period,
                    epistemic_status=excluded.epistemic_status,
                    metadata=excluded.metadata,
                    provenance=excluded.provenance,
                    updated_at=excluded.updated_at
            ''', (
                entity_id,
                entity.get('entity_type', 'cultural_artifact'),
                entity.get('canonical_name', entity.get('name', 'Unknown Entity')),
                entity.get('civilization', 'Unknown'),
                entity.get('historical_period', 'Indeterminate'),
                entity.get('epistemic_status', entity.get('epistemicStance', 'ESTABLISHED')),
                json.dumps(entity.get('metadata', {})),
                json.dumps(entity.get('provenance', {})),
                entity.get('created_at', now),
                now,
            ))
            conn.commit()
        finally:
            conn.close()
        return entity_id

    def save_observation(self, observation: dict[str, Any]) -> str:
        obs_id = str(observation.get('observationId') or observation.get('id'))
        now = datetime.now(timezone.utc).isoformat()
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO artifact_observations (
                    observation_id, entity_id, observed_at, frame_id, spatial_status,
                    pose6d, perception, identity, epistemic, provenance, raw_observation, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(observation_id) DO UPDATE SET
                    entity_id=excluded.entity_id,
                    spatial_status=excluded.spatial_status,
                    pose6d=excluded.pose6d,
                    perception=excluded.perception,
                    identity=excluded.identity,
                    epistemic=excluded.epistemic,
                    provenance=excluded.provenance
            ''', (
                obs_id,
                observation.get('identity', {}).get('entityId') or observation.get('entity_id'),
                observation.get('observed_at', observation.get('timestamp', now)),
                observation.get('perception', {}).get('frameId', observation.get('frame_id', 'map')),
                observation.get('perception', {}).get('spatialStatus', observation.get('spatial_status', 'GROUNDED')),
                json.dumps(observation.get('perception', {}).get('pose6d', observation.get('pose', {}))),
                json.dumps(observation.get('perception', {})),
                json.dumps(observation.get('identity', {})),
                json.dumps(observation.get('epistemic', {})),
                json.dumps(observation.get('provenance', {})),
                json.dumps(observation),
                now,
            ))
            conn.commit()
        finally:
            conn.close()
        return obs_id

    def save_resolution(self, observation_id: str, resolution: dict[str, Any]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO artifact_resolutions (
                    observation_id, entity_id, status, match_score,
                    channel_scores, conflict_penalty, policy_version, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                observation_id,
                resolution.get('entityId'),
                resolution.get('status', 'UNRESOLVED'),
                float(resolution.get('matchScore', 0.0)),
                json.dumps(resolution.get('scores', {})),
                float(resolution.get('conflictPenalty', 0.0)),
                resolution.get('policyVersion', 'v2.2'),
                now,
            ))

            for ev in resolution.get('evidence', []):
                cur.execute('''
                    INSERT INTO artifact_evidence (
                        observation_id, candidate_id, source_type, score,
                        source_reference, payload, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    observation_id,
                    str(ev.get('candidateId', '')),
                    str(ev.get('source', '')),
                    float(ev.get('score', 0.0)),
                    str(ev.get('sourceReference', '')),
                    json.dumps(ev.get('payload', {})),
                    now,
                ))
            conn.commit()
        finally:
            conn.close()

    def get_world_state(self) -> dict[str, Any]:
        conn = self._get_connection()
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute('SELECT * FROM artifact_observations ORDER BY observed_at DESC LIMIT 50')
            obs_rows = [dict(r) for r in cur.fetchall()]
            cur.execute('SELECT * FROM artifact_world_entities')
            entities = [dict(r) for r in cur.fetchall()]

            return {
                'schemaVersion': 'v1.0',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'source': 'holokai-world-memory-store',
                'entityCount': len(entities),
                'observationCount': len(obs_rows),
                'entities': entities,
                'observations': obs_rows,
            }
        finally:
            conn.close()

    def get_entity(self, entity_id: str) -> dict[str, Any] | None:
        conn = self._get_connection()
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute('SELECT * FROM artifact_world_entities WHERE id = ?', (entity_id,))
            row = cur.fetchone()
            if not row:
                return None
            data = dict(row)
            data['metadata'] = json.loads(data['metadata'])
            data['provenance'] = json.loads(data['provenance'])
            return data
        finally:
            conn.close()
