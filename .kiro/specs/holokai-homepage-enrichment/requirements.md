# Requirements Document: HoloKai Homepage Enrichment

## Introduction

This document defines the requirements for transforming the HoloKai homepage from a prototype with generic placeholder content into a sophisticated, branded experience that authentically showcases HoloKai's core mission, product offerings, and technical capabilities. The enrichment integrates the CivilizationGlobe 3D component (built in the cinematic-upgrade spec), staggered motion choreography, and real HoloKai value propositions across all major sections.

The enriched homepage will serve as the primary entry point for users and communicate the platform's differentiation: making ancient knowledge, historical research, and civilizational data interactive through AI-powered synthesis, real-time voice narration, and 3D visualization.

## Glossary

- **HoloKai**: Pan-African civilization research platform powered by AI synthesis engines
- **CivilizationGlobe**: WebGL 3D component rendering an animated wireframe globe with particle effects as a hero background
- **HoloKai Research**: Product tier for ancient text analysis, artifact generation, and historical research
- **HoloKai Voice**: Product tier for ElevenLabs-powered ancient language narration and voice synthesis
- **HoloKai Vision**: Product tier for Gemini-powered manuscript/artifact generation and analysis
- **Oracle Research Engine**: Core AI capability for multi-agent synthesis across civilizational archives
- **Motion Choreography**: Coordinated, time-staggered animations (Framer Motion) across text reveals and section entrances
- **Staggered Text Reveal**: Paragraph-by-paragraph fade-in animation with sequential delays (typically 150–300ms per paragraph)
- **Epistemic Confidence**: AI classification of historical claims with verifiable confidence scores
- **KnowledgeParticleField**: Canvas-based particle system rendering drifting, fading particles in brand colors
- **Design Palette**: Obsidian (#050806), Forest (#163A31), Teal (#39826F), Moss-Bright (#A9D5B0)

## Requirements

### Requirement 1: Hero Section with CivilizationGlobe and Real Mission Statement

**User Story:** As a visitor, I want to immediately understand HoloKai's core mission and see an impressive 3D visualization, so that I am engaged and convinced of the platform's sophistication.

#### Acceptance Criteria

1. WHEN the homepage loads THEN the HeroSection SHALL display the CivilizationGlobe 3D component as a full-bleed background with `pointer-events-none` and no user interaction required

2. WHEN the hero renders THEN the main heading SHALL read "Where Civilizations Remember" with the word "Civilizations" styled in a teal-to-moss gradient (from-[#79B59F] via-[#A9D5B0] to-[#39826F])

3. WHEN the hero renders THEN the supporting description SHALL state "Pan-African epigraphy, astronomy & AI synthesis engine. Query 5,000 years of civilizational knowledge through the Oracle Research Engine."

4. WHEN the hero is visible THEN the eyebrow badge SHALL read "Civilization-Scale Research OS" and use semantic color tokens (border-[var(--color-border)], bg-[var(--color-surface-hover)], text-[var(--color-brand)])

5. WHEN the hero section enters the viewport THEN all heading, description, and supporting badges SHALL animate in using `holokaiVariants.cardEntrance` with `ancientEpistemicTransition` easing

6. WHEN the supporting badges render THEN they SHALL include exactly these labels: "5,000+ Years of Data", "16-Volume Archive", "AI Synthesis Engine", "Epistemic Classification"

7. WHEN the DomainSearch input is engaged THEN clicking search or pressing Enter SHALL navigate to `/oracle?q=<encoded_query>` with the user's query string URL-encoded

---

### Requirement 2: AIBuilderSection with Real AI Capability Messaging

**User Story:** As a researcher, I want to see concrete examples of what the AI engine can do across ancient civilizations, so that I understand the depth of the system's analysis capabilities.

#### Acceptance Criteria

1. WHEN the AIBuilderSection renders THEN the eyebrow label SHALL read "AI Research Engine"

2. WHEN the AIBuilderSection renders THEN the main heading SHALL state "Multi-agent synthesis across 5,000 years"

3. WHEN the AIBuilderSection renders THEN the description SHALL read exactly "The Oracle Research Engine cross-references hieroglyphic records, astronomical data, and epigraphic archives — classifying every claim with epistemic confidence scores."

4. WHEN the terminal animation completes (after the typed query finishes) THEN the output SHALL display exactly three reference lines: "Cross-referencing 847 epigraphic sources across Nubia...", "Synthesizing chronological linguistic drift matrices...", and a final "Epistemic stance: ESTABLISHED" with a confidence score of 0.92

5. WHEN the terminal progress bar animates THEN the gradient bar SHALL transition from teal-bright to forest-active colors using `from-[var(--pui-teal-bright)] to-[var(--pui-forest-active)]`

6. WHEN the AIBuilderSection enters the viewport THEN the entire terminal visual SHALL animate in with `initial={{ opacity: 0, scale: 0.95 }}` and `whileInView={{ opacity: 1, scale: 1 }}`

7. WHEN the AIBuilderSection renders THEN the CTA button SHALL link to `/oracle` with label "Query the Oracle"

---

### Requirement 3: Real Product and Service Teasers

**User Story:** As a prospective customer, I want to see the specific products HoloKai offers with clear value propositions, so that I can understand which offering best suits my needs.

#### Acceptance Criteria

1. WHEN a ProductTicker or ProductShowcase section renders THEN it SHALL display three distinct product cards for "HoloKai Research", "HoloKai Voice", and "HoloKai Vision"

2. WHEN the HoloKai Research card renders THEN it SHALL state "Ancient text analysis, artifact generation, and historical research at scale" as the description

3. WHEN the HoloKai Voice card renders THEN it SHALL state "ElevenLabs-powered narration in ancient languages with voice cloning and synthesis" as the description

4. WHEN the HoloKai Vision card renders THEN it SHALL state "Gemini-powered manuscript and artifact generation with intelligent analysis" as the description

5. WHEN product cards enter the viewport THEN each card SHALL animate in sequentially with staggered entrance delays (0ms, 150ms, 300ms) using `motion.div` and `ancientEpistemicTransition`

6. WHEN a product card is hovered THEN it SHALL display an interactive effect (scale, glow, or border highlight) using hover state classes tied to semantic color tokens

7. WHEN a product card is clicked or a CTA is engaged THEN it SHALL navigate to a relevant product page or feature page (`/research`, `/voice`, `/vision`) with the product context preserved

---

### Requirement 4: Hosting and Infrastructure Section with Real Technical Details

**User Story:** As a technical stakeholder, I want to see HoloKai's infrastructure capabilities clearly articulated, so that I trust the platform's reliability and scalability.

#### Acceptance Criteria

1. WHEN the HostingSection renders THEN it SHALL display an eyebrow label reading "Infrastructure & Reliability"

2. WHEN the HostingSection renders THEN the heading SHALL state "Production-grade cloud infrastructure" or equivalent messaging

3. WHEN the HostingSection renders THEN it SHALL explicitly mention at least three infrastructure details: multi-region deployment, real-time API uptime monitoring, and automated failover

4. WHEN the HostingSection renders THEN it SHALL include real SLA or uptime guarantees (e.g., "99.9% uptime SLA", "Sub-100ms latency across regions")

5. WHEN the HostingSection enters the viewport THEN all text and visual elements SHALL animate in using staggered reveals with `ancientEpistemicTransition`

---

### Requirement 5: Security and Data Privacy Section

**User Story:** As a privacy-conscious user, I want to see HoloKai's security and data handling practices clearly documented, so that I can trust my research data is protected.

#### Acceptance Criteria

1. WHEN the SecuritySection renders THEN the eyebrow label SHALL read "Security & Privacy"

2. WHEN the SecuritySection renders THEN the heading SHALL state "Enterprise-grade security" or similar

3. WHEN the SecuritySection renders THEN it SHALL explicitly mention end-to-end encryption, GDPR compliance, and audit logging

4. WHEN the SecuritySection renders THEN it SHALL include at least two security certifications or compliance badges (e.g., ISO 27001, SOC 2 Type II)

5. WHEN the SecuritySection enters the viewport THEN all content elements SHALL animate in using `holokaiVariants.cardEntrance` with staggered timing

---

### Requirement 6: Launchpad Section with Real Product Pipeline

**User Story:** As an early adopter, I want to see what new capabilities are coming to HoloKai, so that I understand the product roadmap and future value.

#### Acceptance Criteria

1. WHEN the LaunchpadSection renders THEN the eyebrow label SHALL read "Coming Soon" or "Roadmap"

2. WHEN the LaunchpadSection renders THEN it SHALL display at least three upcoming features or product enhancements with brief descriptions

3. WHEN the LaunchpadSection renders THEN upcoming items SHALL include: "Ancient Language Speech Recognition", "Real-time Collaborative Research", and "Artifact 3D Reconstruction"

4. WHEN LaunchpadSection items enter the viewport THEN each SHALL animate in with a subtle entrance animation (scale, fade, or slide)

5. WHEN a LaunchpadSection item is interacted with THEN hovering SHALL reveal more details or trigger a tooltip with additional context

---

### Requirement 7: FAQ Section with Real HoloKai Questions

**User Story:** As a prospective user, I want to find answers to common questions about HoloKai's capabilities and pricing, so that I can make an informed decision.

#### Acceptance Criteria

1. WHEN the FAQSection renders THEN the eyebrow label SHALL read "Frequently Asked Questions"

2. WHEN the FAQSection renders THEN it SHALL display at least six frequently asked questions directly relevant to HoloKai's capabilities, pricing, and usage

3. WHEN the FAQSection renders THEN questions SHALL cover topics such as: data sourcing, AI model accuracy, usage limits, subscription tiers, ancient language support, and research export formats

4. WHEN a FAQ accordion item is clicked THEN it SHALL expand to reveal the full answer with smooth animation

5. WHEN a FAQ item expands THEN the answer text SHALL animate in using `motion.div` with fade and slide-down effects

---

### Requirement 8: Testimonials or Case Studies Section

**User Story:** As an evaluator, I want to see real use cases and success stories from HoloKai users, so that I understand the platform's practical value.

#### Acceptance Criteria

1. WHEN the TestimonialsSection renders THEN the eyebrow label SHALL read "Use Cases" or "Success Stories"

2. WHEN the TestimonialsSection renders THEN it SHALL display at least three case studies or testimonials covering distinct use cases: Academia, Museums, Entertainment, or Publishing

3. WHEN a use case card renders THEN it SHALL include: organization/user name, industry/context, challenge, HoloKai solution, and measurable result or outcome

4. WHEN use case cards enter the viewport THEN they SHALL animate in sequentially with staggered entrance delays using `ancientEpistemicTransition`

5. WHEN a use case card is hovered THEN it SHALL display an interactive effect (scale, glow, or border highlight)

---

### Requirement 9: Motion Choreography and Staggered Text Reveals

**User Story:** As a user, I want smooth, choreographed animations throughout the homepage that guide my attention and create a professional, immersive experience.

#### Acceptance Criteria

1. WHEN any major section enters the viewport THEN all textual paragraphs SHALL animate in sequentially with a delay of 150–200ms between each paragraph using `motion.div` with `initial={{ opacity: 0, y: 8 }}` and `animate={{ opacity: 1, y: 0 }}`

2. WHEN card-based elements (product cards, testimonials, etc.) render THEN they SHALL use `holokaiVariants.cardEntrance` as the motion variant

3. WHEN text reveal animations occur THEN the easing function SHALL use `ancientEpistemicTransition` for consistency across the entire page

4. WHEN the page scrolls THEN animations SHALL be triggered via `whileInView={{ ... }}` with `viewport={{ once: true, amount: 0.3 }}`

5. WHEN a section entrance animation plays THEN hover states on child elements (buttons, links, cards) SHALL remain responsive and not be blocked by animation states

6. IF an animation is interrupted or the user skips to a section via anchor link THEN all animations in that section SHALL play on first viewport visibility without requiring a page reload

---

### Requirement 10: KnowledgeParticleField Integration

**User Story:** As a user, I want to see subtle visual effects that reinforce HoloKai's themes of knowledge and history, so that the page feels cohesive and branded.

#### Acceptance Criteria

1. WHEN the OracleChamber or key sections render THEN a KnowledgeParticleField component SHALL be positioned absolutely behind all content

2. WHEN the KnowledgeParticleField animates THEN particles SHALL drift slowly and fade in and out using colors from the brand palette (#163A31, #39826F, #79B59F)

3. WHEN particles animate THEN they SHALL NOT interfere with user interactions (pointer-events-none)

4. WHEN the page renders on low-end devices THEN the particle system SHALL gracefully degrade or disable without breaking layout or functionality

---

### Requirement 11: Semantic Color Token Consistency

**User Story:** As a developer and brand steward, I want all color references on the homepage to use semantic design tokens, so that future theme changes propagate automatically.

#### Acceptance Criteria

1. WHEN any homepage section renders THEN all color references SHALL use CSS variables (var(--color-brand), var(--color-surface), var(--color-border), var(--pui-teal-bright), var(--pui-forest-active), etc.) instead of hardcoded hex values

2. WHEN a component is styled THEN brand accent colors SHALL use `var(--color-brand)` or `var(--pui-teal-bright)` instead of amber, gold, or other legacy colors

3. WHEN borders are rendered THEN they SHALL use `var(--color-border)` or `var(--color-border-strong)` instead of hardcoded values

4. WHEN hover or active states are applied THEN they SHALL use `var(--color-surface-hover)` or `var(--pui-forest-active)` instead of hardcoded opacity or color values

5. WHEN the page is built or type-checked THEN no amber-*, gold-*, or legacy color utilities SHALL appear in the CSS output for homepage components

---

### Requirement 12: Responsive and Accessible Layout

**User Story:** As a mobile user and accessibility advocate, I want the enriched homepage to display beautifully on all screen sizes and be navigable by assistive technologies.

#### Acceptance Criteria

1. WHEN the homepage renders on mobile (≤640px) THEN all text sizes, spacing, and layout SHALL adapt proportionally without overflow or loss of content

2. WHEN the homepage renders on tablet (641–1024px) THEN heading and font sizes SHALL scale appropriately using `clamp()` or responsive font-size values

3. WHEN the homepage renders on desktop (>1024px) THEN the max-width container SHALL constrain content to 1440px with balanced margins

4. WHEN any animation plays THEN users with `prefers-reduced-motion` media query SHALL see reduced or disabled animations while maintaining readability and functionality

5. WHEN headings are rendered THEN they SHALL use semantic HTML heading tags (h1, h2, h3) with proper hierarchy

6. WHEN links and buttons are interactive THEN they SHALL have visible focus states and adequate color contrast for WCAG AA compliance

---

### Requirement 13: Content Management and Real Data Integration

**User Story:** As a content manager, I want the homepage sections to be populated with real HoloKai product and company data, so that visitors see authentic information.

#### Acceptance Criteria

1. WHEN the ProductTicker renders THEN product names, descriptions, and metadata SHALL be sourced from a real data structure (API, CMS, or constant) rather than hardcoded JSX

2. WHEN the FAQSection renders THEN all Q&A pairs SHALL be sourced from a real data source (API, JSON file, or database) with at least 6 substantive questions

3. WHEN the TestimonialsSection renders THEN case studies or testimonials SHALL reference real or realistic customer scenarios with measurable outcomes

4. WHEN a content update is made to the data source THEN the homepage SHALL reflect the change after a build or without requiring code changes (for API-sourced content)

5. WHEN data is missing or unavailable THEN the section SHALL render gracefully with placeholder content or fallback messaging rather than breaking

