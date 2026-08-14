/**
 * Planetary UI Telemetry SDK
 * Collects Core Web Vitals (CWV), MFE load timings, and telemetry events for live observability.
 */
export class TelemetrySDK {
    static instance;
    queue = [];
    constructor() {
        if (typeof window !== 'undefined') {
            this.initWebVitals();
        }
    }
    static getInstance() {
        if (!TelemetrySDK.instance) {
            TelemetrySDK.instance = new TelemetrySDK();
        }
        return TelemetrySDK.instance;
    }
    initWebVitals() {
        if (typeof PerformanceObserver === 'undefined')
            return;
        try {
            // Observe LCP
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    this.track('web_vitals_lcp', { value: lastEntry.startTime });
                }
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
            // Observe CLS
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                this.track('web_vitals_cls', { value: clsValue });
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
        }
        catch (err) {
            console.warn('[Telemetry] PerformanceObserver not supported:', err);
        }
    }
    track(eventName, properties = {}) {
        const event = {
            eventName,
            timestamp: Date.now(),
            properties: {
                ...properties,
                url: typeof window !== 'undefined' ? window.location.href : '',
            },
        };
        this.queue.push(event);
        if (this.queue.length >= 5) {
            this.flush();
        }
    }
    flush() {
        if (this.queue.length === 0)
            return;
        const batch = [...this.queue];
        this.queue = [];
        if (process.env.NODE_ENV === 'development') {
            console.log('[Telemetry SDK Flush]', batch);
        }
    }
}
export const telemetry = TelemetrySDK.getInstance();
