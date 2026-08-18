"""Isaac ROS RT-DETR + FoundationPose Semantic Perception Adapter.

Translates raw perception detections and 6DoF poses from Isaac Sim / Isaac ROS
into the model-agnostic HoloKai Live Artifact Intelligence contract.
"""

from __future__ import annotations

import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any


@dataclass
class SensorInfo:
    camera: str = '/visual_slam/image_0'
    depth: str = '/visual_slam/depth_0'


@dataclass
class VisualProperties:
    category: str = 'terracotta_sculpture'
    shape: list[str] = field(default_factory=lambda: ['anthropomorphic'])
    material: list[str] = field(default_factory=lambda: ['ceramic', 'terracotta'])
    color: list[str] = field(default_factory=lambda: ['reddish-brown', 'ochre'])
    texture: list[str] = field(default_factory=lambda: ['fired-clay', 'granular'])
    geometry: dict[str, Any] = field(default_factory=lambda: {'height': 0.32, 'width': 0.18, 'depth': 0.15})
    visualDescriptors: list[str] = field(default_factory=lambda: ['perforated-pupils', 'triangular-eyes', 'elaborate-coiffure'])


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
    sensor: dict[str, Any]
    detector: dict[str, Any]
    detection: dict[str, Any]
    visualProperties: dict[str, Any]
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
    sensor_info: dict[str, Any] | None = None,
    visual_properties: dict[str, Any] | None = None,
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

    # Extract or synthesize visual properties for archaeological features
    default_props = asdict(VisualProperties())
    if 'nok' in label.lower():
        default_props['category'] = 'terracotta_sculpture'
        default_props['shape'] = ['anthropomorphic', 'cylindrical_head']
        default_props['material'] = ['fired_terracotta', 'coarse_clay']
        default_props['visualDescriptors'] = ['triangular_perforated_eyes', 'pierced_pupils', 'flared_nostrils', 'beaded_neckbands']
    elif 'ife' in label.lower():
        default_props['category'] = 'metal_or_terracotta_head'
        default_props['shape'] = ['naturalistic_head']
        default_props['material'] = ['leaded_brass', 'copper_alloy', 'terracotta']
        default_props['visualDescriptors'] = ['striated_facial_lines', 'coronet_crown', 'refined_naturalism']

    if visual_properties:
        default_props.update(visual_properties)

    obs = NormalizedArtifactObservation(
        observationId=obs_id,
        timestamp=now_ts,
        sensor=sensor_info or asdict(SensorInfo()),
        detector={
            'name': detector_name,
            'version': 'v2.2',
            'confidence': clean_conf,
        },
        detection={
            'label': label,
            'classId': class_id or label.lower().replace(' ', '_'),
            'confidence': clean_conf,
            'bbox': bbox or {},
            'ocrText': ocr_text,
        },
        visualProperties=default_props,
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
