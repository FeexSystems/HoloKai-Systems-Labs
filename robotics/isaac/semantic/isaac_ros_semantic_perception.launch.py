from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument, LogInfo
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node


def generate_launch_description():

    return LaunchDescription([
        DeclareLaunchArgument('image_topic', default_value='/front_stereo_camera/left/image_rect_color'),
        DeclareLaunchArgument('depth_topic', default_value='/front_stereo_camera/depth'),
        DeclareLaunchArgument('camera_info_topic', default_value='/front_stereo_camera/left/camera_info'),
