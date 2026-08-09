# PLANETARY UI PLATFORM — ARCHITECTURE DOCUMENTATION

## System Overview

The **Planetary UI Platform** is a planetary-scale, edge-native, AI-augmented frontend architecture built on Next.js 15 App Router, Turborepo, Module Federation v2, Cloudflare Workers, and a unified design system.

---

## 1. System Topology & Layers

```mermaid
flowchart TB
  user[End User Browser]

  subgraph Edge[Edge Intelligence Layer - Cloudflare Workers]
    geo[Geo Router Worker]
    aiEdge[AI Route Predictor]
    mfeResolver[MFE Manifest Resolver]
  end

  subgraph Runtime[Frontend Runtime & Monorepo Apps]
    shell[Shell Host App - :3000]
    oracle[Web Oracle MFE - :3001]
    archive[Web Archive MFE - :3002]
  end

  subgraph DesignLayer[Planetary UI CSS Foundation]
    tokens[@holokai/design-tokens]
    preset[Tailwind Semantic Preset]
    primitives[@holokai/ui]
  end

  subgraph Origin[Backend & Infrastructure]
    bff[TypeScript BFF API Gateway - :8000]
    db[(PostgreSQL / Firebase / Drizzle)]
  end

  user --> Edge
  Edge --> Runtime
  Runtime --> DesignLayer
  Runtime --> Origin
```

---

## 2. CSS & Design System Architecture

```text
@layer reset, tokens, base, components, utilities, overrides;

DESIGN TOKENS (@holokai/design-tokens)
      ↓
CSS CUSTOM PROPERTIES (--pui-* primitives, --color-* semantic)
      ↓
TAILWIND PRESET (packages/design-tokens/tailwind.preset.ts)
      ↓
DESIGN PRIMITIVES (@holokai/ui)
      ↓
APPLICATION SURFACES (apps/shell, apps/web-oracle, apps/web-archive)
```

### Key Technical Pillars

1. **CSS Cascade Layers**: `@layer reset, tokens, base, components, utilities, overrides;` defined in [packages/design-tokens/src/index.css](file:///c:/Users/ENGR BILLI/HoloKai-Systems-Labs/packages/design-tokens/src/index.css).
2. **Two-Level Token Architecture**:
   - Primitive `--pui-*` raw values
   - Contextual `--color-*` semantic mappings
   - Theme switching via `[data-theme="dark"]`, `:root` (light), and system mode
   - White-label brand overrides via `[data-brand="planetary"]` and `[data-brand="enterprise"]`
3. **Token Scales**:
   - **Typography**: 13-step `--text-xs` to `--text-9xl`, Inter + JetBrains Mono stacks, display hero classes
   - **Spacing**: 4px base grid, `--space-0` to `--space-48`, responsive `.pui-section`
   - **Radius**: 8-step `--radius-xs` to `--radius-full`
   - **Shadows**: `--shadow-sm` to `--shadow-xl` with dark mode depth scaling
   - **Motion**: `--duration-instant` to `--duration-cinematic`, `--ease-planetary`, entrance keyframes, stagger index `[data-motion-item]`
4. **Accessibility**: `prefers-reduced-motion` global reduction and `.sr-only` class.
5. **Shared Tailwind Preset**: [packages/design-tokens/tailwind.preset.ts](file:///c:/Users/ENGR BILLI/HoloKai-Systems-Labs/packages/design-tokens/tailwind.preset.ts) mapping Tailwind utilities directly to CSS tokens.

---

## 3. Package Structure

```text
/
├── apps/
│   ├── shell/           Next.js 15 Host Shell & Spatial Lab (:3000)
│   ├── web-oracle/      Oracle AI Research MFE Remote (:3001)
│   ├── web-archive/     Civilization Archive MFE Remote (:3002)
│   └── bff/             TypeScript API Gateway (:8000)
│
├── packages/
│   ├── design-tokens/   Planetary UI CSS Design Tokens & Cascade Layers
│   ├── ui/              Shared React 19 UI Primitives
│   ├── design-system/   TypeScript Tokens & Epistemic Definitions
│   ├── contracts/       Typed API & Event Schemas
│   ├── event-bus/       Cross-MFE State Sync Event Bus
│   ├── runtime/         Shared Frontend Runtime Utilities
│   └── mfe-orchestrator/ Module Federation Resolution Engine
│
└── edge/
    ├── ai-router-worker/      Cloudflare Edge AI Router
    ├── geo-router-worker/     Cloudflare Geo Router
    └── mfe-manifest-worker/   MFE Manifest Resolver Worker
```
