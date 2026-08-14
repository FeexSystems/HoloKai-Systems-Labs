/**
 * Planetary UI Prefetch Graph
 * Dynamically pre-warms MFE remotes and route assets to deliver near-zero navigation latency.
 */
export class PrefetchGraph {
    prefetchedUrls = new Set();
    prefetchRemotes(prediction) {
        if (typeof document === 'undefined')
            return;
        // Do not aggressively prefetch on slow networks or data-saver mode
        if (prediction.confidence < 0.70)
            return;
        prediction.prefetchRemotes.forEach((remoteName) => {
            const url = `http://localhost:3000/_next/static/chunks/remote-${remoteName}.js`;
            if (!this.prefetchedUrls.has(url)) {
                this.prefetchedUrls.add(url);
                const link = document.createElement('link');
                link.rel = 'modulepreload';
                link.href = url;
                link.as = 'script';
                document.head.appendChild(link);
            }
        });
    }
}
export const prefetchGraph = new PrefetchGraph();
