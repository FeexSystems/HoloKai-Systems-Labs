from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class SemanticPerceptionBridge(Node):
    """Normalize detector output into stable HoloKai semantic candidates."""

    def __init__(self) -> None:
        super().__init__('holokai_semantic_perception_bridge')
        self.pub = self.create_publisher(String, '/holokai/semantic/candidates', 20)
        self.sub = self.create_subscription(
            String, '/holokai/perception/detections', self._on_detection, 20
        )

    @staticmethod
    def _entity_id(detection: dict[str, Any]) -> str:
        supplied = detection.get('entityId') or detection.get('entity_id')
        if supplied:
            return str(supplied)
        raw = json.dumps(
            {
                'label': detection.get('label', 'unknown'),
                'classId': detection.get('classId'),
                'trackId': detection.get('trackId'),
            },
            sort_keys=True,
        ).encode('utf-8')
        return f"observation:{hashlib.sha256(raw).hexdigest()[:16]}"

    def _on_detection(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed semantic detection')
            return

        detections = payload if isinstance(payload, list) else payload.get('detections', [])
        entities = []
        for detection in detections:
            if not isinstance(detection, dict):
                continue
            confidence = float(detection.get('confidence', 0.0))
            entities.append({
                'entityId': self._entity_id(detection),
                'label': detection.get('label', 'unknown'),
                'semanticType': detection.get('semanticType', 'unknown'),
                'confidence': max(0.0, min(1.0, confidence)),
                'pose': detection.get('pose', {}),
                'bbox': detection.get('bbox', {}),
                'epistemicStance': detection.get('epistemicStance', 'ESTABLISHED'),
                'provenance': detection.get('provenance', {
                    'source': 'isaac_ros_semantic_perception',
                    'method': 'detector-observation',
                }),
            })

        event = {
            'observedAt': datetime.now(timezone.utc).isoformat(),
            'source': 'isaac_ros_semantic_perception',
            'frame': payload.get('frame', 'map') if isinstance(payload, dict) else 'map',
            'entities': entities,
            'robot': payload.get('robot', {}) if isinstance(payload, dict) else {},
            'sensorMetadata': payload.get('sensorMetadata', {}) if isinstance(payload, dict) else {},
            'provenance': {
                'pipeline': 'holokai-semantic-perception-v1',
                'detectorSource': payload.get('detectorSource', 'unknown') if isinstance(payload, dict) else 'unknown',
            },
        }
        out = String()
        out.data = json.dumps(event, separators=(',', ':'))
        self.pub.publish(out)


def main() -> None:
    rclpy.init()
    node = SemanticPerceptionBridge()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
