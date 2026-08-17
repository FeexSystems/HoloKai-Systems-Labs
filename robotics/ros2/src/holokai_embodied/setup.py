from setuptools import setup

package_name = 'holokai_embodied'

setup(
    name=package_name,
    version='0.1.0',
    packages=[package_name],
    data_files=[
        ('share/ament_index/resource_index/packages', ['resource/' + package_name]),
        ('share/' + package_name, ['package.xml']),
        ('share/' + package_name + '/launch', ['launch/holokai_embodied.launch.py']),
    ],
    install_requires=['setuptools'],
    zip_safe=True,
    description='HoloKai embodied intelligence bridge for ROS 2 and NVIDIA Isaac.',
    license='MIT',
    entry_points={
        'console_scripts': [
            'cognitive_bridge = holokai_embodied.cognitive_bridge:main',
            'safety_gateway = holokai_embodied.safety_gateway:main',
            'world_model_bridge = holokai_embodied.world_model_bridge:main',
        ],
    },
)
