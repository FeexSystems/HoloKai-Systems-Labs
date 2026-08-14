'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DefenseGridPage() {
  const [shieldPower, setShieldPower] = useState(98);
  const [gridMode, setGridMode] = useState<'NOMINAL' | 'OVERDRIVE' | 'STEALTH'>('NOMINAL');
  const [toastMessage, setToastMessage] = useState('');

  const handleModeChange = (mode: 'NOMINAL' | 'OVERDRIVE' | 'STEALTH') => {
    setGridMode(mode);
    if (mode === 'OVERDRIVE') setShieldPower(100);
    else if (mode === 'STEALTH') setShieldPower(85);
    else setShieldPower(98);

    setToastMessage(`✓ Defense Grid Mode updated to ${mode}.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 min-h-screen bg-[#05050a] text-white">
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-brand text-black font-mono text-xs font-extrabold shadow-2xl border border-brand-light"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-brand/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-brand uppercase font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Infrastructure Telemetry & Defense Grid
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Planetary Defense Grid</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Monitor real-time threat mitigation, Sungbo Eredo orbital shield integrity, and edge firewall telemetry.
          </p>
        </div>
        <div className="flex gap-2">
          {(['NOMINAL', 'OVERDRIVE', 'STEALTH'] as const).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                gridMode === m ? 'bg-brand text-black shadow-lg shadow-brand/20' : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Shield Telemetry */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-brand/30 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-brand-light font-bold uppercase">Orbital Shield Matrix</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
              {gridMode}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono font-bold">
              <span>Shield Integrity:</span>
              <span className="text-brand-light text-lg">{shieldPower}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${shieldPower}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-brand via-brand-light to-emerald-400 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-500 block text-[10px]">INSPECTION RAMPARTS</span>
              <span className="text-white font-bold">100-Mile Eredo Rampart</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">ACTIVE FIREWALL RULES</span>
              <span className="text-emerald-400 font-bold">1,024 Edge Rules Active</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Logistics & Edge Relays */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-brand/30 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-brand-light font-bold uppercase">Edge Logistics & Relays</span>
            <span className="px-3 py-1 rounded-full bg-brand/20 text-brand-light text-[10px] font-mono font-bold border border-brand/30">
              OPTIMIZED
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono text-zinc-300">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <span>Cloudflare Edge Workers:</span>
              <span className="text-emerald-400 font-bold">Global 24 PoPs</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <span>BFF API Gateway (Port 8000):</span>
              <span className="text-brand-light font-bold">Latency 12ms</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
              <span>Python AI Engine:</span>
              <span className="text-purple-300 font-bold">Memory Store Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
