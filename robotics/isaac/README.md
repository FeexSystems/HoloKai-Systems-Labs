# HoloKai × NVIDIA Isaac Runtime

This directory is the physical-AI integration boundary for HoloKai.

## Runtime topology

```text
Isaac Sim
   │ ROS 2 bridge
   ▼
Isaac ROS
   ├─ Visual SLAM
   ├─ Nvblox / spatial reconstruction
   └─ NITROS GPU transport
   │
   ▼
HoloKai ROS 2 workspace
   ├─ cognitive_bridge
   ├─ safety_gateway
   ├─ world_model_bridge
   └─ world_model
   │
   ▼
HoloKai BFF / World Model API
   │
   ▼
Cultural knowledge graph + vector memory
```

## Recommended baseline

Use a Linux NVIDIA GPU workstation. NVIDIA currently recommends ROS 2 Humble or Jazzy for Isaac Sim; HoloKai targets **Jazzy** for its first Physical AI baseline. Isaac ROS provides a CLI-managed development environment and current Jazzy Debian packages for supported components.

## Isaac ROS host setup

The host should own the NVIDIA Isaac ROS workspace; HoloKai should not vendor NVIDIA's stack into this repository.

```bash
export ISAAC_ROS_WS=${HOME}/workspaces/isaac_ros-dev
mkdir -p "$ISAAC_ROS_WS/src"

# Install/activate the current Isaac ROS CLI according to NVIDIA's official guide.
isaac-ros activate

# Inside the Isaac ROS environment, install the current packages used by HoloKai.
sudo apt-get update
sudo apt-get install -y \
  ros-jazzy-isaac-ros-visual-slam \
  ros-jazzy-isaac-ros-nvblox
```

NVIDIA's current Visual SLAM API is `isaac_ros_visual_slam.launch.py`; Nvblox provides an Isaac Sim example through `nvblox_examples_bringup isaac_sim_example.launch.py`.

## HoloKai workspace

```bash
cd "$ISAAC_ROS_WS"
# Clone HoloKai here or mount this repository into the workspace.
colcon build --symlink-install --packages-select holokai_embodied
source install/setup.bash
ros2 launch holokai_embodied holokai_isaac_ros.launch.py
```

## Start Isaac ROS perception

Use NVIDIA's package-specific launch files rather than copying their internals into HoloKai:

```bash
source /opt/ros/jazzy/setup.bash
source "$ISAAC_ROS_WS/install/setup.bash"

ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py
```

For spatial reconstruction with an Isaac Sim sensor scene:

```bash
ros2 launch nvblox_examples_bringup isaac_sim_example.launch.py navigation:=False
```

## Isaac Sim

Enable `isaacsim.ros2.bridge`, source the same ROS 2 distribution before launching Isaac Sim, load the HoloKai USD scene, and press **Play** to activate ROS communication. Isaac Sim's ROS 2 bridge is the transport boundary; HoloKai does not directly import Isaac Sim Python modules.

## NITROS

When image throughput becomes the bottleneck, connect Isaac Sim's NITROS Bridge topics to the Isaac ROS NITROS graph. Keep high-bandwidth image processing inside the NVIDIA graph and publish only the semantic/spatial results required by HoloKai's world model.

## Safety boundary

The LLM never emits motor-level commands. HoloKai emits an embodied task proposal; the deterministic safety gateway validates it; only then can a hardware-specific controller consume the approved action.
