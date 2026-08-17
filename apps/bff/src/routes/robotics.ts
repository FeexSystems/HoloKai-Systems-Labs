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
  'UNKNOWN',
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

const resolveSchema = z.object({
  observation: z.object({
    confidence: z.number().min(0).max(1),
    label: z.string().optional(),
    semanticType: z.string().optional(),
    bbox: z.record(z.string(), z.unknown()).optional(),
    pose6d: z.record(z.string(), z.unknown()).optional(),
    frameId: z.string().optional(),
  }),
  vector: z.array(z.object({
    candidateId: z.string(),
    score: z.number(),
    status: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
  graph: z.array(z.object({
    candidateId: z.string(),
    score: z.number(),
    status: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
  metadata: z.array(z.object({
    candidateId: z.string(),
    score: z.number(),
    status: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
  provenance: z.array(z.object({
    candidateId: z.string(),
    score: z.number(),
    status: z.string().optional(),
    payload: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
  resolvedThreshold: z.number().optional(),
  ambiguityMargin: z.number().optional(),
  conflictPenaltyWeight: z.number().optional(),
});

function gatewayUrl(): string | null {
  return process.env.HOLOKAI_ROBOTICS_GATEWAY_URL?.replace(/\/$/, '') || null;
}

function pythonEngineUrl(): string | null {
  return process.env.HOLOKAI_ENGINE_URL?.replace(/\/$/, '') || 'http://localhost:8000';
}

router.get('/status', async (_req: Request, res: Response) => {
  const base = gatewayUrl();
  if (!base) {
    return res.json({
      available: false,
      mode: 'unconfigured',
      worldModelVersion: 'v1.0',
      perceptionVersion: 'v2.2',
      message: 'Robotics gateway is not configured. Web services remain independent of ROS/Isaac hosts.',
    });
  }

  try {
    const response = await fetch(`${base}/health`, { signal: AbortSignal.timeout(1500) });
    return res.status(response.ok ? 200 : 503).json({
      available: response.ok,
      mode: process.env.HOLOKAI_ROBOTICS_MODE || 'isaac',
      gateway: base,
      worldModelVersion: 'v1.0',
      perceptionVersion: 'v2.2',
    });
  } catch {
    return res.status(503).json({
      available: false,
      mode: process.env.HOLOKAI_ROBOTICS_MODE || 'isaac',
      gateway: base,
      worldModelVersion: 'v1.0',
      perceptionVersion: 'v2.2',
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
<<<<<<< Updated upstream
  const base = gatewayUrl();
  if (base) {
    try {
      const response = await fetch(`${base}/v1/world`, { signal: AbortSignal.timeout(2000) });
      if (response.ok) {
        const body = await response.json();
        return res.json(body);
      }
    } catch {
      // Fall through to cognitive engine
    }
  }

  // Fallback to python engine or local memory store
  const engine = pythonEngineUrl();
  try {
    const response = await fetch(`${engine}/api/world/state`, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch {
    // Return empty deterministic world state
=======
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
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
router.get('/world/observations', async (_req: Request, res: Response) => {
  const engine = pythonEngineUrl();
  try {
    const response = await fetch(`${engine}/api/world/observations`, { signal: AbortSignal.timeout(2000) });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch {
    // Return empty list
  }
  return res.json({ observations: [] });
});

>>>>>>> Stashed changes
router.post('/artifacts/resolve', async (req: Request, res: Response) => {
  const parsed = resolveSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'invalid_resolution_payload', details: parsed.error.flatten() });
  }

  const engine = pythonEngineUrl();
  try {
    const response = await fetch(`${engine}/api/artifacts/resolve`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(3000),
    });
    if (response.ok) {
      const body = await response.json();
      return res.json(body);
    }
  } catch (err) {
    // In-process fallback solver if python engine is temporarily offline
  }

  return res.json({
    status: 'UNRESOLVED',
    entityId: null,
    matchScore: 0.0,
    scores: { perception: parsed.data.observation.confidence },
    evidence: [],
    conflicts: [],
    policyVersion: 'v2.2',
  });
<<<<<<< Updated upstream
=======
>>>>>>> Stashed changes
>>>>>>> Stashed changes
});

export { router as roboticsRouter };
