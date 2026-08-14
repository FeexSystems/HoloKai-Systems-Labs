export interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
}
export interface AnalyticsSDK {
    track(event: AnalyticsEvent): void;
    page(path: string): void;
    identify(userId: string): void;
}
declare class DefaultAnalyticsSDK implements AnalyticsSDK {
    track(event: AnalyticsEvent): void;
    page(path: string): void;
    identify(userId: string): void;
}
export declare const analyticsSDK: DefaultAnalyticsSDK;
export declare function initDOMAnalyticsTracking(): () => void;
export {};
//# sourceMappingURL=analytics-sdk.d.ts.map