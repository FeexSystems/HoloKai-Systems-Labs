/**
 * Planetary UI Zero-Request Navigation Cache
 * Pre-streams HTML & API data payloads into memory / CacheStorage before navigation events.
 */
export class ZeroRequestNavigationCache {
  private static instance: ZeroRequestNavigationCache;
  private cache: Map<string, { payload: unknown; timestamp: number }> = new Map();

  private constructor() {}

  public static getInstance(): ZeroRequestNavigationCache {
    if (!ZeroRequestNavigationCache.instance) {
      ZeroRequestNavigationCache.instance = new ZeroRequestNavigationCache();
    }
    return ZeroRequestNavigationCache.instance;
  }

  public prefetchApiRoute(route: string, fetcher: () => Promise<unknown>): void {
    if (this.cache.has(route)) return;

    fetcher().then((data) => {
      this.cache.set(route, { payload: data, timestamp: Date.now() });
      console.log(`[Zero-Request Cache] Pre-warmed route payload for "${route}" (0ms navigation state ready)`);
    }).catch((err) => {
      console.warn(`[Zero-Request Cache] Pre-fetch failed for "${route}":`, err);
    });
  }

  public getCachedRoutePayload<T = unknown>(route: string): T | null {
    const entry = this.cache.get(route);
    if (!entry) return null;

    // Cache valid for 5 minutes
    if (Date.now() - entry.timestamp > 300000) {
      this.cache.delete(route);
      return null;
    }

    return entry.payload as T;
  }
}

export const zeroRequestCache = ZeroRequestNavigationCache.getInstance();
