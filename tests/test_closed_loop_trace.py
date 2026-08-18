"""Test suite for HoloKai V2.2 Machine-Readable Trace and Closed-Loop Pipeline.

Verifies the core architectural directive:
1. "The humanoid is a body."
2. "Isaac Sim is a physical intelligence laboratory."
3. "The World Model is HoloKai's representation of reality."
4. "The Knowledge Fabric is HoloKai's civilization memory."
5. "The Epistemic Engine determines what HoloKai can responsibly believe."
6. "The Oracle reasons across all of them."
7. Machine-readable reproducible trace generation and replay.
"""

from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / 'services' / 'artifact-resolver'))
sys.path.insert(0, str(REPO_ROOT / 'services' / 'python-engine'))
sys.path.insert(0, str(REPO_ROOT / 'robotics' / 'isaac' / 'semantic'))

from closed_loop_pipeline import ClosedLoopArtifactPipeline
from epistemic_engine import EpistemicEngine, EpistemicState, TruthLayer
from fixtures.artifact_seed_fixtures import DEVELOPMENT_SEED_ARTIFACTS
from reproducible_trace import HoloKaiPipelineTrace
from resolver import Evidence
from world_memory_store import WorldMemoryStore


def test_closed_loop_trace_generation_and_serialization():
    """Validates complete end-to-end execution and machine-readable trace serialization."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "trace_world.db")
        trace_file = str(Path(tmpdir) / "run_trace_001.json")

        store = WorldMemoryStore(local_db_path=db_path)
        seed = DEVELOPMENT_SEED_ARTIFACTS[0]  # Nok Terracotta Head
        store.save_entity(seed)

        pipeline = ClosedLoopArtifactPipeline(world_store=store)

        trace = pipeline.execute(
            scene_name="holokai_lab_research_plinth",
            detection_label="Nok Terracotta Sculpture",
            detection_confidence=0.96,
            bbox={"x": 120, "y": 80, "width": 240, "height": 380},
            pose6d={"position": {"x": 1.25, "y": 0.85, "z": 0.35}, "orientation": {"x": 0, "y": 0, "z": 0, "w": 1}},
            frame_id="map",
            vector_candidates=[Evidence(candidate_id=seed["id"], source="vector", score=0.92)],
            graph_candidates=[Evidence(candidate_id=seed["id"], source="graph", score=0.88)],
            metadata_candidates=[Evidence(candidate_id=seed["id"], source="metadata", score=0.95)],
            provenance_candidates=[Evidence(candidate_id=seed["id"], source="provenance", score=0.90)],
            run_id="run-nok-001",
            is_simulation=True,
        )

        assert trace.run_id == "run-nok-001"
        assert trace.detection.label == "Nok Terracotta Sculpture"
        assert trace.pose_estimate.spatial_status == "GROUNDED"
        assert trace.resolution.status == "RESOLVED"
        assert trace.resolution.selected_entity_id == seed["id"]
        assert trace.world_model_update.observation_committed is True

        # Save and reload trace
        trace.save_to_file(trace_file)
        assert os.path.exists(trace_file)

        loaded_trace = HoloKaiPipelineTrace.load_from_file(trace_file)
        assert loaded_trace.run_id == trace.run_id
        assert loaded_trace.resolution.match_score == trace.resolution.match_score
        assert loaded_trace.oracle_response.questions_answered["1_what_am_i_seeing"]["detected_object"] == "Nok Terracotta Sculpture"


def test_oracle_answers_all_seven_demonstration_questions():
    """Validates that all 7 required questions are comprehensively and truthfully answered."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "oracle_seven_q.db")
        store = WorldMemoryStore(local_db_path=db_path)
        seed = DEVELOPMENT_SEED_ARTIFACTS[0]
        store.save_entity(seed)

        pipeline = ClosedLoopArtifactPipeline(world_store=store)
        trace = pipeline.execute(
            scene_name="holokai_lab_research_plinth",
            detection_label="Nok Terracotta Head",
            detection_confidence=0.97,
            bbox={"x": 100, "y": 100, "width": 200, "height": 300},
            pose6d={"position": {"x": 1.20, "y": 0.80, "z": 0.30}},
            frame_id="map",
            vector_candidates=[Evidence(candidate_id=seed["id"], source="vector", score=0.94)],
            metadata_candidates=[Evidence(candidate_id=seed["id"], source="metadata", score=0.96)],
            provenance_candidates=[Evidence(candidate_id=seed["id"], source="provenance", score=0.91)],
        )

        answers = trace.oracle_response.questions_answered

        # Q1: What am I seeing?
        assert answers["1_what_am_i_seeing"]["detected_object"] == "Nok Terracotta Head"
        assert answers["1_what_am_i_seeing"]["resolved_entity"] == seed["id"]

        # Q2: Where is it?
        assert answers["2_where_is_it"]["position"]["x"] == 1.20
        assert answers["2_where_is_it"]["reference_frame"] == "map"
        assert answers["2_where_is_it"]["spatial_status"] == "GROUNDED"

        # Q3: What entity does it correspond to?
        assert answers["3_what_entity_does_it_correspond_to"]["canonical_name"] == "Nok Terracotta Head"
        assert answers["3_what_entity_does_it_correspond_to"]["civilization"] == "Nok"

        # Q4: Why?
        assert "triangular_perforated_eyes" in answers["4_why"]["visual_features"] or "fired_terracotta" in str(answers["4_why"]["material"])

        # Q5: What evidence supports the identification?
        assert answers["5_what_evidence_supports_the_identification"]["evidence_count"] >= 3
        assert any("Shaw, T." in c for c in answers["5_what_evidence_supports_the_identification"]["citations"])

        # Q6: What is uncertain?
        assert answers["6_what_is_uncertain"]["epistemic_status"] in ("SUPPORTED", "PROBABLE")

        # Q7: What is the provenance?
        assert "National Museum Jos" in answers["7_what_is_the_provenance"]["institution"] or "HoloKai" in answers["7_what_is_the_provenance"]["institution"]


def test_epistemic_engine_truth_layers_and_conflict_handling():
    """Validates Epistemic Engine truth layers and dispute detection."""
    # 1. Qualified claim creation
    claim = EpistemicEngine.create_qualified_claim(
        subject_id="artifact:nok:terracotta_head_01",
        predicate="EXCAVATED_AT",
        object_id="site:nok:valley",
        truth_layer=TruthLayer.DOCUMENTED,
        confidence=0.95,
        supporting_sources=["Shaw, T. (1978)", "Fagg, B. (1977)"],
    )
    assert claim.epistemic_status == EpistemicState.SUPPORTED
    assert claim.provenance_complete is True
    assert claim.supporting_evidence_count == 2

    # 2. Contradiction handling
    disputed_claim = EpistemicEngine.create_qualified_claim(
        subject_id="artifact:nok:terracotta_head_01",
        predicate="DATED_TO",
        object_id="period:15th_century_ce",
        truth_layer=TruthLayer.INFERRED,
        confidence=0.40,
        supporting_sources=["Anomalous Survey A"],
        contradicting_sources=["Thermoluminescence Dating (Fagg 1977)", "Radiocarbon Assay B"],
    )
    assert disputed_claim.epistemic_status == EpistemicState.DISPUTED
    assert disputed_claim.contradicting_evidence_count == 2
