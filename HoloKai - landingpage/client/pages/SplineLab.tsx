import { Suspense, lazy, useCallback, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Hexagon,
  Minus,
  Plus,
  RotateCcw,
  Zap,
} from "lucide-react";
import type { Application as SplineApplication } from "@splinetool/runtime";
import { HoloKaiLogo } from "@/components/HoloKaiLogo";
import { SplineStage, isWebGLAvailable } from "@/components/lab/SplineStage";
import { units, type Unit } from "@/data/units";
import { coreUrl } from "@/lib/urls";

const LabCanvas = lazy(() =>
  import("@/components/lab/LabCanvas").then((m) => ({ default: m.LabCanvas })),
);

/** Spline export placed in `public/models/`, overridable with a hosted scene URL. */
const SPLINE_SCENE =
  import.meta.env.VITE_SPLINE_SCENE_URL?.trim() || "/models/scene.splinecode";

const ZOOM_STEP = 0.2;
const ZOOM_RANGE = { min: 0.4, max: 2.4 } as const;

function StageMessage({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="grid h-full w-full place-items-center bg-[#020202]">
      <div className="text-center">
        <Hexagon
          className="mx-auto h-12 w-12 animate-pulse text-amber-500"
          strokeWidth={1}
        />
        <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-amber-500/80">
          {title}
        </p>
        <p className="mt-2 max-w-xs text-[10px] leading-5 tracking-[0.12em] text-zinc-600">
          {hint}
        </p>
      </div>
    </div>
  );
}

/**
 * Orbital Spline lab: an interactive 3D space for exploring the Vanguard units.
 * Spline is the primary renderer; the react-three-fiber lab canvas takes over
 * when the scene is missing or fails, and a static notice covers no-WebGL.
 */
export default function SplineLab() {
  const [selected, setSelected] = useState<Unit>(units[0]);
  const [splineDown, setSplineDown] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const appRef = useRef<SplineApplication | null>(null);

  const webgl = useMemo(() => isWebGLAvailable(), []);
  const accent = selected.accent ?? "#f59e0b";

  const applyZoom = useCallback((next: number) => {
    const clamped = Math.min(
      ZOOM_RANGE.max,
      Math.max(ZOOM_RANGE.min, Number(next.toFixed(2))),
    );
    setZoom(clamped);
    appRef.current?.setZoom(clamped);
  }, []);

  const handleReady = useCallback(
    (app: SplineApplication) => {
      appRef.current = app;
      app.setZoom(zoom);
    },
    [zoom],
  );

  const fallbackCanvas = splineDown ? (
    <Suspense
      fallback={
        <StageMessage
          title="INITIALIZING LAB VIEWPORT"
          hint="Preparing the orbital renderer."
        />
      }
    >
      <LabCanvas unit={selected} autoRotate={autoRotate} muted mode="humanoid" />
    </Suspense>
  ) : (
    <StageMessage
      title="LOADING ORBITAL STAGE"
      hint="Streaming the Spline scene from /models/scene.splinecode."
    />
  );

  return (
    <main className="fixed inset-0 flex flex-col bg-[#020202] text-zinc-100 selection:bg-amber-500 selection:text-black">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 md:p-6">
        <div className="pointer-events-auto border border-amber-500/25 bg-black/55 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <HoloKaiLogo
              variant="icon"
              className="h-5 w-5 object-cover object-top"
            />
            <p className="text-[9px] font-bold tracking-[0.3em] text-amber-400">
              HOLOKAI · SPLINE LAB
            </p>
          </div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            {selected.name}
          </h1>
          <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
            {selected.id} · {selected.role}
          </p>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-2">
          <div className="flex border border-white/15 bg-black/55 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => applyZoom(zoom - ZOOM_STEP)}
              className="px-3 py-2 text-zinc-400 transition hover:text-amber-300"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="grid place-items-center px-2 font-mono text-[9px] tracking-[0.2em] text-zinc-500">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => applyZoom(zoom + ZOOM_STEP)}
              className="px-3 py-2 text-zinc-400 transition hover:text-amber-300"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              applyZoom(1);
              setAutoRotate(true);
            }}
            className="border border-white/15 bg-black/55 px-3 py-2 text-[9px] font-bold tracking-[0.18em] text-zinc-400 backdrop-blur-xl transition hover:text-white"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              RESET VIEW
            </span>
          </button>
          <Link
            to="/"
            className="border border-white/15 bg-black/55 px-3 py-2 text-[9px] font-bold tracking-[0.18em] text-zinc-300 backdrop-blur-xl transition hover:border-amber-500/40 hover:text-white"
          >
            <span className="flex items-center gap-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              RETURN
            </span>
          </Link>
          <a
            href={coreUrl()}
            className="flex items-center gap-2 border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[9px] font-bold tracking-[0.18em] text-amber-50 transition hover:bg-amber-500/20"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            ENTER ALKEBULAN
          </a>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        {!webgl ? (
          <StageMessage
            title="WEBGL UNAVAILABLE"
            hint="This device or browser cannot render the orbital lab. Enable hardware acceleration or use a WebGL-capable browser."
          />
        ) : (
          <SplineStage
            scene={SPLINE_SCENE}
            fallback={fallbackCanvas}
            onReady={handleReady}
            onUnavailable={() => setSplineDown(true)}
          />
        )}
      </div>

      <nav
        aria-label="Vanguard units"
        className="relative z-20 border-t border-amber-900/40 bg-black/70 backdrop-blur-xl"
      >
        <ul className="flex gap-2 overflow-x-auto px-4 py-3">
          {units.map((unit) => {
            const active = unit.id === selected.id;
            return (
              <li key={unit.id}>
                <button
                  type="button"
                  onClick={() => setSelected(unit)}
                  aria-pressed={active}
                  className={`flex min-w-[150px] items-center gap-3 border px-3 py-2 text-left transition ${
                    active
                      ? "border-amber-500/50 bg-amber-500/10"
                      : "border-white/10 hover:border-amber-500/30"
                  }`}
                  style={active ? { boxShadow: `0 0 24px -8px ${accent}` } : undefined}
                >
                  <img
                    src={unit.fullbodyImage}
                    alt=""
                    className="h-10 w-10 object-cover object-top"
                    loading="lazy"
                  />
                  <span>
                    <span className="block font-display text-sm font-bold text-white">
                      {unit.name}
                    </span>
                    <span className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500">
                      {unit.role}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
