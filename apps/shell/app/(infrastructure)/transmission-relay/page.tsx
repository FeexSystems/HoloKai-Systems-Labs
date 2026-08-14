'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransmissionRelayPage() {
  const [relayActive, setRelayActive] = useState(true);
  const [latency, setLatency] = useState(14);
  const [toastMessage, setToastMessage] = useState('');

  const handleSimulatePing = () => {
    if (!relayActive) {
      setToastMessage('⚠ Cannot ping: Transmission Relay is offline.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }
    const nextLatency = Math.floor(10 + Math.random() * 15);
    setLatency(nextLatency);
    setToastMessage(`✓ Diagnostic ping successful. Latency: ${nextLatency}ms`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleToggleRelay = () => {
    const nextState = !relayActive;
    setRelayActive(nextState);
    setToastMessage(`✓ Transmission Relay set to ${nextState ? 'ONLINE' : 'OFFLINE'}`);
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
          <span className="text-xs font-mono tracking-widest text-brand uppercase font-bold flex items-center gap-2">
            <span className={`size-2 rounded-full ${relayActive ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            Decentralized Communications & Relays
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Transmission Relays</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Manage high-frequency electromagnetic nodes and quantum receiver relays across sub-Saharan networks.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleToggleRelay}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
              relayActive ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            {relayActive ? 'Deactivate Relay' : 'Activate Relay'}
          </button>
          <button
            onClick={handleSimulatePing}
            className="px-4 py-2.5 rounded-xl bg-brand text-black text-xs font-mono font-extrabold hover:bg-brand-light transition-all"
          >
            ⚡ Test Latency
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Comms Relay Node */}
        <motion.div
          layout
          className="rounded-3xl border border-brand/30 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-brand-light font-bold uppercase">Quantum Relay Center</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold border ${
              relayActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
            }`}>
              {relayActive ? 'ACTIVE' : 'OFFLINE'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-zinc-500 block text-[10px]">CURRENT LATENCY</span>
              <span className="text-white font-bold">{relayActive ? `${latency}ms` : 'N/A'}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[10px]">THROUGHPUT</span>
              <span className="text-white font-bold">{relayActive ? '942.8 GB/s' : '0.0 GB/s'}</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Transmission Center Map */}
        <motion.div
          layout
          className="rounded-3xl border border-brand/30 bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono text-brand-light font-bold uppercase">Relay Nodes Topology</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand/20 text-brand-light text-[9px] font-mono font-bold border border-brand/30">
              STABLE
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono text-zinc-300">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <span>Nile Valley Relay (Kemet):</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <span>Benin Citadel Relay (Sika):</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
