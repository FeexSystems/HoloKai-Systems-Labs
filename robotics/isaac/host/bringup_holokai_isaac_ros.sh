#!/usr/bin/env bash
set -euo pipefail

# HoloKai Physical AI runtime bring-up.
# Host baseline: Ubuntu 24.04 + ROS 2 Jazzy + NVIDIA Isaac ROS + Isaac Sim 6.x.
# Isaac Sim remains a separate process; this script prepares the ROS 2 side.

: "${ISAAC_ROS_WS:=${HOME}/workspaces/isaac_ros-dev}"
: "${ROS_DOMAIN_ID:=0}"
export ROS_DOMAIN_ID

if ! command -v isaac-ros >/dev/null 2>&1; then
  echo "isaac-ros CLI not found. Install/initialize the NVIDIA Isaac ROS environment first." >&2
  exit 2
fi

isaac-ros activate

cd "${ISAAC_ROS_WS}"
source /opt/ros/jazzy/setup.bash
[ -f install/setup.bash ] && source install/setup.bash

colcon build --symlink-install --packages-select holokai_embodied
source install/setup.bash

if ! ros2 pkg prefix isaac_ros_visual_slam >/dev/null 2>&1; then
  echo "isaac_ros_visual_slam is not installed in the active ROS environment." >&2
  echo "Install the NVIDIA Jazzy Debian package or build the upstream package before continuing." >&2
  exit 3
fi

# Terminal A: HoloKai bridges + deterministic world model.
ros2 launch holokai_embodied holokai_isaac_ros.launch.py enable_isaac_ros:=true &
HOLOKAI_BRIDGE_PID=$!

cleanup() {
  kill "${HOLOKAI_BRIDGE_PID}" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Terminal B/C should run the NVIDIA perception graphs. These are intentionally
# separate so failures in an NVIDIA graph cannot terminate HoloKai's world model.
echo
cat <<'EOF'
HoloKai ROS runtime is ready.

In another Isaac ROS terminal:

  isaac-ros activate
  cd "${ISAAC_ROS_WS}"
  source install/setup.bash

Visual SLAM (stereo + IMU):
  ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py \
    num_cameras:=2 \
    enable_imu_fusion:=True \
    base_frame:=base_link \
    camera_optical_frames:="['camera_left_optical_frame','camera_right_optical_frame']"

Nvblox (use the Isaac Sim example as the NVIDIA reference pipeline):
  ros2 launch nvblox_examples_bringup isaac_sim_example.launch.py navigation:=False

Then open Isaac Sim, load:
  robotics/isaac/sim/scenes/holokai_lab.usda

Enable the ROS 2 bridge, run:
  robotics/isaac/sim/scripts/configure_holokai_ros2_graph.py

Press Play in Isaac Sim and verify:
  ros2 topic list
  ros2 topic hz /visual_slam/image_0
  ros2 topic hz /visual_slam/image_1
  ros2 topic hz /visual_slam/imu
  ros2 topic echo /visual_slam/tracking/odometry --once
  ros2 topic echo /holokai/world/state --once
EOF

wait "${HOLOKAI_BRIDGE_PID}"
