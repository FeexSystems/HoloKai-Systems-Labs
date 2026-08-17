# HoloKai Physical AI / NVIDIA Isaac Foundation

HoloKai's Physical AI plane. This layer keeps civilization intelligence, web services, and robot execution separated while providing a deterministic bridge to ROS 2 and NVIDIA Isaac.

## Phase 1 runtime: Isaac Sim + ROS 2 + Isaac ROS + HoloKai World Model

```text
                    HoloKai Cognitive Plane
               Oracle / Agents / RAG / Memory / Graph
                               |
                       Embodied Task Contract
                               |
                    Robotics BFF / Gateway
                               |
                         ROS 2 / DDS
                               |
             +-----------------+------------------+
             |                                    |
        NVIDIA Isaac ROS                    HoloKai ROS 2
       accelerated perception               embodiment nodes
             |                                    |
     +-------+--------+                 +---------+---------+
     |                |                 |         |         |
 Visual SLAM       Nvblox          Safety     World      Cognitive
     |                |             Gate     Model       Bridge
     +-------+--------+                 |         |
             |                          +---------+
             +---------------+--------------------+
                             |
                        World State
                             |
                  HoloKai World Model API
                             |
                Cultural Knowledge / Memory

                    <simulation boundary>
                             |
                         Isaac Sim
                    USD / sensors / robot
                             |
                        ROS 2 Bridge
```

## Design rules

1. The LLM never emits motor-level commands.
2. Cognitive plans use versioned, schema-validated task contracts.
3. `safety_gateway` is deterministic and sits between cognition and execution.
4. ROS 2 is the embodiment boundary; the web/BFF layer never imports ROS libraries.
5. Isaac Sim is the first target for validation; physical hardware follows simulation and hardware-in-the-loop gates.
6. Cultural provenance and epistemic classification travel with semantic tasks and observations.
7. High-bandwidth camera transport stays inside the NVIDIA graph where possible; HoloKai consumes semantic/spatial results rather than duplicating the entire sensor pipeline.
8. NVIDIA packages remain upstream dependencies; HoloKai owns the semantic bridge and world model.

## Initial implementation

- `contracts/embodied_action.schema.json` — task/action contract.
- `contracts/world_observation.schema.json` — world-state observation contract.
- `ros2/src/holokai_embodied` — ROS 2 package boundary.
- `ros2/src/holokai_embodied/holokai_embodied/world_model.py` — deterministic in-process world-state cache.
- `apps/bff/src/routes/robotics.ts` — HTTP gateway for task submission and robot state.
- `isaac/sim/scenes/holokai_lab.usda` — first HoloKai Isaac Sim laboratory scene scaffold.
- `isaac/host/start_holokai_isaac_ros.sh` — host-side activation workflow.

## NVIDIA alignment

NVIDIA currently recommends ROS 2 Humble or Jazzy with Isaac Sim. HoloKai's first Physical AI baseline is **ROS 2 Jazzy**. Isaac Sim's ROS 2 bridge exposes the simulator to ROS applications; Isaac ROS supplies accelerated perception packages such as Visual SLAM and Nvblox; NITROS can keep high-bandwidth image paths GPU-oriented.

## Local development

The web monorepo can be developed without an NVIDIA GPU. Robotics services are optional until an Isaac/ROS 2 host is available.

For a robotics host, use NVIDIA's current Isaac ROS CLI-managed environment, then build HoloKai into the ROS workspace:

```bash
export ISAAC_ROS_WS=${HOME}/workspaces/isaac_ros-dev
isaac-ros activate

cd "$ISAAC_ROS_WS"
colcon build --symlink-install --packages-select holokai_embodied
source install/setup.bash

ros2 launch holokai_embodied holokai_isaac_ros.launch.py
```

Start NVIDIA perception separately from the same sourced environment:

```bash
ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py
ros2 launch nvblox_examples_bringup isaac_sim_example.launch.py navigation:=False
```

Then launch Isaac Sim with the ROS 2 bridge enabled and load `robotics/isaac/sim/scenes/holokai_lab.usda`. Isaac Sim's ROS 2 publishers/subscribers become active when simulation is playing.

The package intentionally does not vendor Isaac ROS. NVIDIA's upstream packages remain the source of truth and are consumed by the robotics host.
