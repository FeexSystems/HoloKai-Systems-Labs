# HoloKai Backend Architecture

## Pipeline

React Oracle UI
→ FastAPI
→ Query Planner
→ Dense Retrieval + BM25/FTS + Graph Traversal + Metadata Filters
→ Reciprocal Rank Fusion
→ Reranker
→ Evidence Pack
→ Wolfram computation when required
→ LLM synthesis
→ Claim extraction
→ Claim/evidence verification
→ Citation + provenance response
→ Research memory

## Core principle

Semantic similarity is not proof. Every factual answer should retain source, evidence-span, retrieval method, provenance, confidence and verification status. If evidence is insufficient, abstain.

## Retrieval modes

- Fact lookup: lexical + dense
- Entity lookup: entity resolution + graph
- Timeline: event graph + deterministic date computation
- Geography: place graph + coordinates + computation
- Multi-hop: graph expansion + hybrid retrieval
- Comparison: normalized evidence + deterministic calculations
- Cosmology: separate cultural/historical claims from modern astronomical calculations
- Oral tradition: preserve speaker/community/language/transcription/rights metadata

## Knowledge graph entities

Person, Place, Polity, Civilization, Dynasty, Institution, University, Artifact, Manuscript, Text, Language, EthnolinguisticGroup, Practice, Technology, AgriculturalProduct, LegalConcept, Ruler, Queen, Event, Battle, TradeRoute, Migration, Diaspora, AstronomicalObject, CosmologicalConcept, Claim, Source, Document, EvidenceSpan, ResearchSession.

## Typed relationships

lived_in, ruled, founded, influenced, traded_with, migrated_to, located_in, authored, translated_from, cites, contradicts, supports, derived_from, contemporaneous_with, preceded, followed, practiced, transmitted_by, observed, calculated_from.

## 16 corpus domains

1. Classical Empires & States
2. Science, Scholarship & Universities
3. Queens, Matriarchy & Political Institutions
4. Cosmology, Astronomy & Indigenous Sciences
5. Architecture, Engineering & Urbanism
6. Oral Libraries & Memory Systems
7. Languages, Scripts & Linguistics
8. Agriculture, Ecology & Food Systems
9. Art, Music, Material Culture & Aesthetics
10. Legal Systems, Governance & Ethics
11. Diaspora, Migration & Transnational Networks
12. Archaeology & Material Evidence
13. Trade, Economics & Maritime Networks
14. Religion, Philosophy & Intellectual Traditions
15. Medicine, Healing & Public Health Traditions
16. Colonial/Postcolonial Archives & Historiography

## Memory

Working memory = current request and evidence.
Session memory = goals, entities, findings, citations and open questions.
Durable memory = explicitly saved research artifacts, versioned and auditable.

## Evaluation

Track Recall@k, Precision@k, MRR, nDCG, context precision/recall, faithfulness, citation precision/completeness, claim support, abstention quality, graph-hop usefulness, latency and cost.
