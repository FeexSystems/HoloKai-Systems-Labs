export interface WebVitalsMetrics {
    lcp?: number;
    cls?: number;
    inp?: number;
    ttfb?: number;
}
export interface TelemetryEvent {
    eventName: string;
    timestamp: number;
    properties: Record<string, unknown>;
    vitals?: WebVitalsMetrics;
}
/**
 * Planetary UI Telemetry SDK
 * Collects Core Web Vitals (CWV), MFE load timings, and telemetry events for live observability.
 */
export declare class TelemetrySDK {
    private static instance;
    private queue;
    private constructor();
    static getInstance(): TelemetrySDK;
    private initWebVitals;
    track(eventName: string, properties?: Record<string, unknown>): void;
    flush(): void;
}
export declare const telemetry: TelemetrySDK;
//# sourceMappingURL=telemetry.d.ts.map