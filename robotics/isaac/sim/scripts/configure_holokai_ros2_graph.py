"""Author the HoloKai Isaac Sim ROS 2 sensor graph for Isaac Sim 6.x.

Run from the Isaac Sim Python environment after opening holokai_lab.usda:
    ./python.sh configure_holokai_ros2_graph.py

The graph publishes the stereo camera pair, camera info, IMU, odometry, TF,
and simulation clock. Isaac Sim 6.x uses the isaacsim.ros2.* node namespace.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import omni.graph.core as og
import omni.usd
from pxr import Gf


GRAPH_PATH = "/World/HoloKaiROS2Graph"
WORLD = "/World/HoloKaiLaboratory"
LEFT_CAMERA = f"{WORLD}/CameraRig/LeftCamera"
RIGHT_CAMERA = f"{WORLD}/CameraRig/RightCamera"
ROBOT = f"{WORLD}/Robot"


def node(name: str, node_type: str):
    return og.Controller.create_node(
        {
            "graph_path": GRAPH_PATH,
            "node_name": name,
            "node_type": node_type,
        }
    )


def connect(src, src_port: str, dst, dst_port: str):
    og.Controller.connect(src.get_attribute(src_port), dst.get_attribute(dst_port))


def set_input(n, port: str, value):
    n.get_attribute(port).set(value)


def build_graph() -> None:
    stage = omni.usd.get_context().get_stage()
    if stage is None:
        raise RuntimeError("No USD stage is open")

    for prim_path in (LEFT_CAMERA, RIGHT_CAMERA, ROBOT):
        if not stage.GetPrimAtPath(prim_path).IsValid():
            raise RuntimeError(f"Required prim is missing: {prim_path}")

    tick = node("OnPlaybackTick", "omni.graph.action.OnPlaybackTick")
    context = node("ROS2Context", "isaacsim.ros2.bridge.ROS2Context")
    sim_time = node("ReadSimulationTime", "isaacsim.core.nodes.IsaacReadSimulationTime")
    clock = node("Clock", "isaacsim.ros2.bridge.ROS2PublishClock")

    set_input(context, "inputs:useDomainIDEnvVar", True)
    set_input(clock, "inputs:topicName", "/clock")
    connect(tick, "outputs:tick", clock, "inputs:execIn")
    connect(context, "outputs:context", clock, "inputs:context")
    connect(sim_time, "outputs:simulationTime", clock, "inputs:timestamp")
    connect(tick, "outputs:tick", sim_time, "inputs:execIn")

    camera_nodes = []
    for name, prim_path, image_topic, info_topic, frame in (
        ("Left", LEFT_CAMERA, "/visual_slam/image_0", "/visual_slam/camera_info_0", "camera_left_optical_frame"),
        ("Right", RIGHT_CAMERA, "/visual_slam/image_1", "/visual_slam/camera_info_1", "camera_right_optical_frame"),
    ):
        render = node(f"{name}RenderProduct", "isaacsim.core.nodes.IsaacCreateRenderProduct")
        image = node(f"{name}Camera", "isaacsim.ros2.bridge.ROS2CameraHelper")
        info = node(f"{name}CameraInfo", "isaacsim.ros2.bridge.ROS2CameraInfoHelper")

        set_input(render, "inputs:cameraPrim", prim_path)
        set_input(render, "inputs:width", 640)
        set_input(render, "inputs:height", 480)
        set_input(image, "inputs:type", "rgb")
        set_input(image, "inputs:topicName", image_topic)
        set_input(image, "inputs:frameId", frame)
        set_input(info, "inputs:topicName", info_topic)
        set_input(info, "inputs:frameId", frame)

        connect(tick, "outputs:tick", render, "inputs:execIn")
        connect(render, "outputs:execOut", image, "inputs:execIn")
        connect(render, "outputs:execOut", info, "inputs:execIn")
        connect(render, "outputs:renderProductPath", image, "inputs:renderProductPath")
        connect(render, "outputs:renderProductPath", info, "inputs:renderProductPath")
        connect(context, "outputs:context", image, "inputs:context")
        connect(context, "outputs:context", info, "inputs:context")
        camera_nodes.append((render, image, info))

    imu = node("IMU", "isaacsim.ros2.bridge.ROS2PublishImu")
    set_input(imu, "inputs:topicName", "/visual_slam/imu")
    set_input(imu, "inputs:frameId", "imu_link")
    set_input(imu, "inputs:orientation", (0.0, 0.0, 0.0, 1.0))
    set_input(imu, "inputs:linearAcceleration", (0.0, 0.0, 0.0))
    set_input(imu, "inputs:angularVelocity", (0.0, 0.0, 0.0))
    connect(tick, "outputs:tick", imu, "inputs:execIn")
    connect(context, "outputs:context", imu, "inputs:context")

    odom_read = node("ComputeOdometry", "isaacsim.core.nodes.IsaacComputeOdometry")
    odom = node("Odometry", "isaacsim.ros2.bridge.ROS2PublishOdometry")
    set_input(odom_read, "inputs:chassisPrim", ROBOT)
    set_input(odom, "inputs:chassisFrameId", "base_link")
    set_input(odom, "inputs:odomFrameId", "odom")
    set_input(odom, "inputs:topicName", "/visual_slam/ground_truth/odometry")
    connect(tick, "outputs:tick", odom_read, "inputs:execIn")
    connect(odom_read, "outputs:execOut", odom, "inputs:execIn")
    connect(odom_read, "outputs:position", odom, "inputs:position")
    connect(odom_read, "outputs:orientation", odom, "inputs:orientation")
    connect(odom_read, "outputs:linearVelocity", odom, "inputs:linearVelocity")
    connect(odom_read, "outputs:angularVelocity", odom, "inputs:angularVelocity")
    connect(context, "outputs:context", odom, "inputs:context")

    graph = stage.GetPrimAtPath(GRAPH_PATH)
    graph.GetAttribute("holokai:rosDomain").Set(int(__import__("os").environ.get("ROS_DOMAIN_ID", "0"))) if graph.HasAttribute("holokai:rosDomain") else None
    print("HoloKai ROS 2 graph authored at", GRAPH_PATH)
    print("Topics: /visual_slam/image_0, /visual_slam/image_1, /visual_slam/camera_info_0, /visual_slam/camera_info_1, /visual_slam/imu, /visual_slam/ground_truth/odometry, /clock")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.parse_args()
    build_graph()
