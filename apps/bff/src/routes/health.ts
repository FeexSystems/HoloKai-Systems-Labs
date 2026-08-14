import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'HoloKai Planetary BFF API Gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

healthRouter.get('/ready', (req, res) => {
  res.json({
    ready: true,
    services: {
      gateway: 'HEALTHY',
      oracle: 'HEALTHY',
      vectorStore: 'READY',
    },
  });
});
