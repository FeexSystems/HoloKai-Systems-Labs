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
        DeclareLaunchArgument('detections_topic', default_value='/holokai/perception/detections'),
        DeclareLaunchArgument('pose_topic', default_value='/foundationpose/pose'),
        LogInfo(msg='HoloKai Semantic Perception v2: Isaac ROS detector + pose grounding boundary'),
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
    ])
