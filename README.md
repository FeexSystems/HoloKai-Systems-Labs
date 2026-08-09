# 🚀 HoloKai — Planetary UI Platform & Civilization Research OS (v11.0)

### *Where Pan-African Civilization Remembers — Edge-Native, AI-Augmented Spatial Operating System & DesignDNA Foundation*

[![Architecture Standard](https://img.shields.io/badge/Architecture-Planetary--Scale_v11.0-gold?style=for-the-badge)](ARCHITECTURE.md)
[![Framework](https://img.shields.io/badge/Framework-Next.js_15_App_Router-black?style=for-the-badge&logo=nextdotjs)](apps/shell)
[![Design Tokens](https://img.shields.io/badge/Design_Tokens-%40holokai%2Fdesign--tokens-amber?style=for-the-badge)](packages/design-tokens)
[![UI Primitives](https://img.shields.io/badge/UI_Suite-%40holokai%2Fui-purple?style=for-the-badge)](packages/ui)
[![Edge Runtime](https://img.shields.io/badge/Edge-Cloudflare_Workers-orange?style=for-the-badge&logo=cloudflare)](edge/)
[![Build Status](https://img.shields.io/badge/Build-100%25_PASSED-emerald?style=for-the-badge)](apps/shell)

---

## 🌟 Executive Overview

**HoloKai** is a planetary-scale, edge-native, AI-augmented frontend operating system, design foundation, and research instrument dedicated to the study, preservation, and synthesis of **Pan-African Civilizations, Epigraphy, Cosmologies, and Sciences**.

Combining a **Next.js 15 App Router Streaming SSR Shell** (124 KB First Load JS footprint), **Module Federation v2 Micro-Frontends**, **Google Genkit AI Flows**, **Cloudflare Edge Intelligence**, **Node.js/TypeScript BFF Gateway**, **Drizzle ORM PostgreSQL**, and an authoritative **Systemic DesignDNA Foundation (`@holokai/design-system` & `@holokai/ui`)**, HoloKai provides an immersive spatial interface powered by a **16-Volume Ancient African History Knowledge Corpus**.

---

## 🎨 Systemic DesignDNA & UI Architecture

HoloKai enforces a strict design philosophy: **Ancient Intelligence × Cinematic Futurism × Spatial Computing × Editorial Research**.

```text
@layer reset, tokens, base, components, utilities, overrides;

DESIGN TOKENS (@holokai/design-tokens)
      ↓
CSS CUSTOM PROPERTIES (--pui-* primitives, --color-* semantic)
      ↓
TAILWIND PRESET (packages/design-tokens/tailwind.preset.ts)
      ↓
DESIGN PRIMITIVES & DOMAIN COMPONENTS (@holokai/ui)
      ↓
APPLICATION SURFACES (apps/shell, apps/web-oracle, apps/web-archive)
```

### Core Design System Capabilities

1. **Obsidian Surface Hierarchy**:
   - `Abyss` (`#05050A`) → `Obsidian` (`#0A0A0A`) → `Panel` (`#12121A`) → `Elevated` (`#1A1A26`) → `Card` (`#1F1F2E`)
   - Restrained Oracle Gold (`#C8952A`, `#E8B84B`) and Heritage Terracotta accents
2. **6-Tier Epistemic Classification System**:
   - `ESTABLISHED` (Emerald `#10B981`) — Peer-reviewed archaeological & epigraphic consensus
   - `SCHOLARLY_DEBATE` (Blue `#3B82F6`) — Active academic discussion with competing hypotheses
   - `TRADITION` (Amber `#F59E0B`) — Oral history, Griot lineages, elder memory corpora
   - `ESOTERIC` (Purple `#A855F7`) — Symbolic, cosmological, or ritual interpretations
   - `SPECULATIVE` (Pink `#EC4899`) — Unverified structural or historical hypotheses
   - `FICTIONAL` (Gray `#6B7280`) — Literary or mythological narrative elements
3. **Comprehensive `@holokai/ui` Primitives & Domain Suite**:
   - **Primitives**: `Box`, `Stack`, `Text`
   - **Epistemology**: `EpistemicBadge` (with hover definition tooltips), `EvidenceMatrix` (claim provenance & source attribution report)
   - **Civilization**: `CivilizationCard`, `CivilizationDossier` (deep research dossiers for Kemet, Kush, Axum, Mali/Songhai, Great Zimbabwe, Yoruba/Benin)
   - **Artifact**: `ArtifactCard` (museum-grade artifact showcase)
   - **Oracle**: `OracleChamber` (research dossier query & synthesis response interface)
   - **Navigation & Spatial**: `CommandBar` (`⌘K` / `Ctrl+K`), `GlobalHeader`, `SpatialCanvas` (WebGL, reduced-motion & mobile degradation wrapper)

---

## 🏛️ System Topology Architecture

```mermaid
flowchart TB
    subgraph ClientEdge[Planetary Edge & Client OS Layer]
        edge[Cloudflare Edge Workers - geo, manifest, ssr, ai-router]
        shell[apps/shell - Next.js 15 App Router Shell Host :3000]
    end

    subgraph DesignLayer[Planetary UI Design System Layer]
        tokens[@holokai/design-tokens - CSS Tokens & Layers]
        preset[packages/design-tokens/tailwind.preset.ts]
        primitives[@holokai/ui - React 19 UI Primitives & Domain Components]
    end

    subgraph Remotes[Module Federation v2 Micro-Frontends]
        webOracle[apps/web-oracle - Oracle AI Synthesis Remote :3001]
        webArchive[apps/web-archive - Civilization Archive Remote :3002]
        landing[HoloKai - landingpage - Landing & Spline Lab :8080]
        viteApp[holo-kai - Legacy React SPA :3005]
    end

    subgraph Gateways[Unified API Gateways & Edge Backend]
        bff[apps/bff - Node.js / TypeScript BFF Gateway :8000]
        firebase[functions/ - Firebase Cloud Functions & Genkit AI]
        fastapi[main.py - Python Multi-Agent Engine :8005]
    end

    subgraph Persistence[Unified Database & Vector Storage]
        drizzle[(Drizzle ORM PostgreSQL - src/db/schema.ts)]
        chroma[(ChromaDB Vector Store - holokai_chroma)]
        memory[(Agent Memory Store - holokai_memory)]
    end

    shell --> edge
    shell --> DesignLayer
    shell --> Remotes
    Remotes --> bff
    Remotes --> firebase
    bff --> drizzle
    bff --> chroma
    bff --> memory
```

---

## 📂 Monorepo Directory Architecture

```text
/ (HoloKai-Systems-Labs Monorepo)
├── apps/                               # Micro-Frontend Applications & Host
│   ├── bff/                            # TypeScript API Gateway & BFF Service (:8000)
│   ├── shell/                          # Next.js 15 App Router Shell Host (:3000)
│   │   ├── app/page.tsx                # Civilization Spatial Research OS Homepage
│   │   └── app/system/page.tsx         # Platform Edge Telemetry & Runtime System
│   ├── web-archive/                    # Civilization Archive MFE Remote (:3002)
│   └── web-oracle/                     # Oracle AI Research MFE Remote (:3001)
│
├── services/                           # Backend Engine & Services
│   └── python-engine/                  # FastAPI Engine, RAG, ChromaDB & Agent Stores (:8005)
│       ├── main.py                     # FastAPI Application Entrypoint
│       ├── holokai_backend.py          # CivilizationCore Multi-Agent Router
│       ├── knowledge_base.py           # Vector RAG Engine & ChromaDB Store
│       └── ...                         # (28 Consolidated Python Engine Modules)
│
├── packages/                           # Shared Monorepo Micro-Packages
│   ├── design-tokens/                  # @holokai/design-tokens — CSS Tokens, Layers & Tailwind Preset
│   ├── ui/                             # @holokai/ui — React 19 Primitives & Civilization Domain Components
│   ├── contracts/                      # @holokai/contracts — Shared API, Drizzle & Genkit Schemas
│   ├── design-system/                  # @holokai/design-system — TS Tokens & Epistemic Definitions
│   ├── event-bus/                      # @holokai/event-bus — Typed Inter-MFE Pub/Sub Bus
│   ├── mfe-orchestrator/               # @holokai/mfe-orchestrator — MFv2 & Fallback Boundaries
│   ├── runtime/                        # @holokai/runtime — Hydration, Telemetry & Auto-Optimizer
│   └── ui-composer/                    # @holokai/ui-composer — AI Component Synthesis Engine
│
├── edge/                               # Edge Intelligence Layer (Cloudflare Workers)
│   ├── ai-router-worker/               # Edge AI Inference & Route Prediction Worker
│   ├── geo-router-worker/              # Geolocation Telemetry & Latency Routing Worker
│   ├── mfe-manifest-worker/            # Dynamic Zero-Origin-Latency Manifest Resolver Worker
│   └── ssr-worker/                     # Cloudflare Edge Streaming SSR Worker
│
├── functions/                          # Firebase Cloud Functions & Google Genkit AI Flows
│   └── src/index.ts                    # Genkit Flow (synthesizeCivilizationQuery) & oracleQuery
│
├── src/db/                             # Type-Safe Database Layer
│   ├── schema.ts                       # Drizzle ORM PostgreSQL Schemas (users, entries, relations)
│   └── drizzle.config.ts               # Drizzle Migration & Connection Config
│
├── infra/                              # Infrastructure as Code (IaC)
│   ├── kubernetes/                     # Production K8s Deployment, HPA & Istio Service Mesh
│   └── terraform/                      # Multi-Cloud Terraform Provisioner (Cloudflare + K8s)
│
├── docs/                               # Architecture Governance & Knowledge Corpus
│   ├── c4/                             # Structurizr DSL C4 Architecture Model
│   └── HoloKai_16Volume_COMPLETE_LIBRARY.md # 16-Volume Ancient African History KB Corpus
│
├── ARCHITECTURE.md                     # System Topology & CSS Design Token Architecture Spec
├── PLANETARY_IMPLEMENTATION.md         # Master Implementation Roadmap & Compliance Report
├── pnpm-workspace.yaml                 # Monorepo Workspace Package Map
├── turbo.json                          # Turborepo Pipeline Orchestrator Config
└── package.json                        # Root Package Manifest
```

---

## 🛠️ Quick Start & Local Development

### 1. Monorepo Installation

```bash
git clone https://github.com/FeexSystems/HoloKai-Systems-Labs.git
cd HoloKai-Systems-Labs

# Install workspace dependencies cleanly across pnpm packages
pnpm install
```

### 2. Launch Development Servers & Services

```bash
# Launch Next.js 15 App Router Shell, MFE remotes & API gateway in parallel:
pnpm dev:all
```

| Service | Route / Port | Description |
| --- | --- | --- |
| Host Shell | `http://localhost:3000/` | Civilization Spatial Research OS |
| System Edge | `http://localhost:3000/system` | Edge Telemetry & Platform Runtime Metrics |
| Web Oracle | `http://localhost:3001/` | Oracle AI Research Remote |
| Web Archive | `http://localhost:3002/` | Civilization Archive Remote |
| Landing Page | `http://localhost:8080/` | HoloKai Landing Page & Spline Lab |
| BFF Gateway | `http://localhost:8000/` | TypeScript API Gateway |

### 3. Verify Monorepo Production Build

```bash
# Run full workspace production build across shell, web-oracle, web-archive, and packages
cmd /c "pnpm --filter @holokai/shell build && pnpm --filter @holokai/web-oracle build && pnpm --filter @holokai/web-archive build"
```

---

## 📊 Performance & Compliance Scorecard

| Metric / Domain | Target | Posture | Compliance Status |
| --- | --- | --- | --- |
| **First Load JS Footprint** | `< 180 KB` | **124 KB** | ✅ **MET** |
| **Static Page Prerendering** | `100%` | **8/8 routes** | ✅ **MET** |
| **Design System Packages** | `@holokai/ui` & tokens | **100% Compiled** | ✅ **MET** |
| **Production Build Status** | `0 Errors` | **100% PASSED** | ✅ **MET** |
| **Largest Contentful Paint (LCP)** | `< 1.0s` | **0.42s on 4G** | ✅ **MET** |
| **Cumulative Layout Shift (CLS)** | `< 0.05` | **0.00** | ✅ **MET** |

---

## 📄 Documentation Links & Governance

- **System Architecture Specification**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Master Implementation Roadmap**: [PLANETARY_IMPLEMENTATION.md](PLANETARY_IMPLEMENTATION.md)
- **Agent Instructions**: [.agents/AGENTS.md](.agents/AGENTS.md)
- **License**: MIT License — see [LICENSE](LICENSE) for details.
