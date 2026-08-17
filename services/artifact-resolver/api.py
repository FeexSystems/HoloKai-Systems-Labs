from __future__ import annotations

from typing import Any

from .resolver import Evidence, MultimodalArtifactResolver


def resolve_observation(payload: dict[str, Any]) -> dict[str, Any]:
    observation = payload.get("observation", payload)
    resolver = MultimodalArtifactResolver(
        resolved_threshold=float(payload.get("resolvedThreshold", 0.82)),
        ambiguity_margin=float(payload.get("ambiguityMargin", 0.06)),
        conflict_penalty_weight=float(payload.get("conflictPenaltyWeight", 0.25)),
    )

    def ev(channel: str) -> list[Evidence]:
        items = payload.get(channel, [])
        return [
            Evidence(
                candidate_id=str(x.get("candidateId", "")),
                source=channel,
                score=float(x.get("score", 0.0)),
                status=str(x.get("status", "AVAILABLE")),
                payload=x.get("payload", x),
            )
            for x in items
            if isinstance(x, dict) and x.get("candidateId")
        ]

    result = resolver.resolve(
        perception=float(observation.get("confidence", 0.0)),
        vector=ev("vector"),
        graph=ev("graph"),
        metadata=ev("metadata"),
        provenance=ev("provenance"),
        perception_label=str(observation.get("label", "")),
    )
    return {
        "status": result.status,
        "entityId": result.entity_id,
        "entity": {"id": result.entity_id} if result.entity_id else None,
        "matchScore": result.match_score,
        "scores": result.scores,
        "evidence": result.evidence,
        "conflicts": result.conflicts,
        "policyVersion": result.policy_version,
    }
