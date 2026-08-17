"""HTTP <-> ROS 2 gateway for the HoloKai Physical AI plane.

Runs on the same robotics host as ROS 2. The web BFF never imports rclpy;
it calls this small gateway over HTTP instead.
"""

from __future__ import annotations

import asyncio
import json
import os
import threading
from typing import Any

import rclpy
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from rclpy.node import Node
from std_msgs.msg import String
import uvicorn


class TaskRequest(BaseModel):
    taskId: str | None = None
    intent: str
    target: dict[str, Any]
    constraints: dict[str, Any]
    requiredCapabilities: list[str] = Field(default_factory=list)
    provenance: dict[str, Any]
    metadata: dict[str, Any] = Field(default_factory=dict)


class RosBridgeNode(Node):
    def __init__(self) -> None:
        super().__init__('holokai_http_gateway')
        self.task_pub = self.create_publisher(String, '/holokai/task/request', 10)
        self._lock = threading.Lock()
        self._world: dict[str, Any] = {
            'schemaVersion': '1.0',
            'source': 'holokai-http-gateway',
            'entityCount': 0,
            'entities': [],
            'robot': {'pose': None},
        }
        self.world_sub = self.create_subscription(
            String, '/holokai/world/state', self._world_callback, 10
        )

    def _world_callback(self, message: String) -> None:
        try:
            state = json.loads(message.data)
        except json.JSONDecodeError:
            self.get_logger().warning('Ignoring malformed world-state JSON')
            return
        with self._lock:
            self._world = state

    def world(self) -> dict[str, Any]:
        with self._lock:
            return dict(self._world)

    def submit(self, task: TaskRequest) -> dict[str, Any]:
        message = String()
        message.data = task.model_dump_json(exclude_none=True)
        self.task_pub.publish(message)
        return {'accepted': True, 'taskId': task.taskId, 'transport': 'ros2'}


app = FastAPI(title='HoloKai Robotics Gateway', version='0.1.0')
node: RosBridgeNode | None = None


@app.get('/health')
def health() -> dict[str, str]:
    return {'status': 'ok', 'service': 'holokai-robotics-gateway'}


@app.get('/v1/world')
def world() -> dict[str, Any]:
    if node is None:
        raise HTTPException(status_code=503, detail='ROS bridge not initialized')
    return node.world()


@app.post('/v1/tasks')
def task(request: TaskRequest) -> dict[str, Any]:
    if node is None:
        raise HTTPException(status_code=503, detail='ROS bridge not initialized')
    return node.submit(request)


def ros_spin() -> None:
    rclpy.spin(node)


def main() -> None:
    global node
    rclpy.init()
    node = RosBridgeNode()
    thread = threading.Thread(target=ros_spin, daemon=True)
    thread.start()
    try:
        uvicorn.run(
            app,
            host=os.getenv('HOLOKAI_ROBOTICS_GATEWAY_HOST', '0.0.0.0'),
            port=int(os.getenv('HOLOKAI_ROBOTICS_GATEWAY_PORT', '8787')),
        )
    finally:
        node.destroy_node()
        rclpy.shutdown()
        thread.join(timeout=2)


if __name__ == '__main__':
    main()
