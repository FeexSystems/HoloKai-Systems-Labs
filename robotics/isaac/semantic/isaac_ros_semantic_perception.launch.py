from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, LogInfo
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():
    return LaunchDescription([
        DeclareLaunchArgument('image_topic', default_value='/front_stereo_camera/left/image_rect_color'),
        DeclareLaunchArgument('depth_topic', default_value='/front_stereo_camera/depth'),
        DeclareLaunchArgument('camera_info_topic', default_value='/front_stereo_camera/left/camera_info'),
        DeclareLaunchArgument('detections_topic', default_value='/holokai/perception/detections'),
        DeclareLaunchArgument('pose_topic', default_value='/foundationpose/pose'),
        LogInfo(msg='HoloKai Semantic Perception v2: Isaac ROS detector + FoundationPose boundary'),
        Node(package='holokai_embodied', executable='semantic_perception_bridge', name='holokai_semantic_perception_bridge', output='screen'),
        Node(package='holokai_embodied', executable='entity_resolver', name='holokai_entity_resolver', output='screen'),
    ])
