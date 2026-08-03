import {
  Component,
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Application as SplineApplication } from "@splinetool/runtime";

const Spline = lazy(() => import("@splinetool/react-spline"));

const LOAD_TIMEOUT_MS = 25000;

class SplineErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export type SplineStageProps = {
  scene: string;
  /** Rendered while the scene downloads and whenever it cannot be shown. */
  fallback: ReactNode;
  onReady?: (app: SplineApplication) => void;
  onUnavailable?: () => void;
};

/**
 * Loads a Spline scene with a hard timeout, error boundary and WebGL guard so
 * the lab always degrades to the r3f/key-art fallback instead of a blank canvas.
 */
export function SplineStage({
  scene,
  fallback,
  onReady,
  onUnavailable,
}: SplineStageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const fail = useCallback(() => {
    setFailed(true);
    onUnavailable?.();
  }, [onUnavailable]);

  useEffect(() => {
    if (loaded || failed) return undefined;
    const timer = setTimeout(fail, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loaded, failed, fail]);

  if (failed) return <>{fallback}</>;

  return (
    <div className="absolute inset-0">
      {!loaded && <div className="absolute inset-0">{fallback}</div>}
      <SplineErrorBoundary onError={fail} fallback={fallback}>
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            onLoad={(app) => {
              setLoaded(true);
              onReady?.(app);
            }}
            onError={fail}
            className="h-full w-full"
          />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
}

export function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}
