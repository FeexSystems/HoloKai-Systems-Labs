# HoloKai Oracle Portal — Google Antigravity IDE Rules

## Source of truth
Treat the existing HoloKai implementation as the source of truth:
- `holo-kai/src/pages`
- `holo-kai/src/components`

Do not invent unsupported product functionality.

## Base44 context
This is a Base44 app repository. Preserve existing conventions.
- CLI overview: https://docs.base44.com/developers/references/cli/get-started/overview.md
- Use `base44 dev` for local dev with backend; `npm run dev` for frontend-only work.
- SDK client: `src/api/base44Client.js`
- Vite plugin: `vite.config.js`

## Design direction
Build toward the reviewed HoloKai direction:
- sophisticated
- classy
- modern
- minimalistic
- highly user-friendly
- tasteful 3D effects
- restrained motion
- strong visual hierarchy
- research-grade evidence/provenance UX

The goal is not a generic SaaS dashboard or cyberpunk HUD.

## Primary architecture
`CivilizationCore` is the master application shell. Preserve its existing 13-view concept while improving information architecture and visual hierarchy.

Core systems:
- Oracle
- Civilization
- Research
- Guardians
- Spatial / 3D
- Computation (Wolfram)
- Epistemology
- System / Authentication

## Figma handoff
The intended Figma structure is:
00 Vision
01 Foundations
02 Variables
03 Iconography
04 Navigation
05 Oracle
06 Civilization
07 Guardians
08 Research
09 3D / Spatial
10 Landing
11 Orbital Lab
12 Oracle Portal
13 Civilization Core
14 Research Portfolio
15 Guardian Profiles
16 Archive
17 Auth
18 Future Experiences
19 Responsive
20 Motion / Prototype
21 Developer Handoff

## Engineering principles
- Prefer reusable React components.
- Keep design tokens centralized.
- Preserve existing routes and behavior unless explicitly changing them.
- Treat desktop, tablet, and mobile as first-class layouts.
- Provide reduced-motion alternatives.
- Avoid unnecessary perpetual animation, heavy particle fields, and excessive WebGL.
- 3D should be concentrated around meaningful moments of discovery.
- Maintain accessible contrast, focus states, keyboard interaction, and touch targets.
- Keep research evidence, citations, provenance, and confidence visually authoritative and readable.
- Route quantitative claims through the Wolfram computational layer when appropriate.
- Never invent numerical values. Identify reference date, units, assumptions, uncertainty, and provenance.
- Distinguish calculated results from historical interpretation.
- Respect epistemic classifications: ESTABLISHED, SCHOLARLY_DEBATE, TRADITION, ESOTERIC, SPECULATIVE, FICTIONAL.
- When computational results conflict with a user's premise, explain the discrepancy rather than forcing agreement.

## Workflow
Before changing major UI:
1. Inspect the existing component/page.
2. Map it to the design-system section above.
3. Implement reusable primitives first.
4. Verify responsive behavior.
5. Verify existing functionality is preserved.
6. Document material architectural changes.

## Verification
Run the project checks available in package.json before considering a major UI task complete.
