from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, LogInfo
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    image_topic = LaunchConfiguration('image_topic')
    depth_topic = LaunchConfiguration('depth_topic')
    camera_info_topic = LaunchConfiguration('camera_info_topic')
    detections_topic = LaunchConfiguration('detections_topic')
    pose_topic = LaunchConfiguration('pose_topic')

    return LaunchDescription([
        DeclareLaunchArgument('image_topic', default_value='/front_stereo_camera/left/image_rect_color'),
        DeclareLaunchArgument('depth_topic', default_value='/front_stereo_camera/depth'),
        DeclareLaunchArgument('camera_info_topic', default_value='/front_stereo_camera/left/camera_info'),
        DeclareLaunchArgument('detections_topic', default_value='/isaac_ros/rtdetr/detections'),
        DeclareLaunchArgument('pose_topic', default_value='/isaac_ros/foundationpose/poses'),
        LogInfo(msg='HoloKai Semantic Perception v2.1: RT-DETR + FoundationPose + multimodal artifact resolver'),
        Node(
            package='holokai_embodied',
            executable='isaac_ros_artifact_adapter',
            name='holokai_isaac_ros_artifact_adapter',
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
            executable='multimodal_resolver',
            name='holokai_multimodal_resolver',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='artifact_intelligence',
            name='holokai_artifact_intelligence',
            output='screen',
        ),
        Node(
            package='holokai_embodied',
            executable='world_model_bridge',
            name='holokai_world_model_bridge',
            output='screen',
        ),
    ])
