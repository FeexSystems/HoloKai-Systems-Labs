# HoloKai Artifact Resolver v2.2

The resolver converts a normalized physical observation into an auditable identity decision.

## Evidence channels

- **PGVector**: semantic similarity candidates.
- **Neo4j**: civilization, region, era, material and source relationships.
- **Metadata/Aliases**: deterministic names, aliases and catalog metadata.
- **Provenance**: source-quality evidence.

The policy combines these channels while retaining individual scores. It never treats a detector score as historical truth.

## Decision states

- `RESOLVED`: best candidate crosses the configured threshold and is sufficiently separated from the runner-up.
- `AMBIGUOUS`: multiple candidates remain materially competitive.
- `UNRESOLVED`: evidence is insufficient.

## Integration contract

`resolve_observation()` accepts an observation plus arrays named `vector`, `graph`, `metadata`, and `provenance`. Each evidence record has `candidateId` and `score`.

The Isaac adapter in `robotics/isaac/semantic/rtdetr_foundationpose_adapter.py` normalizes RT-DETR/FoundationPose output before it enters this cognitive boundary.

## Persistence

`supabase/migrations/20260817190000_artifact_world_memory.sql` adds persistent world entities, observations, and evidence records. RLS is enabled by default; production policies must be added according to the authenticated BFF access model before exposing these tables through the Data API.
