from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Iterable


@dataclass
class Evidence:
    candidate_id: str
    source: str
    score: float
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass
class Resolution:
    status: str
    entity_id: str | None
    match_score: float
    scores: dict[str, float]
    evidence: list[dict[str, Any]]
    conflicts: list[dict[str, Any]]


class MultimodalArtifactResolver:
    """Evidence-fusion policy independent of ROS/database clients."""

    def __init__(self, resolved_threshold: float = 0.82, ambiguity_margin: float = 0.06):
        self.resolved_threshold = resolved_threshold
        self.ambiguity_margin = ambiguity_margin

    def resolve(
        self,
        perception: float,
        vector: Iterable[Evidence] = (),
        graph: Iterable[Evidence] = (),
        metadata: Iterable[Evidence] = (),
        provenance: Iterable[Evidence] = (),
    ) -> Resolution:
        channels = [list(vector), list(graph), list(metadata), list(provenance)]
        by_candidate: dict[str, dict[str, float]] = {}
        evidence: list[dict[str, Any]] = []
        for channel, items in zip(("vector", "graph", "metadata", "provenance"), channels):
            for item in items:
                score = max(0.0, min(1.0, item.score))
                by_candidate.setdefault(item.candidate_id, {})[channel] = score
                evidence.append({"candidateId": item.candidate_id, "source": channel, "score": score, "payload": item.payload})

        ranked: list[tuple[str, float, dict[str, float]]] = []
        weights = {"vector": 0.35, "graph": 0.25, "metadata": 0.25, "provenance": 0.15}
        for candidate_id, scores in by_candidate.items():
            available = sum(weights[k] for k in scores)
            fused = sum(weights[k] * scores[k] for k in scores) / available if available else 0.0
            fused = 0.65 * fused + 0.35 * max(0.0, min(1.0, perception))
            ranked.append((candidate_id, fused, scores))
        ranked.sort(key=lambda x: x[1], reverse=True)

        if not ranked:
            return Resolution("UNRESOLVED", None, 0.0, {}, evidence, [])

        best_id, best_score, channel_scores = ranked[0]
        second_score = ranked[1][1] if len(ranked) > 1 else 0.0
        conflicts: list[dict[str, Any]] = []
        if len(ranked) > 1 and best_score - second_score < self.ambiguity_margin:
            return Resolution("AMBIGUOUS", None, best_score, channel_scores, evidence, conflicts)
        if best_score < self.resolved_threshold:
            return Resolution("UNRESOLVED", None, best_score, channel_scores, evidence, conflicts)
        return Resolution("RESOLVED", best_id, best_score, channel_scores, evidence, conflicts)
