import asyncio
import json
import random
import time
from aiohttp import web

# Mock telemetry state
joint_states = {
    "shoulder_pan": 0.0,
    "shoulder_lift": -0.5,
    "elbow": 1.0,
    "wrist_1": -1.5,
    "wrist_2": -1.5,
    "wrist_3": 0.0
}

async def sse_handler(request):
    response = web.StreamResponse(
        status=200,
        reason='OK',
        headers={
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        }
    )
    await response.prepare(request)

    print("Client connected to SSE perception stream.")
    
    try:
        while True:
            # Simulate slight joint movements
            for joint in joint_states:
                joint_states[joint] += random.uniform(-0.05, 0.05)
            
            # Simulate RT-DETR bounding boxes
            objects = []
            if random.random() > 0.3:
                objects.append({
                    "id": "obj_001",
                    "label": "Coffee Mug",
                    "confidence": round(random.uniform(0.7, 0.99), 2),
                    "bbox": [random.randint(100, 200), random.randint(100, 200), 150, 150]
                })
            if random.random() > 0.6:
                objects.append({
                    "id": "obj_002",
                    "label": "Research Document",
                    "confidence": round(random.uniform(0.6, 0.95), 2),
                    "bbox": [random.randint(300, 400), random.randint(200, 300), 200, 100]
                })

            payload = {
                "timestamp": time.time(),
                "joints": joint_states,
                "objects": objects,
                "status": "active"
            }
            
            await response.write(f"data: {json.dumps(payload)}\n\n".encode('utf-8'))
            await asyncio.sleep(0.5)  # 2 Hz update rate
    except asyncio.CancelledError:
        print("Client disconnected.")
        raise
    finally:
        return response

async def health_check(request):
    return web.json_response({"status": "ok", "service": "mock_perception_stream"})

async def world_state(request):
    return web.json_response({
        "entities": [
            {"id": "e1", "type": "artifact", "name": "Coffee Mug"},
            {"id": "e2", "type": "document", "name": "Research Document"}
        ]
    })

app = web.Application()
app.router.add_get('/stream', sse_handler)
app.router.add_get('/health', health_check)
app.router.add_get('/v1/world', world_state)

if __name__ == '__main__':
    print("Starting Mock Perception Stream (GR00T/Isaac Sim) on port 8001...")
    web.run_app(app, port=8001)
