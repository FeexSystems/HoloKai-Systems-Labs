/**
 * Wave 7B Task 109: Detailed Error Logging
 * Captures full error context for debugging and monitoring
 */

import { logger } from './logger.js';

export interface ErrorContext {
  timestamp: string;
  service: string;
  environment: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  error: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };
  metadata?: Record<string, any>;
}

export class ErrorLogger {
  private static instance: ErrorLogger;
  private errorQueue: ErrorContext[] = [];
  private readonly MAX_QUEUE_SIZE = 100;
  private readonly FLUSH_INTERVAL = 5000; // 5 seconds

  private constructor() {
    // Start periodic flush
    setInterval(() => this.flush(), this.FLUSH_INTERVAL);
  }

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  /**
   * Log an error with full context
   */
  logError(context: Partial<ErrorContext>): void {
    const errorContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || 'holokai-bff',
      environment: process.env.NODE_ENV || 'development',
      error: { name: 'UnknownError', message: 'An unknown error occurred' },
      ...context
    };

    // Add to queue
    this.errorQueue.push(errorContext);

    // Log to console for immediate visibility
    logger.error(errorContext, 'Error logged:');

    // Flush if queue is full
    if (this.errorQueue.length >= this.MAX_QUEUE_SIZE) {
      this.flush();
    }
  }

  /**
   * Log an error from an Express request
   */
  logRequestError(
    error: Error,
    req: any,
    additionalMetadata?: Record<string, any>
  ): void {
    this.logError({
      userId: req.auth?.userId || req.user?.id,
      sessionId: req.sessionID,
      requestId: req.id,
      userAgent: req.get('user-agent'),
      ipAddress: req.ip,
      endpoint: req.path,
      method: req.method,
      statusCode: (error as any).statusCode || 500,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: (error as any).code
      },
      metadata: {
        ...additionalMetadata,
        query: req.query,
        params: req.params,
        body: this.sanitizeBody(req.body)
      }
    });
  }

  /**
   * Log an API error
   */
  logApiError(
    error: any,
    endpoint: string,
    method: string,
    additionalMetadata?: Record<string, any>
  ): void {
    this.logError({
      endpoint,
      method,
      statusCode: error.response?.status || error.status,
      error: {
        name: error.name || 'APIError',
        message: error.message || 'API request failed',
        stack: error.stack,
        code: error.code
      },
      metadata: {
        ...additionalMetadata,
        url: error.config?.url,
        timeout: error.config?.timeout,
        headers: this.sanitizeHeaders(error.config?.headers)
      }
    });
  }

  /**
   * Log a database error
   */
  logDatabaseError(
    error: any,
    query?: string,
    additionalMetadata?: Record<string, any>
  ): void {
    this.logError({
      error: {
        name: error.name || 'DatabaseError',
        message: error.message || 'Database operation failed',
        stack: error.stack,
        code: error.code
      },
      metadata: {
        ...additionalMetadata,
        query: this.sanitizeQuery(query),
        table: error.table,
        constraint: error.constraint
      }
    });
  }

  /**
   * Sanitize request body to remove sensitive data
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'creditCard'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize headers to remove sensitive data
   */
  private sanitizeHeaders(headers?: any): any {
    if (!headers) return headers;

    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    const sanitized = { ...headers };

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Sanitize SQL query to prevent logging sensitive data
   */
  private sanitizeQuery(query?: string): string | undefined {
    if (!query) return query;

    // Remove literal values that might contain sensitive data
    return query
      .replace(/'[^']*'/g, "'?'")
      .replace(/"[^"]*"/g, '"?"')
      .replace(/\b\d+\b/g, '?');
  }

  /**
   * Flush error queue to external monitoring service
   */
  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errorsToFlush = [...this.errorQueue];
    this.errorQueue = [];

    try {
      // In production, send to monitoring service (Sentry, DataDog, etc.)
      if (process.env.NODE_ENV === 'production') {
        await this.sendToMonitoringService(errorsToFlush);
      }

      // Also log to file for backup
      logger.info(`Flushed ${errorsToFlush.length} errors to monitoring`);
    } catch (error) {
      logger.error(error, 'Failed to flush errors:');
      // Re-add to queue if flush failed
      this.errorQueue.unshift(...errorsToFlush);
    }
  }

  /**
   * Send errors to external monitoring service
   */
  private async sendToMonitoringService(errors: ErrorContext[]): Promise<void> {
    // Implement integration with your monitoring service
    // Example: Sentry, DataDog, New Relic, etc.
    
    if (process.env.SENTRY_DSN) {
      // Sentry integration would go here
      // For now, just log that we would send
      logger.info(`Would send ${errors.length} errors to Sentry`);
    }

    if (process.env.DATADOG_API_KEY) {
      // DataDog integration would go here
      logger.info(`Would send ${errors.length} errors to DataDog`);
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byService: Record<string, number>;
    byType: Record<string, number>;
    recent: ErrorContext[];
  } {
    const allErrors = [...this.errorQueue];

    const byService: Record<string, number> = {};
    const byType: Record<string, number> = {};

    allErrors.forEach(error => {
      byService[error.service] = (byService[error.service] || 0) + 1;
      byType[error.error.name] = (byType[error.error.name] || 0) + 1;
    });

    return {
      total: allErrors.length,
      byService,
      byType,
      recent: allErrors.slice(-10)
    };
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance();

/**
 * Express middleware for automatic error logging
 */
export function errorLoggingMiddleware(req: any, res: any, next: any) {
  const originalJson = res.json;

  res.json = function (data: any) {
    if (res.statusCode >= 400) {
      const error = new Error(data.error || 'HTTP Error');
      (error as any).statusCode = res.statusCode;
      errorLogger.logRequestError(error, req, { responseData: data });
    }
    return originalJson.call(this, data);
  };

  next();
}

/**
 * Async error wrapper for automatic error logging
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context: Partial<ErrorContext> = {}
): T {
  return (async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLogger.logError({
        error: {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack
        },
        ...context
      });
      throw error;
    }
  }) as T;
}
