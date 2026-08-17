from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String

from .rtdetr_foundationpose_adapter import normalize_detection


class IsaacROSArtifactAdapter(Node):
    """Normalize Isaac ROS detector and pose estimator messages into HoloKai observations.

    Accepts vision/pose detections over ROS 2 topics, maps them through the
    normalized perception contract, and publishes standard HoloKai candidate streams.
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
        world_frame = payload.get('frame', 'map')
        normalized = []

        for i, detection in enumerate(detections):
            if not isinstance(detection, dict):
                continue
            track_id = str(detection.get('trackId', detection.get('id', i)))
            pose = self.latest_pose.get(track_id, {})
            label = str(detection.get('label', detection.get('className', 'unknown')))
            conf = float(detection.get('confidence', detection.get('score', 0.0)))
            bbox = detection.get('bbox', detection.get('boundingBox', {}))
            pose_dict = pose.get('pose6d', pose.get('pose', {}))
            pose_conf = float(pose.get('confidence', pose.get('score', 0.0)))
            frame_id = pose.get('frameId', world_frame)

            item = normalize_detection(
                label=label,
                confidence=conf,
                bbox=bbox,
                pose6d=pose_dict,
                frame_id=frame_id,
                detector_name=str(detection.get('detector', 'RT-DETR')),
                pose_source=str(pose.get('source', 'FoundationPose')),
                pose_confidence=pose_conf,
                ocr_text=str(detection.get('ocrText', '')),
            )
            item['trackId'] = track_id
            item['semanticType'] = detection.get('semanticType', 'cultural_artifact')
            normalized.append(item)

        out = String()
        out.data = json.dumps({
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'frame': world_frame,
            'detectorSource': 'RT-DETR',
            'poseSource': 'FoundationPose',
            'detections': normalized,
            'count': len(normalized),
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
