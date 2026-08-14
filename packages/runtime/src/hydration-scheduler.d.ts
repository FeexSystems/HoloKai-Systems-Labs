export type HydrationPriority = 'critical' | 'visible' | 'idle';
export interface HydrationTarget {
    id: string;
    priority: HydrationPriority;
    hydrate: () => void | Promise<void>;
}
/**
 * Planetary UI Hydration Scheduler
 * Prioritizes above-the-fold component hydration and defers below-the-fold components
 * until viewport intersection or idle state to meet sub-1s LCP targets.
 */
export declare class HydrationScheduler {
    private static instance;
    private targets;
    private constructor();
    static getInstance(): HydrationScheduler;
    register(target: HydrationTarget): void;
    hydrateNow(id: string): void;
    private scheduleIdle;
}
export declare const hydrationScheduler: HydrationScheduler;
//# sourceMappingURL=hydration-scheduler.d.ts.map