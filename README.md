# 🚀 HoloKai — Planetary UI Platform & Civilization Research OS (v14.0)

### *Where Pan-African Civilization Remembers — Edge-Native, 3D Spatial & Multi-Vocal AI Research OS*

[![Architecture Standard](https://img.shields.io/badge/Architecture-Planetary--Scale_v14.0-gold?style=for-the-badge)](ARCHITECTURE.md)
[![Framework](https://img.shields.io/badge/Framework-Next.js_15_App_Router-black?style=for-the-badge&logo=nextdotjs)](apps/shell)
[![Design Tokens](https://img.shields.io/badge/Design_Tokens-%40holokai%2Fdesign--tokens-amber?style=for-the-badge)](packages/design-tokens)
[![UI Suite](https://img.shields.io/badge/UI_Suite-%40holokai%2Fui-purple?style=for-the-badge)](packages/ui)
[![3D GLTF Viewer](https://img.shields.io/badge/3D_GLTF-Cyber_Mannequin-cyan?style=for-the-badge)](apps/shell)
[![Vocal Engine](https://img.shields.io/badge/Vocal_AI-Gemini%20%2B%20ElevenLabs%20%2B%20Deepgram-emerald?style=for-the-badge)](packages/ui)
[![Physical AI](https://img.shields.io/badge/Physical_AI-ROS_2_%2B_NVIDIA_Isaac-76B900?style=for-the-badge)](robotics/)

---

## 🌟 Executive Overview

**HoloKai** is a civilization-scale, edge-native, 3D spatial research operating system dedicated to the digitization, preservation, and synthesis of **Pan-African Epigraphy, Archaeoastronomy, Metallurgy, and Oral Memory**.

The platform combines the existing Next.js 15 spatial research OS, multi-vocal AI engine, Module Federation micro-frontends, systemic DesignDNA, Python multi-agent/RAG engine, and a new isolated **Physical AI plane** for ROS 2 and NVIDIA Isaac. HoloKai can therefore evolve from a research interface into an embodied civilization-intelligence platform while keeping web cognition and physical execution cleanly separated.

---

## 🧠 Civilization Intelligence + 🤖 Physical AI

```text
                         HOLOKAI
                            │
            ┌───────────────┴───────────────┐
            │                               │
      CIVILIZATION OS                  PHYSICAL AI
            │                               │
     Oracle / RAG / Graph             ROS 2 / Isaac ROS
     Memory / Epistemics              Isaac Sim / Lab
            │                               │
            └───────────┬───────────────────┘
                        │
                EMBODIED AI GATEWAY
                        │
                  Humanoid / Robot
```

### NVIDIA Isaac integration

The new `robotics/` workspace contains the HoloKai Physical AI boundary:

- `robotics/contracts/embodied_action.schema.json` — versioned embodied task contract.
- `robotics/ros2/` — ROS 2 package with cognitive, safety, and world-model bridges.
- `robotics/isaac/sim/` — Isaac Sim digital-twin and synthetic-data workspace.
- `robotics/isaac/lab/` — Isaac Lab robot-learning workspace.
- `robotics/isaac/assets/` — semantic-to-physical asset registry boundary.
- `apps/bff/src/routes/robotics.ts` — controlled HTTP gateway for task submission, robot status, and world state.

### Safety boundary

The LLM and HoloKai agents **never emit motor-level commands**. They produce a schema-validated `EmbodiedAction`. A deterministic safety gateway validates velocity, human-proximity, manipulation authorization, emergency-stop state, and provenance before an approved task can cross into ROS 2.

### Cognitive → physical loop

```text
Knowledge Graph / RAG
        ↓
Cognitive Planner
        ↓
EmbodiedAction
        ↓
Safety Gateway
        ↓
ROS 2
        ↓
Isaac ROS / Isaac Sim / Robot
        ↓
Perception + World Observation
        ↓
World Model / Episodic Memory
        ↓
Cognitive Planner
```

The robotics layer is optional for web-only deployments. Configure `HOLOKAI_ROBOTICS_GATEWAY_URL` only on a BFF host that is explicitly allowed to communicate with a robotics gateway.

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
                     └─────────────────┬─────────────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     │          VOCAL ENGINE             │
                     │ ElevenLabs → Deepgram → Browser  │
                     └───────────────────────────────────┘
```

---

## 🕴️ 3D Spatial & Video Visual Suite (`@holokai/ui`)

1. **3D Cyber Mannequin GLTF Node** — interactive WebGL mannequin with skeleton joint nodes.
2. **Cinematic Vanguard Carousel** — 3D coverflow gallery with voice triggers.
3. **Spaceship-Style Motion Cards** — perspective tilt and magnetic interactions.
4. **WebGL Particle Atmosphere** — spatial particle constellation.

---

## 🎨 Systemic DesignDNA Hierarchy

```text
DESIGN TOKENS (@holokai/design-tokens)
      ↓
CSS CUSTOM PROPERTIES
      ↓
TAILWIND PRESET
      ↓
@holokai/ui
      ↓
APPLICATION + ROBOTICS CONTROL SURFACES
```

---

## 🛠️ Quick Start & Production Commands

```bash
pnpm install
pnpm --filter @holokai/shell build
```

For the robotics host:

```bash
cd robotics/ros2
colcon build --symlink-install
source install/setup.bash
ros2 launch holokai_embodied holokai_embodied.launch.py
```

The NVIDIA Isaac installation itself is managed according to NVIDIA's supported Isaac ROS / Isaac Sim / Isaac Lab environment rather than vendored into the HoloKai web monorepo.

---

## 📄 Governance & Documentation

- **System Architecture Specification**: [ARCHITECTURE.md](ARCHITECTURE.md)
- **Physical AI Foundation**: [robotics/README.md](robotics/README.md)
- **Master Implementation Roadmap**: [PLANETARY_IMPLEMENTATION.md](PLANETARY_IMPLEMENTATION.md)
- **HoloKai Platform Enhancement Initiative**: [HOLOKAI-ENHANCEMENT-INITIATIVE.md](HOLOKAI-ENHANCEMENT-INITIATIVE.md)
- **Homepage Enrichment Tasks**: [.kiro/specs/holokai-homepage-enrichment/tasks.md](.kiro/specs/holokai-homepage-enrichment/tasks.md)
- **Specialized AI Agents**: [.claude/agents/](.claude/agents/)
