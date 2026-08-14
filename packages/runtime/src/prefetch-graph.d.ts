import { RoutePrediction } from './heuristic-engine';
/**
 * Planetary UI Prefetch Graph
 * Dynamically pre-warms MFE remotes and route assets to deliver near-zero navigation latency.
 */
export declare class PrefetchGraph {
    private prefetchedUrls;
    prefetchRemotes(prediction: RoutePrediction): void;
}
export declare const prefetchGraph: PrefetchGraph;
//# sourceMappingURL=prefetch-graph.d.ts.map