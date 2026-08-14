export interface OptimizationState {
    particleDensityRatio: number;
    targetFps: number;
    enable3DCanvas: boolean;
    enableMotionEffects: boolean;
}
/**
 * Planetary UI Autonomous UI Optimization Engine
 * Monitors runtime FPS & connection metrics to dynamically adjust WebGL, canvas, and animation workloads.
 */
export declare class AutonomousUIOptimizer {
    private static instance;
    private currentFps;
    private frameCount;
    private lastTimestamp;
    private constructor();
    static getInstance(): AutonomousUIOptimizer;
    private monitorPerformance;
    getOptimizationConfig(): OptimizationState;
}
export declare const autoOptimizer: AutonomousUIOptimizer;
//# sourceMappingURL=auto-optimizer.d.ts.map