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
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "failed">("idle");
  const [loaded, setLoaded] = useState(false);

  const fail = useCallback(() => {
    setStatus("failed");
    onUnavailable?.();
  }, [onUnavailable]);

  useEffect(() => {
    if (!scene || !scene.trim()) {
      fail();
      return undefined;
    }

    let active = true;
    setStatus("verifying");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      if (active) fail();
    }, LOAD_TIMEOUT_MS);

    fetch(scene, { signal: controller.signal })
      .then((res) => {
        if (!active) return;
        const contentType = res.headers.get("content-type") || "";
        if (!res.ok || contentType.includes("text/html")) {
          fail();
        } else {
          setStatus("verified");
        }
      })
      .catch(() => {
        if (active) fail();
      })
      .finally(() => {
        clearTimeout(timeoutId);
      });

    return () => {
      active = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [scene, fail]);

  if (status !== "verified") {
    return <>{fallback}</>;
  }

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
