from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any


@dataclass
class NormalizedArtifactDetection:
    label: str
    confidence: float
    bbox: dict[str, float]
    pose6d: dict[str, Any]
    frame_id: str
    detector: str = 'isaac_ros_rtdetr'
    pose_estimator: str = 'isaac_ros_foundationpose'


def normalize_detection(
    label: str,
    confidence: float,
    bbox: dict[str, float],
    pose6d: dict[str, Any] | None,
    frame_id: str,
) -> dict[str, Any]:
    """Adapter contract: keep NVIDIA-specific message handling outside HoloKai cognition."""
    item = NormalizedArtifactDetection(
        label=label,
        confidence=max(0.0, min(1.0, confidence)),
        bbox=bbox,
        pose6d=pose6d or {},
        frame_id=frame_id,
    )
    return asdict(item)
