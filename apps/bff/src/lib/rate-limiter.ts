/**
 * Wave 7D Task 116: Rate Limiting
 * 100 requests/min per IP, specific limits per endpoint
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

export interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

/**
 * Default rate limiter: 100 requests per minute per IP
 */
export const defaultRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skipFailedRequests: false
});

/**
 * Strict rate limiter for expensive operations: 10 requests per minute
 */
export const strictRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Too many requests for this operation. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Lenient rate limiter for read operations: 200 requests per minute
 */
export const lenientRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Too many read requests. Please slow down.',
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * API-specific rate limiters
 */
export const apiRateLimiters = {
  // Oracle query: 30 requests per minute
  oracle: rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: 'Too many Oracle queries. Please wait before asking another question.',
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Voice synthesis: 10 requests per minute (already implemented in oracle.ts)
  voice: rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Too many voice synthesis requests. Please wait before trying again.',
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Transcription: 20 requests per minute
  transcribe: rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many transcription requests. Please wait before trying again.',
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Document upload: 5 requests per minute
  upload: rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many upload requests. Please wait before uploading another document.',
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Commerce checkout: 3 requests per minute
  checkout: rateLimit({
    windowMs: 60 * 1000,
    max: 3,
    message: 'Too many checkout attempts. Please wait before trying again.',
    standardHeaders: true,
    legacyHeaders: false
  }),

  // Identity operations: 20 requests per minute
  identity: rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many identity operations. Please wait before trying again.',
    standardHeaders: true,
    legacyHeaders: false
  })
};

/**
 * Custom rate limiter with dynamic limits based on user tier
 */
export function createTierBasedRateLimiter(getUserTier: (req: Request) => Promise<string>) {
  return async (req: Request, res: Response, next: any) => {
    const tier = await getUserTier(req);

    let maxRequests: number;
    switch (tier) {
      case 'enterprise':
        maxRequests = 500; // Enterprise: 500 requests/min
        break;
      case 'pro':
        maxRequests = 200; // Pro: 200 requests/min
        break;
      case 'free':
      default:
        maxRequests = 100; // Free: 100 requests/min
        break;
    }

    const tierLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: maxRequests,
      message: `Rate limit exceeded for ${tier} tier. Please upgrade for higher limits.`,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req: Request) => {
        return req.ip || 'unknown';
      }
    });

    return tierLimiter(req, res, next);
  };
}

/**
 * Rate limiter for authenticated users (higher limits)
 */
export const authenticatedRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200, // 200 requests per minute for authenticated users
  message: 'Too many requests. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    // Use user ID if available, otherwise IP
    return (req as any).auth?.userId || req.ip || 'unknown';
  },
  skip: (req: Request) => {
    // Skip rate limiting for authenticated users with enterprise tier
    const userTier = (req as any).auth?.tier;
    return userTier === 'enterprise';
  }
});

/**
 * Rate limiter for public endpoints (lower limits)
 */
export const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50, // 50 requests per minute for public endpoints
  message: 'Too many requests from this IP. Please wait before trying again.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => req.ip || 'unknown'
});

/**
 * Sliding window rate limiter (more accurate than fixed window)
 */
export class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;

    // Clean up old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this key
    let timestamps = this.requests.get(key) || [];

    // Remove requests outside the window
    timestamps = timestamps.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      return false;
    }

    // Add current request
    timestamps.push(now);
    this.requests.set(key, timestamps);

    return true;
  }

  getRemainingRequests(key: string): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    const timestamps = this.requests.get(key) || [];
    const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
    return Math.max(0, this.maxRequests - validTimestamps.length);
  }

  getResetTime(key: string): number {
    const timestamps = this.requests.get(key);
    if (!timestamps || timestamps.length === 0) {
      return Date.now();
    }
    return timestamps[0] + this.windowMs;
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    for (const [key, timestamps] of this.requests.entries()) {
      const validTimestamps = timestamps.filter(timestamp => timestamp > windowStart);
      if (validTimestamps.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validTimestamps);
      }
    }
  }
}

/**
 * Express middleware for sliding window rate limiter
 */
export function slidingWindowRateLimit(windowMs: number, maxRequests: number) {
  const limiter = new SlidingWindowRateLimiter(windowMs, maxRequests);

  return (req: Request, res: Response, next: any) => {
    const key = req.ip || 'unknown';

    if (!limiter.isAllowed(key)) {
      const remaining = limiter.getRemainingRequests(key);
      const resetTime = limiter.getResetTime(key);

      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());

      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please wait before trying again.',
        retryAfter: Math.ceil((limiter.getResetTime(key) - Date.now()) / 1000)
      });
    }

    res.setHeader('X-RateLimit-Limit', maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', limiter.getRemainingRequests(key).toString());
    res.setHeader('X-RateLimit-Reset', new Date(limiter.getResetTime(key)).toISOString());

    next();
  };
}
