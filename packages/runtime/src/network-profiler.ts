export type EffectiveConnectionType = '4g' | '3g' | '2g' | 'slow-2g';

export interface NetworkProfile {
  effectiveType: EffectiveConnectionType;
  saveData: boolean;
  rtt?: number;
  downlink?: number;
  shouldLiteMode: boolean;
}

/**
 * Planetary UI Network Profiler
 * Monitors connection speed to adjust 3D particle counts, WebGL render loops, and asset prefetching.
 */
export function profileNetwork(): NetworkProfile {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return {
      effectiveType: '4g',
      saveData: false,
      shouldLiteMode: false,
    };
  }

  const conn = (navigator as any).connection || {};
  const effectiveType: EffectiveConnectionType = conn.effectiveType || '4g';
  const saveData: boolean = !!conn.saveData;
  const rtt: number | undefined = conn.rtt;
  const downlink: number | undefined = conn.downlink;

  const shouldLiteMode = saveData || effectiveType === '2g' || effectiveType === 'slow-2g' || (rtt !== undefined && rtt > 500);

  return {
    effectiveType,
    saveData,
    rtt,
    downlink,
    shouldLiteMode,
  };
}
