from __future__ import annotations

import json
from datetime import datetime, timezone

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class WorldModelBridge(Node):
    """Normalizes robot observations into HoloKai world-model events."""

    def __init__(self) -> None:
        super().__init__('holokai_world_model_bridge')
        self.pub = self.create_publisher(String, '/holokai/world/observation', 10)
        self.sub = self.create_subscription(
            String, '/holokai/robot/observation', self._on_observation, 20
        )

    def _on_observation(self, message: String) -> None:
        try:
            observation = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warn('Ignoring malformed robot observation')
            return

        event = {
            'observedAt': datetime.now(timezone.utc).isoformat(),
            'source': 'ros2',
            'frame': observation.get('frame', 'map'),
            'entities': observation.get('entities', []),
            'robot': observation.get('robot', {}),
            'sensorMetadata': observation.get('sensorMetadata', {}),
            'provenance': observation.get('provenance', {}),
        }
        out = String()
        out.data = json.dumps(event, separators=(',', ':'))
        self.pub.publish(out)


def main() -> None:
    rclpy.init()
    node = WorldModelBridge()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
