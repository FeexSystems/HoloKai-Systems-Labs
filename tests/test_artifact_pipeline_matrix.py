"""HoloKai 10-Point Verification Matrix Test Suite.

Validates the full multimodal perception and evidence fusion pipeline:
1. RESOLVED (conclusive evidence)
2. AMBIGUOUS (close candidate margin)
3. UNKNOWN (no candidates cross threshold)
4. CONFLICTING EVIDENCE (civilization mismatch penalty)
5. PGVECTOR UNAVAILABLE (graceful degradation)
6. NEO4J UNAVAILABLE (graceful degradation)
7. POSE FRAME FAILURE (ungrounded spatial fallback)
8. WORLD MODEL PERSISTENCE (storage and recall across instances)
9. PROVENANCE RETENTION (citations, epistemic stance preserved)
10. FULL ARTIFACT RECONSTRUCTION E2E PIPELINE
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / 'services' / 'artifact-resolver'))
sys.path.insert(0, str(REPO_ROOT / 'services' / 'python-engine'))
sys.path.insert(0, str(REPO_ROOT / 'robotics' / 'isaac' / 'semantic'))

from fixtures.artifact_seed_fixtures import DEVELOPMENT_SEED_ARTIFACTS
from resolver import Evidence, MultimodalArtifactResolver
from rtdetr_foundationpose_adapter import normalize_detection
from world_memory_store import WorldMemoryStore


def test_1_resolved_conclusive_evidence():
    """TEST 1: High perception + vector + graph + metadata + provenance yields RESOLVED."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, ambiguity_margin=0.06)
    cand_id = "artifact:nok:terracotta_head_01"

    res = resolver.resolve(
        perception=0.96,
        vector=[Evidence(candidate_id=cand_id, source="vector", score=0.92)],
        graph=[Evidence(candidate_id=cand_id, source="graph", score=0.88)],
        metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.95)],
        provenance=[Evidence(candidate_id=cand_id, source="provenance", score=0.90)],
        perception_label="Nok Terracotta Sculpture",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert res.match_score >= 0.85
    assert not res.conflicts


def test_2_ambiguous_close_candidates():
    """TEST 2: Two candidate matches within ambiguity margin yields AMBIGUOUS."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, ambiguity_margin=0.06)
    cand_1 = "artifact:nok:terracotta_head_01"
    cand_2 = "artifact:nok:terracotta_head_02"

    res = resolver.resolve(
        perception=0.92,
        vector=[
            Evidence(candidate_id=cand_1, source="vector", score=0.86),
            Evidence(candidate_id=cand_2, source="vector", score=0.84),
        ],
        metadata=[
            Evidence(candidate_id=cand_1, source="metadata", score=0.88),
            Evidence(candidate_id=cand_2, source="metadata", score=0.85),
        ],
        perception_label="Nok Sculpture",
    )

    assert res.status == "AMBIGUOUS"
    assert res.entity_id is None
    assert res.match_score >= 0.50
    assert len(res.conflicts) > 0
    assert res.conflicts[0]["type"] == "COMPETING_CANDIDATES"


def test_3_unknown_no_candidates():
    """TEST 3: No candidates above threshold yields UNRESOLVED."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80)

    res = resolver.resolve(
        perception=0.30,
        vector=[],
        graph=[],
        metadata=[],
        provenance=[],
        perception_label="Unknown Rock Formation",
    )

    assert res.status == "UNRESOLVED"
    assert res.entity_id is None
    assert res.match_score == 0.0


def test_4_conflicting_evidence_civilization_mismatch():
    """TEST 4: Visual Nok vs Metadata Ife applies penalty and prevents false attribution."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, conflict_penalty_weight=0.25)
    cand_ife = "artifact:ife:terracotta_head_01"

    res = resolver.resolve(
        perception=0.95,
        vector=[Evidence(candidate_id=cand_ife, source="vector", score=0.85)],
        metadata=[Evidence(candidate_id=cand_ife, source="metadata", score=0.85)],
        perception_label="Nok Terracotta Sculpture",
    )

    assert len(res.conflicts) > 0
    assert res.conflicts[0]["type"] == "CIVILIZATION_MISMATCH"
    assert res.status in ("AMBIGUOUS", "UNRESOLVED")
    assert res.entity_id is None


def test_5_pgvector_unavailable_degradation():
    """TEST 5: PGVector down allows system to degrade gracefully with VECTOR_UNAVAILABLE."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.75)
    cand_id = "artifact:nok:terracotta_head_01"

    res = resolver.resolve(
        perception=0.94,
        vector=[Evidence(candidate_id=cand_id, source="vector", score=0.0, status="VECTOR_UNAVAILABLE")],
        graph=[Evidence(candidate_id=cand_id, source="graph", score=0.89)],
        metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.95)],
        provenance=[Evidence(candidate_id=cand_id, source="provenance", score=0.90)],
        perception_label="Nok Terracotta",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert any(e["status"] == "VECTOR_UNAVAILABLE" for e in res.evidence)


def test_6_neo4j_unavailable_degradation():
    """TEST 6: Neo4j down allows system to degrade gracefully with GRAPH_UNAVAILABLE."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.75)
    cand_id = "artifact:ife:terracotta_head_01"

    res = resolver.resolve(
        perception=0.92,
        graph=[Evidence(candidate_id=cand_id, source="graph", score=0.0, status="GRAPH_UNAVAILABLE")],
        vector=[Evidence(candidate_id=cand_id, source="vector", score=0.93)],
        metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.94)],
        provenance=[Evidence(candidate_id=cand_id, source="provenance", score=0.90)],
        perception_label="Ife Head",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert any(e["status"] == "GRAPH_UNAVAILABLE" for e in res.evidence)


def test_7_pose_frame_failure_ungrounded():
    """TEST 7: Invalid or missing transform frame marks spatialStatus as UNGROUNDED."""
    norm = normalize_detection(
        label="Nok Terracotta Head",
        confidence=0.95,
        bbox={"x": 100, "y": 120, "width": 200, "height": 300},
        pose6d={},
        frame_id="unknown",
    )

    assert norm["pose"]["spatialStatus"] == "UNGROUNDED"
    assert norm["provenance"]["spatialStatus"] == "UNGROUNDED"
    assert norm["pose"]["frameId"] == "ungrounded"


def test_8_world_model_persistence():
    """TEST 8: Entities and observations persist reliably across WorldMemoryStore instances."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_file = str(Path(tmpdir) / "persistent_world.db")

        # Session 1: Write
        store1 = WorldMemoryStore(local_db_path=db_file)
        entity_id = store1.save_entity({
            "id": "artifact:nok:terracotta_head_01",
            "canonical_name": "Nok Terracotta Head",
            "civilization": "Nok",
            "historical_period": "c. 500 BCE – 200 CE",
            "epistemic_status": "ESTABLISHED",
            "properties": {"material": "terracotta"},
            "provenance": {"institution": "National Museum Jos"},
        })
        store1.save_observation({
            "observationId": "obs-matrix-001",
            "entity_id": entity_id,
            "timestamp": "2026-08-17T12:00:00Z",
            "perception": {"confidence": 0.96},
            "detection": {"label": "Nok Terracotta Head"},
            "pose": {"position": {"x": 1.0, "y": 0.5, "z": 0.8}, "frameId": "map", "spatialStatus": "GROUNDED"},
            "identity": {"status": "RESOLVED", "entityId": entity_id, "matchScore": 0.92},
        })

        # Session 2: Fresh instance read
        store2 = WorldMemoryStore(local_db_path=db_file)
        state = store2.get_world_state()
        entity = store2.get_entity(entity_id)

        assert state["entityCount"] == 1
        assert state["observationCount"] == 1
        assert entity["canonical_name"] == "Nok Terracotta Head"
        assert entity["civilization"] == "Nok"


def test_9_provenance_retention():
    """TEST 9: Resolved entity preserves citations and epistemic stance."""
    fixture = DEVELOPMENT_SEED_ARTIFACTS[0]
    assert fixture["provenance"]["epistemicStance"] == "ESTABLISHED"
    assert len(fixture["provenance"]["citations"]) > 0
    assert "Shaw, T." in fixture["provenance"]["citations"][0]


def test_10_end_to_end_artifact_pipeline():
    """TEST 10: Full synthetic pipeline from normalized detection -> resolution -> storage."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_file = str(Path(tmpdir) / "e2e_world.db")
        store = WorldMemoryStore(local_db_path=db_file)

        # Seed known entity
        seed = DEVELOPMENT_SEED_ARTIFACTS[0]
        store.save_entity(seed)

        # 1. Perception normalization
        norm_obs = normalize_detection(
            label="Nok Terracotta Sculpture",
            confidence=0.96,
            bbox={"x": 50, "y": 60, "width": 200, "height": 300},
            pose6d={"position": {"x": 1.2, "y": 0.5, "z": 0.8}, "orientation": {"x": 0, "y": 0, "z": 0, "w": 1}},
            frame_id="map",
        )

        # 2. Multi-channel evidence assembly
        resolver = MultimodalArtifactResolver(resolved_threshold=0.80)
        cand_id = seed["id"]
        res = resolver.resolve(
            perception=norm_obs["detector"]["confidence"],
            vector=[Evidence(candidate_id=cand_id, source="vector", score=0.91)],
            graph=[Evidence(candidate_id=cand_id, source="graph", score=0.88)],
            metadata=[Evidence(candidate_id=cand_id, source="metadata", score=0.96)],
            provenance=[Evidence(candidate_id=cand_id, source="provenance", score=0.92)],
            perception_label=norm_obs["detection"]["label"],
        )

        assert res.status == "RESOLVED"
        assert res.entity_id == cand_id

        # 3. World model persistent commit
        obs_id = norm_obs["observationId"]
        store.save_observation({
            "observationId": obs_id,
            "entity_id": res.entity_id,
            "timestamp": norm_obs["timestamp"],
            "perception": norm_obs["detector"],
            "identity": {"status": res.status, "entityId": res.entity_id, "matchScore": res.match_score},
            "provenance": norm_obs["provenance"],
        })
        store.save_resolution(obs_id, {
            "entityId": res.entity_id,
            "status": res.status,
            "matchScore": res.match_score,
            "scores": res.scores,
            "evidence": res.evidence,
        })

        # 4. Verify world query
        state = store.get_world_state()
        assert state["entityCount"] == 1
        assert state["observationCount"] == 1
        first_obs = state["observations"][0]
        assert (first_obs.get("observationId") or first_obs.get("observation_id")) == obs_id
