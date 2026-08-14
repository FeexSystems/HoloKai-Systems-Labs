/**
 * Wave 7D Task 119: Implement CORS
 * Whitelist trusted origins only
 */

import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

/**
 * Trusted origins configuration
 * In production, these should come from environment variables
 */
const TRUSTED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'https://holokai.com',
  'https://www.holokai.com',
  'https://app.holokai.com',
  'https://*.holokai.com'
].concat(
  process.env.ALLOWED_ORIGINS?.split(',').filter(Boolean) || []
);

/**
 * Check if origin is trusted
 */
function isTrustedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;

  // Exact match
  if (TRUSTED_ORIGINS.includes(origin)) {
    return true;
  }

  // Wildcard match
  for (const trustedOrigin of TRUSTED_ORIGINS) {
    if (trustedOrigin.includes('*')) {
      const pattern = trustedOrigin.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(origin)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * CORS configuration
 */
export const corsConfig = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (isTrustedOrigin(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from untrusted origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-ID',
    'X-Response-Time'
  ],
  maxAge: 86400 // 24 hours
};

/**
 * CORS middleware
 */
export const corsMiddleware = cors(corsConfig);

/**
 * Strict CORS for sensitive endpoints
 */
export const strictCorsConfig = {
  ...corsConfig,
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Only allow same-origin for sensitive endpoints
    if (!origin) {
      return callback(null, false);
    }

    const serverOrigin = process.env.SERVER_ORIGIN || 'https://holokai.com';
    if (origin === serverOrigin || origin === 'http://localhost:3000') {
      callback(null, true);
    } else {
      callback(new Error('Strict CORS: Only same-origin requests allowed'));
    }
  }
};

export const strictCorsMiddleware = cors(strictCorsConfig);

/**
 * Add CORS headers to response
 */
export function addCorsHeaders(req: Request, res: Response, next: NextFunction) {
  const origin = req.get('Origin');

  if (origin && isTrustedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Vary', 'Origin');
  }

  next();
}

/**
 * Preflight request handler
 */
export function handlePreflight(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.status(204).end();
}

/**
 * CORS error handler
 */
export function corsErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err.message === 'Not allowed by CORS' || err.message === 'Strict CORS: Only same-origin requests allowed') {
    res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed by CORS policy'
    });
    return;
  }
  next(err);
}
