'use client';

import { useEffect, useState } from 'react';

interface WebVitals {
  LCP: number | null;
  FID: number | null;
  CLS: number | null;
  FCP: number | null;
  TTFB: number | null;
}

export function WebVitalsMonitor() {
  const [vitals, setVitals] = useState<WebVitals>({
    LCP: null,
    FID: null,
    CLS: null,
    FCP: null,
    TTFB: null
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lcpEntry = entries[entries.length - 1] as any;
          setVitals(prev => ({ ...prev, LCP: lcpEntry.startTime }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // First Contentful Paint (FCP)
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fcpEntry = entries[0] as any;
          setVitals(prev => ({ ...prev, FCP: fcpEntry.startTime }));
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as any[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          setVitals(prev => ({ ...prev, CLS: clsValue }));
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const fidEntry = entries[0] as any;
          setVitals(prev => ({ ...prev, FID: fidEntry.processingStart - fidEntry.startTime }));
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // Time to First Byte (TTFB)
      try {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          setVitals(prev => ({ ...prev, TTFB: navigation.responseStart - navigation.requestStart }));
        }
      } catch (e) {
        console.warn('TTFB not available');
      }
    }
  }, []);

  // Log vitals to monitoring service
  useEffect(() => {
    if (vitals.LCP && vitals.FID && vitals.CLS) {
      console.log('Web Vitals:', vitals);

      // Send to monitoring service in production
      if (process.env.NODE_ENV === 'production') {
        // sendToMonitoringService(vitals);
      }
    }
  }, [vitals]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getScoreColor = (value: number | null, good: number, needsImprovement: number) => {
    if (value === null) return 'text-zinc-500';
    if (value <= good) return 'text-emerald-400';
    if (value <= needsImprovement) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg bg-black/90 border border-white/10 text-xs z-50">
      <div className="font-bold text-white mb-2">Web Vitals (Dev Only)</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">LCP:</span>
          <span className={getScoreColor(vitals.LCP, 2500, 4000)}>
            {vitals.LCP ? `${vitals.LCP.toFixed(0)}ms` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">FID:</span>
          <span className={getScoreColor(vitals.FID, 100, 300)}>
            {vitals.FID ? `${vitals.FID.toFixed(0)}ms` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">CLS:</span>
          <span className={getScoreColor(vitals.CLS, 0.1, 0.25)}>
            {vitals.CLS ? vitals.CLS.toFixed(3) : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">FCP:</span>
          <span className={getScoreColor(vitals.FCP, 1800, 3000)}>
            {vitals.FCP ? `${vitals.FCP.toFixed(0)}ms` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">TTFB:</span>
          <span className={getScoreColor(vitals.TTFB, 800, 1800)}>
            {vitals.TTFB ? `${vitals.TTFB.toFixed(0)}ms` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
