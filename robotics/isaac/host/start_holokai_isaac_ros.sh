#!/usr/bin/env bash
set -euo pipefail

# HoloKai does not own the NVIDIA Isaac ROS installation. This script expects
# an NVIDIA-supported Isaac ROS CLI environment to be installed on the host.

: "${ISAAC_ROS_WS:=$HOME/workspaces/isaac_ros-dev}"
: "${ROS_DISTRO:=jazzy}"

if ! command -v isaac-ros >/dev/null 2>&1; then
  echo "ERROR: isaac-ros CLI not found. Install the current NVIDIA Isaac ROS environment first." >&2
  exit 1
fi

if [[ ! -d "$ISAAC_ROS_WS" ]]; then
  echo "ERROR: ISAAC_ROS_WS does not exist: $ISAAC_ROS_WS" >&2
  exit 1
fi

export ROS_DISTRO
export RMW_IMPLEMENTATION="${RMW_IMPLEMENTATION:-rmw_fastrtps_cpp}"

cd "$ISAAC_ROS_WS"
echo "Activating NVIDIA Isaac ROS environment..."
echo "Run: isaac-ros activate"
echo
printf '%s\n' \
  "After activation, build/source the HoloKai workspace and run:" \
  "  colcon build --symlink-install --packages-select holokai_embodied" \
  "  source install/setup.bash" \
  "  ros2 launch holokai_embodied holokai_isaac_ros.launch.py" \
  "" \
  "Then start NVIDIA perception with:" \
  "  ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py" \
  "" \
  "For Isaac Sim spatial reconstruction:" \
  "  ros2 launch nvblox_examples_bringup isaac_sim_example.launch.py navigation:=False"
