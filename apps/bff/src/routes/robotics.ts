import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  EmbodiedActionSchema,
  EmbodiedActionPlanSchema,
  EmbodiedSafetyPolicySchema,
  WorldObservationSchema,
} from '@holokai/contracts';
import { logger } from '../logger.js';

export const roboticsRouter = Router();

const gatewayUrl = () => process.env.ROBOTICS_GATEWAY_URL || 'http://127.0.0.1:8088';
const pythonEngineUrl = () => process.env.PYTHON_ENGINE_URL || 'http://127.0.0.1:8000';

const TaskSubmissionSchema = z.object({
  taskId: z.string().min(1),
  intent: z.enum(['observe', 'inspect', 'navigate', 'compare', 'report', 'manipulate']),
  target: z.object({
    entityId: z.string().min(1),
    semanticType: z.string().min(1),
    locationFrame: z.string().optional(),
    pose: z
      .object({
        x: z.number().optional(),
        y: z.number().optional(),
        z: z.number().optional(),
        qx: z.number().optional(),
        qy: z.number().optional(),
        qz: z.number().optional(),
        qw: z.number().optional(),
        frameId: z.string().optional(),
      })
      .optional(),
  }),
  constraints: z.object({
    maxLinearVelocity: z.number().positive(),
    maxAngularVelocity: z.number().positive(),
    humanProximityMeters: z.number().nonnegative(),
    allowManipulation: z.boolean(),
    allowedWorkspace: z.string().optional(),
  }),
  requiredCapabilities: z.array(z.string()).min(1),
  provenance: z.object({
    source: z.string().min(1),
    epistemicStance: z.string().min(1),
    confidence: z.number().min(0).max(1),
    evidenceIds: z.array(z.string()).min(1),
  }),
  metadata: z.record(z.unknown()).optional(),
});

router.get('/health', async (_req: Request, res: Response) => {
  const base = gatewayUrl();
  if (!base) return res.status(503).json({ error: 'robotics_gateway_unconfigured' });

  try {
    const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(2000) });
    const body = await response.json().catch(() => ({}));
    return res.status(response.status).json(body);
  } catch (error) {
    return res.status(502).json({
      error: 'robotics_gateway_unreachable',
      detail: error instanceof Error ? error.message : 'unknown error',
    });
  }
});

router.post('/tasks', async (req: Request, res: Response) => {
  const parsed = TaskSubmissionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'invalid_task_payload',
      issues: parsed.error.issues,
    });
  }

  const base = gatewayUrl();
  if (!base) return res.status(503).json({ error: 'robotics_gateway_unconfigured' });

  const task = parsed.data;
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
  const engine = pythonEngineUrl();
  try {
    const response = await fetch(`${engine}/api/world/state`, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch {
    // Check gateway
  }

  const base = gatewayUrl();
  if (base) {
    try {
      const response = await fetch(`${base}/v1/world`, { signal: AbortSignal.timeout(2000) });
      const body = await response.json().catch(() => ({}));
      return res.status(response.status).json(body);
    } catch {
      // Fallback
    }
  }

  return res.json({
    schemaVersion: 'v1.0',
    timestamp: new Date().toISOString(),
    source: 'holokai-bff-fallback',
    entityCount: 0,
    observationCount: 0,
    entities: [],
    observations: [],
  });
});

router.get('/world/entities', async (_req: Request, res: Response) => {
  const engine = pythonEngineUrl();
  try {
    const response = await fetch(`${engine}/api/world/entities`, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch {
    // Return empty list
  }
  return res.json({ entities: [] });
});

router.get('/world/artifacts/:id', async (req: Request, res: Response) => {
  const engine = pythonEngineUrl();
  const id = String(req.params.id);
  try {
    const response = await fetch(`${engine}/api/world/artifacts/${encodeURIComponent(id)}`, {
      signal: AbortSignal.timeout(2000),
    });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch {
    // Fallback
  }
  return res.status(404).json({ error: 'artifact_not_found', entityId: id });
});

router.get('/world/observations', async (_req: Request, res: Response) => {
  const engine = pythonEngineUrl();
  try {
    const response = await fetch(`${engine}/api/world/observations`, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch {
    // Fallback
  }
  return res.json({ observations: [] });
});

router.get('/safety/policy', async (_req: Request, res: Response) => {
  const base = gatewayUrl();
  if (!base) return res.status(503).json({ error: 'robotics_gateway_unconfigured' });

  try {
    const response = await fetch(`${base}/v1/safety/policy`, { signal: AbortSignal.timeout(2000) });
    const body = await response.json().catch(() => ({}));
    return res.status(response.status).json(body);
  } catch (error) {
    return res.status(502).json({
      error: 'robotics_gateway_unreachable',
      detail: error instanceof Error ? error.message : 'unknown error',
    });
  }
});
