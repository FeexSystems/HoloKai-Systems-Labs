"""HoloKai World Model v1 & Local Memory Store.

Persistent SQLite backed engine storing:
- Physical and Simulated Observations
- Multi-Channel Evidence Spans
- Grounded 6DoF Artifact Poses
- State Change Events & Provenance
"""

from __future__ import annotations

import json
import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

DEFAULT_DB_PATH = str(Path(__file__).resolve().parent / 'world_model_v1.db')


class WorldMemoryStore:
    """Persistent storage engine for the HoloKai World Model."""

    def __init__(self, local_db_path: Optional[str] = None):
        self.db_path = local_db_path or os.getenv('HOLOKAI_LOCAL_MEMORY_DB', DEFAULT_DB_PATH)
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path, timeout=10.0)

    def _init_db(self) -> None:
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                CREATE TABLE IF NOT EXISTS artifact_world_entities (
                    id TEXT PRIMARY KEY,
                    entity_type TEXT NOT NULL,
                    canonical_name TEXT NOT NULL,
                    civilization TEXT NOT NULL,
                    historical_period TEXT NOT NULL,
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
                    sensor_id TEXT NOT NULL,
                    frame_id TEXT NOT NULL,
                    raw_observation TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS artifact_resolutions (
                    observation_id TEXT PRIMARY KEY,
                    entity_id TEXT,
                    status TEXT NOT NULL,
                    match_score REAL NOT NULL,
                    resolution_payload TEXT NOT NULL,
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
            cur.execute('''
                CREATE TABLE IF NOT EXISTS world_state_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_type TEXT NOT NULL,
                    entity_id TEXT,
                    observation_id TEXT,
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
        metadata_dict = dict(entity.get('metadata') or entity.get('properties') or {})
        for k in ('academic_citations', 'provenance_records', 'physical_properties', 'visual_features', 'citations'):
            if k in entity and k not in metadata_dict:
                metadata_dict[k] = entity[k]

        provenance_dict = dict(entity.get('provenance') or {})
        if 'provenance_records' in entity and 'records' not in provenance_dict:
            provenance_dict['records'] = entity['provenance_records']

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
                entity.get('entity_type', entity.get('type', 'cultural_artifact')),
                entity.get('canonical_name', entity.get('canonicalName', entity.get('name', 'Unknown Entity'))),
                entity.get('civilization', 'Unknown'),
                entity.get('historical_period', entity.get('historicalPeriod', entity.get('period', 'Indeterminate'))),
                entity.get('epistemic_status', entity.get('epistemicStatus', entity.get('epistemicStance', 'ESTABLISHED'))),
                json.dumps(metadata_dict),
                json.dumps(provenance_dict),
                entity.get('created_at', now),
                now,
            ))
            conn.commit()
        finally:
            conn.close()
        return entity_id

    def save_observation(self, observation: dict[str, Any]) -> str:
        obs_id = str(observation.get('observationId') or observation.get('observation_id'))
        now = datetime.now(timezone.utc).isoformat()
        entity_id = observation.get('entity_id') or (observation.get('identity') or {}).get('entityId')
        pose = observation.get('pose') or {}
        sensor = observation.get('sensor') or {}

        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO artifact_observations (
                    observation_id, entity_id, observed_at, sensor_id, frame_id, raw_observation, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(observation_id) DO UPDATE SET
                    entity_id=excluded.entity_id,
                    observed_at=excluded.observed_at,
                    sensor_id=excluded.sensor_id,
                    frame_id=excluded.frame_id,
                    raw_observation=excluded.raw_observation
            ''', (
                obs_id,
                entity_id,
                observation.get('timestamp') or observation.get('observed_at') or now,
                sensor.get('camera', 'default_sensor'),
                pose.get('frameId', 'map'),
                json.dumps(observation),
                now,
            ))
            conn.commit()
        finally:
            conn.close()
        return obs_id

    def save_resolution(self, observation_id: str, resolution_data: dict[str, Any]) -> None:
        now = datetime.now(timezone.utc).isoformat()
        entity_id = resolution_data.get('entityId') or resolution_data.get('entity_id')
        status = resolution_data.get('status', 'UNRESOLVED')
        match_score = float(resolution_data.get('matchScore', resolution_data.get('match_score', 0.0)))

        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO artifact_resolutions (
                    observation_id, entity_id, status, match_score, resolution_payload, created_at
                ) VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(observation_id) DO UPDATE SET
                    entity_id=excluded.entity_id,
                    status=excluded.status,
                    match_score=excluded.match_score,
                    resolution_payload=excluded.resolution_payload
            ''', (
                observation_id,
                entity_id,
                status,
                match_score,
                json.dumps(resolution_data),
                now,
            ))

            for ev in resolution_data.get('evidence', []):
                cur.execute('''
                    INSERT INTO artifact_evidence (
                        observation_id, candidate_id, source_type, score, source_reference, payload, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                ''', (
                    observation_id,
                    ev.get('candidateId', entity_id or 'unknown'),
                    ev.get('source', 'unknown'),
                    float(ev.get('score', 0.0)),
                    ev.get('status', 'AVAILABLE'),
                    json.dumps(ev.get('payload', {})),
                    now,
                ))

            conn.commit()
        finally:
            conn.close()

    def log_state_event(
        self,
        event_type: str,
        entity_id: Optional[str] = None,
        observation_id: Optional[str] = None,
        payload: Optional[dict[str, Any]] = None,
    ) -> int:
        now = datetime.now(timezone.utc).isoformat()
        conn = self._get_connection()
        try:
            cur = conn.cursor()
            cur.execute('''
                INSERT INTO world_state_events (
                    event_type, entity_id, observation_id, payload, created_at
                ) VALUES (?, ?, ?, ?, ?)
            ''', (
                event_type,
                entity_id,
                observation_id,
                json.dumps(payload or {}),
                now,
            ))
            event_id = cur.lastrowid or 0
            conn.commit()
            return event_id
        finally:
            conn.close()

    def get_world_state(self) -> dict[str, Any]:
        conn = self._get_connection()
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute('SELECT * FROM artifact_observations ORDER BY observed_at DESC LIMIT 50')
            raw_obs = [dict(r) for r in cur.fetchall()]
            observations = []
            for r in raw_obs:
                try:
                    observations.append(json.loads(r['raw_observation']))
                except Exception:
                    observations.append(r)

            cur.execute('SELECT * FROM artifact_world_entities')
            raw_entities = [dict(r) for r in cur.fetchall()]
            entities = []
            for e in raw_entities:
                try:
                    e['metadata'] = json.loads(e['metadata'])
                    e['provenance'] = json.loads(e['provenance'])
                except Exception:
                    pass
                entities.append(e)

            return {
                'schemaVersion': 'v1.0',
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'source': 'holokai-world-memory-store',
                'entityCount': len(entities),
                'observationCount': len(observations),
                'entities': entities,
                'observations': observations,
            }
        finally:
            conn.close()

    def get_observations(self, limit: int = 50) -> list[dict[str, Any]]:
        conn = self._get_connection()
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute('SELECT * FROM artifact_observations ORDER BY observed_at DESC LIMIT ?', (limit,))
            rows = [dict(r) for r in cur.fetchall()]
            out = []
            for r in rows:
                try:
                    out.append(json.loads(r['raw_observation']))
                except Exception:
                    out.append(r)
            return out
        finally:
            conn.close()

    def get_observation(self, observation_id: str) -> dict[str, Any] | None:
        conn = self._get_connection()
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute('SELECT * FROM artifact_observations WHERE observation_id = ?', (observation_id,))
            row = cur.fetchone()
            if not row:
                return None
            try:
                return json.loads(dict(row)['raw_observation'])
            except Exception:
                return dict(row)
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
            try:
                data['metadata'] = json.loads(data['metadata'])
                data['provenance'] = json.loads(data['provenance'])
                if isinstance(data['metadata'], dict):
                    for k, v in data['metadata'].items():
                        if k not in data:
                            data[k] = v
            except Exception:
                pass
            return data
        finally:
            conn.close()

    def get_artifact_evidence(self, entity_id: str) -> list[dict[str, Any]]:
        conn = self._get_connection()
        try:
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute('''
                SELECT * FROM artifact_evidence
                WHERE candidate_id = ? OR observation_id IN (
                    SELECT observation_id FROM artifact_resolutions WHERE entity_id = ?
                ) ORDER BY score DESC
            ''', (entity_id, entity_id))
            rows = [dict(r) for r in cur.fetchall()]
            for r in rows:
                try:
                    r['payload'] = json.loads(r['payload'])
                except Exception:
                    pass
            return rows
        finally:
            conn.close()

    def get_artifact_provenance(self, entity_id: str) -> dict[str, Any] | None:
        entity = self.get_entity(entity_id)
        if not entity:
            return None
        return entity.get('provenance')


_WORLD_STORE_INSTANCE: Optional[WorldMemoryStore] = None


def get_world_store() -> WorldMemoryStore:
    global _WORLD_STORE_INSTANCE
    if _WORLD_STORE_INSTANCE is None:
        _WORLD_STORE_INSTANCE = WorldMemoryStore()
    return _WORLD_STORE_INSTANCE
