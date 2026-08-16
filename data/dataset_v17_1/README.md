# HoloKai V17.1 Dataset Pack

Generated from the V17.1 normalized, provenance-preserving corpus.

## Files

- `holokai_v17_1_embeddings.jsonl` — RAG/embedding-ready records.
- `holokai_v17_1_pgvector.sql` — PostgreSQL + pgvector schema and inserts. Embedding column is intentionally NULL.
- `holokai_v17_1_neo4j.cypher` — Neo4j nodes, provenance links, plant-part and traditional-use relationships.
- `holokai_v17_1_neo4j_nodes.csv` — Neo4j bulk node export.
- `holokai_v17_1_neo4j_edges.csv` — Neo4j bulk relationship export.

## Important

The dataset preserves V17.0 source claims but does not silently upgrade traditional, cultural, historical, quantitative, or medical claims into verified facts.

Embeddings are not precomputed because the production embedding model/dimension was not specified. The SQL currently uses `VECTOR(1536)` as a common deployment baseline; change it to match the selected model before indexing.
