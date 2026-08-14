'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IdentityMatrixPage() {
  const [activeTier, setActiveTier] = useState<'TIER_1' | 'TIER_2'>('TIER_1');
  const [synapseActive, setSynapseActive] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const handleToggleSynapse = () => {
    setSynapseActive(!synapseActive);
    setToastMessage(!synapseActive ? '✓ Synapse Node Re-connected.' : '⚠️ Synapse Node Suspended.');
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
            className="fixed top-24 right-6 z-50 px-5 py-3 rounded-2xl bg-[var(--color-brand)] text-black font-mono text-xs font-extrabold shadow-2xl border border-[var(--color-border)]"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <header className="border-b border-[var(--color-border)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[var(--color-brand)] uppercase font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Citizen Identity Node Matrix
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Identity Matrix & Telemetry</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Manage active neural synapses, civilizational access tiers, registered assets, and spatial telemetry.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTier('TIER_1')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTier === 'TIER_1' ? 'bg-[var(--color-brand)] text-black shadow-lg' : 'bg-white/5 text-zinc-400'
            }`}
          >
            Tier 1 Access Pass
          </button>
          <button
            onClick={() => setActiveTier('TIER_2')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTier === 'TIER_2' ? 'bg-[var(--color-brand)] text-black shadow-lg' : 'bg-white/5 text-zinc-400'
            }`}
          >
            Guest Pass
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Node 1: Access Tier & Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-[var(--color-brand)] font-bold uppercase">Identity Clearance</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
              ACTIVE
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Dr. Amara Diallo</h3>
            <span className="text-xs text-[var(--color-brand)] font-mono block mt-1">Senior Epigrapher & Archaeoastronomer</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span>Access Tier:</span>
              <span className="text-[var(--color-brand-light)] font-bold">{activeTier === 'TIER_1' ? 'Full Civilizational' : 'Guest Read-Only'}</span>
            </div>
            <div className="flex justify-between">
              <span>Security Score:</span>
              <span className="text-emerald-400 font-bold">99.4%</span>
            </div>
            <div className="flex justify-between">
              <span>Codex Access:</span>
              <span className="text-white font-bold">16 Volumes Digitized</span>
            </div>
          </div>
        </motion.div>

        {/* Node 2: Synapse Connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-[var(--color-brand)] font-bold uppercase">Neural Synapse Node</span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border ${
              synapseActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {synapseActive ? 'ONLINE' : 'SUSPENDED'}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Oracle Direct Link</h3>
            <span className="text-xs text-zinc-400 font-mono block mt-1">Bi-directional telemetry stream</span>
          </div>
          <div className="space-y-3 pt-2">
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
              <div className="bg-gradient-to-r from-[var(--color-brand)] to-emerald-400 h-full w-4/5 animate-pulse" />
            </div>
            <button
              onClick={handleToggleSynapse}
              className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
                synapseActive
                  ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30'
                  : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
              }`}
            >
              {synapseActive ? 'Suspend Synapse Stream' : 'Activate Synapse Link'}
            </button>
          </div>
        </motion.div>

        {/* Node 3: Archive & Spatial Vault */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-mono text-[var(--color-brand)] font-bold uppercase">Spatial Research Vault</span>
            <span className="px-3 py-1 rounded-full bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] text-[10px] font-mono font-bold border border-[var(--color-border)]">
              SYNCED
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">16-Volume Codex Vault</h3>
            <span className="text-xs text-zinc-400 font-mono block mt-1">Epistemic classification index</span>
          </div>
          <div className="space-y-2 text-xs font-mono text-zinc-400 pt-2 border-t border-white/5">
            <div className="flex justify-between">
              <span>Saved Dossiers:</span>
              <span className="text-[var(--color-brand-light)] font-bold">42 Synthesizations</span>
            </div>
            <div className="flex justify-between">
              <span>Vanguard Units:</span>
              <span className="text-white font-bold">8 Assigned</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
