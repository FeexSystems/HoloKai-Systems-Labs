# HoloKai Physical AI / NVIDIA Isaac

> **Embodied civilization intelligence:** perception, spatial reasoning, cultural knowledge, provenance, and safe robot execution.

HoloKai's Physical AI plane is the bridge between the civilization-intelligence platform and embodied machines. It is deliberately separated from the web application and cognitive services so that NVIDIA Isaac, ROS 2, simulation, perception, safety, and world-state handling can evolve without coupling motor execution to an LLM or browser process.

---

## Table of contents

- [1. Mission](#1-mission)
- [2. System architecture](#2-system-architecture)
- [3. End-to-end runtime](#3-end-to-end-runtime)
- [4. Isaac Sim](#4-isaac-sim)
- [5. ROS 2 embodiment boundary](#5-ros-2-embodiment-boundary)
- [6. Isaac ROS perception](#6-isaac-ros-perception)
- [7. Semantic Perception v2.1](#7-semantic-perception-v21)
- [8. Multimodal Artifact Resolver](#8-multimodal-artifact-resolver)
- [9. PGVector retrieval](#9-pgvector-retrieval)
- [10. Knowledge-graph retrieval](#10-knowledge-graph-retrieval)
- [11. Metadata and alias retrieval](#11-metadata-and-alias-retrieval)
- [12. Evidence fusion](#12-evidence-fusion)
- [13. Pose grounding](#13-pose-grounding)
- [14. Artifact Intelligence contract](#14-artifact-intelligence-contract)
- [15. HoloKai World Model](#15-holokai-world-model)
- [16. BFF and UI exposure](#16-bff-and-ui-exposure)
- [17. Provenance and epistemic safeguards](#17-provenance-and-epistemic-safeguards)
- [18. Configuration](#18-configuration)
- [19. Repository map](#19-repository-map)
- [20. Runtime bring-up](#20-runtime-bring-up)
- [21. Validation gates](#21-validation-gates)
- [22. Failure modes](#22-failure-modes)
- [23. Security model](#23-security-model)
- [24. Development roadmap](#24-development-roadmap)
- [25. Design rules](#25-design-rules)

---

## 1. Mission

HoloKai is not intended to be a generic robot wrapper. The Physical AI plane gives HoloKai a controlled way to connect **physical observations** to its civilization knowledge systems.

The intended progression is:

```text
SEE
  ↓
LOCALIZE
  ↓
CLASSIFY
  ↓
RESOLVE IDENTITY
  ↓
RETRIEVE KNOWLEDGE
  ↓
VERIFY PROVENANCE
  ↓
UPDATE WORLD MODEL
  ↓
REASON / PLAN
  ↓
ACT THROUGH SAFETY GATES
```

A detected object is therefore not automatically a historical fact. HoloKai keeps perception, identity, evidence, and epistemic status as separate layers.

---

## 2. System architecture

```text
                         HOLOKAI COGNITIVE PLANE
        Oracle / Agents / RAG / Memory / Knowledge Graph
                              │
                     Embodied Task Contract
                              │
                     Robotics BFF / Gateway
                              │
                         ROS 2 / DDS
                              │
          ┌───────────────────┴───────────────────┐
          │                                       │
     NVIDIA ISAAC                           HOLOKAI ROS 2
          │                                       │
   ┌──────┼────────┐                    ┌─────────┼─────────┐
   │      │        │                    │         │         │
 Isaac   Isaac   Nvblox               Safety    World    Semantic
 Sim     ROS                          Gateway    Model    Bridge
   │      │        │                    │         │         │
   └──────┴────────┘                    └─────────┴─────────┘
          │                                       │
          └──────────────────┬────────────────────┘
                             │
                     Semantic World State
                             │
                   Multimodal Artifact Resolver
                             │
                 ┌───────────┼────────────┐
                 │           │            │
              PGVector     Neo4j       Metadata
                 │           │            │
                 └───────────┼────────────┘
                             │
                     Evidence Fusion
                             │
                       Entity Resolution
                             │
                     HoloKai World Model
                             │
                       BFF / Live UI
```

### Separation of concerns

| Plane | Responsibility | Must not own |
|---|---|---|
| Cognitive | reasoning, planning, RAG, cultural knowledge | motor-level commands |
| BFF | authenticated HTTP boundary | direct ROS internals |
| ROS 2 | embodiment messaging and execution boundary | historical truth |
| Isaac ROS | accelerated perception | cultural attribution |
| Isaac Sim | deterministic simulation and sensors | production historical claims |
| Artifact Resolver | identity/evidence fusion | unsafe actuation |
| World Model | spatial/semantic state | unverified claims presented as facts |
| Safety Gateway | deterministic execution authorization | open-ended LLM reasoning |

---

## 3. End-to-end runtime

The target physical-to-cognitive loop is:

```text
Isaac Sim / Robot sensors
        │
        ├── RGB
        ├── Depth
        ├── IMU
        └── Odometry / TF
        │
        ▼
Isaac ROS perception
        │
        ├── Visual SLAM
        ├── RT-DETR / detector
        ├── FoundationPose / pose estimator
        └── Nvblox / spatial reconstruction
        │
        ▼
HoloKai semantic normalization
        │
        ▼
Candidate artifact set
        │
        ├── PGVector semantic retrieval
        ├── knowledge-graph neighborhood retrieval
        └── metadata / alias retrieval
        │
        ▼
Evidence fusion
        │
        ├── RESOLVED
        ├── AMBIGUOUS
        └── UNRESOLVED
        │
        ▼
Artifact Intelligence observation
        │
        ▼
HoloKai World Model
        │
        ├── BFF
        ├── live UI
        ├── episodic memory
        └── cognitive planner
```

The reverse loop is:

```text
Knowledge / Planner
       ↓
EmbodiedAction
       ↓
Safety Gateway
       ↓
ROS 2
       ↓
Robot / Isaac Sim
       ↓
New observation
```

---

## 4. Isaac Sim

Isaac Sim is HoloKai's first physical-AI validation environment. It provides the reproducible digital-twin boundary before physical hardware is introduced.

The initial laboratory scene is:

```text
robotics/isaac/sim/scenes/holokai_lab.usda
```

The scene is intended to provide:

- a HoloKai laboratory environment;
- robot embodiment;
- RGB/depth sensing;
- IMU/odometry inputs;
- semantic artifact anchors;
- ROS 2 topic integration;
- repeatable perception experiments.

The simulation should be treated as a controlled test environment. Ground-truth labels or poses from simulation are validation fixtures, not evidence for historical claims.

---

## 5. ROS 2 embodiment boundary

ROS 2 is the physical execution boundary. The web application and BFF do not import ROS libraries.

The ROS 2 package lives under:

```text
robotics/ros2/src/holokai_embodied/
```

Important responsibilities include:

- cognitive bridge;
- safety gateway;
- world model;
- semantic perception bridge;
- entity resolution;
- Isaac ROS launch orchestration.

The canonical data path is topic-oriented rather than browser-oriented:

```text
sensor → ROS 2 → semantic normalization → world model
```

---

## 6. Isaac ROS perception

The HoloKai boundary is intentionally **model-agnostic** while the initial NVIDIA implementation targets the Isaac ROS ecosystem.

### Primary perception roles

**Visual SLAM**

Provides visual-inertial localization so observations can be grounded in the robot's spatial trajectory.

**RT-DETR / object detection**

Produces normalized 2D semantic detections such as labels, confidence, bounding boxes, and tracking identifiers.

**FoundationPose / 6DoF pose estimation**

Provides object pose when an appropriate object representation/model is available.

**Nvblox**

Provides spatial reconstruction and environment representation useful for navigation and obstacle reasoning.

High-bandwidth image processing should remain in the NVIDIA graph where practical. HoloKai should consume normalized semantic/spatial outputs rather than unnecessarily copying every raw frame into the web/cognitive plane.

---

## 7. Semantic Perception v2.1

Semantic Perception v2.1 turns generic computer-vision output into an auditable HoloKai artifact observation.

```text
             RGB / Depth
                  │
                  ▼
             RT-DETR
                  │
             2D detection
                  │
                  ▼
          FoundationPose
                  │
             6DoF pose
                  │
                  ▼
       Semantic Perception Bridge
                  │
                  ▼
          Candidate artifact
                  │
                  ▼
       Multimodal Artifact Resolver
                  │
                  ▼
        Artifact Intelligence
                  │
                  ▼
          HoloKai World Model
```

The stable semantic boundary carries, where available:

- label;
- semantic type;
- confidence;
- bounding box;
- pose;
- track ID;
- detector source;
- sensor metadata;
- provenance;
- epistemic stance.

Detector-specific APIs do not leak into the cognitive core.

---

## 8. Multimodal Artifact Resolver

The resolver answers a different question from the detector.

Detector:

> **What physical visual pattern is present?**

Resolver:

> **Which HoloKai entity, if any, is supported by the available evidence?**

The resolver combines four evidence channels:

```text
                  Candidate
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
    PGVector       Neo4j       Metadata/Alias
       │             │             │
       └─────────────┼─────────────┘
                     ▼
              Evidence Fusion
                     │
             ┌───────┼────────┐
             ▼       ▼        ▼
          RESOLVED AMBIGUOUS UNRESOLVED
```

### Candidate generation

The resolver should generate candidates broadly enough to avoid premature attribution. Candidate evidence may include:

- visual/semantic description;
- detector label;
- aliases;
- civilization terms;
- region;
- era;
- artifact class;
- embedding similarity;
- graph neighbors;
- source/provenance metadata.

### Candidate decision

The resolver does not simply select the highest numerical similarity. It evaluates evidence quality and conflict.

A candidate should be `RESOLVED` only when the combined evidence crosses the configured resolution policy.

If multiple candidates remain materially competitive, return `AMBIGUOUS`.

If evidence is insufficient, return `UNRESOLVED`.

---

## 9. PGVector retrieval

PGVector is the semantic retrieval channel for HoloKai's vectorized knowledge.

The intended query is conceptually:

```text
physical observation
      ↓
semantic description
      ↓
embedding
      ↓
cosine similarity
      ↓
top-k knowledge candidates
```

The configured table is:

```text
holokai_embeddings
```

The current integration supports a database URL and configurable embedding table. The database layer should provide an indexed vector search path rather than performing a full table scan.

### Vector evidence should include

```json
{
  "candidateId": "...",
  "similarity": 0.87,
  "source": "pgvector",
  "recordId": "...",
  "metadata": {}
}
```

Vector similarity is **candidate evidence**, not historical proof.

A semantically similar description can still refer to a different artifact, period, civilization, museum reproduction, or generic object class.

---

## 10. Knowledge-graph retrieval

The optional Neo4j channel supplies relational context that vector search cannot express reliably by itself.

Conceptually:

```text
Artifact
   │
   ├── CREATED_BY → Civilization / Culture
   ├── LOCATED_IN → Region
   ├── DATED_TO → Era
   ├── RELATED_TO → Person / Place
   ├── MATERIAL → Material
   ├── TYPE → Artifact class
   └── SOURCED_FROM → Evidence record
```

A graph neighborhood query can therefore test whether a candidate is structurally compatible with other known facts.

For example, a candidate that is visually plausible but connected to a region/period incompatible with other evidence should receive a lower evidence score or be marked ambiguous.

Neo4j is optional. HoloKai must remain functional when graph infrastructure is unavailable, but the absence of graph evidence should be visible in provenance rather than silently treated as positive evidence.

---

## 11. Metadata and alias retrieval

Metadata matching is the deterministic retrieval layer.

It should consider:

- canonical names;
- historical names;
- spelling variants;
- transliterations;
- local-language aliases;
- artifact categories;
- civilization aliases;
- regions;
- material;
- era;
- known catalog identifiers.

Example:

```text
"Nok head"
"Nok terracotta"
"Nok terracotta sculpture"
"Nok sculpture"
```

may all contribute lexical evidence toward the same candidate while remaining distinct aliases in the underlying provenance record.

Aliases should never overwrite canonical names.

---

## 12. Evidence fusion

Evidence fusion combines independent signals rather than hiding them behind a single confidence number.

A conceptual score is:

```text
S(candidate) =
    w_p * perception
  + w_v * vector
  + w_g * graph
  + w_m * metadata
  + w_x * provenance
  - conflict_penalty
```

The exact weights are configuration, not historical truth.

The system must preserve the individual components:

```json
{
  "perception": 0.96,
  "vector": 0.88,
  "graph": 0.81,
  "metadata": 0.94,
  "provenance": 0.90,
  "conflictPenalty": 0.00,
  "matchScore": 0.88
}
```

This makes the resolver auditable.

### Why this matters

A high visual confidence should not compensate for contradictory provenance.

Likewise, an excellent text embedding match should not override an incompatible physical pose, catalog identifier, or graph relationship.

---

## 13. Pose grounding

Object pose is meaningful only when its coordinate frame is known.

The intended transformation is:

```text
camera frame
    ↓
pose estimator
    ↓
object pose
    ↓
TF transform tree
    ↓
map / world frame
    ↓
HoloKai World Model
```

The artifact observation therefore carries:

```text
position
orientation
frame_id
timestamp
pose_source
pose_confidence
```

HoloKai should never silently treat a camera-frame coordinate as a global world coordinate.

If TF resolution fails, retain the raw pose and mark its frame/grounding status explicitly.

---

## 14. Artifact Intelligence contract

The v2.1 contract lives at:

```text
robotics/contracts/artifact_intelligence.schema.json
```

Its conceptual structure is:

```json
{
  "observationId": "...",
  "timestamp": "...",
  "perception": {
    "detector": "...",
    "confidence": 0.96,
    "bbox": {},
    "pose6d": {},
    "frameId": "map"
  },
  "identity": {
    "status": "RESOLVED",
    "entityId": "...",
    "name": "...",
    "civilization": "...",
    "matchScore": 0.88
  },
  "knowledge": {},
  "provenance": {},
  "epistemic": {}
}
```

### Identity states

**RESOLVED** — evidence satisfies the configured resolution policy.

**AMBIGUOUS** — more than one candidate remains materially plausible.

**UNRESOLVED** — available evidence is insufficient.

The system should prefer uncertainty over fabricated attribution.

---

## 15. HoloKai World Model

The World Model is the semantic/spatial state layer that receives resolved observations.

Its responsibility is to answer:

> **What does HoloKai currently believe is present in this physical environment, where is it, when was it observed, and why?**

An artifact state should contain both spatial and semantic state:

```text
entity ID
semantic type
label
civilization
pose
frame
timestamp
perception confidence
identity status
identity score
knowledge references
provenance
epistemic stance
```

The World Model should retain enough provenance to reconstruct how a physical observation became a semantic world-state assertion.

---

## 16. BFF and UI exposure

The web plane accesses robotics through the controlled BFF boundary:

```text
HoloKai UI
    ↓
/api/robotics/world
    ↓
Robotics BFF
    ↓
Robotics Gateway
    ↓
ROS 2
    ↓
World Model
```

The browser should not connect directly to DDS or ROS 2.

A live artifact panel can expose:

```text
ARTIFACT
Nok terracotta sculpture

IDENTITY
RESOLVED · 0.88

PERCEPTION
RT-DETR · 0.96

POSE
FoundationPose · 0.91

CIVILIZATION
Nok

EVIDENCE
PGVector 0.88
Graph 0.81
Metadata 0.94

PROVENANCE
3 knowledge records
2 evidence records

EPISTEMIC STATUS
ESTABLISHED
```

The UI should expose uncertainty and evidence rather than displaying an unsupported single label as absolute truth.

---

## 17. Provenance and epistemic safeguards

HoloKai maintains an explicit epistemic boundary:

```text
PERCEPTION
  ≠
IDENTITY
  ≠
HISTORICAL TRUTH
```

### Perception confidence

How confident is the detector that the physical visual signal belongs to a particular detected class?

### Pose confidence

How reliable is the estimated physical pose?

### Identity score

How strongly do the combined retrieval/evidence channels support the candidate entity?

### Epistemic stance

What status does the underlying knowledge claim carry?

Supported conceptual values include:

```text
ESTABLISHED
SCHOLARLY_DEBATE
TRADITION
ESOTERIC
SPECULATIVE
FICTIONAL
```

A detector cannot promote `TRADITION` to `ESTABLISHED`, and a high visual score cannot establish archaeological provenance.

---

## 18. Configuration

The resolver and robotics host may use:

```bash
DATABASE_URL=...
HOLOKAI_PGVECTOR_TABLE=holokai_embeddings
NEO4J_URI=...
NEO4J_USER=...
NEO4J_PASSWORD=...
HOLOKAI_ENGINE_PATH=...
HOLAKAI_EMBED_MODEL=...
HOLOKAI_ROBOTICS_GATEWAY_URL=...
ISAAC_ROS_WS=$HOME/workspaces/isaac_ros-dev
```

### Operational principle

Secrets belong in the runtime environment or approved secret manager. Do not commit database passwords, Neo4j credentials, private keys, or production connection strings to the repository.

---

## 19. Repository map

```text
robotics/
├── README.md
├── contracts/
│   ├── embodied_action.schema.json
│   ├── world_observation.schema.json
│   ├── semantic_detection.schema.json
│   └── artifact_intelligence.schema.json
│
├── ros2/
│   └── src/holokai_embodied/
│       └── holokai_embodied/
│           ├── cognitive_bridge.py
│           ├── safety_gateway.py
│           ├── world_model.py
│           ├── world_model_bridge.py
│           ├── semantic_perception_bridge.py
│           └── entity_resolver.py
│
├── isaac/
│   ├── sim/
│   │   └── scenes/holokai_lab.usda
│   ├── semantic/
│   │   ├── artifact_intelligence.py
│   │   └── README.md
│   ├── lab/
│   └── assets/
│
└── host/
    └── Isaac ROS activation / bring-up scripts
```

The exact contents of the branch may evolve as Isaac ROS integration is hardened; this document describes the intended architecture and stable interfaces rather than claiming every NVIDIA runtime component is vendored into HoloKai.

---

## 20. Runtime bring-up

### Web-only development

No NVIDIA GPU is required to develop the web monorepo.

### Robotics host

Use NVIDIA's supported Isaac ROS environment, then build HoloKai into the ROS workspace:

```bash
export ISAAC_ROS_WS=${HOME}/workspaces/isaac_ros-dev
isaac-ros activate

cd "$ISAAC_ROS_WS"
colcon build --symlink-install --packages-select holokai_embodied
source install/setup.bash
```

Start the HoloKai robotics boundary:

```bash
ros2 launch holokai_embodied holokai_isaac_ros.launch.py
```

Start perception components according to the installed NVIDIA Isaac ROS release:

```bash
ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py
ros2 launch nvblox_examples_bringup isaac_sim_example.launch.py navigation:=False
```

Then launch Isaac Sim, enable the ROS 2 bridge, load:

```text
robotics/isaac/sim/scenes/holokai_lab.usda
```

and press **Play**.

NVIDIA packages are deliberately not vendored into this repository. The NVIDIA-supported environment is the source of truth for Isaac Sim and Isaac ROS versions.

---

## 21. Validation gates

HoloKai should pass the following gates in order.

### Gate A — Sensor transport

```bash
ros2 topic list
ros2 topic hz <camera-topic>
ros2 topic hz <imu-topic>
```

Verify that timestamps and frame IDs are coherent.

### Gate B — Localization

Verify Visual SLAM tracking odometry and TF availability.

### Gate C — Detection

Verify detector output contains valid bounding boxes, labels, confidence and timestamps.

### Gate D — Pose

Verify pose estimation and coordinate-frame transformations.

### Gate E — Retrieval

Verify PGVector candidate retrieval and, when configured, graph/metadata candidates.

### Gate F — Evidence fusion

Verify candidate scores, conflicts and identity state.

### Gate G — World Model

Verify the resolved artifact appears with spatial state and provenance.

### Gate H — BFF/UI

Verify the live world state is available through the authenticated web boundary.

### Gate I — Hardware-in-the-loop

Only after simulation and software validation should physical robot actuation be enabled.

---

## 22. Failure modes

### Detector unavailable

World Model continues to represent previously known state; no fabricated new artifact is created.

### Pose unavailable

Artifact may remain semantically detected but spatial grounding is marked incomplete.

### PGVector unavailable

Resolver can fall back to other configured evidence channels, but missing evidence is recorded.

### Neo4j unavailable

Graph evidence becomes unavailable rather than being treated as negative evidence.

### Conflicting evidence

Return `AMBIGUOUS` or lower the identity confidence according to policy.

### No candidate

Return `UNRESOLVED` and retain the raw observation for later review/learning.

### Unknown artifact

An unknown object is a valid World Model state. HoloKai should not force every object into a known African civilization entity.

---

## 23. Security model

The Physical AI plane is a privileged boundary.

### Non-negotiable rules

1. LLMs do not issue motor-level commands.
2. Every embodied action is schema validated.
3. Safety checks are deterministic.
4. The BFF does not expose arbitrary ROS topics or DDS to browsers.
5. Robotics credentials are isolated from public web credentials.
6. Perception input is treated as untrusted sensor data.
7. Historical knowledge is not mutated merely because a detector produced an observation.
8. Provenance is retained for semantic assertions.
9. Emergency-stop state has precedence over cognitive plans.
10. Simulation ground truth is never silently promoted to external historical evidence.

---

## 24. Development roadmap

### Phase 1 — Foundation

- Isaac Sim laboratory
- ROS 2 Jazzy
- Isaac ROS boundary
- Visual SLAM
- Nvblox
- HoloKai World Model
- Robotics BFF

### Phase 2 — Semantic Perception

- RT-DETR integration
- FoundationPose integration
- semantic detection normalization
- artifact entity resolver

### Phase 3 — Artifact Intelligence

- PGVector retrieval
- Neo4j neighborhood retrieval
- metadata/alias retrieval
- evidence fusion
- provenance-aware resolution
- ambiguous/unresolved handling

### Phase 4 — Cultural Spatial Intelligence

- artifact-to-civilization relationships
- region/era constraints
- museum/archive catalog identifiers
- 3D artifact registry
- spatial cultural maps
- temporal world-state reasoning

### Phase 5 — Embodied Cultural Agent

- semantic exploration
- artifact-aware navigation
- multimodal question answering grounded in the World Model
- episodic memory
- human-robot interaction
- controlled manipulation tasks

### Phase 6 — Physical Deployment

- hardware-in-the-loop
- robot calibration
- safety certification gates
- restricted actuation
- field evaluation

---

## 25. Design rules

1. **The LLM never emits motor-level commands.**
2. **Cognitive plans use versioned, schema-validated task contracts.**
3. **The safety gateway is deterministic and sits between cognition and execution.**
4. **ROS 2 is the embodiment boundary.**
5. **Isaac Sim is the first validation target.**
6. **Physical hardware follows simulation and hardware-in-the-loop gates.**
7. **Cultural provenance travels with semantic observations and tasks.**
8. **Perception confidence, identity confidence, and epistemic status remain independent.**
9. **Vector similarity is evidence, not proof.**
10. **Graph relationships are evidence, not proof.**
11. **Unknown and ambiguous entities are first-class states.**
12. **Simulation ground truth is not historical provenance.**
13. **High-bandwidth sensor processing stays GPU-oriented where possible.**
14. **NVIDIA packages remain upstream dependencies.**
15. **HoloKai owns the semantic bridge, provenance model, resolver policy, and World Model.**
16. **Every physical-to-cultural assertion should be auditable from observation to evidence.**

---

## Architecture outcome

The Physical AI plane is designed to make this loop possible:

```text
                    ┌─────────────────────┐
                    │  AFRICAN KNOWLEDGE  │
                    │  GRAPH + MEMORY     │
                    └──────────┬──────────┘
                               │
                               ▼
                         HoloKai Oracle
                               │
                               ▼
                        Cognitive Planner
                               │
                         EmbodiedAction
                               │
                               ▼
                         Safety Gateway
                               │
                               ▼
                             ROS 2
                               │
                    ┌──────────┴──────────┐
                    │                     │
                 Isaac Sim             Robot
                    │                     │
                    └──────────┬──────────┘
                               │
                         RGB / Depth / IMU
                               │
                               ▼
                         Isaac ROS
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                  Detect      Pose      Spatial
                    │          │          │
                    └──────────┼──────────┘
                               ▼
                     Semantic Perception
                               │
                               ▼
                    Multimodal Resolver
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
              PGVector       Neo4j       Metadata
                 └─────────────┼─────────────┘
                               ▼
                         Evidence Fusion
                               │
                               ▼
                       Artifact Intelligence
                               │
                               ▼
                       HoloKai World Model
                               │
                 ┌─────────────┼─────────────┐
                 ▼             ▼             ▼
               BFF            UI          Memory
```

**HoloKai's Physical AI objective is therefore not simply to make a robot see. It is to create a provenance-aware bridge from physical perception to African civilization knowledge while preserving uncertainty, spatial grounding, evidence, and deterministic safety boundaries.**
