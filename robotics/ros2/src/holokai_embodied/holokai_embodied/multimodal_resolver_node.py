from __future__ import annotations

import json
import os
import sys
from typing import Any

import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class MultimodalResolverNode(Node):
    """ROS adapter for the HoloKai PGVector + graph + metadata resolver."""

    def __init__(self) -> None:
        super().__init__('holokai_multimodal_resolver')
        engine_path = os.getenv('HOLOKAI_ENGINE_PATH')
        if engine_path and engine_path not in sys.path:
            sys.path.insert(0, engine_path)
        try:
            from multimodal_artifact_resolver import MultimodalArtifactResolver
            self.resolver = MultimodalArtifactResolver()
            self.ready = True
        except Exception as exc:
            self.resolver = None
            self.ready = False
            self.get_logger().error(f'Multimodal resolver unavailable: {exc}')

        self.pub = self.create_publisher(String, '/holokai/robot/resolved_observation', 20)
        self.sub = self.create_subscription(
            String, '/holokai/robot/observation', self._on_observation, 20
        )

    def _on_observation(self, message: String) -> None:
        try:
            observation = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed robot observation')
            return

        if not self.ready or self.resolver is None:
            return

        entities: list[dict[str, Any]] = []
        for entity in observation.get('entities', []):
            if entity.get('semanticType') not in {
                'cultural_artifact', 'artifact', 'sculpture', 'pottery',
                'textile', 'manuscript', 'inscription', 'architectural_element',
            }:
                entities.append(entity)
                continue

            result = self.resolver.resolve(entity)
            enriched = dict(entity)
            enriched['resolution'] = result
            if result.get('status') == 'RESOLVED' and result.get('entity'):
                resolved = result['entity']
                enriched['resolvedEntity'] = {
                    'name': resolved.get('name'),
                    'civilization': resolved.get('civilization') or resolved.get('knowledge', {}).get('civilization'),
                }
                enriched['entityId'] = resolved.get('entityId', enriched.get('entityId'))
                enriched['knowledge'] = resolved.get('knowledge', {})
                enriched['evidenceIds'] = [
                    str(i) for i, _ in enumerate(resolved.get('evidence', []))
                ]
            entities.append(enriched)

        out = String()
        out.data = json.dumps({
            **observation,
            'entities': entities,
            'provenance': {
                **observation.get('provenance', {}),
                'resolver': 'holokai-multimodal-artifact-resolver-v2.1',
            },
        }, separators=(',', ':'))
        self.pub.publish(out)


def main() -> None:
    rclpy.init()
    node = MultimodalResolverNode()
    try:
        rclpy.spin(node)
    finally:
        node.destroy_node()
        rclpy.shutdown()
