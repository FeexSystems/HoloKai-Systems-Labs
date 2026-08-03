---
name: holokai-visual-upgrade
description: Guide the visual redesign of HoloKai Oracle Portal following the Antigravity IDE handoff. Use when making design-system, layout, or component visual changes to any HoloKai page or component.
---

# HoloKai Visual Upgrade

## Overview

This skill governs the visual redesign of the HoloKai Oracle Portal. It ensures all UI changes follow the established design direction (sophisticated, classy, modern, minimalistic) and preserve existing functionality.

## Design Direction

The visual target is:
**Classical intelligence + African heritage + advanced spatial computing + luxury editorial design.**

NOT a generic SaaS dashboard. NOT a cyberpunk HUD.

## Workflow

### 1. Inspect Before Changing
- Read the existing component/page source in `holo-kai/src/pages` or `holo-kai/src/components`.
- Identify what the component currently does, what state it manages, and what routes it serves.

### 2. Map to Design System
Reference `docs/UI_ARCHITECTURE.md` to identify which design-system layer the component belongs to:
- Foundation, Navigation, Oracle, Civilization, Guardians, Research, Spatial, or System.

### 3. Design Tokens First
Before modifying any component visually:
- Check if the required tokens exist in the centralized token system.
- If not, add them to the token file before proceeding.
- Token categories: background, surface, elevated surface, text, muted text, Oracle accent, heritage accent, system/status, spacing, radius, elevation, blur, motion.

### 4. Build Reusable Primitives
- Extract shared patterns into reusable components in `holo-kai/src/components/ui/` or `holo-kai/src/components/common/`.
- Avoid inline one-off styles for patterns that appear more than once.

### 5. Preserve Functionality
- All existing routes must continue to work.
- All existing state management must be preserved.
- All existing data flows must remain intact.
- If replacing a component, verify the same props/behavior contract is honored.

### 6. Verify Responsive Behavior
Check all changes at:
- Desktop (1280px+)
- Tablet (768px–1279px)
- Mobile (< 768px)

### 7. Accessibility
- Ensure accessible contrast ratios.
- Verify focus states and keyboard navigation.
- Provide `prefers-reduced-motion` alternatives for animations.
- Maintain adequate touch targets on mobile.

## Priority Reference

| Priority | Area | Key Components |
|----------|------|----------------|
| P0 | Design Foundation | Token system, typography, spacing |
| P0 | CivilizationCore | Master shell, navigation grouping |
| P0 | Oracle | Search, response, evidence, provenance |
| P1 | Spatial | Orbital Lab, 3D Orbital, artifact viewer |
| P1 | Research | Portfolio, journal, citations, knowledge graph |
| P1 | Guardians | Card, profile, voice state, selectors |
| P2 | Responsive/A11y | All breakpoints, reduced motion, contrast |

## Placeholder Pages — Do Not Over-Design

These pages exist as minimal stubs. Do not fabricate full implementations:
- Dashboard
- CommunityGallery
- ContributionPortal
- GlobalInsights
- HelpCenter
- Notifications
- Settings
- SystemStatus

## Golden-Path UX

Landing → Orbital Lab → Select Guardian → Civilization Core → Oracle → Ask Question → Oracle Response → Evidence → Source → Manuscript/Artifact → Research

## References

- [ANTIGRAVITY_HANDOFF.md](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/docs/ANTIGRAVITY_HANDOFF.md)
- [UI_ARCHITECTURE.md](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/docs/UI_ARCHITECTURE.md)
- [PROJECT_MANIFEST.json](file:///c:/Users/ENGR%20BILLI/Downloads/holokai-oracle-portal%20(1)/docs/PROJECT_MANIFEST.json)
