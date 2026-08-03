# HoloKai Component-to-Figma Mapping

This document maps HoloKai React components to their corresponding Figma design handoff sections defined in `AGENTS.md` and `docs/ANTIGRAVITY_HANDOFF.md`.

## Figma Structure & Component Registry

| Figma Section | Section Name | React Component(s) | Source File | Status |
|---------------|--------------|-------------------|-------------|--------|
| **00** | Vision | `LandingPage` | `src/pages/LandingPage.jsx` | Implemented |
| **01** | Foundations | CSS Design Tokens & `tokens.js` | `src/index.css`, `src/lib/tokens.js` | Implemented |
| **02** | Variables | Tailwind Theme Tokens | `tailwind.config.js` | Implemented |
| **03** | Iconography | Lucide React + Custom Icons | `src/components/ui/GoogleIcon.jsx` | Implemented |
| **04** | Navigation | `Sidebar`, `ShellHeader`, `ShellQuickNav`, `FloatingDock` | `src/components/core/*`, `src/components/ui/FloatingDock.jsx` | Refactored |
| **05** | Oracle | `OracleCorePanel`, `HoloKaiVoiceOracle`, `OracleDataPanel` | `src/components/core/OracleCorePanel.jsx`, `src/components/oracle/*` | Flagship Refactored |
| **06** | Civilization | `CivilizationArchive`, `CivilizationMap`, `InteractiveMap` | `src/components/core/CivilizationArchive.jsx`, `src/components/core/InteractiveMap.jsx` | Implemented |
| **07** | Guardians | `GuardianCard`, `GuardianSelector`, `GuardianProfiles`, `VanguardPanel` | `src/components/guardians/*`, `src/pages/GuardianProfiles.jsx` | Modularized |
| **08** | Research | `ResearchPortfolio`, `ResearchJournal`, `ResearchChat`, `Library` | `src/pages/Research*.jsx`, `src/components/core/*` | Implemented |
| **09** | 3D / Spatial | `OrbitalLab`, `CivilizationMemory3DOrbital`, `Artifact3DGallery`, `SplineOrbitalStage` | `src/pages/OrbitalLab.jsx`, `src/components/orbital-lab/*` | Refined |
| **10** | Landing | `LandingIndex` | `src/landing/pages/Index.jsx` | Implemented |
| **11** | Orbital Lab | `OrbitalLab`, `OrbitalScene` | `src/pages/OrbitalLab.jsx`, `src/components/orbital-lab/OrbitalScene.jsx` | Implemented |
| **12** | Oracle Portal | `OraclePortal` | `src/pages/OraclePortal.jsx` | Implemented |
| **13** | Civilization Core | `CivilizationCore` (Master Shell) | `src/pages/CivilizationCore.jsx` | Shell Refactored |
| **14** | Research Portfolio | `ResearchPortfolio` | `src/pages/ResearchPortfolio.jsx` | Implemented |
| **15** | Guardian Profiles | `GuardianProfiles` | `src/pages/GuardianProfiles.jsx` | Implemented |
| **16** | Archive | `GuardianArchive`, `CivilizationArchive` | `src/pages/GuardianArchive.jsx`, `src/components/core/CivilizationArchive.jsx` | Implemented |
| **17** | Auth | `Login`, `Register`, `ForgotPassword`, `ResetPassword` | `src/pages/Login.jsx`, `src/pages/Register.jsx` | Implemented |
| **18** | Future Experiences | Placeholder stubs (Dashboard, HelpCenter, etc.) | `src/pages/Dashboard.jsx`, etc. | Specification Stubs |
| **19** | Responsive | `@media (pointer: coarse)`, `Sheet` Mobile Drawers | `src/index.css`, `src/hooks/use-mobile.jsx` | Verified |
| **20** | Motion / Prototype | `prefers-reduced-motion` Overrides & Framer Motion | `src/index.css`, `src/lib/tokens.js` | Reduced Motion Compliant |
| **21** | Developer Handoff | Component & Token Mapping Docs | `docs/COMPONENT_MAP.md`, `docs/TOKEN_MAP.md` | Complete |
