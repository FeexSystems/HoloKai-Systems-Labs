/**
 * Wave 7B Task 106: Retry Logic with Exponential Backoff
 * Handles transient failures with configurable retry strategies
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryableErrors?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

export class RetryHandler {
  private static readonly DEFAULT_OPTIONS: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffMultiplier: 2,
    retryableErrors: (error) => {
      // Retry on network errors, 5xx errors, and specific status codes
      if (!error) return false;
      
      // Network errors (no response)
      if (!error.response) return true;
      
      // 5xx server errors
      if (error.response.status >= 500) return true;
      
      // 429 Too Many Requests
      if (error.response.status === 429) return true;
      
      // 408 Request Timeout
      if (error.response.status === 408) return true;
      
      return false;
    },
    onRetry: () => {}
  };

  static async execute<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    let lastError: any;
    let delay = config.initialDelay;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Check if error is retryable
        if (!config.retryableErrors(error)) {
          throw error;
        }

        // If this was the last attempt, throw the error
        if (attempt === config.maxRetries) {
          throw error;
        }

        // Call retry callback
        config.onRetry(attempt + 1, error);

        // Calculate delay with exponential backoff
        const currentDelay = Math.min(delay, config.maxDelay);
        
        // Wait before retrying
        await this.sleep(currentDelay);
        
        // Increase delay for next attempt
        delay = currentDelay * config.backoffMultiplier;
      }
    }

    throw lastError;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create a retryable fetch wrapper
   */
  static async fetchWithRetry(
    url: string,
    options: RequestInit = {},
    retryOptions: RetryOptions = {}
  ): Promise<Response> {
    return this.execute(async () => {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const error: any = new Error(`HTTP error! status: ${response.status}`);
        error.response = response;
        throw error;
      }
      
      return response;
    }, retryOptions);
  }

  /**
   * Retry with jitter to prevent thundering herd
   */
  static async executeWithJitter<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    let lastError: any;
    let delay = config.initialDelay;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        if (!config.retryableErrors(error)) {
          throw error;
        }

        if (attempt === config.maxRetries) {
          throw error;
        }

        config.onRetry(attempt + 1, error);

        // Add jitter: delay * (0.5 to 1.5)
        const jitter = 0.5 + Math.random();
        const currentDelay = Math.min(delay * jitter, config.maxDelay);
        
        await this.sleep(currentDelay);
        delay = currentDelay * config.backoffMultiplier;
      }
    }

    throw lastError;
  }
}

/**
 * Convenience function for retrying async operations
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return RetryHandler.execute(fn, options);
}
