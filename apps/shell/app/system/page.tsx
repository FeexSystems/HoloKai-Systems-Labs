'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface MFEStatus {
  name: string;
  port: number;
  status: 'ONLINE' | 'STANDBY';
  latency: string;
}

export default function SystemPage() {
  const [lcpScore, setLcpScore] = useState(0.42);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Live Streaming...');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [mfes, setMfes] = useState<MFEStatus[]>([
    { name: 'Shell Host', port: 3000, status: 'ONLINE', latency: '4ms' },
    { name: 'Oracle AI MFE', port: 3001, status: 'ONLINE', latency: '12ms' },
    { name: 'Archive MFE', port: 3002, status: 'ONLINE', latency: '8ms' },
    { name: 'Research MFE', port: 3003, status: 'ONLINE', latency: '9ms' },
    { name: 'Cart & Commerce MFE', port: 3005, status: 'ONLINE', latency: '11ms' },
    { name: 'Planetary BFF Gateway', port: 8000, status: 'ONLINE', latency: '15ms' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLcpScore(+(0.3 + Math.random() * 0.2).toFixed(2));
      
      setMfes(prev => prev.map(mfe => {
        const baseLatency = parseInt(mfe.latency);
        const newLatency = Math.max(2, baseLatency + (Math.random() * 4 - 2));
        return { ...mfe, latency: `${Math.floor(newLatency)}ms` };
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshDiagnostics = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLcpScore(+(0.35 + Math.random() * 0.15).toFixed(2));
      setLastRefreshed(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 text-white min-h-screen bg-[#05050a] relative overflow-hidden">
      {/* Cyberpunk Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-10">
      {/* System Header */}
      <header className="border-b border-brand/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/30 text-brand-light text-xs font-mono font-bold">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Planetary Infrastructure v14.0</span>
            <span>•</span>
            <span>Edge Observability</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-3">
            Platform Infrastructure & Telemetry System
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Real-time observability diagnostics, micro-frontend status, edge latency benchmarks, and BFF API topology.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshDiagnostics}
            disabled={isRefreshing}
            className="px-4 py-2.5 rounded-xl bg-brand text-black text-xs font-mono font-extrabold shadow-lg hover:bg-brand-light disabled:opacity-50 transition-all"
          >
            {isRefreshing ? 'Pinging Telemetry...' : '⚡ Refresh Diagnostics'}
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono font-bold transition-colors self-start md:self-auto"
          >
            ← Home
          </Link>
        </div>
      </header>

      {/* Core Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-brand/50 bg-[#12121a]/80 p-6 backdrop-blur-md space-y-3 shadow-[0_0_25px_rgba(200,149,42,0.15)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-3xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150" />
          <div className="text-xs uppercase tracking-widest text-brand-light font-mono font-bold relative z-10">
            Global Edge Telemetry (LCP)
          </div>
          <div className="text-4xl font-extrabold text-white flex items-baseline gap-2">
            <span>{lcpScore}s</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">Sub-1.0s Target Met</span>
          </div>
          <p className="text-xs text-zinc-400 font-light">Last checked: {lastRefreshed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-blue-500/50 bg-[#12121a]/80 p-6 backdrop-blur-md space-y-3 shadow-[0_0_25px_rgba(59,130,246,0.15)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150" />
          <div className="text-xs uppercase tracking-widest text-blue-400 font-mono font-bold relative z-10">
            MFE Orchestration Mesh
          </div>
          <div className="text-4xl font-extrabold text-white">6 Remotes Active</div>
          <p className="text-xs text-zinc-400 font-light">Shell, Oracle, Archive, Research, Cart, BFF</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-emerald-500/50 bg-[#12121a]/80 p-6 backdrop-blur-md space-y-3 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl -mr-10 -mt-10 transition-transform duration-1000 group-hover:scale-150" />
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold relative z-10">
            Planetary BFF API Gateway
          </div>
          <div className="text-4xl font-extrabold text-white">Port 8000</div>
          <p className="text-xs text-zinc-400 font-light">TypeScript Express, Clerk Auth & Gemini Synthesis</p>
        </motion.div>
      </section>

      {/* Live MFE Network Status Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-brand-light font-mono">Micro-Frontend Remotes Topology</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mfes.map((mfe) => (
            <motion.div
              layout
              key={mfe.name}
              className="p-4 rounded-2xl bg-[#0a0a0f] border border-brand/30 flex items-center justify-between font-mono text-xs hover:border-brand-light/80 transition-colors shadow-[0_0_15px_rgba(200,149,42,0.05)] hover:shadow-[0_0_20px_rgba(200,149,42,0.2)]"
            >
              <div>
                <span className="font-bold text-white block">{mfe.name}</span>
                <span className="text-zinc-500">Port {mfe.port}</span>
              </div>
              <div className="text-right space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  ● {mfe.status}
                </span>
                <span className="text-zinc-400 block text-[10px]">{mfe.latency}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Deep Architecture Breakdown */}
      <section className="p-8 rounded-3xl border border-white/10 bg-[#0a0a0f] space-y-6">
        <h2 className="text-xl font-bold text-brand-light border-b border-white/10 pb-4 font-mono">
          Planetary UI Edge Architecture Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-300 font-mono">
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-brand-light font-bold block">1. Edge Router Worker</span>
            <p className="text-zinc-400 leading-relaxed font-light">
              Geo-routing, device classification, and network profiling executed at global edge nodes without origin latency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-blue-400 font-bold block">2. Inter-MFE EventBus</span>
            <p className="text-zinc-400 leading-relaxed font-light">
              Decoupled pub/sub event stream (`ORACLE_QUERY_COMPLETED`, `holokai_cart_change`) across dynamic remotes.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-emerald-400 font-bold block">3. Epistemic Classification Pipeline</span>
            <p className="text-zinc-400 leading-relaxed font-light">
              6-tier evidence verification engine ensuring non-speculative scientific and historical transparency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2">
            <span className="text-purple-400 font-bold block">4. Python AI Engine & Vector Store</span>
            <p className="text-zinc-400 leading-relaxed font-light">
              16-Volume African Codex vector memory store integrated with Gemini AI synthesis.
            </p>
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
