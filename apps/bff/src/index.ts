import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import helmet from 'helmet';
import { z } from 'zod';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { healthRouter } from './routes/health-enhanced.js';
import { oracleRouter } from './routes/oracle.js';
import { commerceRouter } from './routes/commerce.js';
import { identityRouter } from './routes/identity.js';
import { archiveRouter } from './routes/archive.js';
import { researchRouter } from './routes/research.js';
import { voiceRouter } from './routes/voice.js';
import { transcribeRouter } from './routes/transcribe.js';
import { geminiStreamRouter } from './routes/gemini-stream.js';
import { roboticsRouter } from './routes/robotics.js';

// Middlewares
import { corsMiddleware } from './lib/cors-config.js';
import { errorLoggingMiddleware } from './lib/error-logger.js';
import { compressionMiddleware } from './lib/compression.js';
import { defaultRateLimiter } from './lib/rate-limiter.js';
import { csrfProtection } from './lib/csrf-protection.js';
import { metricsMiddleware } from './lib/metrics-collector.js';

// Environment Validation
const envSchema = z.object({
  PORT: z.string().optional(),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),
  HOLOKAI_ROBOTICS_GATEWAY_URL: z.string().url().optional(),
  HOLOKAI_ROBOTICS_MODE: z.enum(['isaac', 'simulation', 'disabled']).optional(),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Environment validation failed:", error.issues);
    process.exit(1);
  }
}

const app = express();
const DEFAULT_PORT = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(corsMiddleware);
app.use(compressionMiddleware);
app.use(express.json());
app.use(metricsMiddleware);
app.use(defaultRateLimiter);
app.use(csrfProtection());

// Public routes
app.use('/api', healthRouter);
app.use('/api/oracle', oracleRouter);
app.use('/api/archive', archiveRouter);
app.use('/api/research', researchRouter);
app.use('/api/commerce', commerceRouter);
app.use('/api/voice', voiceRouter);
app.use('/api/transcribe', transcribeRouter);
app.use('/api/gemini', geminiStreamRouter);
app.use('/api/robotics', roboticsRouter);

// Protected routes
app.use('/api/identity', ClerkExpressRequireAuth(), identityRouter);

// Error handler for Clerk
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'Unauthenticated') {
    res.status(401).json({ error: 'Unauthenticated' });
  } else {
    next(err);
  }
});

// Global error logging
app.use(errorLoggingMiddleware);

function startServer(port: number) {
  const server = app.listen(port, () => {
    console.log(`🚀 HoloKai Planetary BFF API Gateway running on port ${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is occupied. Attempting fallback port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('BFF Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
