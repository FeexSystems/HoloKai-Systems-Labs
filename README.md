# 🚀 HoloKai — Planetary UI Platform & Civilization Research OS (v14.0)

### *Where Pan-African Civilization Remembers — Edge-Native, 3D Spatial & Multi-Vocal AI Research OS*

[![Architecture Standard](https://img.shields.io/badge/Architecture-Planetary--Scale_v14.0-gold?style=for-the-badge)](ARCHITECTURE.md)
[![Framework](https://img.shields.io/badge/Framework-Next.js_15_App_Router-black?style=for-the-badge&logo=nextdotjs)](apps/shell)
[![Design Tokens](https://img.shields.io/badge/Design_Tokens-%40holokai%2Fdesign--tokens-amber?style=for-the-badge)](packages/design-tokens)
[![UI Suite](https://img.shields.io/badge/UI_Suite-%40holokai%2Fui-purple?style=for-the-badge)](packages/ui)
[![3D GLTF Viewer](https://img.shields.io/badge/3D_GLTF-Cyber_Mannequin-cyan?style=for-the-badge)](apps/shell)
[![Vocal Engine](https://img.shields.io/badge/Vocal_AI-Gemini%20%2B%20ElevenLabs%20%2B%20Deepgram-emerald?style=for-the-badge)](packages/ui)
[![Build Status](https://img.shields.io/badge/Build-100%25_PASSED-emerald?style=for-the-badge)](apps/shell)

---

## 🌟 Executive Overview

**HoloKai** is a civilization-scale, edge-native, 3D spatial research operating system dedicated to the digitization, preservation, and synthesis of **Pan-African Epigraphy, Archaeoastronomy, Metallurgy, and Oral Memory**.

Combining a **Next.js 15 App Router Streaming SSR Shell Host**, **3D Cyber Mannequin GLTF Node**, **Cinematic 3D Vanguard Units Carousel Gallery**, **Multi-Vocal AI Engine (Google Gemini AI + ElevenLabs + Deepgram)**, **Module Federation v2 Micro-Frontends**, and an authoritative **Systemic DesignDNA Foundation (`@holokai/design-system` & `@holokai/ui`)**, HoloKai provides a high-production 3D spatial interface powered by a **16-Volume Ancient African History Knowledge Corpus**.

---

## 🎙️ AI Engine & Multi-Vocal Architecture

```text
                          ┌─────────────────────────┐
                          │   SCHOLAR VOICE / PROMPT│
                          └────────────┬────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     │  MAIN CHAT & REASONING ENGINE     │
                     │        GOOGLE GEMINI AI           │
                     │  (Gemini 2.5 Flash & Flash Lite)  │
                     └─────────────────┬─────────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     │          VOCAL ENGINE             │
                     ├───────────────────────────────────┤
                     │ 1st CHOICE: ELEVENLABS (Primary)   │
                     │ 2nd CHOICE: DEEPGRAM (Fallback)   │
                     │ BROWSER: WEB SPEECH (Local)       │
                     └─────────────────┬─────────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     │      AUDIO VISUALIZER MATRIX      │
                     │  (48-Band Canvas + Script Glyphs) │
                     └───────────────────────────────────┘
```

1. **Google Gemini AI (Main Chat Engine)**:
   - Powers all scholar multi-agent reasoning, primary source epigraphic transliterations, 16-volume codex vector queries, and 6-tier epistemic confidence scoring.
2. **ElevenLabs (1st Choice Vocal Engine)**:
   - High-fidelity conversational speech synthesis for 8 Vanguard Guardian voice personas (Kemet-Alpha, Kush-Prime, Asante-V, Bantu-Node, Sika-Gold, Zamani, Naja-7, Oluwa-Core).
3. **Deepgram (2nd Choice Vocal Engine)**:
   - High-speed Nova-3 Speech-to-Text & Aura TTS fallback engine for real-time live microphone audio transcription.
4. **Audio & Ancient Script Spectrum Visualizers**:
   - `VoiceVisualizer`: Real-time 48-band Canvas 2D audio spectrum analyzer with gold frequency bars.
   - `AncientScriptVoiceVisualizer`: Floating Ge'ez, Hieroglyphic, Meroitic, and Nsibidi glyph particles reacting to voice amplitude.

---

## 🕴️ 3D Spatial & Video Visual Suite (`@holokai/ui`)

1. **3D Cyber Mannequin GLTF Node (`CyberMannequinViewer.tsx`)**:
   - Interactive WebGL / Canvas 3D mannequin canvas (`cyber_mannequin.gltf`) with 15 skeleton joint nodes, autorotation, cybernetic wireframe, and cursor interactive orbit.
2. **Cinematic Vanguard Carousel Gallery (`VanguardCarousel.tsx`)**:
   - 3D Coverflow perspective slider with auto-playing MP4 video loops on focus, character spec metrics, and ElevenLabs voice triggers.
3. **Spaceship-Style Motion Cards (`Card.tsx`)**:
   - 3D perspective tilt (`rotateX`, `rotateY`), follow-mouse glare sheen overlay, and magnetic hover translation.
4. **WebGL Particle Atmosphere (`SpatialCanvas.tsx`)**:
   - Canvas 2D/Three.js starfield particle constellation with cursor spotlight tracking.

---

## 🎨 Systemic DesignDNA Hierarchy

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

---

## 🛠️ Quick Start & Production Commands

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Launch production server on port 3005
pnpm --filter @holokai/shell start -p 3005

# 3. Rebuild monorepo packages cleanly
cmd /c "pnpm --filter @holokai/design-system build && pnpm --filter @holokai/ui build && pnpm --filter @holokai/shell build"
```

| Service | Route / Port | Description |
| --- | --- | --- |
| **HoloKai Spatial OS Shell** | `http://localhost:3005/` | 3D Spatial Research OS, Mannequin Viewer, Vanguard Carousel & Voice Chamber |
| **System Edge** | `http://localhost:3005/system` | Platform Telemetry & Edge Runtime |
| **Web Oracle Remote** | `http://localhost:3001/` | Oracle AI Research Remote |
| **Web Archive Remote** | `http://localhost:3002/` | Civilization Archive Remote |

---

## 📄 Governance & Documentation

- **System Architecture Specification**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Master Implementation Roadmap**: [PLANETARY_IMPLEMENTATION.md](PLANETARY_IMPLEMENTATION.md)
- **HoloKai Platform Enhancement Initiative**: [HOLOKAI-ENHANCEMENT-INITIATIVE.md](HOLOKAI-ENHANCEMENT-INITIATIVE.md)
- **Homepage Enrichment Tasks**: [.kiro/specs/holokai-homepage-enrichment/tasks.md](.kiro/specs/holokai-homepage-enrichment/tasks.md)
- **Specialized AI Agents**: [.claude/agents/](.claude/agents/)
- **Walkthrough & Verification Log**: [walkthrough.md](walkthrough.md)
