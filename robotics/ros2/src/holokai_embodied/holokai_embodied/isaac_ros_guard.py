from __future__ import annotations

import os
import shutil

import rclpy
from rclpy.node import Node


class IsaacRosGuard(Node):
    """Fail-fast guard for an externally managed Isaac ROS environment."""

    def __init__(self) -> None:
        super().__init__('holokai_isaac_ros_guard')
        required = ['ROS_DISTRO']
        missing = [name for name in required if not os.getenv(name)]
        if missing:
            raise RuntimeError(
                'Isaac ROS mode requires a sourced ROS 2 environment; '
                f'missing: {", ".join(missing)}'
            )
        self.get_logger().info(
            'Isaac ROS integration enabled for ROS_DISTRO=%s', os.getenv('ROS_DISTRO')
        )
        if shutil.which('ros2') is None:
            raise RuntimeError('ros2 executable not found in PATH')
        self.get_logger().info(
            'Launch NVIDIA perception separately with the Isaac ROS workspace; '
            'HoloKai consumes its ROS topics through configured interfaces.'
        )


def main() -> None:
    rclpy.init()
    node = IsaacRosGuard()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
