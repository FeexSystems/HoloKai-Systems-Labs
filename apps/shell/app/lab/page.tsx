'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from 'react-error-boundary';

// Use the existing R3F CivilizationGlobe (R3F + Three.js are already in shell deps)
const CivilizationGlobe = dynamic(
  () => import('../../components/three/CivilizationGlobe').then((m) => ({ default: m.CivilizationGlobe })),
  {
    loading: () => (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020202]">
        <div className="relative w-20 h-20 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-3 rounded-full border border-dashed border-teal-400/40 animate-[spin_3s_linear_infinite_reverse]" />
          <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_16px_6px_rgba(52,211,153,0.5)]" />
        </div>
        <p className="text-xs font-mono text-emerald-400/60 tracking-widest uppercase animate-pulse">
          Initializing 3D Canvas...
        </p>
      </div>
    ),
    ssr: false,
  }
);

const MFEFallback = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-xl p-8">
    <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mb-4" />
    <div className="text-xs font-mono tracking-widest text-amber-500 uppercase">Loading Module</div>
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-red-950/20 border border-red-500/30 rounded-xl p-8">
    <div className="text-red-400 font-mono text-sm mb-2">Module Load Failed</div>
    <div className="text-red-400/60 font-mono text-xs mb-4 max-w-md text-center">{error.message}</div>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg text-xs font-mono hover:bg-red-500/30 transition-colors"
    >
      Retry Connection
    </button>
  </div>
);

const DynamicArtifactGallery = dynamic<any>(
  () => import('@holokai/ui').then((mod) => mod.Artifact3DGallery as any),
  { ssr: false, loading: () => <MFEFallback /> }
);

const DynamicCelestialObservatory = dynamic<any>(
  () => import('@holokai/ui').then((mod) => mod.CelestialObservatory as any),
  { ssr: false, loading: () => <MFEFallback /> }
);

const DynamicUnitLabViewer = dynamic<any>(
  () => import('@holokai/ui').then((mod) => mod.UnitLabViewer as any),
  { ssr: false, loading: () => <MFEFallback /> }
);


const VANGUARD_UNITS = [
  { id: 'kemet', name: 'Kemet-Alpha', role: 'Archivist', color: 'emerald', status: 'ACTIVE' },
  { id: 'kush', name: 'Kush-Prime', role: 'Metallurgist', color: 'amber', status: 'STANDBY' },
  { id: 'asante', name: 'Asante-V', role: 'Oracle', color: 'amber', status: 'ACTIVE' },
  { id: 'bantu', name: 'Bantu-Node', role: 'Navigator', color: 'blue', status: 'ACTIVE' },
  { id: 'oluwa', name: 'Oluwa-Core', role: 'Griot', color: 'purple', status: 'STANDBY' },
  { id: 'sika', name: 'Sika-Gold', role: 'Artisan', color: 'amber', status: 'ACTIVE' },
];

const colorMap: Record<string, string> = {
  emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5',
  amber: 'border-amber-500/30 text-amber-400 bg-amber-500/5',
  blue: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
  purple: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
};

export default function LabPage() {
  const [activeUnit, setActiveUnit] = useState('kemet');
  const [activeTab, setActiveTab] = useState<'orbital' | 'gallery' | 'observatory'>('orbital');
  const [isUnitLabOpen, setIsUnitLabOpen] = useState(false);

  const selected = VANGUARD_UNITS.find((v) => v.id === activeUnit) ?? VANGUARD_UNITS[0];

  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 relative overflow-hidden">
      {/* Deep Space Nebula Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/15 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-amber-900/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Top Bar */}
        <header className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">3D Robotics &amp; Spatial Lab</span>
              <h1 className="text-xl font-bold tracking-tight text-white mt-0.5">Orbital Vanguard Stage</h1>
            </div>
            <span className="px-2.5 py-1 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
              ● WebGL Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {(['orbital', 'gallery', 'observatory'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-emerald-500 text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="/oracle/voice"
              className="px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold hover:bg-purple-500/20 transition-all"
            >
              🎙 Voice Engine
            </Link>
            <Link
              href="/vanguards"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-mono font-bold hover:bg-white/10 transition-all"
            >
              ← Vanguard Roster
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">

          {/* LEFT: Unit Selector Panel */}
          <aside className="w-56 shrink-0 border-r border-white/5 bg-black/30 backdrop-blur-md p-4 flex flex-col gap-2 overflow-y-auto">
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest px-2 mb-1">Active Units</p>
            {VANGUARD_UNITS.map((unit) => (
              <button
                key={unit.id}
                onClick={() => setActiveUnit(unit.id)}
                className={`w-full text-left px-3 py-3 rounded-xl border transition-all ${
                  activeUnit === unit.id
                    ? `${colorMap[unit.color]} border-opacity-100`
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-xs font-bold text-white">{unit.name}</div>
                <div className="text-[10px] font-mono text-zinc-500 mt-0.5">{unit.role}</div>
                <div className={`text-[9px] font-mono font-bold mt-1.5 ${
                  unit.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  ● {unit.status}
                </div>
              </button>
            ))}
          </aside>

          {/* CENTER: 3D Spline Viewport or Other Components */}
          <div className="flex-1 relative">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              {activeTab === 'orbital' && (
                <>
                  {/* Unit Info Overlay */}
                  <motion.div
                    key={activeUnit}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  >
                    <div className="px-5 py-2 rounded-full bg-black/70 border border-white/10 backdrop-blur-md flex items-center gap-3">
                      <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-mono text-white font-bold">{selected.name}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{selected.role} · {selected.status}</span>
                    </div>
                  </motion.div>

                  {/* R3F CivilizationGlobe 3D Scene */}
                  <div className="absolute inset-0">
                    <CivilizationGlobe />
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
                    <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/5 backdrop-blur-md">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Orbital Stage</p>
                      <p className="text-xs font-mono text-emerald-400 font-bold">Pan-African Vanguard Series</p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'gallery' && (
                <div className="absolute inset-0 p-8 overflow-y-auto">
                  <DynamicArtifactGallery />
                </div>
              )}

              {activeTab === 'observatory' && (
                <div className="absolute inset-0 p-8 overflow-y-auto">
                  <DynamicCelestialObservatory civId="kemet" />
                </div>
              )}
            </ErrorBoundary>
          </div>

          {/* RIGHT: Stats & Intel Panel */}
          <aside className="w-64 shrink-0 border-l border-white/5 bg-black/30 backdrop-blur-md p-5 flex flex-col gap-4 overflow-y-auto">
            <div className="space-y-1">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Unit Intelligence</p>
              <h3 className="text-base font-bold text-white">{selected.name}</h3>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Combat Class', value: selected.role },
                { label: 'Engine Status', value: selected.status },
                { label: 'AI Backbone', value: 'Gemini 2.0' },
                { label: 'TTS Engine', value: 'ElevenLabs' },
                { label: 'Origin', value: 'Pan-African Codex' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs border-b border-white/5 pb-2">
                  <span className="text-zinc-500 font-mono">{label}</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
            </div>

            {/* Telemetry */}
            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Live Telemetry</p>
              {[
                { label: 'Epistemic Accuracy', val: 97, color: 'bg-emerald-400' },
                { label: 'Vector Coherence', val: 84, color: 'bg-teal-400' },
                { label: 'Cultural Resonance', val: 91, color: 'bg-amber-400' },
              ].map(({ label, val, color }) => (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-400">{label}</span>
                    <span className="text-white">{val}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2 mt-auto">
              <button
                onClick={() => setIsUnitLabOpen(true)}
                className="block w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold text-center hover:bg-amber-500/20 transition-all"
              >
                🔍 Enter 3D Unit Lab
              </button>
              <Link
                href="/oracle/voice"
                className="block w-full py-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold text-center hover:bg-purple-500/20 transition-all"
              >
                🎙 Activate Voice Oracle
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {isUnitLabOpen && (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <DynamicUnitLabViewer 
            unit={selected as any} 
            onClose={() => setIsUnitLabOpen(false)} 
            onChangeUnit={(u: any) => setActiveUnit(u.id)}
          />
        </ErrorBoundary>
      )}
    </main>
  );
}
