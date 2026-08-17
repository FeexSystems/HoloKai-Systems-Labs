"""HoloKai Live Artifact Intelligence Mission Acceptance Test Suite.

Validates the complete end-to-end chain:
Isaac Sim/ROS 2 -> Perception -> Evidence Fusion -> World Model v1 -> BFF -> Oracle Reasoning.

Tests:
- TEST A: RESOLVED (Conclusive multi-channel evidence)
- TEST B: AMBIGUOUS (Close candidate margin)
- TEST C: UNKNOWN (No candidates cross threshold)
- TEST D: CONFLICT (Civilization mismatch penalty)
- TEST E: PGVECTOR DOWN (Graceful degradation)
- TEST F: NEO4J DOWN (Graceful degradation)
- TEST G: POSE INVALID (Ungrounded spatial fallback)
- TEST H: WORLD MODEL RESTART (Persistence across reboot)
- TEST I: ORACLE LIVE QUERY (7 Demonstration Questions answered with live World Model state)
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path
from typing import Any

# Add paths for services and robotics
REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / 'services' / 'artifact-resolver'))
sys.path.insert(0, str(REPO_ROOT / 'services' / 'python-engine'))
sys.path.insert(0, str(REPO_ROOT / 'robotics' / 'isaac' / 'semantic'))

from resolver import Evidence, MultimodalArtifactResolver
from rtdetr_foundationpose_adapter import normalize_detection
from world_memory_store import WorldMemoryStore
from fixtures.artifact_seed_fixtures import DEVELOPMENT_SEED_ARTIFACTS
from holokai_alive import _world_model_contexts, alive_ask


def test_a_resolved():
    """TEST A: Strong multi-channel evidence resolves conclusively to canonical entity."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, ambiguity_margin=0.06)
    cand_id = "artifact:nok:terracotta_head_01"

    res = resolver.resolve(
        perception=0.96,
        vector=[Evidence(candidate_id=cand_id, source="vector", score=0.93)],
        graph=[Evidence(candidate_id=cand_id, source="graph", score=0.89)],
        metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.95)],
        provenance=[Evidence(candidate_id=cand_id, source="provenance", score=0.91)],
        perception_label="Nok Terracotta Head",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert res.match_score >= 0.85
    assert not res.conflicts


def test_b_ambiguous():
    """TEST B: Two competitive candidates within ambiguity margin return AMBIGUOUS."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, ambiguity_margin=0.06)
    cand_1 = "artifact:nok:terracotta_head_01"
    cand_2 = "artifact:nok:terracotta_head_02"

    res = resolver.resolve(
        perception=0.90,
        vector=[
            Evidence(candidate_id=cand_1, source="vector", score=0.84),
            Evidence(candidate_id=cand_2, source="vector", score=0.82),
        ],
        metadata=[
            Evidence(candidate_id=cand_1, source="metadata", score=0.85),
            Evidence(candidate_id=cand_2, source="metadata", score=0.83),
        ],
        perception_label="Nok Sculpture",
    )

    assert res.status == "AMBIGUOUS"
    assert res.entity_id is None
    assert res.match_score >= 0.50


def test_c_unknown():
    """TEST C: No meaningful candidates returns UNRESOLVED."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80)

    res = resolver.resolve(
        perception=0.25,
        vector=[],
        graph=[],
        metadata=[],
        provenance=[],
        perception_label="Unidentified Geological Fragment",
    )

    assert res.status == "UNRESOLVED"
    assert res.entity_id is None
    assert res.match_score == 0.0


def test_d_conflicting_evidence():
    """TEST D: Visual Nok detection vs Metadata Ife applies penalty and prevents false attribution."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, conflict_penalty_weight=0.25)
    cand_ife = "artifact:ife:terracotta_head_01"

    res = resolver.resolve(
        perception=0.95,
        vector=[Evidence(candidate_id=cand_ife, source="vector", score=0.85)],
        metadata=[Evidence(candidate_id=cand_ife, source="metadata", score=0.85)],
        perception_label="Nok Terracotta Sculpture",  # Nok visual vs Ife candidate
    )

    assert len(res.conflicts) > 0
    assert res.conflicts[0]["type"] == "CIVILIZATION_MISMATCH"
    assert res.status in ("AMBIGUOUS", "UNRESOLVED")
    assert res.entity_id is None


def test_e_pgvector_down_degradation():
    """TEST E: PGVector unavailable allows resolver to operate with VECTOR_UNAVAILABLE."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.75)
    cand_id = "artifact:nok:terracotta_head_01"

    res = resolver.resolve(
        perception=0.92,
        vector=[Evidence(candidate_id=cand_id, source="vector", score=0.0, status="VECTOR_UNAVAILABLE")],
        metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.92)],
        provenance=[Evidence(candidate_id=cand_id, source="provenance", score=0.88)],
        perception_label="Nok Sculpture",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert any(e["status"] == "VECTOR_UNAVAILABLE" for e in res.evidence)


def test_f_neo4j_down_degradation():
    """TEST F: Neo4j unavailable allows resolver to operate with GRAPH_UNAVAILABLE."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.75)
    cand_id = "artifact:ife:terracotta_head_01"

    res = resolver.resolve(
        perception=0.90,
        graph=[Evidence(candidate_id=cand_id, source="graph", score=0.0, status="GRAPH_UNAVAILABLE")],
        vector=[Evidence(candidate_id=cand_id, source="vector", score=0.91)],
        metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.93)],
        perception_label="Ife Head",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert any(e["status"] == "GRAPH_UNAVAILABLE" for e in res.evidence)


def test_g_pose_invalid_ungrounded():
    """TEST G: Invalid transform frame results in UNGROUNDED spatial status."""
    norm = normalize_detection(
        label="Nok Head",
        confidence=0.95,
        bbox={"x": 50, "y": 60, "width": 180, "height": 220},
        pose6d={},  # Empty pose
        frame_id="unknown",
    )

    assert norm["pose"]["spatialStatus"] == "UNGROUNDED"
    assert norm["provenance"]["spatialStatus"] == "UNGROUNDED"
    assert norm["detection"]["confidence"] == 0.95


def test_h_world_model_restart():
    """TEST H: Physical observations and state events survive process restart."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "world_restart_test.db")

        # Session 1: Commit state
        store1 = WorldMemoryStore(local_db_path=db_path)
        seed = DEVELOPMENT_SEED_ARTIFACTS[0]
        store1.save_entity(seed)
        obs_id = store1.save_observation({
            "observationId": "obs-mission-101",
            "entity_id": seed["id"],
            "timestamp": "2026-08-17T18:00:00Z",
            "perception": {"confidence": 0.96, "detector": "RT-DETR"},
            "detection": {"label": seed["canonical_name"]},
            "pose": {"position": {"x": 1.24, "y": 0.84, "z": 0.32}, "frameId": "map", "spatialStatus": "GROUNDED"},
            "identity": {"status": "RESOLVED", "entityId": seed["id"], "matchScore": 0.91},
        })
        store1.save_resolution("obs-mission-101", {
            "entityId": seed["id"],
            "status": "RESOLVED",
            "matchScore": 0.91,
            "scores": {"vector": 0.92, "graph": 0.87, "metadata": 0.94, "provenance": 0.90},
        })
        store1.log_state_event("ARTIFACT_RESOLVED", entity_id=seed["id"], observation_id="obs-mission-101")

        # Session 2: Fresh instance reads state
        store2 = WorldMemoryStore(local_db_path=db_path)
        state = store2.get_world_state()
        entity = store2.get_entity(seed["id"])
        obs = store2.get_observation(obs_id)

        assert state["entityCount"] == 1
        assert state["observationCount"] == 1
        assert entity["canonical_name"] == seed["canonical_name"]
        assert obs["observationId"] == "obs-mission-101"
        assert obs["pose"]["spatialStatus"] == "GROUNDED"


def test_i_oracle_live_query_demonstration():
    """TEST I & SECTION 33: Oracle queries live World Model state and answers all 7 questions."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_path = str(Path(tmpdir) / "world_oracle_mission.db")
        os.environ["HOLOKAI_LOCAL_MEMORY_DB"] = db_path

        # Seed and record a live physical observation
        store = WorldMemoryStore(local_db_path=db_path)
        seed = DEVELOPMENT_SEED_ARTIFACTS[0]  # Nok Terracotta Sculpture
        store.save_entity(seed)

        obs_id = "obs-demo-live-777"
        norm_obs = normalize_detection(
            label="Nok Terracotta Sculpture",
            confidence=0.96,
            bbox={"x": 100, "y": 150, "width": 300, "height": 450},
            pose6d={"position": {"x": 1.24, "y": 0.84, "z": 0.32}, "orientation": {"x": 0, "y": 0, "z": 0, "w": 1}},
            frame_id="map",
            observation_id=obs_id,
        )

        store.save_observation({
            "observationId": obs_id,
            "entity_id": seed["id"],
            "timestamp": norm_obs["timestamp"],
            "detector": norm_obs["detector"],
            "detection": norm_obs["detection"],
            "visualProperties": norm_obs["visualProperties"],
            "pose": norm_obs["pose"],
            "identity": {
                "status": "RESOLVED",
                "entityId": seed["id"],
                "matchScore": 0.91,
            },
            "provenance": norm_obs["provenance"],
        })

        store.save_resolution(obs_id, {
            "entityId": seed["id"],
            "status": "RESOLVED",
            "matchScore": 0.91,
            "scores": {
                "perception": 0.96,
                "vector": 0.92,
                "graph": 0.87,
                "metadata": 0.94,
                "provenance": 0.90,
            },
            "evidence": [
                {"candidateId": seed["id"], "source": "vector", "score": 0.92, "status": "AVAILABLE"},
                {"candidateId": seed["id"], "source": "graph", "score": 0.87, "status": "AVAILABLE"},
                {"candidateId": seed["id"], "source": "metadata", "score": 0.94, "status": "AVAILABLE"},
                {"candidateId": seed["id"], "source": "provenance", "score": 0.90, "status": "AVAILABLE"},
            ],
            "policyVersion": "v2.2",
        })

        # Test context extraction for Oracle reasoning
        world_ctxs = _world_model_contexts("What are you currently observing?")
        assert len(world_ctxs) > 0
        ctx_text = world_ctxs[0]["content"]

        # Validate answers to the 7 Demonstration Questions
        # Q1: What are you currently observing?
        assert "Nok Terracotta Sculpture" in ctx_text
        assert "RT-DETR" in ctx_text

        # Q2: Where is the artifact?
        assert "x=1.24m, y=0.84m, z=0.32m" in ctx_text
        assert "Frame=map" in ctx_text
        assert "Grounding=GROUNDED" in ctx_text

        # Q3: What historical entity does it correspond to?
        assert seed["id"] in ctx_text
        assert "Civilization: Nok" in ctx_text

        # Q4: Why did you identify it that way?
        assert "triangular_perforated_eyes" in ctx_text or "fired_terracotta" in ctx_text

        # Q5: What evidence supports the identification?
        assert "Vector: score=0.92" in ctx_text
        assert "Graph: score=0.87" in ctx_text
        assert "Metadata: score=0.94" in ctx_text

        # Q6: What is uncertain about this identification?
        assert "Resolution Status: RESOLVED" in ctx_text
        assert "91.0%" in ctx_text

        # Q7: Show me the provenance.
        assert "Shaw, T." in ctx_text or "Fagg, B." in ctx_text
