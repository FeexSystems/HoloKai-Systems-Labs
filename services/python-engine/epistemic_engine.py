"""HoloKai Epistemic Engine (Responsible Belief & Truth Layer System).

Enforces the core philosophical doctrine:
"The Epistemic Engine determines what HoloKai can responsibly believe."
"HoloKai must never confuse language generation with reality itself."

Subsystems & Invariants:
1. Epistemic States:
   - KNOWN: Conclusively established by multi-source archaeological/historical consensus.
   - SUPPORTED: Strong evidentiary basis with primary sources and provenance.
   - PROBABLE: Multi-channel evidence alignment crossing confidence threshold (>= 0.80).
   - POSSIBLE: Plausible hypothesis with limited evidence; alternative interpretations exist.
   - UNCERTAIN: Evidence is ambiguous, partial, or degraded.
   - DISPUTED: Active scholarly debate or conflicting source claims.
   - CONTRADICTED: Direct evidentiary or physical contradiction.
   - UNKNOWN: Insufficient or missing data.
   - SIMULATED: Generated or reconstructed inside a synthetic environment (e.g. Isaac Sim).
   - FICTIONAL_RECONSTRUCTION: Creative or speculative representation; NOT factual.

2. Four-Layer Truth Model:
   - OBSERVED: Directly captured by sensors / perception in physical or simulated space.
   - DOCUMENTED: Recorded in academic literature, manuscripts, or archaeological catalogs.
   - INFERRED: Computed by multimodal fusion, heuristic, or neural reasoning.
   - SIMULATED: Executed within Isaac Sim synthetic reality.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, List, Optional


class EpistemicState(str, Enum):
    KNOWN = "KNOWN"
    SUPPORTED = "SUPPORTED"
    PROBABLE = "PROBABLE"
    POSSIBLE = "POSSIBLE"
    UNCERTAIN = "UNCERTAIN"
    DISPUTED = "DISPUTED"
    CONTRADICTED = "CONTRADICTED"
    UNKNOWN = "UNKNOWN"
    SIMULATED = "SIMULATED"
    FICTIONAL_RECONSTRUCTION = "FICTIONAL_RECONSTRUCTION"


class TruthLayer(str, Enum):
    OBSERVED = "OBSERVED"
    DOCUMENTED = "DOCUMENTED"
    INFERRED = "INFERRED"
    SIMULATED = "SIMULATED"


@dataclass
class EpistemicClaim:
    """Formal knowledge claim with explicit evidentiary qualifications."""

    claim: str
    truth_layer: TruthLayer
    epistemic_status: EpistemicState
    confidence: float
    supporting_sources: List[str] = field(default_factory=list)
    contradicting_sources: List[str] = field(default_factory=list)
    supporting_evidence_count: int = 0
    contradicting_evidence_count: int = 0
    provenance_complete: bool = False
    temporal_validity: Optional[str] = None
    method_of_inference: Optional[str] = None
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class EpistemicEngine:
    """Evaluates claims, propagates uncertainty, and guards against epistemic inflation."""

    @staticmethod
    def evaluate_artifact_resolution(
        match_score: float,
        resolution_status: str,
        conflicts: List[dict[str, Any]],
        has_provenance: bool,
        is_simulation: bool = False,
    ) -> EpistemicState:
        """Determines the responsible epistemic state for an artifact identification."""
        if is_simulation and resolution_status != "RESOLVED":
            return EpistemicState.SIMULATED

        if conflicts:
            for c in conflicts:
                if c.get("type") in ("CIVILIZATION_MISMATCH", "CONTRADICTED"):
                    return EpistemicState.DISPUTED if match_score >= 0.50 else EpistemicState.CONTRADICTED
            return EpistemicState.DISPUTED

        if resolution_status == "RESOLVED":
            if match_score >= 0.90 and has_provenance:
                return EpistemicState.SUPPORTED
            elif match_score >= 0.80:
                return EpistemicState.PROBABLE
            else:
                return EpistemicState.POSSIBLE

        if resolution_status == "AMBIGUOUS":
            return EpistemicState.UNCERTAIN

        return EpistemicState.UNKNOWN

    @staticmethod
    def create_qualified_claim(
        subject_id: str,
        predicate: str,
        object_id: str,
        truth_layer: TruthLayer,
        confidence: float,
        supporting_sources: List[str],
        contradicting_sources: Optional[List[str]] = None,
        method_of_inference: Optional[str] = None,
        temporal_validity: Optional[str] = None,
    ) -> EpistemicClaim:
        """Creates an epistemically bounded claim ensuring no false certainty."""
        contra = contradicting_sources or []
        supp_count = len(supporting_sources)
        contra_count = len(contra)
        clean_conf = max(0.0, min(1.0, float(confidence)))

        if contra_count > 0 and supp_count > 0:
            status = EpistemicState.DISPUTED
        elif contra_count > 0 and supp_count == 0:
            status = EpistemicState.CONTRADICTED
        elif clean_conf >= 0.90 and supp_count >= 2:
            status = EpistemicState.SUPPORTED
        elif clean_conf >= 0.75:
            status = EpistemicState.PROBABLE
        elif clean_conf >= 0.50:
            status = EpistemicState.POSSIBLE
        elif clean_conf > 0.0:
            status = EpistemicState.UNCERTAIN
        else:
            status = EpistemicState.UNKNOWN

        return EpistemicClaim(
            claim=f"{subject_id} {predicate} {object_id}",
            truth_layer=truth_layer,
            epistemic_status=status,
            confidence=clean_conf,
            supporting_sources=supporting_sources,
            contradicting_sources=contra,
            supporting_evidence_count=supp_count,
            contradicting_evidence_count=contra_count,
            provenance_complete=bool(supp_count > 0),
            temporal_validity=temporal_validity,
            method_of_inference=method_of_inference,
        )
