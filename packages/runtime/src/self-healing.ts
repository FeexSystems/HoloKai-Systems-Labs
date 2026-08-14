export interface SelfHealingRecoveryState {
  errorCount: number;
  lastErrorTimestamp: number;
  circuitBreakerOpen: boolean;
}

/**
 * Planetary UI Self-Healing Runtime Recovery System
 * Prevents cascading runtime errors by circuit-breaking failing modules and auto-recovering.
 */
export class SelfHealingRuntime {
  private static instance: SelfHealingRuntime;
  private state: SelfHealingRecoveryState = {
    errorCount: 0,
    lastErrorTimestamp: 0,
    circuitBreakerOpen: false,
  };

  private constructor() {}

  public static getInstance(): SelfHealingRuntime {
    if (!SelfHealingRuntime.instance) {
      SelfHealingRuntime.instance = new SelfHealingRuntime();
    }
    return SelfHealingRuntime.instance;
  }

  public recordError(error: Error, context: string): void {
    const now = Date.now();
    console.warn(`[Self-Healing Runtime] Error recorded in "${context}":`, error.message);

    this.state.errorCount++;
    this.state.lastErrorTimestamp = now;

    if (this.state.errorCount >= 3) {
      this.state.circuitBreakerOpen = true;
      console.error(`[Self-Healing Runtime] Circuit breaker OPEN for module "${context}". Swapping to safe fallback.`);
    }
  }

  public attemptRecovery(): boolean {
    if (Date.now() - this.state.lastErrorTimestamp > 10000) {
      this.state.errorCount = 0;
      this.state.circuitBreakerOpen = false;
      console.log('[Self-Healing Runtime] Circuit breaker reset to CLOSED state.');
      return true;
    }
    return !this.state.circuitBreakerOpen;
  }
}

export const selfHealingRuntime = SelfHealingRuntime.getInstance();
