/**
 * Planetary UI Hydration Scheduler
 * Prioritizes above-the-fold component hydration and defers below-the-fold components
 * until viewport intersection or idle state to meet sub-1s LCP targets.
 */
export class HydrationScheduler {
    static instance;
    targets = new Map();
    constructor() { }
    static getInstance() {
        if (!HydrationScheduler.instance) {
            HydrationScheduler.instance = new HydrationScheduler();
        }
        return HydrationScheduler.instance;
    }
    register(target) {
        this.targets.set(target.id, target);
        if (target.priority === 'critical') {
            this.hydrateNow(target.id);
        }
        else if (target.priority === 'idle') {
            this.scheduleIdle(target.id);
        }
    }
    hydrateNow(id) {
        const target = this.targets.get(id);
        if (target) {
            target.hydrate();
            this.targets.delete(id);
        }
    }
    scheduleIdle(id) {
        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            window.requestIdleCallback(() => this.hydrateNow(id));
        }
        else {
            setTimeout(() => this.hydrateNow(id), 2000);
        }
    }
}
export const hydrationScheduler = HydrationScheduler.getInstance();
