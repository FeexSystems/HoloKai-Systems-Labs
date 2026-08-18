"""HoloKai Machine-Readable Reproducible Trace Engine.

Enforces the core development rule:
"Every run should produce an inspectable trace. The same scene should be capable of being replayed.
The same input should produce comparable outputs. Failures should be diagnosable at every layer."

Trace Structure:
RUN_ID
  ├── SENSOR_FRAME
  ├── DETECTION
  ├── POSE_ESTIMATE
  ├── SEMANTIC_OBSERVATION
  ├── CANDIDATE_ENTITIES
  ├── EVIDENCE
  ├── RESOLUTION
  ├── WORLD_MODEL_UPDATE
  └── ORACLE_RESPONSE
"""

from __future__ import annotations

import json
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, List, Optional


@dataclass
class SensorFrameTrace:
    camera_topic: str
    depth_topic: str
    image_resolution: tuple[int, int]
    frame_id: str
    timestamp: str
    raw_sensor_metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class DetectionTrace:
    model: str  # RT-DETR
    label: str
    confidence: float
    bbox: dict[str, float]
    execution_time_ms: float = 0.0


@dataclass
class PoseEstimateTrace:
    model: str  # FoundationPose
    position: dict[str, float]
    orientation: dict[str, float]
    frame_id: str
    confidence: float
    spatial_status: str  # GROUNDED | UNGROUNDED
    execution_time_ms: float = 0.0


@dataclass
class SemanticObservationTrace:
    observation_id: str
    timestamp: str
    visual_properties: dict[str, Any]
    provenance_metadata: dict[str, Any]


@dataclass
class CandidateEntitiesTrace:
    candidates: List[dict[str, Any]]
    retrieval_sources: List[str]  # ['vector', 'graph', 'metadata', 'provenance']


@dataclass
class EvidenceTrace:
    evidence_items: List[dict[str, Any]]
    fusion_weights: dict[str, float]
    conflicts_detected: List[dict[str, Any]] = field(default_factory=list)


@dataclass
class ResolutionTrace:
    status: str  # RESOLVED | AMBIGUOUS | UNRESOLVED
    selected_entity_id: Optional[str]
    match_score: float
    epistemic_status: str  # SUPPORTED | PROBABLE | UNCERTAIN | DISPUTED
    resolution_policy_version: str = "v2.2"


@dataclass
class WorldModelUpdateTrace:
    database_write_timestamp: str
    entity_updated: bool
    observation_committed: bool
    state_event_id: Optional[int] = None
    entities_count_after_update: int = 0
    observations_count_after_update: int = 0


@dataclass
class OracleResponseTrace:
    questions_answered: dict[str, Any]
    epistemic_stance: str
    confidence_score: float
    citations_returned: List[str]
    reasoning_summary: str


@dataclass
class HoloKaiPipelineTrace:
    """Master machine-readable trace for an end-to-end artifact intelligence run."""

    run_id: str
    created_at: str
    environment: str  # 'isaac_sim_synthetic' | 'physical_lab'
    sensor_frame: SensorFrameTrace
    detection: DetectionTrace
    pose_estimate: PoseEstimateTrace
    semantic_observation: SemanticObservationTrace
    candidate_entities: CandidateEntitiesTrace
    evidence: EvidenceTrace
    resolution: ResolutionTrace
    world_model_update: WorldModelUpdateTrace
    oracle_response: OracleResponseTrace

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)

    def save_to_file(self, file_path: str | Path) -> None:
        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(self.to_json(), encoding="utf-8")

    @classmethod
    def load_from_file(cls, file_path: str | Path) -> HoloKaiPipelineTrace:
        path = Path(file_path)
        data = json.loads(path.read_text(encoding="utf-8"))
        return cls(
            run_id=data["run_id"],
            created_at=data["created_at"],
            environment=data["environment"],
            sensor_frame=SensorFrameTrace(**data["sensor_frame"]),
            detection=DetectionTrace(**data["detection"]),
            pose_estimate=PoseEstimateTrace(**data["pose_estimate"]),
            semantic_observation=SemanticObservationTrace(**data["semantic_observation"]),
            candidate_entities=CandidateEntitiesTrace(**data["candidate_entities"]),
            evidence=EvidenceTrace(**data["evidence"]),
            resolution=ResolutionTrace(**data["resolution"]),
            world_model_update=WorldModelUpdateTrace(**data["world_model_update"]),
            oracle_response=OracleResponseTrace(**data["oracle_response"]),
        )
