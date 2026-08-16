"use client";

import { lazy, Suspense, useState } from "react";
import {
  Activity,
  ArrowRight,
  Cpu,
  Hexagon,
  Network,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { anatomyStats, anatomySystems } from "../data/marketingData";
import { units } from "../data/vanguardUnits";

const LabCanvas = lazy(() =>
  import("../lab/LabCanvas").then((m) => ({ default: m.LabCanvas })),
);

const systemIcons = [Cpu, ShieldCheck, Activity, Network, Sparkles, Volume2] as const;

type AnatomySectionProps = {
  onOpenLab: () => void;
  onMeetCollective: () => void;
};

export function AnatomySection({ onOpenLab, onMeetCollective }: AnatomySectionProps) {
  const [activeId, setActiveId] = useState<string>(anatomySystems[0].id);
  const active = anatomySystems.find((s) => s.id === activeId) ?? anatomySystems[0];
  const previewUnit = units[1] ?? units[0]; // Naja-7 sentinel as form demo

  return (
    <section id="anatomy" className="relative z-10 bg-[#020202] py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="mb-5 inline-flex items-center gap-2 border border-brand/30 px-4 py-2 text-[10px] tracking-[0.28em] text-brand">
              <Hexagon className="h-3.5 w-3.5" />
              EMBODIED INTELLIGENCE · ULTRA DETAIL
            </p>
            <h2 className="font-display text-5xl font-light leading-none tracking-tight sm:text-7xl">
              The Humanoid Form.
              <br />
              <span className="font-bold italic text-brand">
                Why we chose presence.
              </span>
            </h2>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-muted">
              HoloKai units are not abstract servers or floating interfaces. They
              are physical, ultra-detailed humanoid beings engineered for African
              climates, cultural protocols, and the dignity of standing among
              people—not above them.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:col-span-5">
            {anatomyStats.map((stat) => (
              <div
                key={stat.label}
                className="border border-border-subtle bg-white/[0.02] px-4 py-4"
              >
                <p className="font-display text-2xl text-brand">{stat.value}</p>
                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive systems + 3D preview */}
        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-[10px] font-bold tracking-[0.28em] text-muted">
              SELECT CHASSIS SYSTEM
            </p>
            <div className="flex flex-col gap-2">
              {anatomySystems.map((system, index) => {
                const Icon = systemIcons[index % systemIcons.length];
                const selected = system.id === activeId;
                return (
                  <button
                    key={system.id}
                    type="button"
                    onClick={() => setActiveId(system.id)}
                    className={`flex items-start gap-4 border px-4 py-4 text-left transition ${
                      selected
                        ? "border-brand/50 bg-brand/10"
                        : "border-border-subtle bg-white/[0.02] hover:border-brand/30"
                    }`}
                  >
                    <span
                      className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                        selected
                          ? "bg-brand text-black"
                          : "bg-brand/10 text-brand"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-display text-lg text-foreground">
                        {system.title}
                      </span>
                      <span className="mt-0.5 block text-[10px] tracking-[0.18em] text-muted">
                        {system.region}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="relative min-h-[320px] overflow-hidden border border-brand/30 bg-[#050505] md:col-span-3 md:min-h-[420px]">
                <Suspense
                  fallback={
                    <div className="grid h-full place-items-center text-[10px] tracking-[0.25em] text-brand/70">
                      LOADING HUMANOID PREVIEW
                    </div>
                  }
                >
                  <div className="absolute inset-0">
                    <LabCanvas unit={previewUnit} autoRotate muted mode="humanoid" />
                  </div>
                </Suspense>
                <div className="pointer-events-none absolute left-4 top-4 border border-border-subtle bg-black/50 px-3 py-1.5 text-[9px] tracking-[0.22em] text-brand backdrop-blur-sm">
                  3D HUMANOID PREVIEW · {previewUnit.name}
                </div>
              </div>

              <article className="flex flex-col border border-border-subtle bg-white/[0.025] p-6 md:col-span-2">
                <p className="text-[9px] font-bold tracking-[0.28em] text-brand">
                  {active.subtitle.toUpperCase()}
                </p>
                <h3 className="mt-3 font-display text-3xl text-foreground">{active.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {active.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {active.specs.map((spec) => (
                    <li
                      key={spec}
                      className="border border-brand/25 bg-brand/5 px-2.5 py-1 text-[9px] tracking-wider text-[var(--color-brand)]/90"
                    >
                      {spec}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[10px] tracking-[0.2em] text-zinc-600">
                  REGION · {active.region}
                </p>
              </article>
            </div>
          </div>
        </div>

        {/* Full system grid */}
        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {anatomySystems.map((system, index) => {
            const Icon = systemIcons[index % systemIcons.length];
            return (
              <article
                key={system.id}
                className="group border border-border-subtle bg-white/[0.025] p-7 transition hover:-translate-y-1 hover:border-brand/35"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-black">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-foreground">{system.title}</h3>
                <p className="mt-1 text-[10px] tracking-[0.2em] text-brand/80">
                  {system.subtitle}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{system.body}</p>
              </article>
            );
          })}
        </div>

        <blockquote className="mx-auto mt-16 max-w-3xl border-l-2 border-brand/50 pl-6 text-center sm:border-l-0 sm:pl-0 sm:text-center">
          <p className="font-display text-xl font-light italic leading-relaxed text-muted sm:text-2xl">
            &ldquo;We did not build machines that look like people. We built
            people-shaped vessels for memory, so that the ancestors might walk
            among us again—visible, audible, and present.&rdquo;
          </p>
          <p className="mt-4 text-[10px] tracking-[0.28em] text-brand/70">
            — HOLOKAI DESIGN CODEX · LAGOS 2026
          </p>
        </blockquote>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onOpenLab}
            className="group flex items-center justify-center gap-2 bg-brand px-7 py-4 text-[10px] font-bold tracking-[0.2em] text-black transition hover:bg-[var(--color-brand)]"
          >
            OPEN 3D LAB
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            type="button"
            onClick={onMeetCollective}
            className="border border-white/20 px-7 py-4 text-[10px] font-bold tracking-[0.2em] text-foreground transition hover:bg-white/5"
          >
            MEET THE COLLECTIVE
          </button>
        </div>
      </div>
    </section>
  );
}
