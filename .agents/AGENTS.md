# HoloKai Oracle Portal — Workspace Rules

## Project structure
- `holo-kai/` — React frontend (Base44 app, Vite, Tailwind)
- `docs/` — Design handoff, architecture, and knowledge base
- `.agents/skills/` — Agent skills for this project

## Source of truth
- `holo-kai/src/pages` and `holo-kai/src/components` are the implementation source of truth.
- `docs/ANTIGRAVITY_HANDOFF.md` is the design/task source of truth.
- `docs/UI_ARCHITECTURE.md` defines the design-system taxonomy.

## Before making changes
1. Read the relevant handoff and architecture docs.
2. Inspect the existing source before modifying.
3. Preserve existing functionality and routes.
4. Follow the `holokai-visual-upgrade` skill workflow.

## Placeholder pages
Do not fabricate implementations for: Dashboard, CommunityGallery, ContributionPortal, GlobalInsights, HelpCenter, Notifications, Settings, SystemStatus.
