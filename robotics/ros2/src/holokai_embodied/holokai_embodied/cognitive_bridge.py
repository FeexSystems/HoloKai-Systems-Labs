from __future__ import annotations

import json
import os
import uuid
from datetime import datetime, timezone

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class CognitiveBridge(Node):
    """Bridge high-level HoloKai tasks into the ROS 2 task proposal topic."""

    def __init__(self) -> None:
        super().__init__('holokai_cognitive_bridge')
        self.proposal_pub = self.create_publisher(String, '/holokai/task/proposed', 10)
        self.input_sub = self.create_subscription(
            String, '/holokai/task/request', self._on_request, 10
        )
        self.source = os.getenv('HOLOKAI_ROBOTICS_SOURCE', 'holokai-cognitive-core')

    def _on_request(self, message: String) -> None:
        try:
            request = json.loads(message.data)
        except json.JSONDecodeError as exc:
            self.get_logger().error('Invalid task request: %s', exc)
            return

        task = {
            'taskId': request.get('taskId') or str(uuid.uuid4()),
            'intent': request.get('intent', 'observe'),
            'createdAt': datetime.now(timezone.utc).isoformat(),
            'target': request.get('target', {'entityId': 'world', 'semanticType': 'environment'}),
            'constraints': request.get('constraints', {
                'maxLinearVelocity': 0.25,
                'maxAngularVelocity': 0.8,
                'humanProximityMeters': 1.0,
                'allowManipulation': False,
            }),
            'requiredCapabilities': request.get('requiredCapabilities', ['perception']),
            'provenance': request.get('provenance', {
                'source': self.source,
                'epistemicStance': 'ESTABLISHED',
                'confidence': 1.0,
                'evidenceIds': [],
            }),
            'metadata': request.get('metadata', {}),
        }

        out = String()
        out.data = json.dumps(task, separators=(',', ':'))
        self.proposal_pub.publish(out)
        self.get_logger().info('Published embodied task %s', task['taskId'])


def main() -> None:
    rclpy.init()
    node = CognitiveBridge()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
