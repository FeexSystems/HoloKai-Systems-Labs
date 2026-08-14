export type DeviceClass = 'mobile' | 'tablet' | 'desktop' | 'bot';
export interface DeviceContext {
    deviceClass: DeviceClass;
    isTouch: boolean;
    viewportWidth?: number;
}
/**
 * Planetary UI Device Classifier
 * Classifies user-agent & viewport capabilities to optimize micro-frontend bundles.
 */
export declare function classifyDevice(userAgent: string, width?: number): DeviceContext;
//# sourceMappingURL=device-classifier.d.ts.map