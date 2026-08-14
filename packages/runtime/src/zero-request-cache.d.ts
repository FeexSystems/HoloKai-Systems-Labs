/**
 * Planetary UI Zero-Request Navigation Cache
 * Pre-streams HTML & API data payloads into memory / CacheStorage before navigation events.
 */
export declare class ZeroRequestNavigationCache {
    private static instance;
    private cache;
    private constructor();
    static getInstance(): ZeroRequestNavigationCache;
    prefetchApiRoute(route: string, fetcher: () => Promise<unknown>): void;
    getCachedRoutePayload<T = unknown>(route: string): T | null;
}
export declare const zeroRequestCache: ZeroRequestNavigationCache;
//# sourceMappingURL=zero-request-cache.d.ts.map