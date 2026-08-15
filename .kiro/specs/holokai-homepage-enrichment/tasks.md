# HoloKai Homepage Enrichment — Implementation Tasks & Verification

## Overview
Status and tracking for the 13 requirements defined in [requirements.md](./requirements.md). All tasks have been implemented and verified across `@holokai/ui` and `@holokai/shell`.

---

## Tasks & Verification Checklist

### Requirement 1: Hero Section with CivilizationGlobe & Real Mission Statement
- [x] 1.1 Embed `CivilizationGlobe` 3D WebGL background with CSS gradient fallback in `apps/shell/components/homepage/HeroSection.tsx`
- [x] 1.2 Implement headline: "Where Civilizations Remember" with teal-to-moss gradient text
- [x] 1.3 Implement supporting description and "Civilization-Scale Research OS" eyebrow badge
- [x] 1.4 Integrate `DomainSearch` component connecting to `/oracle?q=`
- [x] 1.5 Apply `holokaiVariants.cardEntrance` and `ancientEpistemicTransition` motion profiles

### Requirement 2: AIBuilderSection with Real AI Messaging
- [x] 2.1 Implement `AIBuilderSection` with live terminal typewriter simulation
- [x] 2.2 Add interactive progress bar transitioning from `var(--pui-teal-bright)` to `var(--pui-forest-active)`
- [x] 2.3 Output three reference lines with `ESTABLISHED` (0.92) stance badge
- [x] 2.4 Add "Query the Oracle" CTA linking to `/oracle`

### Requirement 3: Real Product & Service Teasers
- [x] 3.1 Define core products in `packages/ui/src/data/homepageData.ts`: HoloKai Research, HoloKai Voice, HoloKai Vision
- [x] 3.2 Add product descriptions highlighting ElevenLabs voice narration and Gemini vision models
- [x] 3.3 Apply staggered motion delays (0ms, 150ms, 300ms) with interactive hover glow

### Requirement 4: Hosting & Infrastructure Section
- [x] 4.1 Implement `HostingSection` with real-time latency monitors (`<45ms`) and 99.99% uptime SLA
- [x] 4.2 Articulate multi-region deployment and automated failover capabilities

### Requirement 5: Security & Epistemic Rigor Section
- [x] 5.1 Implement `SecuritySection` showcasing 6-Tier Epistemic Rigor classification
- [x] 5.2 Add SHA-256 cryptographic proofs, SOC 2 Type II, and GDPR compliance certifications

### Requirement 6: Launchpad Section
- [x] 6.1 Implement `LaunchpadSection` linking to Oracle Engine, 16-Vol Archive, Vanguard Units, 3D Orbital Lab, and System Telemetry

### Requirement 7: Comprehensive FAQ Section
- [x] 7.1 Implement `FAQSection` with 6 detailed questions sourced from `packages/ui/src/data/homepageData.ts`
- [x] 7.2 Accordion expansion with smooth Framer Motion height transitions

### Requirement 8: Testimonials & Case Studies Section
- [x] 8.1 Implement `TestimonialsSection` with peer endorsements from IFAN/UCAD Dakar, African Epigraphy Project Ghana, and Nairobi Heritage Trust

### Requirement 9: Motion Choreography & Staggered Reveals
- [x] 9.1 Wire `FullPageScrollWrapper` in `apps/shell/app/page.tsx` for section snapping and scroll orchestration
- [x] 9.2 Implement `ScrollReveal` and `ScrollRevealStagger` across all content cards

### Requirement 10: KnowledgeParticleField & Spatial Canvas
- [x] 10.1 Position `KnowledgeParticleField` in `packages/ui/src/oracle/KnowledgeParticleField.tsx`
- [x] 10.2 Graceful fallback when `prefers-reduced-motion` or low-power mode is detected

### Requirement 11: Semantic Color Token Consistency
- [x] 11.1 Purge all legacy hardcoded amber/gold hex values from active homepage components
- [x] 11.2 Enforce CSS custom properties (`var(--color-brand)`, `var(--color-surface)`, `var(--pui-teal-bright)`)

### Requirement 12: Responsive & Accessible Layout
- [x] 12.1 Responsive clamp typography for mobile (<=640px), tablet (641-1024px), and desktop (1440px max-width)
- [x] 12.2 Support `prefers-reduced-motion` reduction rules in global styles

### Requirement 13: Content Management & Data Layer Integration
- [x] 13.1 Build structured mock data module `packages/ui/src/data/homepageData.ts`
- [x] 13.2 Export models and mock JSON from `@holokai/ui` root barrel file
