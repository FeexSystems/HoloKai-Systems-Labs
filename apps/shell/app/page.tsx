import React, { Suspense } from 'react';
import { COLOR_TOKENS } from '@holokai/design-system';

async function TelemetryWidget() {
  // Simulate server-side telemetry fetch in streaming RSC
  return (
    <div className="rounded-xl border border-amber-500/20 bg-zinc-900/60 p-6 backdrop-blur-md">
      <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
        Edge Telemetry & LCP Target
      </div>
      <div className="text-3xl font-extrabold text-white">0.42s</div>
      <p className="text-xs text-zinc-400 mt-1">Sub-1.0s LCP Target Met on 4G Global Edge</p>
    </div>
  );
}

export default function ShellHomePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Planetary UI Platform Runtime
        </h1>
        <p className="text-lg text-zinc-400">
          Edge-native micro-frontend architecture powered by Next.js App Router streaming SSR & Cloudflare edge Workers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Suspense
          fallback={
            <div className="h-32 rounded-xl bg-zinc-900/40 animate-pulse border border-white/5" />
          }
        >
          <TelemetryWidget />
        </Suspense>

        <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md">
          <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-2">
            MFE Orchestration
          </div>
          <div className="text-3xl font-extrabold text-white">5 MFEs</div>
          <p className="text-xs text-zinc-400 mt-1">Shell, Oracle, Archive, Research, Account</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2">
            BFF Architecture
          </div>
          <div className="text-3xl font-extrabold text-white">TypeScript BFF</div>
          <p className="text-xs text-zinc-400 mt-1">Unified API Gateway & JWT Session Auth</p>
        </div>
      </div>
    </div>
  );
}
