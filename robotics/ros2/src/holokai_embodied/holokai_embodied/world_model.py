from __future__ import annotations

import json
from collections import OrderedDict
from datetime import datetime, timezone
from typing import Any

import rclpy
from geometry_msgs.msg import PoseStamped
from nav_msgs.msg import Odometry
from rclpy.node import Node
from std_msgs.msg import String


class WorldModel(Node):
    """Small, deterministic ROS-facing world-model cache for HoloKai.

    The node is intentionally transport-focused. Persistent cultural memory,
    vector retrieval, and the long-lived knowledge graph remain outside ROS.
    """

    def __init__(self) -> None:
        super().__init__('holokai_world_model')
        self.frame = self.declare_parameter('world_frame', 'map').value
        self.max_entities = int(self.declare_parameter('max_entities', 256).value)
        self.entities: OrderedDict[str, dict[str, Any]] = OrderedDict()
        self.robot: dict[str, Any] = {'pose': None, 'frame': self.frame}

        self.observation_pub = self.create_publisher(String, '/holokai/world/state', 10)
        self.entity_sub = self.create_subscription(
            String, '/holokai/robot/resolved_observation', self._on_observation, 20
        )
        self.odom_sub = self.create_subscription(
            Odometry, '/visual_slam/tracking/odometry', self._on_odom, 20
        )
        self.pose_sub = self.create_subscription(
            PoseStamped, '/holokai/robot/pose', self._on_pose, 20
        )
        self.timer = self.create_timer(0.25, self._publish_state)

    def _touch_entity(self, entity: dict[str, Any]) -> None:
        entity_id = str(entity.get('entityId') or entity.get('id') or '')
        if not entity_id:
            return
        entity = dict(entity)
        entity['lastObservedAt'] = datetime.now(timezone.utc).isoformat()
        self.entities.pop(entity_id, None)
        self.entities[entity_id] = entity
        while len(self.entities) > self.max_entities:
            self.entities.popitem(last=False)

    def _on_observation(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed resolved observation payload')
            return

        for entity in payload.get('entities', []):
            if isinstance(entity, dict):
                self._touch_entity(entity)

        robot = payload.get('robot')
        if isinstance(robot, dict):
            self.robot.update(robot)

    def _on_odom(self, message: Odometry) -> None:
        self.robot['frame'] = message.header.frame_id or self.frame
        self.robot['pose'] = {
            'position': {
                'x': message.pose.pose.position.x,
                'y': message.pose.pose.position.y,
                'z': message.pose.pose.position.z,
            },
            'orientation': {
                'x': message.pose.pose.orientation.x,
                'y': message.pose.pose.orientation.y,
                'z': message.pose.pose.orientation.z,
                'w': message.pose.pose.orientation.w,
            },
        }

    def _on_pose(self, message: PoseStamped) -> None:
        self.robot['frame'] = message.header.frame_id or self.frame
        self.robot['pose'] = {
            'position': {
                'x': message.pose.position.x,
                'y': message.pose.position.y,
                'z': message.pose.position.z,
            },
            'orientation': {
                'x': message.pose.orientation.x,
                'y': message.pose.orientation.y,
                'z': message.pose.orientation.z,
                'w': message.pose.orientation.w,
            },
        }

    def _publish_state(self) -> None:
        state = {
            'schemaVersion': '1.0',
            'observedAt': datetime.now(timezone.utc).isoformat(),
            'source': 'holokai-ros-world-model',
            'frame': self.frame,
            'robot': self.robot,
            'entities': list(self.entities.values()),
            'entityCount': len(self.entities),
        }
        message = String()
        message.data = json.dumps(state, separators=(',', ':'))
        self.observation_pub.publish(message)


def main() -> None:
    rclpy.init()
    node = WorldModel()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
