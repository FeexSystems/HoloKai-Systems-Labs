import React from 'react';

export const metadata = {
  title: 'HoloKai · 3D Orbital Spline Lab',
  description: 'Interactive spatial laboratory for Pan-African Vanguard units and 3D robotics visualization.',
};

export default function LabPage() {
  return (
    <main className="min-h-screen bg-[#020202] text-zinc-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="border-b border-brand/20 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-brand uppercase">3D Robotics & Spatial Lab</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">Orbital Spline Viewport</h1>
          </div>
          <span className="px-3 py-1 text-xs font-mono bg-brand/10 text-brand-light border border-brand/30 rounded-full">
            Auto-Optimizer: Active
          </span>
        </header>

        <div className="relative aspect-video w-full rounded-2xl border border-brand/20 bg-black/80 overflow-hidden flex items-center justify-center">
          <div className="text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/30 mx-auto flex items-center justify-center text-brand-light font-mono text-xl animate-pulse">
              3D
            </div>
            <h2 className="text-xl font-bold text-white">Vanguard Orbital Stage Ready</h2>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Interactive 3D viewport streaming from <code className="text-brand-light">/models/scene.splinecode</code> with automatic R3F LabCanvas fallback.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
