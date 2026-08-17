from __future__ import annotations

import json
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class SafetyGateway(Node):
    """Deterministic policy gate between cognitive tasks and robot execution.

    This node deliberately does not call an LLM. It validates task constraints
    and publishes only approved tasks to the execution boundary.
    """

    def __init__(self) -> None:
        super().__init__('holokai_safety_gateway')
        self.input_sub = self.create_subscription(
            String, '/holokai/task/proposed', self._on_task, 10
        )
        self.output_pub = self.create_publisher(String, '/holokai/task/approved', 10)
        self.stop_sub = self.create_subscription(
            String, '/holokai/safety/stop', self._on_stop, 10
        )
        self.estop = False

    def _on_stop(self, message: String) -> None:
        self.estop = message.data.strip().lower() in {'1', 'true', 'stop', 'engaged'}
        self.get_logger().warn('Emergency stop state: %s', self.estop)

    def _validate(self, task: dict[str, Any]) -> tuple[bool, str]:
        if self.estop:
            return False, 'emergency_stop_engaged'

        constraints = task.get('constraints') or {}
        linear = float(constraints.get('maxLinearVelocity', 0))
        angular = float(constraints.get('maxAngularVelocity', 0))
        proximity = float(constraints.get('humanProximityMeters', 0))

        if linear < 0 or linear > 3.0:
            return False, 'linear_velocity_out_of_bounds'
        if angular < 0 or angular > 6.28:
            return False, 'angular_velocity_out_of_bounds'
        if proximity < 0.75:
            return False, 'human_proximity_below_safety_floor'

        intent = task.get('intent')
        if intent in {'pick', 'place'} and not bool(constraints.get('allowManipulation')):
            return False, 'manipulation_not_authorized'

        if not task.get('provenance'):
            return False, 'missing_provenance'

        return True, 'approved'

    def _on_task(self, message: String) -> None:
        try:
            task = json.loads(message.data)
            approved, reason = self._validate(task)
            task['safety'] = {'decision': reason}
            if approved:
                out = String()
                out.data = json.dumps(task, separators=(',', ':'))
                self.output_pub.publish(out)
                self.get_logger().info('Approved task %s', task.get('taskId'))
            else:
                self.get_logger().warn('Rejected task %s: %s', task.get('taskId'), reason)
        except (json.JSONDecodeError, TypeError, ValueError) as exc:
            self.get_logger().error('Rejected malformed task: %s', exc)


def main() -> None:
    rclpy.init()
    node = SafetyGateway()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
