import { classifyDevice, DeviceContext } from './device-classifier';
import { profileNetwork, NetworkProfile } from './network-profiler';

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
export function extractRouteFeatures(currentRoute: string, geoCountry?: string): RouteUserContext {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const width = typeof window !== 'undefined' ? window.innerWidth : undefined;
  const historyLen = typeof window !== 'undefined' ? window.history.length : 1;

  const device = classifyDevice(ua, width);
  const network = profileNetwork();

  return {
    currentRoute,
    geoCountry: geoCountry || 'US',
    device,
    network,
    historyLength: historyLen,
    lastNavTimestamp: Date.now(),
  };
}
