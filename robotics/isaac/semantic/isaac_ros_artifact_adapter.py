from __future__ import annotations

import json
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class IsaacROSArtifactAdapter(Node):
    """Normalize Isaac ROS detector/pose messages into HoloKai candidates.

    The adapter accepts JSON during bring-up so it can bridge RT-DETR and
    FoundationPose outputs without coupling the HoloKai core to a specific
    Isaac ROS message version. A production graph can replace the two input
    topics with vision_msgs/Detection2DArray and a typed pose message while
    retaining the normalized HoloKai output contract.
    """

    def __init__(self) -> None:
        super().__init__('holokai_isaac_ros_artifact_adapter')
        self.pub = self.create_publisher(String, '/holokai/perception/detections', 20)
        self.detection_sub = self.create_subscription(
            String, '/isaac_ros/rtdetr/detections', self._on_detection, 20
        )
        self.pose_sub = self.create_subscription(
            String, '/isaac_ros/foundationpose/poses', self._on_pose, 20
        )
        self.latest_pose: dict[str, Any] = {}

    def _on_pose(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
            poses = payload.get('poses', payload if isinstance(payload, list) else [])
            self.latest_pose = {
                str(p.get('trackId', p.get('entityId', i))): p
                for i, p in enumerate(poses) if isinstance(p, dict)
            }
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed FoundationPose payload')

    def _on_detection(self, message: String) -> None:
        try:
            payload = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed RT-DETR payload')
            return

        detections = payload.get('detections', payload if isinstance(payload, list) else [])
        normalized = []
        for i, detection in enumerate(detections):
            if not isinstance(detection, dict):
                continue
            track_id = str(detection.get('trackId', detection.get('id', i)))
            pose = self.latest_pose.get(track_id, {})
            normalized.append({
                'entityId': detection.get('entityId'),
                'trackId': track_id,
                'label': detection.get('label', detection.get('className', 'unknown')),
                'semanticType': detection.get('semanticType', 'cultural_artifact'),
                'confidence': float(detection.get('confidence', detection.get('score', 0.0))),
                'bbox': detection.get('bbox', detection.get('boundingBox', {})),
                'pose': pose.get('pose6d', pose.get('pose', {})),
                'poseConfidence': float(pose.get('confidence', pose.get('score', 0.0))),
                'frame': pose.get('frameId', payload.get('frame', 'camera')),
                'ocrText': detection.get('ocrText', ''),
                'provenance': {
                    'source': 'isaac_ros_artifact_adapter',
                    'detectorSource': 'isaac_ros_rtdetr',
                    'poseSource': 'isaac_ros_foundationpose',
                },
            })

        out = String()
        out.data = json.dumps({
            'frame': payload.get('frame', 'camera'),
            'detectorSource': 'isaac_ros_rtdetr',
            'poseSource': 'isaac_ros_foundationpose',
            'detections': normalized,
        }, separators=(',', ':'))
        self.pub.publish(out)


def main() -> None:
    rclpy.init()
    node = IsaacROSArtifactAdapter()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
