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
export declare class HeuristicEngine {
    private static ROUTE_TRANSITION_MAP;
    predictNextRoute(context: RouteUserContext): RoutePrediction;
}
export declare const heuristicEngine: HeuristicEngine;
//# sourceMappingURL=heuristic-engine.d.ts.map