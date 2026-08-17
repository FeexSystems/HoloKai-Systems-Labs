"""HoloKai Artifact Intelligence & World Model v1 Verification Test Matrix.

Implements the mandatory 10-Point Test Suite covering:
- TEST 1: RESOLVED (Conclusive multi-channel evidence)
- TEST 2: AMBIGUOUS (Close candidate margin)
- TEST 3: UNKNOWN (No meaningful candidates)
- TEST 4: CONFLICTING EVIDENCE (Civilization/era mismatch penalty)
- TEST 5: PGVECTOR UNAVAILABLE (Graceful degradation)
- TEST 6: NEO4J UNAVAILABLE (Graceful degradation)
- TEST 7: POSE FRAME FAILURE (Fallback to UNGROUNDED)
- TEST 8: WORLD MODEL PERSISTENCE (Observation survives restart)
- TEST 9: PROVENANCE RETENTION (Complete source attribution)
- TEST 10: END-TO-END PIPELINE (Perception -> Resolver -> Persistence)
"""

from __future__ import annotations

import os
import sys
import tempfile
from pathlib import Path

# Add services and robotics to path
REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / 'services' / 'artifact-resolver'))
sys.path.insert(0, str(REPO_ROOT / 'services' / 'python-engine'))
sys.path.insert(0, str(REPO_ROOT / 'robotics' / 'isaac' / 'semantic'))

from resolver import Evidence, MultimodalArtifactResolver
from rtdetr_foundationpose_adapter import normalize_detection
from world_memory_store import WorldMemoryStore
from fixtures.artifact_seed_fixtures import DEVELOPMENT_SEED_ARTIFACTS


def test_1_resolved_conclusive_evidence():
    """TEST 1: Conclusive multi-channel evidence resolves to canonical entity."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, ambiguity_margin=0.06)

    cand_id = "artifact:nok:terracotta_head_01"
    perception_conf = 0.95
    vector_ev = [Evidence(candidate_id=cand_id, source="vector", score=0.92)]
    graph_ev = [Evidence(candidate_id=cand_id, source="graph", score=0.88)]
    metadata_ev = [Evidence(candidate_id=cand_id, source="metadata", score=0.95)]
    provenance_ev = [Evidence(candidate_id=cand_id, source="provenance", score=0.90)]

    res = resolver.resolve(
        perception=perception_conf,
        vector=vector_ev,
        graph=graph_ev,
        metadata=metadata_ev,
        provenance=provenance_ev,
        perception_label="Nok Terracotta Sculpture",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert res.match_score >= 0.85
    assert not res.conflicts


def test_2_ambiguous_close_candidates():
    """TEST 2: Two candidate matches within ambiguity margin return AMBIGUOUS."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, ambiguity_margin=0.06)

    cand_a = "artifact:nok:head_variant_a"
    cand_b = "artifact:nok:head_variant_b"

    vector_ev = [
        Evidence(candidate_id=cand_a, source="vector", score=0.85),
        Evidence(candidate_id=cand_b, source="vector", score=0.83),
    ]
    metadata_ev = [
        Evidence(candidate_id=cand_a, source="metadata", score=0.84),
        Evidence(candidate_id=cand_b, source="metadata", score=0.82),
    ]

    res = resolver.resolve(
        perception=0.90,
        vector=vector_ev,
        metadata=metadata_ev,
        perception_label="Nok Terracotta",
    )

    assert res.status == "AMBIGUOUS"
    assert res.entity_id is None
    assert res.match_score >= 0.50


def test_3_unknown_no_candidates():
    """TEST 3: When no candidate crosses the baseline, status is UNRESOLVED."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80)

    res = resolver.resolve(
        perception=0.30,
        vector=[],
        graph=[],
        metadata=[],
        provenance=[],
        perception_label="Unidentified rock fragment",
    )

    assert res.status == "UNRESOLVED"
    assert res.entity_id is None
    assert res.match_score == 0.0


def test_4_conflicting_evidence_civilization_mismatch():
    """TEST 4: Visual Nok vs Metadata Ife applies penalty and prevents false resolution."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.80, conflict_penalty_weight=0.25)

    cand_ife = "artifact:ife:terracotta_head_01"
    vector_ev = [Evidence(candidate_id=cand_ife, source="vector", score=0.85)]
    metadata_ev = [Evidence(candidate_id=cand_ife, source="metadata", score=0.85)]

    res = resolver.resolve(
        perception=0.95,
        vector=vector_ev,
        metadata=metadata_ev,
        perception_label="Nok Terracotta Head",  # Visual is Nok, candidate is Ife
    )

    assert len(res.conflicts) > 0
    assert res.conflicts[0]["type"] == "CIVILIZATION_MISMATCH"
    # Match score reduced by penalty
    assert res.status in ("AMBIGUOUS", "UNRESOLVED")
    assert res.entity_id is None


def test_5_pgvector_unavailable_degradation():
    """TEST 5: PGVector unconfigured -> resolver operates with VECTOR_UNAVAILABLE."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.75)

    cand_id = "artifact:nok:terracotta_head_01"
    vector_ev = [Evidence(candidate_id=cand_id, source="vector", score=0.0, status="VECTOR_UNAVAILABLE")]
    metadata_ev = [Evidence(candidate_id=cand_id, source="metadata", score=0.90)]
    provenance_ev = [Evidence(candidate_id=cand_id, source="provenance", score=0.85)]

    res = resolver.resolve(
        perception=0.90,
        vector=vector_ev,
        metadata=metadata_ev,
        provenance=provenance_ev,
        perception_label="Nok Sculpture",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert any(e["status"] == "VECTOR_UNAVAILABLE" for e in res.evidence)


def test_6_neo4j_unavailable_degradation():
    """TEST 6: Neo4j unconfigured -> resolver operates with GRAPH_UNAVAILABLE."""
    resolver = MultimodalArtifactResolver(resolved_threshold=0.75)

    cand_id = "artifact:ife:terracotta_head_01"
    graph_ev = [Evidence(candidate_id=cand_id, source="graph", score=0.0, status="GRAPH_UNAVAILABLE")]
    vector_ev = [Evidence(candidate_id=cand_id, source="vector", score=0.90)]
    metadata_ev = [Evidence(candidate_id=cand_id, source="metadata", score=0.92)]

    res = resolver.resolve(
        perception=0.90,
        vector=vector_ev,
        graph=graph_ev,
        metadata=metadata_ev,
        perception_label="Ife Head",
    )

    assert res.status == "RESOLVED"
    assert res.entity_id == cand_id
    assert any(e["status"] == "GRAPH_UNAVAILABLE" for e in res.evidence)


def test_7_pose_frame_failure_ungrounded():
    """TEST 7: Missing or invalid map frame results in UNGROUNDED spatial status."""
    norm = normalize_detection(
        label="Nok Head",
        confidence=0.94,
        bbox={"x": 10, "y": 20, "width": 100, "height": 120},
        pose6d={},  # Missing pose
        frame_id="unknown",
    )

    assert norm["pose"]["spatialStatus"] == "UNGROUNDED"
    assert norm["provenance"]["spatialStatus"] == "UNGROUNDED"


def test_8_world_model_persistence():
    """TEST 8: Observations and resolutions survive process restart."""
    with tempfile.TemporaryDirectory() as tmpdir:
        db_file = str(Path(tmpdir) / "world_test.db")

        # Session 1: Write state
        store1 = WorldMemoryStore(local_db_path=db_file)
        entity_id = store1.save_entity({
            "id": "artifact:nok:terracotta_head_01",
            "canonical_name": "Nok Terracotta Sculpture",
            "civilization": "Nok",
            "epistemic_status": "ESTABLISHED",
        })
        obs_id = store1.save_observation({
            "observationId": "obs-persist-test-101",
            "entity_id": entity_id,
            "timestamp": "2026-08-17T12:00:00Z",
            "frame_id": "map",
            "spatial_status": "GROUNDED",
            "perception": {"confidence": 0.96, "detector": "RT-DETR"},
            "identity": {"status": "RESOLVED", "entityId": entity_id},
        })
        store1.save_resolution("obs-persist-test-101", {
            "entityId": entity_id,
            "status": "RESOLVED",
            "matchScore": 0.92,
            "scores": {"vector": 0.92, "metadata": 0.95},
            "evidence": [{"candidateId": entity_id, "source": "vector", "score": 0.92}],
        })

        # Session 2: Read state from new instance
        store2 = WorldMemoryStore(local_db_path=db_file)
        world_state = store2.get_world_state()
        entity = store2.get_entity(entity_id)

        assert world_state["entityCount"] == 1
        assert world_state["observationCount"] == 1
        assert entity is not None
        assert entity["canonical_name"] == "Nok Terracotta Sculpture"
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
<<<<<<< Updated upstream
        assert state["observations"][0]["observation_id"] == obs_id
=======
        first_obs = state["observations"][0]
        assert (first_obs.get("observationId") or first_obs.get("observation_id")) == obs_id
>>>>>>> Stashed changes
