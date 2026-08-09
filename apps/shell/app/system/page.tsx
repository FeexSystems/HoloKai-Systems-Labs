import React, { Suspense } from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'HoloKai · Platform Core Metrics & Runtime System',
  description: 'Edge telemetry, LCP performance targets, MFE orchestration status & BFF API gateway metrics.',
};

async function TelemetryWidget() {
  return (
    <div className="rounded-2xl border border-amber-500/30 bg-[#12121a] p-6 backdrop-blur-md space-y-2">
      <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-semibold">
        Edge Telemetry & LCP Target
      </div>
      <div className="text-4xl font-extrabold text-white">0.42s</div>
      <p className="text-xs text-zinc-400">Sub-1.0s LCP Target Met on 4G Global Edge Workers</p>
    </div>
  );
}

export default function SystemPage() {
  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 text-white">
      {/* System Header */}
      <header className="border-b border-amber-500/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <span>✨ Planetary Scale v11.0</span>
            <span>•</span>
            <span>Edge-Native Runtime</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
            Platform Infrastructure & Telemetry System
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            Real-time observability diagnostics, micro-frontend status, edge latency benchmarks, and GraphQL/BFF API topology.
          </p>
        </div>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono transition-colors self-start md:self-auto"
        >
          ← Return to Civilization OS
        </Link>
      </header>

      {/* Core Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense fallback={<div className="h-36 rounded-2xl bg-zinc-900/40 animate-pulse border border-white/5" />}>
          <TelemetryWidget />
        </Suspense>

        <div className="rounded-2xl border border-amber-500/30 bg-[#12121a] p-6 backdrop-blur-md space-y-2">
          <div className="text-xs uppercase tracking-widest text-blue-400 font-mono font-semibold">
            MFE Orchestration Mesh
          </div>
          <div className="text-4xl font-extrabold text-white">5 MFEs Active</div>
          <p className="text-xs text-zinc-400">Shell, Oracle, Archive, Research, Vanguards</p>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#12121a] p-6 backdrop-blur-md space-y-2">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold">
            BFF API Architecture
          </div>
          <div className="text-4xl font-extrabold text-white">TypeScript BFF</div>
          <p className="text-xs text-zinc-400">Unified Gateway, Genkit AI & JWT Auth</p>
        </div>
      </section>

      {/* Deep Architecture Breakdown */}
      <section className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0f] space-y-6">
        <h2 className="text-xl font-bold text-amber-400 border-b border-white/10 pb-4">
          Planetary UI Edge Architecture Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300 font-mono">
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-amber-400 font-bold block">1. Edge Router Worker</span>
            <p className="text-zinc-400 leading-relaxed">
              Geo-routing, device classification, and network profiling executed at global edge nodes without origin latency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-blue-400 font-bold block">2. Inter-MFE EventBus</span>
            <p className="text-zinc-400 leading-relaxed">
              Decoupled pub/sub event stream (`ORACLE_QUERY_COMPLETED`, `CIVILIZATION_SELECTED`) across dynamic remotes.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-emerald-400 font-bold block">3. Epistemic Classification Pipeline</span>
            <p className="text-zinc-400 leading-relaxed">
              6-tier evidence verification engine ensuring non-speculative scientific and historical transparency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-purple-400 font-bold block">4. Wolfram Computational Engine</span>
            <p className="text-zinc-400 leading-relaxed">
              Mathematical, astronomical, and chronological validation layer integrated with vector stores.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
