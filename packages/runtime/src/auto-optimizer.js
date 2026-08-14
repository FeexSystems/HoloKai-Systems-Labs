import { profileNetwork } from './network-profiler';
/**
 * Planetary UI Autonomous UI Optimization Engine
 * Monitors runtime FPS & connection metrics to dynamically adjust WebGL, canvas, and animation workloads.
 */
export class AutonomousUIOptimizer {
    static instance;
    currentFps = 60;
    frameCount = 0;
    lastTimestamp = performance.now();
    constructor() {
        if (typeof window !== 'undefined') {
            this.monitorPerformance();
        }
    }
    static getInstance() {
        if (!AutonomousUIOptimizer.instance) {
            AutonomousUIOptimizer.instance = new AutonomousUIOptimizer();
        }
        return AutonomousUIOptimizer.instance;
    }
    monitorPerformance() {
        const tick = (now) => {
            this.frameCount++;
            if (now >= this.lastTimestamp + 1000) {
                this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastTimestamp));
                this.frameCount = 0;
                this.lastTimestamp = now;
            }
            requestAnimationFrame(tick);
        };
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(tick);
        }
    }
    getOptimizationConfig() {
        const net = profileNetwork();
        let particleDensityRatio = 1.0;
        let targetFps = 60;
        let enable3DCanvas = true;
        let enableMotionEffects = true;
        if (net.shouldLiteMode || this.currentFps < 30) {
            particleDensityRatio = 0.2;
            targetFps = 30;
            enable3DCanvas = false; // Fall back heavy 3D canvases to 2D CSS gradients
            enableMotionEffects = false;
        }
        else if (this.currentFps < 45) {
            particleDensityRatio = 0.5;
            targetFps = 30;
        }
        return {
            particleDensityRatio,
            targetFps,
            enable3DCanvas,
            enableMotionEffects,
        };
    }
}
export const autoOptimizer = AutonomousUIOptimizer.getInstance();
