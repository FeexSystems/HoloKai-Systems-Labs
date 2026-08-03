# HoloKai Oracle Portal — Antigravity IDE Handoff

## Objective

Continue the HoloKai Oracle Portal redesign from the existing React implementation and the completed code-to-Figma review.

The requested visual target is a premium civilization-memory/research interface:
**classical intelligence + African heritage + advanced spatial computing + luxury editorial design**.

The redesign must improve hierarchy and usability without replacing the product concept.

## Existing source

Project root:
`holo-kai/`

Primary implementation source:
- `holo-kai/src/pages`
- `holo-kai/src/components`

Important implementation areas identified during review:
- `CivilizationCore`
- `OraclePortal`
- `OracleCorePanel`
- `OracleDataPanel`
- `OracleKnowledgeGraph`
- `OracleSearchBar`
- `OracleSidebar`
- `OracleTimelineScrubber`
- `OrbitalLab`
- `OrbitalScene`
- `SplineOrbitalStage`
- `CivilizationMemory3DOrbital`
- `GuardianProfiles`
- `GuardianArchive`
- `ResearchPortfolio`
- `ResearchJournal`
- `CivilizationArchive`
- `CivilizationMap`
- `Artifact3DGallery`
- `ManuscriptViewer`
- `KnowledgeGraph`
- `TimelineExplorer`
- `SourceDrawer`
- `ClaimCitations`
- `CompareCivilizations`
- `HoloKaiVoiceOracle`
- `VoiceVisualizer`
- `TriangulationReasoningPanel`
- `VanguardPanel`
- `DockedGuardian`

## Priority

### P0 — Design foundation
Create a coherent token system for:
- background
- surface
- elevated surface
- text
- muted text
- Oracle accent
- heritage accent
- system/status colors
- spacing
- radius
- elevation
- blur
- motion

### P0 — CivilizationCore
Treat `CivilizationCore` as the master application shell.

Improve navigation by grouping existing functionality into:
- Explore
- Research
- Guardians
- Create

Do not remove existing capabilities.

### P0 — Oracle
Make Oracle the flagship research interaction:
- search
- Oracle core
- response
- evidence
- source
- provenance
- confidence
- citations
- timeline/context
- voice/reasoning states
- computational verification (Wolfram layer)

### P0 — Computational Knowledge Layer (Wolfram)
Wolfram is HoloKai's quantitative verification engine — not its historical knowledge base.

Full specification: `docs/WOLFRAM_COMPUTATIONAL_LAYER.md`

Key subsystems:
- Civilization & historical entity engine (HistoricalCountry, HistoricalPeriod)
- Chronology engine (overlap, precedence, contemporaneity)
- Geographic civilization engine (distance, area, territory polygons)
- Astronomy & ancient sky engine (visibility, eclipses, precession)
- Mathematics & engineering verification
- Population & genetics (with strict epistemic separation)
- Economics & civilization scale (no fabricated ancient GDP)
- Linguistic computation
- Epistemology layer (ESTABLISHED → SCHOLARLY_DEBATE → TRADITION → ESOTERIC → SPECULATIVE → FICTIONAL)
- Evidence matrix with confidence heuristic
- Computational query router

UX flow: Oracle → Evidence → Computation → Visualization

### P1 — Spatial experience
Refine:
- Orbital Lab
- Civilization Memory 3D
- artifact visualization
- Guardian presentation

Use 3D selectively and provide graceful fallbacks.

### P1 — Research
Refine:
- research portfolio
- research journal
- evidence
- citations
- source drawer
- manuscripts
- comparison
- knowledge graph

### P1 — Guardians
Create reusable Guardian components with states:
- default
- hover
- selected
- speaking
- offline
- loading
- expanded
- mobile

### P2 — Responsive/accessibility
Verify:
- desktop
- tablet
- mobile
- reduced motion
- keyboard/focus
- contrast
- touch targets
- readable research layouts

### P2 — Handoff
Prepare:
- component-to-code mapping
- design-token mapping
- implementation notes
- eventual Figma Code Connect mapping

## Golden-path prototype

Use this as the principal end-to-end UX:

Landing
→ Orbital Lab
→ Select Guardian
→ Civilization Core
→ Oracle
→ Ask Question
→ Oracle Response
→ Evidence + Computational Verification (Wolfram)
→ Source
→ Manuscript / Artifact
→ Research

## Important constraint

Do not fabricate detailed implementations for placeholder routes such as Dashboard, Community Gallery, Contribution Portal, Global Insights, or Help Center when the existing source does not establish their requirements. Treat them as future-experience specifications until their product requirements exist.

## Definition of done

A major redesign task is complete only when:
- existing relevant functionality remains intact
- the new UI follows the HoloKai design system
- components are reusable
- responsive behavior is verified
- accessibility states are covered
- 3D/motion is tasteful and performant
- evidence/provenance remains clear
- computational claims are routed through verification where applicable
- epistemic classifications are respected (established vs. tradition vs. speculative)
- the changed area is documented
