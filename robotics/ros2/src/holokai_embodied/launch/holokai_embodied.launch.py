from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import SetEnvironmentVariable


def generate_launch_description():
    return LaunchDescription([
        SetEnvironmentVariable(
            name='HOLOKAI_ENGINE_PATH',
            value='${HOLOKAI_ENGINE_PATH}',
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
            executable='semantic_perception_bridge',
            name='holokai_semantic_perception_bridge',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='entity_resolver',
            name='holokai_entity_resolver',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='world_model_bridge',
            name='holokai_world_model_bridge',
            output='screen',
        ),
    ])
