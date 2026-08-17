from launch import LaunchDescription
from launch_ros.actions import Node


def generate_launch_description():
    return LaunchDescription([
        Node(package='holokai_embodied', executable='cognitive_bridge', name='holokai_cognitive_bridge', output='screen'),
        Node(package='holokai_embodied', executable='safety_gateway', name='holokai_safety_gateway', output='screen'),
        Node(package='holokai_embodied', executable='semantic_perception_bridge', name='holokai_semantic_perception_bridge', output='screen'),
        Node(package='holokai_embodied', executable='multimodal_resolver', name='holokai_multimodal_resolver', output='screen'),
        Node(package='holokai_embodied', executable='artifact_intelligence', name='holokai_artifact_intelligence', output='screen'),
        Node(package='holokai_embodied', executable='world_model_bridge', name='holokai_world_model_bridge', output='screen'),
        Node(package='holokai_embodied', executable='world_model', name='holokai_world_model', output='screen'),
    ])
