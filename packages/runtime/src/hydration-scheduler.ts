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
export class HydrationScheduler {
  private static instance: HydrationScheduler;
  private targets: Map<string, HydrationTarget> = new Map();

  private constructor() {}

  public static getInstance(): HydrationScheduler {
    if (!HydrationScheduler.instance) {
      HydrationScheduler.instance = new HydrationScheduler();
    }
    return HydrationScheduler.instance;
  }

  public register(target: HydrationTarget): void {
    this.targets.set(target.id, target);

    if (target.priority === 'critical') {
      this.hydrateNow(target.id);
    } else if (target.priority === 'idle') {
      this.scheduleIdle(target.id);
    }
  }

  public hydrateNow(id: string): void {
    const target = this.targets.get(id);
    if (target) {
      target.hydrate();
      this.targets.delete(id);
    }
  }

  private scheduleIdle(id: string): void {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => this.hydrateNow(id));
    } else {
      setTimeout(() => this.hydrateNow(id), 2000);
    }
  }
}

export const hydrationScheduler = HydrationScheduler.getInstance();
