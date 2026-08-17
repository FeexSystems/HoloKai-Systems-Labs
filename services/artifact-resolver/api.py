from __future__ import annotations

from typing import Any

from .resolver import Evidence, MultimodalArtifactResolver


def resolve_observation(payload: dict[str, Any]) -> dict[str, Any]:
    observation = payload.get("observation", payload)
    resolver = MultimodalArtifactResolver(
        resolved_threshold=float(payload.get("resolvedThreshold", 0.82)),
        ambiguity_margin=float(payload.get("ambiguityMargin", 0.06)),
    )

    def ev(channel: str) -> list[Evidence]:
        return [Evidence(str(x["candidateId"]), channel, float(x.get("score", 0)), x) for x in payload.get(channel, []) if x.get("candidateId")]

    result = resolver.resolve(
        perception=float(observation.get("confidence", 0)),
        vector=ev("vector"), graph=ev("graph"), metadata=ev("metadata"), provenance=ev("provenance"),
    )
    return {
        "status": result.status,
        "entity": {"id": result.entity_id} if result.entity_id else None,
        "matchScore": result.match_score,
        "scores": result.scores,
        "evidence": result.evidence,
        "conflicts": result.conflicts,
    }
