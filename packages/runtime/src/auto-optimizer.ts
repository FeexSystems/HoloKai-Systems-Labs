import { NetworkProfile, profileNetwork } from './network-profiler';

export interface OptimizationState {
  particleDensityRatio: number; // 0.1 to 1.0
  targetFps: number; // 30 or 60
  enable3DCanvas: boolean;
  enableMotionEffects: boolean;
}

/**
 * Planetary UI Autonomous UI Optimization Engine
 * Monitors runtime FPS & connection metrics to dynamically adjust WebGL, canvas, and animation workloads.
 */
export class AutonomousUIOptimizer {
  private static instance: AutonomousUIOptimizer;
  private currentFps: number = 60;
  private frameCount: number = 0;
  private lastTimestamp: number = performance.now();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.monitorPerformance();
    }
  }

  public static getInstance(): AutonomousUIOptimizer {
    if (!AutonomousUIOptimizer.instance) {
      AutonomousUIOptimizer.instance = new AutonomousUIOptimizer();
    }
    return AutonomousUIOptimizer.instance;
  }

  private monitorPerformance(): void {
    const tick = (now: number) => {
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

  public getOptimizationConfig(): OptimizationState {
    const net: NetworkProfile = profileNetwork();

    let particleDensityRatio = 1.0;
    let targetFps = 60;
    let enable3DCanvas = true;
    let enableMotionEffects = true;

    if (net.shouldLiteMode || this.currentFps < 30) {
      particleDensityRatio = 0.2;
      targetFps = 30;
      enable3DCanvas = false; // Fall back heavy 3D canvases to 2D CSS gradients
      enableMotionEffects = false;
    } else if (this.currentFps < 45) {
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
