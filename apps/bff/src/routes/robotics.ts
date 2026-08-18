import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';

const router = Router();

const epistemic = z.enum([
  'ESTABLISHED',
  'SCHOLARLY_DEBATE',
  'TRADITION',
  'ESOTERIC',
  'SPECULATIVE',
  'FICTIONAL',
]);

const taskSchema = z.object({
  taskId: z.string().min(1).optional(),
  intent: z.enum(['observe', 'inspect', 'navigate', 'approach', 'pick', 'place', 'follow', 'return_home', 'stop']),
  target: z.object({
    entityId: z.string().min(1),
    semanticType: z.string().min(1),
    locationFrame: z.string().optional(),
    pose: z.record(z.string(), z.number()).optional(),
  }),
  constraints: z.object({
    maxLinearVelocity: z.number().min(0).max(3),
    maxAngularVelocity: z.number().min(0).max(6.28),
    humanProximityMeters: z.number().min(0),
    allowManipulation: z.boolean(),
    allowedWorkspace: z.string().optional(),
  }),
  requiredCapabilities: z.array(z.string()).default([]),
  provenance: z.object({
    source: z.string().min(1),
    epistemicStance: epistemic,
    confidence: z.number().min(0).max(1),
    evidenceIds: z.array(z.string()).default([]),
  }),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

function gatewayUrl(): string | null {
  return process.env.HOLOKAI_ROBOTICS_GATEWAY_URL?.replace(/\/$/, '') || null;
}

router.get('/status', async (_req: Request, res: Response) => {
  const base = gatewayUrl();
  if (!base) {
    return res.json({
      available: false,
      mode: 'unconfigured',
      message: 'Robotics gateway is not configured. Web services remain independent of ROS/Isaac hosts.',
    });
  }

  try {
    const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(1500) });
    return res.status(response.ok ? 200 : 503).json({
      available: response.ok,
      mode: process.env.HOLOKAI_ROBOTICS_MODE || 'isaac',
      gateway: base,
    });
  } catch {
    return res.status(503).json({
      available: false,
      mode: process.env.HOLOKAI_ROBOTICS_MODE || 'isaac',
      gateway: base,
    });
  }
});

router.post('/tasks', async (req: Request, res: Response) => {
  const parsed = taskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_embodied_task', details: parsed.error.flatten() });
  }

  const base = gatewayUrl();
  if (!base) {
    return res.status(503).json({
      error: 'robotics_gateway_unconfigured',
      taskId: parsed.data.taskId || randomUUID(),
      hint: 'Configure HOLOKAI_ROBOTICS_GATEWAY_URL on the BFF host before enabling robot execution.',
    });
  }

  const task = { ...parsed.data, taskId: parsed.data.taskId || randomUUID() };

  try {
    const response = await fetch(`${base}/v1/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(task),
      signal: AbortSignal.timeout(3000),
    });
    const body = await response.json().catch(() => ({}));
    return res.status(response.status).json(body);
  } catch (error) {
    return res.status(502).json({
      error: 'robotics_gateway_unreachable',
      taskId: task.taskId,
      detail: error instanceof Error ? error.message : 'unknown error',
    });
  }
});

router.get('/world', async (_req: Request, res: Response) => {
  const base = gatewayUrl();
  if (!base) return res.status(503).json({ error: 'robotics_gateway_unconfigured' });

  try {
    const response = await fetch(`${base}/v1/world`, { signal: AbortSignal.timeout(2000) });
    const body = await response.json().catch(() => ({}));
    return res.status(response.status).json(body);
  } catch {
    return res.status(502).json({ error: 'robotics_gateway_unreachable' });
  }
});

router.get('/stream', async (req: Request, res: Response) => {
  const base = gatewayUrl();
  if (!base) {
    res.status(503).json({ error: 'robotics_gateway_unconfigured' });
    return;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const response = await fetch(`${base}/stream`);
    
    if (!response.ok || !response.body) {
      res.write(`data: ${JSON.stringify({ error: 'stream_unavailable' })}\n\n`);
      res.end();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    req.on('close', () => {
      reader.cancel();
    });

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: 'stream_error', detail: error instanceof Error ? error.message : 'unknown error' })}\n\n`);
    res.end();
  }
});

export { router as roboticsRouter };
