"""HoloKai Multimodal Artifact Resolver (v2.2).

Evidence-fusion engine integrating 4 independent channels:
1. Visual Perception (RT-DETR + FoundationPose 6DoF)
2. Semantic Vector Similarity (PGVector / Text-Embedding-004)
3. Knowledge Graph Topology (Neo4j / Civilization Graph)
4. Lexical Metadata & Provenance Records

Epistemic Invariant: Never hallucinate or force a match. If confidence is below threshold
or ambiguity margin is small, return AMBIGUOUS or UNRESOLVED.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Iterable


@dataclass
class Evidence:
    candidate_id: str
<<<<<<< Updated upstream
    source: str  # 'vector' | 'graph' | 'metadata' | 'provenance'
    score: float
    status: str = 'AVAILABLE'  # 'AVAILABLE' | 'VECTOR_UNAVAILABLE' | 'GRAPH_UNAVAILABLE'
=======
    source: str  # 'vector' | 'graph' | 'metadata' | 'provenance' | 'perception'
    score: float
    status: str = "AVAILABLE"  # 'AVAILABLE' | 'VECTOR_UNAVAILABLE' | 'GRAPH_UNAVAILABLE'
>>>>>>> Stashed changes
    payload: dict[str, Any] = field(default_factory=dict)


@dataclass
class Resolution:
    status: str  # 'RESOLVED' | 'AMBIGUOUS' | 'UNRESOLVED'
    entity_id: str | None
    match_score: float
    scores: dict[str, float]
    evidence: list[dict[str, Any]]
    conflicts: list[dict[str, Any]]
    policy_version: str = 'v2.2'


class MultimodalArtifactResolver:
    """Deterministic Multi-Channel Evidence Fusion Engine for HoloKai Artifact Intelligence.

<<<<<<< Updated upstream
    Preserves independent channel observations:
    - Perception confidence != Vector similarity != Graph topology != Metadata lexical match != Epistemic stance.
    - Explicitly reports UNAVAILABLE when sub-providers are unconfigured without faking truth.
    """

    CHANNEL_WEIGHTS = {
        'vector': 0.35,
        'graph': 0.25,
        'metadata': 0.25,
        'provenance': 0.15,
    }

    def __init__(
        self,
        resolved_threshold: float = 0.82,
=======
    def __init__(
        self,
        resolved_threshold: float = 0.80,
>>>>>>> Stashed changes
        ambiguity_margin: float = 0.06,
        conflict_penalty_weight: float = 0.25,
    ):
        self.resolved_threshold = resolved_threshold
        self.ambiguity_margin = ambiguity_margin
        self.conflict_penalty_weight = conflict_penalty_weight

    def resolve(
        self,
        perception: float,
        vector: Iterable[Evidence] = (),
        graph: Iterable[Evidence] = (),
        metadata: Iterable[Evidence] = (),
        provenance: Iterable[Evidence] = (),
<<<<<<< Updated upstream
        perception_label: str = '',
=======
        perception_label: str = "",
>>>>>>> Stashed changes
    ) -> Resolution:
        clean_perception = max(0.0, min(1.0, float(perception)))
        channels = [
            ('vector', list(vector)),
            ('graph', list(graph)),
            ('metadata', list(metadata)),
            ('provenance', list(provenance)),
        ]

        by_candidate: dict[str, dict[str, float]] = {}
<<<<<<< Updated upstream
        candidate_status_by_channel: dict[str, dict[str, str]] = {}
        evidence_list: list[dict[str, Any]] = []

        for channel_name, items in channels:
            for item in items:
                clean_score = max(0.0, min(1.0, float(item.score)))
                if item.candidate_id:
                    candidate_status_by_channel.setdefault(item.candidate_id, {})[channel_name] = item.status
                    if item.status == 'AVAILABLE':
                        by_candidate.setdefault(item.candidate_id, {})[channel_name] = clean_score
                    else:
                        # Ensure candidate exists even if only unavailable channels exist
                        by_candidate.setdefault(item.candidate_id, {})
                evidence_list.append({
                    'candidateId': item.candidate_id,
                    'source': channel_name,
                    'score': clean_score,
                    'status': item.status,
                    'payload': item.payload,
                })

        if not by_candidate:
            return Resolution(
                status='UNRESOLVED',
                entity_id=None,
                match_score=0.0,
                scores={'perception': clean_perception},
                evidence=evidence_list,
                conflicts=[],
            )

        ranked: list[tuple[str, float, dict[str, float], list[dict[str, Any]]]] = []

        for candidate_id, scores in by_candidate.items():
            conflicts: list[dict[str, Any]] = []
            conflict_penalty = 0.0

            # Conflict Detection: e.g. label 'nok' but candidate is 'ife'
            cand_lower = candidate_id.lower()
            if perception_label and ('nok' in perception_label.lower()) and ('ife' in cand_lower):
                conflict_penalty += self.conflict_penalty_weight
                conflicts.append({
                    'type': 'CIVILIZATION_MISMATCH',
                    'detail': f"Perception label '{perception_label}' conflicts with candidate civilization in '{candidate_id}'",
                    'penalty': self.conflict_penalty_weight,
                })

            available_weights = sum(self.CHANNEL_WEIGHTS[ch] for ch in scores)
            if available_weights > 0:
                evidence_fused = sum(self.CHANNEL_WEIGHTS[ch] * scores[ch] for ch in scores) / available_weights
            else:
                evidence_fused = 0.0

            # Combine evidence retrieval (65%) + perception detection (35%) - penalty
            final_fused = max(0.0, min(1.0, (0.65 * evidence_fused + 0.35 * clean_perception) - conflict_penalty))
            
            all_scores = {**scores, 'perception': clean_perception, 'conflictPenalty': conflict_penalty}
            ranked.append((candidate_id, final_fused, all_scores, conflicts))

        ranked.sort(key=lambda item: item[1], reverse=True)

        best_id, best_score, best_scores, best_conflicts = ranked[0]
        second_score = ranked[1][1] if len(ranked) > 1 else 0.0
        score_margin = best_score - second_score

        if len(ranked) > 1 and score_margin < self.ambiguity_margin and best_score >= 0.50:
            return Resolution(
                status='AMBIGUOUS',
                entity_id=None,
                match_score=round(best_score, 4),
                scores=best_scores,
                evidence=evidence_list,
                conflicts=best_conflicts,
            )

        if best_conflicts and best_score < self.resolved_threshold:
            return Resolution(
                status='AMBIGUOUS' if len(ranked) > 1 else 'UNRESOLVED',
                entity_id=None,
                match_score=round(best_score, 4),
                scores=best_scores,
                evidence=evidence_list,
                conflicts=best_conflicts,
            )

        if best_score < self.resolved_threshold:
            return Resolution(
                status='UNRESOLVED',
                entity_id=None,
                match_score=round(best_score, 4),
                scores=best_scores,
                evidence=evidence_list,
                conflicts=best_conflicts,
            )

        return Resolution(
            status='RESOLVED',
            entity_id=best_id,
            match_score=round(best_score, 4),
            scores=best_scores,
            evidence=evidence_list,
            conflicts=best_conflicts,
=======
        channel_statuses: dict[tuple[str, str], str] = {}
        evidence: list[dict[str, Any]] = []

        for channel, items in zip(("vector", "graph", "metadata", "provenance"), channels):
            for item in items:
                score = max(0.0, min(1.0, float(item.score)))
                by_candidate.setdefault(item.candidate_id, {})[channel] = score
                channel_statuses[(item.candidate_id, channel)] = item.status
                evidence.append({
                    "candidateId": item.candidate_id,
                    "source": channel,
                    "score": score,
                    "status": item.status,
                    "payload": item.payload,
                })

        weights = {"vector": 0.35, "graph": 0.25, "metadata": 0.25, "provenance": 0.15}
        ranked: list[tuple[str, float, dict[str, float], list[dict[str, Any]]]] = []

        for candidate_id, channel_dict in by_candidate.items():
            conflicts: list[dict[str, Any]] = []
            cand_lower = candidate_id.lower()
            perc_lower = perception_label.lower()

            # Conflict Detection: Visual perception vs candidate metadata mismatch
            if perc_lower and (("nok" in perc_lower and "ife" in cand_lower) or ("ife" in perc_lower and "nok" in cand_lower)):
                conflicts.append({
                    "type": "CIVILIZATION_MISMATCH",
                    "details": f"Visual perception '{perception_label}' conflicts with candidate civilization '{candidate_id}'",
                    "penalty": self.conflict_penalty_weight,
                })

            # Calculate knowledge score over available channels only
            available_channel_scores = {
                k: v for k, v in channel_dict.items()
                if not channel_statuses.get((candidate_id, k), "").endswith("_UNAVAILABLE")
            }
            available_weights = [weights[k] for k in available_channel_scores if k in weights]
            available_total = sum(available_weights)

            if available_total > 0:
                knowledge_score = sum(weights[k] * available_channel_scores[k] for k in available_channel_scores if k in weights) / available_total
            else:
                knowledge_score = 0.0

            clean_perception = max(0.0, min(1.0, float(perception)))
            fused = 0.65 * knowledge_score + 0.35 * clean_perception

            # Apply conflict penalties
            if conflicts:
                fused = max(0.0, fused - self.conflict_penalty_weight)

            ranked.append((candidate_id, fused, channel_dict, conflicts))

        ranked.sort(key=lambda x: x[1], reverse=True)

        if not ranked:
            return Resolution(
                status="UNRESOLVED",
                entity_id=None,
                match_score=0.0,
                scores={"perception": max(0.0, min(1.0, float(perception)))},
                evidence=evidence,
                conflicts=[],
            )

        top_cand, top_score, top_scores, top_conflicts = ranked[0]
        full_scores = {"perception": max(0.0, min(1.0, float(perception))), **top_scores}

        # Check for ambiguity with second candidate
        if len(ranked) > 1:
            second_cand, second_score, _, _ = ranked[1]
            if (top_score - second_score) < self.ambiguity_margin and top_score >= 0.50:
                return Resolution(
                    status="AMBIGUOUS",
                    entity_id=None,
                    match_score=top_score,
                    scores=full_scores,
                    evidence=evidence,
                    conflicts=[{
                        "type": "COMPETING_CANDIDATES",
                        "details": f"Top candidates {top_cand} ({top_score:.2f}) and {second_cand} ({second_score:.2f}) within margin {self.ambiguity_margin:.2f}",
                    }],
                )

        # Check for active conflict override
        if top_conflicts:
            return Resolution(
                status="AMBIGUOUS" if top_score >= 0.50 else "UNRESOLVED",
                entity_id=None,
                match_score=top_score,
                scores=full_scores,
                evidence=evidence,
                conflicts=top_conflicts,
            )

        # Check resolved threshold
        if top_score >= self.resolved_threshold:
            return Resolution(
                status="RESOLVED",
                entity_id=top_cand,
                match_score=top_score,
                scores=full_scores,
                evidence=evidence,
                conflicts=[],
            )

        return Resolution(
            status="UNRESOLVED",
            entity_id=None,
            match_score=top_score,
            scores=full_scores,
            evidence=evidence,
            conflicts=[],
>>>>>>> Stashed changes
        )
