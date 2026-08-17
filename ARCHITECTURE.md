# PLANETARY UI PLATFORM — ARCHITECTURE DOCUMENTATION

## System Overview

The **HoloKai Platform** is a planetary-scale, edge-native, AI-augmented civilization research operating system. Its web and cognitive planes are complemented by a physically isolated **Physical AI plane** based on ROS 2 and NVIDIA Isaac.

## 1. System Topology & Layers

```mermaid
flowchart TB
  user[End User Browser]
  subgraph Edge[Edge Intelligence]
    geo[Cloudflare Edge]
    aiEdge[AI Route Predictor]
    mfe[MFE Resolver]
  end
  subgraph Runtime[HoloKai Apps]
    shell[Shell]
    oracle[Oracle]
    archive[Archive]
    research[Research]
  end
  subgraph Cognition[Civilization Intelligence]
    bff[BFF Gateway]
    python[Python Multi-Agent Engine]
    rag[RAG / Chroma / Memory]
    graph[Knowledge Graph]
  end
  subgraph Physical[Physical AI]
    gateway[Embodied Task Gateway]
    ros[ROS 2 / DDS]
    isaacros[Isaac ROS]
    sim[Isaac Sim]
    lab[Isaac Lab]
    robot[Humanoid / Robot]
  end
  user --> Edge
  Edge --> Runtime
  Runtime --> Cognition
  bff --> gateway
  gateway --> ros
  ros --> isaacros
  isaacros --> robot
  sim --> isaacros
  lab --> sim
  robot --> ros
  ros --> gateway
  gateway --> bff
  python --> bff
  rag --> python
  graph --> python
```

### Architectural boundary

- Cognitive systems decide high-level intent.
- Physical AI systems perceive, simulate, plan, and execute.
- ROS 2 is the embodiment boundary.
- The BFF never imports ROS libraries.
- The LLM never emits motor-level commands.
- A deterministic safety gateway is mandatory before robot execution.

## 2. NVIDIA Isaac Integration

`robotics/` is the dedicated Physical AI workspace.

```text
robotics/
├── contracts/embodied_action.schema.json
├── ros2/src/holokai_embodied/
│   ├── cognitive_bridge.py
│   ├── safety_gateway.py
│   ├── world_model_bridge.py
│   └── launch/holokai_embodied.launch.py
└── isaac/
    ├── sim/       # Isaac Sim scenes, USD assets, sensors
    ├── lab/       # Isaac Lab environments and policies
    └── assets/    # HoloKai semantic/physical assets
```

HoloKai does not vendor NVIDIA Isaac ROS. NVIDIA's upstream packages remain the source of truth and are installed on the robotics host.

| Layer | Responsibility |
|---|---|
| Isaac ROS | Accelerated ROS 2 perception, mapping, pose and robotics workloads |
| Isaac Sim | Digital twins, physics, sensors, synthetic data, SIL/HIL validation |
| Isaac Lab | Scalable robot-learning environments and evaluation |
| ROS 2 | Robot middleware / hardware boundary |
| HoloKai | Civilization knowledge, provenance, reasoning, memory, task intent |

## 3. Embodied Intelligence Contract

Every task crossing cognition into embodiment uses `robotics/contracts/embodied_action.schema.json` and the shared `@holokai/contracts` TypeScript definitions.

The contract carries task identity, semantic target, spatial pose/frame, velocity and human-proximity constraints, required capabilities, epistemic stance, evidence IDs, confidence, and metadata.

## 4. Safety Architecture

```text
HoloKai Agent / LLM
        |
        v
EmbodiedAction
        |
        v
Schema validation
        |
        v
Deterministic Safety Gateway
        |
   +----+----+
   |         |
 reject    approve
             |
             v
           ROS 2
             |
             v
       Isaac / Robot
```

The safety gateway is deliberately non-LLM. It enforces hard bounds, emergency-stop state, manipulation authorization, provenance presence, and minimum human-proximity constraints.

## 5. Cognitive ↔ World Model Loop

```text
Knowledge Graph / RAG
        ↓
Cognitive Planner
        ↓
Embodied Action
        ↓
ROS 2 / Isaac
        ↓
Perception + Localization
        ↓
World Observation
        ↓
World Model / Episodic Memory
        ↓
Cognitive Planner
```

This creates the foundation for **Embodied Civilization Intelligence**: cultural entities can become spatially grounded without losing provenance or epistemic status.

## 6. CSS & Design System

The robotics UI consumes the same `@holokai/design-tokens` and `@holokai/ui` system. Future surfaces include Robot Dossier, World Map, Sensor Health, Action Timeline, Simulation Viewport, and Safety State.

## 7. Package Structure

```text
/
├── apps/                  # HoloKai web and BFF applications
├── packages/              # Shared contracts, UI, runtime and design system
├── services/              # Python cognition, RAG and memory
├── robotics/              # ROS 2 + NVIDIA Isaac Physical AI plane
└── edge/                  # Cloudflare edge intelligence
```
