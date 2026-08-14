/**
 * Wave 7B Task 107: Fallback Responses
 * Serves cached responses when Gemini or other services are unavailable
 */

interface CachedResponse {
  query: string;
  response: string;
  timestamp: number;
  ttl: number;
}

class FallbackResponseCache {
  private cache: Map<string, CachedResponse> = new Map();
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate a cache key from query
   */
  private generateKey(query: string): string {
    return query.toLowerCase().trim().replace(/\s+/g, '-');
  }

  /**
   * Store a response in cache
   */
  set(query: string, response: string, ttl: number = this.DEFAULT_TTL): void {
    const key = this.generateKey(query);
    this.cache.set(key, {
      query,
      response,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Get a cached response if available and not expired
   */
  get(query: string): string | null {
    const key = this.generateKey(query);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    const now = Date.now();
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  /**
   * Clear expired cache entries
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now - cached.timestamp > cached.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
}

// Singleton instance
export const fallbackCache = new FallbackResponseCache();

/**
 * Pre-populated fallback responses for common queries
 */
const FALLBACK_RESPONSES: Record<string, string> = {
  'kemetic-astronomy': `
The ancient Kemetic people developed sophisticated astronomical knowledge. They:
- Created accurate calendars based on Sirius and other star observations
- Aligned pyramids and temples with celestial bodies
- Documented star movements in temple ceilings and coffins
- Used astronomy for agricultural planning along the Nile
- Developed the 365-day calendar with 12 months of 30 days plus 5 epagomenal days

*Note: This is a cached response. The Oracle is currently experiencing high demand and will provide detailed responses shortly.*
  `.trim(),

  'timbuktu-scholars': `
Timbuktu was a center of learning from the 13th to 16th centuries:
- Home to the University of Sankore and numerous madrasas
- Scholars studied mathematics, astronomy, medicine, and law
- Preserved Greek and Roman texts through Arabic translations
- Manuscripts covered diverse topics from theology to science
- Attracted scholars from across the Islamic world and beyond

*Note: This is a cached response. The Oracle is currently experiencing high demand and will provide detailed responses shortly.*
  `.trim(),

  'maat-concept': `
Maat was a fundamental Kemetic concept representing:
- Truth, balance, order, harmony, law, morality, and justice
- The principle that maintained cosmic and social order
- Personified as a goddess, daughter of the creator god Ra
- Central to Kemetic ethics and governance
- The pharaoh's duty to uphold Maat ensured prosperity

*Note: This is a cached response. The Oracle is currently experiencing high demand and will provide detailed responses shortly.*
  `.trim(),

  'nubian-civilization': `
Nubian civilization (Kush) was a powerful ancient African kingdom:
- Located south of Kemet along the Nile
- Developed its own writing system (Meroitic)
- Ruled as pharaohs during Egypt's 25th Dynasty
- Built pyramids at Meroë and other sites
- Excelled in ironworking and trade

*Note: This is a cached response. The Oracle is currently experiencing high demand and will provide detailed responses shortly.*
  `.trim(),

  'default': `
The HoloKai Oracle is temporarily unable to process your query at this moment. This may be due to:
- High demand on our AI services
- Temporary maintenance of our knowledge systems
- Network connectivity issues

Please try again in a few moments. Our team has been notified and is working to restore full service.

For immediate assistance, you can:
- Browse our research archives
- Explore our document collections
- Contact support at support@holokai.com
  `.trim()
};

/**
 * Get a fallback response for a query
 */
export function getFallbackResponse(query: string): string {
  const normalizedQuery = query.toLowerCase();

  // Check cache first
  const cached = fallbackCache.get(query);
  if (cached) {
    return cached;
  }

  // Try to match against pre-defined responses
  if (normalizedQuery.includes('astronomy') || normalizedQuery.includes('star') || normalizedQuery.includes('calendar')) {
    return FALLBACK_RESPONSES['kemetic-astronomy'];
  }

  if (normalizedQuery.includes('timbuktu') || normalizedQuery.includes('manuscript') || normalizedQuery.includes('scholar')) {
    return FALLBACK_RESPONSES['timbuktu-scholars'];
  }

  if (normalizedQuery.includes('maat') || normalizedQuery.includes('balance') || normalizedQuery.includes('justice')) {
    return FALLBACK_RESPONSES['maat-concept'];
  }

  if (normalizedQuery.includes('nubia') || normalizedQuery.includes('kush') || normalizedQuery.includes('meroë')) {
    return FALLBACK_RESPONSES['nubian-civilization'];
  }

  return FALLBACK_RESPONSES['default'];
}

/**
 * Cache a successful response for future fallback use
 */
export function cacheResponse(query: string, response: string): void {
  fallbackCache.set(query, response);
}

/**
 * Clear expired fallback cache entries
 */
export function clearExpiredFallbackCache(): void {
  fallbackCache.clearExpired();
}
