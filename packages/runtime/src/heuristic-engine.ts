import { RouteUserContext } from './route-features';

export interface RoutePrediction {
  predictedRoute: string;
  confidence: number;
  prefetchRemotes: string[];
}

/**
 * Planetary UI Heuristic AI Route Prediction Engine
 * Analyzes current session context to predict upcoming navigation targets and pre-warm remotes.
 */
export class HeuristicEngine {
  private static ROUTE_TRANSITION_MAP: Record<string, string[]> = {
    '/': ['/oracle', '/archive'],
    '/landing': ['/oracle', '/core'],
    '/oracle': ['/archive', '/research'],
    '/archive': ['/research', '/oracle'],
    '/research': ['/archive', '/dashboard'],
  };

  public predictNextRoute(context: RouteUserContext): RoutePrediction {
    const candidateRoutes = HeuristicEngine.ROUTE_TRANSITION_MAP[context.currentRoute] || ['/oracle'];
    const predictedRoute = candidateRoutes[0];

    // High confidence if user is on desktop with 4G connection
    let confidence = 0.75;
    if (context.network.effectiveType === '4g' && context.device.deviceClass === 'desktop') {
      confidence = 0.92;
    } else if (context.network.shouldLiteMode) {
      confidence = 0.60;
    }

    const prefetchRemotes: string[] = [];
    if (predictedRoute === '/oracle') prefetchRemotes.push('webOracle');
    else if (predictedRoute === '/archive') prefetchRemotes.push('webArchive');

    return {
      predictedRoute,
      confidence,
      prefetchRemotes,
    };
  }
}

export const heuristicEngine = new HeuristicEngine();
