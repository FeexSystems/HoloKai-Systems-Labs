from __future__ import annotations

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


_STOPWORDS = {
    'the', 'and', 'with', 'from', 'this', 'that', 'object', 'artifact',
    'cultural', 'unknown', 'head', 'figure', 'item',
}


def _tokens(value: str) -> set[str]:
    return {
        token for token in re.findall(r"[a-z0-9]+", value.lower())
        if len(token) > 2 and token not in _STOPWORDS
    }


class KnowledgeEntityResolver(Node):
    """Resolve visual candidates against the HoloKai knowledge base.

    The resolver uses the repository's canonical knowledge_base_comprehensive
    module when HOLOKAI_ENGINE_PATH is available. No visual detection is
    promoted to historical truth: perception confidence and epistemic stance
    remain independent fields.
    """

    def __init__(self) -> None:
        super().__init__('holokai_entity_resolver')
        self.pub = self.create_publisher(String, '/holokai/robot/observation', 20)
        self.sub = self.create_subscription(
            String, '/holokai/semantic/candidates', self._on_candidates, 20
        )
        self.min_match = float(os.getenv('HOLOKAI_ENTITY_MATCH_THRESHOLD', '0.28'))
        self.entries = self._load_entries()
        self.get_logger().info('Loaded %d HoloKai knowledge entries', len(self.entries))

    def _load_entries(self) -> list[dict[str, Any]]:
        engine_path = os.getenv('HOLOKAI_ENGINE_PATH')
        if engine_path:
            sys.path.insert(0, engine_path)
        try:
            from knowledge_base_comprehensive import get_all_entries
            return list(get_all_entries())
        except Exception as exc:
            self.get_logger().warning('Knowledge base unavailable: %s', exc)
            return []

    @staticmethod
    def _civilization(entry: dict[str, Any]) -> str:
        meta = entry.get('metadata') or {}
        title = meta.get('title', '').lower()
        text = entry.get('text', '').lower()
        candidates = [
            ('ife', 'Ife'), ('nok', 'Nok'), ('benin', 'Benin'), ('kemet', 'Kemet'),
            ('egypt', 'Kemet / Ancient Egypt'), ('kush', 'Kush'), ('nubia', 'Nubia / Kush'),
            ('aksum', 'Aksum'), ('mali', 'Mali Empire'), ('songhai', 'Songhai'),
            ('zimbabwe', 'Great Zimbabwe'), ('kongo', 'Kingdom of Kongo'),
        ]
        for needle, label in candidates:
            if needle in title or needle in text:
                return label
        return meta.get('region', 'African civilization knowledge')

    def _match(self, candidate: dict[str, Any], entry: dict[str, Any]) -> float:
        meta = entry.get('metadata') or {}
        candidate_text = ' '.join([
            str(candidate.get('label', '')),
            str(candidate.get('semanticType', '')),
            str(candidate.get('aliases', '')),
        ])
        entry_text = ' '.join([
            str(meta.get('title', '')),
            str(meta.get('region', '')),
            str(meta.get('era', '')),
            str(entry.get('text', '')),
        ])
        a, b = _tokens(candidate_text), _tokens(entry_text)
        if not a or not b:
            return 0.0
        overlap = len(a & b) / max(1, len(a))
        title_tokens = _tokens(str(meta.get('title', '')))
        title_bonus = 0.22 if a & title_tokens else 0.0
        return min(1.0, overlap + title_bonus)

    def _resolve(self, candidate: dict[str, Any]) -> dict[str, Any]:
        ranked = sorted(
            ((self._match(candidate, entry), entry) for entry in self.entries),
            key=lambda item: item[0],
            reverse=True,
        )
        score, entry = ranked[0] if ranked else (0.0, None)
        if entry is None or score < self.min_match:
            return {
                **candidate,
                'resolution': {
                    'status': 'UNRESOLVED',
                    'matchScore': round(score, 3),
                    'resolver': 'holokai-knowledge-entity-resolver-v1',
                },
            }

        meta = entry.get('metadata') or {}
        return {
            **candidate,
            'entityId': f"knowledge:{re.sub(r'[^a-z0-9]+', '-', meta.get('title', 'entity').lower()).strip('-')}",
            'resolvedEntity': {
                'name': meta.get('title', 'Unnamed HoloKai entity'),
                'civilization': self._civilization(entry),
                'domain': meta.get('domain'),
                'region': meta.get('region'),
                'era': meta.get('era'),
            },
            'knowledge': {
                'content': entry.get('text', ''),
                'source': meta.get('source', 'HoloKai Knowledge Base'),
                'metadata': meta,
            },
            'resolution': {
                'status': 'RESOLVED',
                'matchScore': round(score, 3),
                'resolver': 'holokai-knowledge-entity-resolver-v1',
            },
            'provenance': {
                **(candidate.get('provenance') or {}),
                'knowledgeSource': meta.get('source', 'HoloKai Knowledge Base'),
                'knowledgeTitle': meta.get('title'),
                'resolvedAt': datetime.now(timezone.utc).isoformat(),
            },
        }

    def _on_candidates(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed semantic candidates')
            return

        resolved = [self._resolve(item) for item in payload.get('entities', [])]
        event = {
            'observedAt': payload.get('observedAt', datetime.now(timezone.utc).isoformat()),
            'source': 'holokai-entity-resolution',
            'frame': payload.get('frame', 'map'),
            'entities': resolved,
            'robot': payload.get('robot', {}),
            'sensorMetadata': payload.get('sensorMetadata', {}),
            'provenance': {
                **(payload.get('provenance') or {}),
                'entityResolver': 'holokai-knowledge-entity-resolver-v1',
            },
        }
        out = String()
        out.data = json.dumps(event, separators=(',', ':'))
        self.pub.publish(out)


def main() -> None:
    rclpy.init()
    node = KnowledgeEntityResolver()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
