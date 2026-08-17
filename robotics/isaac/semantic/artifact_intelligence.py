from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class ArtifactIntelligence(Node):
    """Fuse perception, pose, entity resolution, knowledge and provenance.

    This node is intentionally model-agnostic. Detector and pose-estimator
    adapters publish normalized observations; HoloKai owns the evidence and
    identity fusion contract.
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
        return f"artifact-observation:{hashlib.sha256(raw).hexdigest()[:20]}"

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
            artifacts.append({
                'observationId': self._observation_id(entity, observed_at),
                'timestamp': observed_at,
                'perception': {
                    'detector': provenance.get('detectorSource', 'isaac_ros_perception'),
                    'confidence': entity.get('confidence', 0.0),
                    'bbox': entity.get('bbox', {}),
                    'pose6d': entity.get('pose', {}),
                    'frameId': payload.get('frame', 'map'),
                },
                'identity': {
                    'status': resolution.get('status', 'UNRESOLVED'),
                    'entityId': entity.get('entityId'),
                    'name': resolved.get('name', entity.get('label')),
                    'civilization': resolved.get('civilization'),
                    'matchScore': resolution.get('matchScore', 0.0),
                },
                'knowledge': entity.get('knowledge', {}),
                'provenance': {
                    'perceptionSource': provenance.get('source', 'unknown'),
                    'resolver': resolution.get('resolver', 'unknown'),
                    'knowledgeSources': [{
                        'source': provenance.get('knowledgeSource'),
                        'title': provenance.get('knowledgeTitle'),
                    }],
                    'evidenceIds': entity.get('evidenceIds', []),
                },
                'epistemic': {
                    'stance': entity.get('epistemicStance', 'ESTABLISHED'),
                    'basis': 'knowledge-record metadata',
                },
            })

        event = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'worldFrame': payload.get('frame', 'map'),
            'artifacts': artifacts,
            'source': 'holokai-artifact-intelligence-v2.1',
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
