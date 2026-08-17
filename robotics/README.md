# HoloKai Physical AI / NVIDIA Isaac Foundation

HoloKai's Physical AI plane. This layer keeps civilization intelligence, web services, and robot execution separated while providing a deterministic bridge to ROS 2 and NVIDIA Isaac.

## Architecture

```text
HoloKai Oracle / Agents / Memory / Knowledge Graph
                     |
              Embodied Task Contract
                     |
              Robotics BFF Gateway
                     |
              ROS 2 / DDS boundary
                     |
        +------------+-------------+
        |                          |
    Isaac ROS                 Isaac Sim / Lab
 perception, SLAM,            simulation, data,
 mapping, pose, nav           robot learning
        |                          |
        +------------+-------------+
                     |
              Physical Robot
```

## Design rules

1. The LLM never emits motor-level commands.
2. Cognitive plans use versioned, schema-validated task contracts.
3. `safety_gateway` is deterministic and sits between cognition and execution.
4. ROS 2 is the embodiment boundary; the web/BFF layer never imports ROS libraries.
5. Isaac Sim is the first target for validation; physical hardware follows simulation and hardware-in-the-loop gates.
6. Cultural provenance and epistemic classification travel with semantic tasks and observations.

## Initial implementation

- `contracts/embodied_action.schema.json` — task/action contract.
- `ros2/src/holokai_embodied` — ROS 2 package boundary.
- `apps/bff/src/routes/robotics.ts` — HTTP gateway for task submission and robot state.
- `robotics/isaac/` — reserved for Isaac Sim/Isaac Lab scenes, assets, policies, and deployment manifests.

## NVIDIA alignment

The integration is intentionally compatible with NVIDIA Isaac ROS, Isaac Sim, and Isaac Lab. Isaac ROS handles accelerated ROS 2 perception/navigation workloads; Isaac Sim provides the digital-twin and simulation environment; Isaac Lab is reserved for scalable robot-learning workflows.

## Local development

The web monorepo can be developed without an NVIDIA GPU. Robotics services are optional until an Isaac/ROS 2 host is available.

For a robotics host, install the NVIDIA-supported Isaac/ROS 2 environment first, then build this package in the ROS workspace:

```bash
cd robotics/ros2
colcon build --symlink-install
source install/setup.bash
ros2 launch holokai_embodied holokai_embodied.launch.py
```

The package intentionally does not vendor Isaac ROS. NVIDIA's upstream packages remain the source of truth and are consumed by the robotics host.
