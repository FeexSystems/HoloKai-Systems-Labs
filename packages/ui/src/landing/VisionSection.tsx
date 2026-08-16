import { ArrowRight, Globe2, Hexagon, Network, Sparkles } from "lucide-react";
import {
  visionLanguages,
  visionOutcomes,
  visionPillars,
} from "../data/marketingData";

type VisionSectionProps = {
  onExploreVanguard: () => void;
  onExploreIntelligence: () => void;
};

export function VisionSection({
  onExploreVanguard,
  onExploreIntelligence,
}: VisionSectionProps) {
  return (
    <section
      id="vision"
      className="relative z-10 border-y border-border-subtle bg-black py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1600px] px-6">
        {/* Header */}
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="text-xs font-bold tracking-[0.35em] text-brand">
              AN EPISTEMOLOGY OF WHOLENESS
            </p>
            <h2 className="mt-5 font-display text-5xl font-light leading-none sm:text-6xl lg:text-7xl">
              The archive was never{" "}
              <span className="font-bold italic text-brand">empty.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-muted sm:text-lg">
              HoloKai reconnects fragments of history separated by distance,
              extraction, and omission. It does not replace living knowledge—it
              makes space for communities to govern, extend, and embody it
              through ultra-realistic humanoid presence.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {visionPillars.map((p) => (
                <div
                  key={p.id}
                  className="border border-brand/20 bg-brand/[0.04] px-4 py-5 text-center"
                >
                  <p className="font-display text-3xl font-bold text-brand sm:text-4xl">
                    {p.metric}
                  </p>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
                    {p.metricLabel}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matrix visual + copy */}
        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-12">
          <div className="relative min-h-[380px] overflow-hidden border border-[var(--color-border)] bg-[radial-gradient(circle_at_50%_40%,rgba(217,119,6,0.2),transparent_45%),linear-gradient(135deg,#121212,#030303)] lg:col-span-7">
            <Network
              className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 animate-[spin_38s_linear_infinite] text-brand/70 sm:h-72 sm:w-72"
              strokeWidth={0.45}
            />
            <Hexagon
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 text-brand/90"
              strokeWidth={0.8}
            />
            <div className="absolute left-6 top-6 border border-border-subtle bg-black/40 px-3 py-2 text-[9px] tracking-[0.24em] text-muted backdrop-blur-sm">
              LIVE EPISTEMOLOGICAL MATRIX
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t border-border-subtle bg-black/50 p-6 backdrop-blur-md">
              <p className="text-[10px] tracking-[0.2em] text-brand">
                ● LIVE KNOWLEDGE GRAPH · 4.29M NODES · LAGOS NODE
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {visionLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="border border-border-subtle bg-white/5 px-2 py-1 text-[9px] tracking-wider text-muted"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            {visionPillars.map((pillar) => (
              <article
                key={pillar.id}
                className="border border-border-subtle bg-white/[0.02] p-6 transition hover:border-brand/35"
              >
                <p className="text-[9px] font-bold tracking-[0.28em] text-brand">
                  {pillar.kicker.toUpperCase()}
                </p>
                <h3 className="mt-2 font-display text-2xl text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Market outcomes */}
        <div className="mt-16">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] text-muted">
                WHO HOLOKAI SERVES
              </p>
              <h3 className="mt-2 font-display text-3xl font-light sm:text-4xl">
                Built for institutions that{" "}
                <span className="italic text-brand">remember.</span>
              </h3>
            </div>
            <Sparkles className="hidden h-8 w-8 text-brand/60 sm:block" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {visionOutcomes.map((outcome) => (
              <article
                key={outcome.title}
                className="border border-border-subtle bg-background/80 p-6"
              >
                <Globe2 className="h-5 w-5 text-brand" />
                <h4 className="mt-5 font-display text-xl text-foreground">{outcome.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted">{outcome.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onExploreVanguard}
            className="group flex items-center justify-center gap-2 bg-brand px-7 py-4 text-[10px] font-bold tracking-[0.2em] text-black transition hover:bg-[var(--color-brand)]"
          >
            EXPLORE THE VANGUARD
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={onExploreIntelligence}
            className="border border-white/20 px-7 py-4 text-[10px] font-bold tracking-[0.2em] text-foreground transition hover:bg-white/5"
          >
            SEE THE INTELLIGENCE STACK
          </button>
        </div>
      </div>
    </section>
  );
}
