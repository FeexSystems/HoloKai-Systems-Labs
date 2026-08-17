from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class ArtifactIntelligence(Node):
    """Fuse normalized perception, 6DoF pose, entity resolution, evidence, and provenance.

    Maintains clean separation:
    - Perception confidence != Identity confidence != Epistemic certainty.
    - Preserves multi-channel evidence trails (vector, graph, metadata, provenance).
    """

    def __init__(self) -> None:
        super().__init__('holokai_artifact_intelligence')
        self.pub = self.create_publisher(String, '/holokai/artifact/intelligence', 20)
        self.sub = self.create_subscription(
            String, '/holokai/robot/observation', self._on_observation, 20
        )

    @staticmethod
    def _observation_id(entity: dict[str, Any], observed_at: str) -> str:
        raw = json.dumps({
            'entityId': entity.get('entityId'),
            'trackId': entity.get('trackId'),
            'observedAt': observed_at,
        }, sort_keys=True).encode('utf-8')
        return f"obs-{hashlib.sha256(raw).hexdigest()[:16]}"

    def _on_observation(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed world observation')
            return

        observed_at = payload.get('observedAt', datetime.now(timezone.utc).isoformat())
        artifacts = []
        for entity in payload.get('entities', []):
            if entity.get('semanticType') not in {
                'cultural_artifact', 'artifact', 'sculpture', 'pottery',
                'textile', 'manuscript', 'inscription', 'architectural_element',
            }:
                continue

            resolved = entity.get('resolvedEntity') or {}
            resolution = entity.get('resolution') or {}
            provenance = entity.get('provenance') or {}
            pose_dict = entity.get('pose') or {}

            # Determine spatial grounding status
            spatial_status = entity.get('spatialStatus') or pose_dict.get('spatialStatus', 'GROUNDED')
            if not pose_dict or payload.get('frame') in {'unknown', 'ungrounded'}:
                spatial_status = 'UNGROUNDED'

            artifacts.append({
                'observationId': entity.get('observationId') or self._observation_id(entity, observed_at),
                'timestamp': observed_at,
                'perception': {
                    'detector': provenance.get('detector', entity.get('detector', {}).get('name', 'RT-DETR')),
                    'confidence': float(entity.get('confidence', entity.get('detector', {}).get('confidence', 0.0))),
                    'bbox': entity.get('bbox', entity.get('detection', {}).get('bbox', {})),
                    'pose6d': pose_dict,
                    'frameId': payload.get('frame', 'map'),
                    'spatialStatus': spatial_status,
                },
                'identity': {
                    'status': resolution.get('status', 'UNRESOLVED'),
                    'entityId': entity.get('entityId') or resolution.get('entityId'),
                    'name': resolved.get('name', entity.get('label', entity.get('detection', {}).get('label', 'Unknown Artifact'))),
                    'civilization': resolved.get('civilization', 'Unknown'),
                    'matchScore': float(resolution.get('matchScore', 0.0)),
                    'candidateIds': resolution.get('candidateIds', []),
                },
                'evidence': resolution.get('evidence', []),
                'scores': resolution.get('scores', {}),
                'knowledge': entity.get('knowledge', {}),
                'provenance': {
                    'perceptionSource': provenance.get('source', 'isaac_ros_perception_v2.2'),
                    'resolver': resolution.get('resolver', 'holokai-multimodal-artifact-resolver-v2.2'),
                    'knowledgeSources': provenance.get('knowledgeSources', [{
                        'source': provenance.get('knowledgeSource', 'HoloKai Knowledge Base'),
                        'title': provenance.get('knowledgeTitle', 'Artifact Record'),
                    }]),
                    'evidenceIds': entity.get('evidenceIds', []),
                },
                'epistemic': {
                    'stance': entity.get('epistemicStance', resolved.get('epistemicStatus', 'ESTABLISHED')),
                    'basis': 'multimodal-evidence-fusion-v2.2',
                },
            })

        event = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'worldFrame': payload.get('frame', 'map'),
            'artifacts': artifacts,
            'source': 'holokai-artifact-intelligence-v2.2',
        }
        out = String()
        out.data = json.dumps(event, separators=(',', ':'))
        self.pub.publish(out)


def main() -> None:
    rclpy.init()
    node = ArtifactIntelligence()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
