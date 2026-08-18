/**
 * Wave 7C Task 113: Caching Strategy
 * Browser cache products (1 week), articles (1 day)
 */

import { Request, Response, NextFunction } from 'express';

export interface CacheOptions {
  maxAge?: number; // seconds
  sMaxAge?: number; // seconds
  staleWhileRevalidate?: number; // seconds
  staleIfError?: number; // seconds
  public?: boolean;
  private?: boolean;
  noCache?: boolean;
  noStore?: boolean;
  mustRevalidate?: boolean;
  proxyRevalidate?: boolean;
  immutable?: boolean;
}

/**
 * Cache-Control header builder
 */
export class CacheControl {
  static build(options: CacheOptions): string {
    const directives: string[] = [];

    if (options.public) directives.push('public');
    if (options.private) directives.push('private');
    if (options.noCache) directives.push('no-cache');
    if (options.noStore) directives.push('no-store');
    if (options.mustRevalidate) directives.push('must-revalidate');
    if (options.proxyRevalidate) directives.push('proxy-revalidate');

    if (options.maxAge !== undefined) {
      directives.push(`max-age=${options.maxAge}`);
    }

    if (options.sMaxAge !== undefined) {
      directives.push(`s-maxage=${options.sMaxAge}`);
    }

    if (options.staleWhileRevalidate !== undefined) {
      directives.push(`stale-while-revalidate=${options.staleWhileRevalidate}`);
    }

    if (options.staleIfError !== undefined) {
      directives.push(`stale-if-error=${options.staleIfError}`);
    }

    return directives.join(', ');
  }
}

/**
 * Predefined cache policies
 */
export const CachePolicies = {
  // Products change rarely - cache for 1 week
  products: CacheControl.build({
    public: true,
    maxAge: 604800, // 7 days
    sMaxAge: 604800,
    staleWhileRevalidate: 86400 // 1 day
  }),

  // Articles change occasionally - cache for 1 day
  articles: CacheControl.build({
    public: true,
    maxAge: 86400, // 1 day
    sMaxAge: 86400,
    staleWhileRevalidate: 3600 // 1 hour
  }),

  // Static assets - cache for 1 year
  static: CacheControl.build({
    public: true,
    maxAge: 31536000, // 1 year
    immutable: true
  }),

  // API responses - cache for 5 minutes
  api: CacheControl.build({
    public: true,
    maxAge: 300, // 5 minutes
    sMaxAge: 300,
    staleWhileRevalidate: 60
  }),

  // User-specific data - no cache
  private: CacheControl.build({
    private: true,
    noCache: true
  }),

  // Real-time data - no cache
  realtime: CacheControl.build({
    noCache: true,
    noStore: true
  })
};

/**
 * Express middleware for cache control
 */
export function cacheControl(options: CacheOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Cache-Control', CacheControl.build(options));
    next();
  };
}

/**
 * Apply cache policy based on route
 */
export function applyCachePolicy(route: string): string {
  if (route.startsWith('/api/commerce/products')) {
    return CachePolicies.products;
  }
  if (route.startsWith('/api/research/articles')) {
    return CachePolicies.articles;
  }
  if (route.startsWith('/api/archive')) {
    return CachePolicies.articles;
  }
  if (route.startsWith('/api/oracle')) {
    return CachePolicies.realtime;
  }
  if (route.startsWith('/api/identity')) {
    return CachePolicies.private;
  }
  return CachePolicies.api;
}

/**
 * ETag generation for content validation
 */
export function generateETag(content: string): string {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Express middleware for ETag support
 */
export function etagMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;

  res.send = function (this: Response, body: any) {
    if (typeof body === 'string' || Buffer.isBuffer(body)) {
      const etag = generateETag(body.toString());
      res.setHeader('ETag', `"${etag}"`);

      // Check If-None-Match header
      const ifNoneMatch = req.get('If-None-Match');
      if (ifNoneMatch === `"${etag}"`) {
        res.status(304).end();
        return;
      }
    }

    return originalSend.call(this, body);
  };

  next();
}

/**
 * In-memory cache for frequently accessed data
 */
class InMemoryCache {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private readonly DEFAULT_TTL = 60000; // 1 minute

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new InMemoryCache();

// Periodic cleanup
setInterval(() => memoryCache.cleanup(), 60000); // Every minute
