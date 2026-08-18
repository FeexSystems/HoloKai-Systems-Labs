/**
 * Wave 8A Task 127: Set Up Metrics Collection
 * Track API response times, error rates, agent performance
 */

export interface MetricData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface HistogramData {
  name: string;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private timers: Map<string, number> = new Map();

  /**
   * Increment a counter metric
   */
  increment(name: string, value: number = 1, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    this.counters.set(key, (this.counters.get(key) || 0) + value);
  }

  /**
   * Decrement a counter metric
   */
  decrement(name: string, value: number = 1, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    this.counters.set(key, (this.counters.get(key) || 0) - value);
  }

  /**
   * Set a gauge metric
   */
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    this.gauges.set(key, value);
  }

  /**
   * Record a histogram metric
   */
  histogram(name: string, value: number, tags?: Record<string, string>): void {
    const key = this.buildKey(name, tags);
    if (!this.histograms.has(key)) {
      this.histograms.set(key, []);
    }
    this.histograms.get(key)!.push(value);
  }

  /**
   * Start a timer for a metric
   */
  startTimer(name: string, tags?: Record<string, string>): string {
    const timerId = `${name}_${Date.now()}_${Math.random()}`;
    this.timers.set(timerId, Date.now());
    return timerId;
  }

  /**
   * Stop a timer and record as histogram
   */
  stopTimer(name: string, timerId: string, tags?: Record<string, string>): number {
    const startTime = this.timers.get(timerId);
    if (!startTime) {
      return 0;
    }

    const duration = Date.now() - startTime;
    this.histogram(name, duration, tags);
    this.timers.delete(timerId);

    return duration;
  }

  /**
   * Get counter value
   */
  getCounter(name: string, tags?: Record<string, string>): number {
    const key = this.buildKey(name, tags);
    return this.counters.get(key) || 0;
  }

  /**
   * Get gauge value
   */
  getGauge(name: string, tags?: Record<string, string>): number {
    const key = this.buildKey(name, tags);
    return this.gauges.get(key) || 0;
  }

  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string, tags?: Record<string, string>): {
    count: number;
    min: number;
    max: number;
    mean: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const key = this.buildKey(name, tags);
    const values = this.histograms.get(key);

    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const mean = sum / sorted.length;

    const p50Index = Math.floor(sorted.length * 0.5);
    const p95Index = Math.floor(sorted.length * 0.95);
    const p99Index = Math.floor(sorted.length * 0.99);

    return {
      count: sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean,
      p50: sorted[p50Index],
      p95: sorted[p95Index],
      p99: sorted[p99Index]
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.timers.clear();
  }

  /**
   * Get all metrics as an array
   */
  getAllMetrics(): MetricData[] {
    const metrics: MetricData[] = [];

    // Collect counters
    for (const [key, value] of this.counters.entries()) {
      const { name, tags } = this.parseKey(key);
      metrics.push({
        name,
        value,
        timestamp: Date.now(),
        tags
      });
    }

    // Collect gauges
    for (const [key, value] of this.gauges.entries()) {
      const { name, tags } = this.parseKey(key);
      metrics.push({
        name,
        value,
        timestamp: Date.now(),
        tags
      });
    }

    return metrics;
  }

  /**
   * Build key from name and tags
   */
  private buildKey(name: string, tags?: Record<string, string>): string {
    if (!tags || Object.keys(tags).length === 0) {
      return name;
    }

    const tagString = Object.entries(tags)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    return `${name}|${tagString}`;
  }

  /**
   * Parse key back to name and tags
   */
  private parseKey(key: string): { name: string; tags?: Record<string, string> } {
    const parts = key.split('|');
    const name = parts[0];

    if (parts.length === 1) {
      return { name };
    }

    const tags: Record<string, string> = {};
    const tagPairs = parts[1].split(',');
    for (const pair of tagPairs) {
      const [key, value] = pair.split('=');
      tags[key] = value;
    }

    return { name, tags };
  }
}

// Singleton instance
export const metrics = new MetricsCollector();

/**
 * Predefined metric names
 */
export const MetricNames = {
  // API metrics
  API_REQUESTS_TOTAL: 'api.requests.total',
  API_REQUESTS_SUCCESS: 'api.requests.success',
  API_REQUESTS_ERROR: 'api.requests.error',
  API_RESPONSE_TIME: 'api.response.time',

  // Agent metrics
  AGENT_REQUESTS_TOTAL: 'agent.requests.total',
  AGENT_RESPONSE_TIME: 'agent.response.time',
  AGENT_ERRORS: 'agent.errors',

  // Database metrics
  DB_QUERY_TIME: 'db.query.time',
  DB_CONNECTIONS_ACTIVE: 'db.connections.active',
  DB_CONNECTIONS_IDLE: 'db.connections.idle',

  // Cache metrics
  CACHE_HITS: 'cache.hits',
  CACHE_MISSES: 'cache.misses',
  CACHE_SIZE: 'cache.size',

  // Business metrics
  USER_REGISTRATIONS: 'user.registrations',
  SUBSCRIPTION_UPGRADES: 'subscription.upgrades',
  ORACLE_QUERIES: 'oracle.queries',
  DOCUMENT_UPLOADS: 'document.uploads',

  // Security metrics
  AUTH_ATTEMPTS: 'auth.attempts',
  AUTH_FAILURES: 'auth.failures',
  RATE_LIMIT_VIOLATIONS: 'rate_limit.violations'
};

/**
 * Express middleware for automatic metrics collection
 */
export function metricsMiddleware(req: any, res: any, next: any) {
  const startTime = Date.now();

  metrics.increment(MetricNames.API_REQUESTS_TOTAL, 1, {
    endpoint: req.path,
    method: req.method
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const success = res.statusCode < 400;

    metrics.histogram(MetricNames.API_RESPONSE_TIME, duration, {
      endpoint: req.path,
      method: req.method,
      status: res.statusCode
    });

    if (success) {
      metrics.increment(MetricNames.API_REQUESTS_SUCCESS, 1, {
        endpoint: req.path,
        method: req.method
      });
    } else {
      metrics.increment(MetricNames.API_REQUESTS_ERROR, 1, {
        endpoint: req.path,
        method: req.method,
        statusCode: res.statusCode
      });
    }
  });

  next();
}

/**
 * Get metrics summary for dashboard
 */
export function getMetricsSummary() {
  return {
    api: {
      totalRequests: metrics.getCounter(MetricNames.API_REQUESTS_TOTAL),
      successRate: calculateSuccessRate(),
      avgResponseTime: metrics.getHistogramStats(MetricNames.API_RESPONSE_TIME)?.mean || 0,
      p95ResponseTime: metrics.getHistogramStats(MetricNames.API_RESPONSE_TIME)?.p95 || 0
    },
    agents: {
      totalRequests: metrics.getCounter(MetricNames.AGENT_REQUESTS_TOTAL),
      avgResponseTime: metrics.getHistogramStats(MetricNames.AGENT_RESPONSE_TIME)?.mean || 0,
      errorRate: calculateAgentErrorRate()
    },
    database: {
      avgQueryTime: metrics.getHistogramStats(MetricNames.DB_QUERY_TIME)?.mean || 0,
      activeConnections: metrics.getGauge(MetricNames.DB_CONNECTIONS_ACTIVE),
      idleConnections: metrics.getGauge(MetricNames.DB_CONNECTIONS_IDLE)
    },
    cache: {
      hits: metrics.getCounter(MetricNames.CACHE_HITS),
      misses: metrics.getCounter(MetricNames.CACHE_MISSES),
      hitRate: calculateCacheHitRate(),
      size: metrics.getGauge(MetricNames.CACHE_SIZE)
    },
    security: {
      authAttempts: metrics.getCounter(MetricNames.AUTH_ATTEMPTS),
      authFailures: metrics.getCounter(MetricNames.AUTH_FAILURES),
      rateLimitViolations: metrics.getCounter(MetricNames.RATE_LIMIT_VIOLATIONS)
    },
    business: {
      userRegistrations: metrics.getCounter(MetricNames.USER_REGISTRATIONS),
      subscriptionUpgrades: metrics.getCounter(MetricNames.SUBSCRIPTION_UPGRADES),
      oracleQueries: metrics.getCounter(MetricNames.ORACLE_QUERIES),
      documentUploads: metrics.getCounter(MetricNames.DOCUMENT_UPLOADS)
    }
  };
}

function calculateSuccessRate(): number {
  const total = metrics.getCounter(MetricNames.API_REQUESTS_TOTAL);
  const success = metrics.getCounter(MetricNames.API_REQUESTS_SUCCESS);

  if (total === 0) return 0;
  return (success / total) * 100;
}

function calculateAgentErrorRate(): number {
  const total = metrics.getCounter(MetricNames.AGENT_REQUESTS_TOTAL);
  const errors = metrics.getCounter(MetricNames.AGENT_ERRORS);

  if (total === 0) return 0;
  return (errors / total) * 100;
}

function calculateCacheHitRate(): number {
  const hits = metrics.getCounter(MetricNames.CACHE_HITS);
  const misses = metrics.getCounter(MetricNames.CACHE_MISSES);
  const total = hits + misses;

  if (total === 0) return 0;
  return (hits / total) * 100;
}
