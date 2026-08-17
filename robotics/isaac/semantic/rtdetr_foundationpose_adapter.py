"""Normalized Perception Adapter for Isaac ROS RT-DETR and FoundationPose.

Keeps NVIDIA/hardware-specific message types cleanly separated from HoloKai
Cognitive, World Model, and Evidence Fusion layers.
"""

from __future__ import annotations

import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class DetectorInfo:
    name: str = 'RT-DETR'
    version: str = 'isaac-ros-3.1'
    confidence: float = 0.0


@dataclass
class BoundingBox2D:
    x: float = 0.0
    y: float = 0.0
    width: float = 0.0
    height: float = 0.0


@dataclass
class DetectionPayload:
    label: str
    classId: str = ''
    bbox: dict[str, float] = field(default_factory=dict)
    ocrText: str = ''


@dataclass
class Position3D:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0


@dataclass
class OrientationQuaternion:
    x: float = 0.0
    y: float = 0.0
    z: float = 0.0
    w: float = 1.0


@dataclass
class Pose6D:
    position: dict[str, float] = field(default_factory=lambda: asdict(Position3D()))
    orientation: dict[str, float] = field(default_factory=lambda: asdict(OrientationQuaternion()))
    frameId: str = 'map'
    source: str = 'FoundationPose'
    confidence: float = 0.0
    spatialStatus: str = 'GROUNDED'  # GROUNDED | UNGROUNDED


@dataclass
class NormalizedArtifactObservation:
    observationId: str
    timestamp: str
    detector: dict[str, Any]
    detection: dict[str, Any]
    pose: dict[str, Any]
    provenance: dict[str, Any] = field(default_factory=dict)


def normalize_detection(
    label: str,
    confidence: float,
    bbox: dict[str, float] | None = None,
    pose6d: dict[str, Any] | None = None,
    frame_id: str = 'map',
    detector_name: str = 'RT-DETR',
    pose_source: str = 'FoundationPose',
    pose_confidence: float = 0.0,
    class_id: str = '',
    ocr_text: str = '',
    observation_id: str | None = None,
) -> dict[str, Any]:
    """Normalize raw perception into stable, model-agnostic HoloKai contract."""
    obs_id = observation_id or f"obs-{uuid.uuid4().hex[:12]}"
    now_ts = datetime.now(timezone.utc).isoformat()
    clean_conf = max(0.0, min(1.0, float(confidence)))

    # Pose extraction and spatial grounding validation
    pose_dict = pose6d or {}
    has_valid_frame = bool(frame_id and frame_id.strip() and frame_id != 'unknown')
    spatial_status = 'GROUNDED' if (has_valid_frame and pose_dict) else 'UNGROUNDED'

    norm_pose = {
        'position': pose_dict.get('position', {'x': 0.0, 'y': 0.0, 'z': 0.0}),
        'orientation': pose_dict.get('orientation', {'x': 0.0, 'y': 0.0, 'z': 0.0, 'w': 1.0}),
        'frameId': frame_id if has_valid_frame else 'ungrounded',
        'source': pose_source,
        'confidence': max(0.0, min(1.0, float(pose_confidence or pose_dict.get('confidence', 0.0)))),
        'spatialStatus': spatial_status,
    }

    obs = NormalizedArtifactObservation(
        observationId=obs_id,
        timestamp=now_ts,
        detector={
            'name': detector_name,
            'version': 'v2.2',
            'confidence': clean_conf,
        },
        detection={
            'label': label,
            'classId': class_id or label.lower().replace(' ', '_'),
            'bbox': bbox or {},
            'ocrText': ocr_text,
        },
        pose=norm_pose,
        provenance={
            'source': 'isaac_ros_semantic_perception_v2.2',
            'detector': detector_name,
            'poseEstimator': pose_source,
            'frameId': norm_pose['frameId'],
            'spatialStatus': spatial_status,
        },
    )
    return asdict(obs)
