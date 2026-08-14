export type EffectiveConnectionType = '4g' | '3g' | '2g' | 'slow-2g';
export interface NetworkProfile {
    effectiveType: EffectiveConnectionType;
    saveData: boolean;
    rtt?: number;
    downlink?: number;
    shouldLiteMode: boolean;
}
/**
 * Planetary UI Network Profiler
 * Monitors connection speed to adjust 3D particle counts, WebGL render loops, and asset prefetching.
 */
export declare function profileNetwork(): NetworkProfile;
//# sourceMappingURL=network-profiler.d.ts.map