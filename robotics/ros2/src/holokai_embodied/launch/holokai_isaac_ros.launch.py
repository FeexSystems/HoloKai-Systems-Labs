from __future__ import annotations

from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, GroupAction
from launch.conditions import IfCondition
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description() -> LaunchDescription:
    enable_isaac_ros = LaunchConfiguration('enable_isaac_ros')
    return LaunchDescription([
        DeclareLaunchArgument(
            'enable_isaac_ros',
            default_value='false',
            description=(
                'Only enable after the NVIDIA Isaac ROS workspace is sourced. '
                'The NVIDIA perception graph is intentionally owned by the Isaac ROS host.'
            ),
        ),
        Node(
            package='holokai_embodied',
            executable='cognitive_bridge',
            name='holokai_cognitive_bridge',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='safety_gateway',
            name='holokai_safety_gateway',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='world_model_bridge',
            name='holokai_world_model_bridge',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='world_model',
            name='holokai_world_model',
            output='screen',
        ),
        GroupAction(
            condition=IfCondition(enable_isaac_ros),
            actions=[
                # Isaac ROS components are deliberately launched by the NVIDIA
                # workspace. This node only validates that the graph is enabled.
                Node(
                    package='holokai_embodied',
                    executable='isaac_ros_guard',
                    name='holokai_isaac_ros_guard',
                    output='screen',
                ),
            ],
        ),
    ])
