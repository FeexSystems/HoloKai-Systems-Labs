#!/usr/bin/env python3
"""Run the HoloKai semantic perception -> entity resolution -> world model chain.

This development runner avoids requiring a rebuilt ROS package while the Isaac
integration is being iterated. Run from the repository root after sourcing ROS 2.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

import rclpy
from rclpy.executors import MultiThreadedExecutor


REPO_ROOT = Path(__file__).resolve().parents[3]
ROS_PACKAGE_ROOT = REPO_ROOT / 'robotics' / 'ros2' / 'src' / 'holokai_embodied'
ENGINE_ROOT = REPO_ROOT / 'services' / 'python-engine'

sys.path.insert(0, str(ROS_PACKAGE_ROOT))
os.environ.setdefault('HOLOKAI_ENGINE_PATH', str(ENGINE_ROOT))

from holokai_embodied.semantic_perception_bridge import SemanticPerceptionBridge
from holokai_embodied.entity_resolver import KnowledgeEntityResolver
from holokai_embodied.world_model_bridge import WorldModelBridge


def main() -> None:
    rclpy.init()
    nodes = [
        SemanticPerceptionBridge(),
        KnowledgeEntityResolver(),
        WorldModelBridge(),
    ]
    executor = MultiThreadedExecutor(num_threads=3)
    for node in nodes:
        executor.add_node(node)
    try:
        executor.spin()
    finally:
        for node in nodes:
            executor.remove_node(node)
            node.destroy_node()
        rclpy.shutdown()


if __name__ == '__main__':
    main()
