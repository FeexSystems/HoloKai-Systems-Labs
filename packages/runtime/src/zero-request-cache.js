/**
 * Planetary UI Zero-Request Navigation Cache
 * Pre-streams HTML & API data payloads into memory / CacheStorage before navigation events.
 */
export class ZeroRequestNavigationCache {
    static instance;
    cache = new Map();
    constructor() { }
    static getInstance() {
        if (!ZeroRequestNavigationCache.instance) {
            ZeroRequestNavigationCache.instance = new ZeroRequestNavigationCache();
        }
        return ZeroRequestNavigationCache.instance;
    }
    prefetchApiRoute(route, fetcher) {
        if (this.cache.has(route))
            return;
        fetcher().then((data) => {
            this.cache.set(route, { payload: data, timestamp: Date.now() });
            console.log(`[Zero-Request Cache] Pre-warmed route payload for "${route}" (0ms navigation state ready)`);
        }).catch((err) => {
            console.warn(`[Zero-Request Cache] Pre-fetch failed for "${route}":`, err);
        });
    }
    getCachedRoutePayload(route) {
        const entry = this.cache.get(route);
        if (!entry)
            return null;
        // Cache valid for 5 minutes
        if (Date.now() - entry.timestamp > 300000) {
            this.cache.delete(route);
            return null;
        }
        return entry.payload;
    }
}
export const zeroRequestCache = ZeroRequestNavigationCache.getInstance();
