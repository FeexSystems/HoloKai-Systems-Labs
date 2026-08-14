/**
 * Planetary UI Network Profiler
 * Monitors connection speed to adjust 3D particle counts, WebGL render loops, and asset prefetching.
 */
export function profileNetwork() {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
        return {
            effectiveType: '4g',
            saveData: false,
            shouldLiteMode: false,
        };
    }
    const conn = navigator.connection || {};
    const effectiveType = conn.effectiveType || '4g';
    const saveData = !!conn.saveData;
    const rtt = conn.rtt;
    const downlink = conn.downlink;
    const shouldLiteMode = saveData || effectiveType === '2g' || effectiveType === 'slow-2g' || (rtt !== undefined && rtt > 500);
    return {
        effectiveType,
        saveData,
        rtt,
        downlink,
        shouldLiteMode,
    };
}
