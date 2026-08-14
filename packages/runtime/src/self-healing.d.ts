export interface SelfHealingRecoveryState {
    errorCount: number;
    lastErrorTimestamp: number;
    circuitBreakerOpen: boolean;
}
/**
 * Planetary UI Self-Healing Runtime Recovery System
 * Prevents cascading runtime errors by circuit-breaking failing modules and auto-recovering.
 */
export declare class SelfHealingRuntime {
    private static instance;
    private state;
    private constructor();
    static getInstance(): SelfHealingRuntime;
    recordError(error: Error, context: string): void;
    attemptRecovery(): boolean;
}
export declare const selfHealingRuntime: SelfHealingRuntime;
//# sourceMappingURL=self-healing.d.ts.map