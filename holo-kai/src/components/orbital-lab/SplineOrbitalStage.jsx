/**
 * Real Spline 3D layer for Orbital Lab.
 * Lazy-loaded progressive enhancement: when VITE_SPLINE_SCENE_URL is unset
 * (or load fails), OrbitalScene CSS ambient remains the sole visual layer.
 */
import React, { Component, Suspense, lazy, useCallback, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

const SCENE_URL = (import.meta.env.VITE_SPLINE_SCENE_URL || 'https://prod.spline.design/UxqPsHJtrHQardbV/scene.splinecode').trim();
const LOAD_TIMEOUT_MS = 20000;

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn(
      '[HoloKai] Spline scene failed — OrbitalScene ambient continues:',
      error?.message || error
    );
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function LoadingHint() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex flex-col items-center justify-end pb-40">
      <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/30">
        Loading Orbital Stage
      </p>
      <div className="mt-2 h-0.5 w-28 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full w-1/2 bg-gradient-to-r from-holokai-gold/60 to-holokai-gold/20"
          style={{
            animation: 'spline-load 1.4s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes spline-load {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}

/**
 * @param {{ sceneUrl?: string, className?: string, onReady?: () => void, onUnavailable?: () => void }} props
 */
export default function SplineOrbitalStage({
  sceneUrl = SCENE_URL,
  className = '',
  onReady,
  onUnavailable,
}) {
  const [status, setStatus] = useState('idle');
  const [loaded, setLoaded] = useState(false);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const configured = Boolean(sceneUrl && sceneUrl.trim()) && !prefersReducedMotion;

  const fail = useCallback(() => {
    setStatus('failed');
    onUnavailable?.();
  }, [onUnavailable]);

  useEffect(() => {
    if (!configured) {
      fail();
      return undefined;
    }

    let active = true;
    setStatus('verifying');

    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      if (active) fail();
    }, LOAD_TIMEOUT_MS);

    fetch(sceneUrl, { signal: controller.signal })
      .then((res) => {
        if (!active) return;
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || contentType.includes('text/html')) {
          fail();
        } else {
          setStatus('verified');
        }
      })
      .catch(() => {
        if (active) fail();
      })
      .finally(() => {
        clearTimeout(timer);
      });

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [configured, sceneUrl, fail]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onReady?.();
  }, [onReady]);

  // No scene URL configured or verification failed — progressive enhancement: nothing to render
  if (!configured || status !== 'verified') {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 z-[1] pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {!loaded && <LoadingHint />}
      <SplineErrorBoundary onError={fail} fallback={null}>
        <Suspense fallback={null}>
          <Spline
            scene={sceneUrl}
            onLoad={handleLoad}
            className="h-full w-full opacity-90"
          />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
}

export { SCENE_URL as DEFAULT_SPLINE_SCENE_URL };
