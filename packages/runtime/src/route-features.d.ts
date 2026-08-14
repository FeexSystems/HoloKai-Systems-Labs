import { DeviceContext } from './device-classifier';
import { NetworkProfile } from './network-profiler';
export interface RouteUserContext {
    currentRoute: string;
    geoCountry?: string;
    device: DeviceContext;
    network: NetworkProfile;
    historyLength: number;
    lastNavTimestamp: number;
}
/**
 * Planetary UI Route Feature Extractor
 * Gathers environment, connection, geo, and session behavior signals for AI route prediction.
 */
export declare function extractRouteFeatures(currentRoute: string, geoCountry?: string): RouteUserContext;
//# sourceMappingURL=route-features.d.ts.map