'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_REQUISITIONS = [
  {
    id: 'REQ-9081',
    item: 'Kemet-Alpha Epigraphy Unit Pass',
    category: 'Vanguard Access',
    status: 'DELIVERED',
    timestamp: '2026-08-10 14:22',
    amount: '$149.00',
  },
  {
    id: 'REQ-8842',
    item: 'Sankore Mathematical Astronomy Folio',
    category: '16-Volume Codex',
    status: 'PROCESSING',
    timestamp: '2026-08-10 19:40',
    amount: '$49.00',
  },
  {
    id: 'REQ-7619',
    item: 'Sungbo Eredo Rampart Telemetry Module',
    category: 'Defense Grid',
    status: 'DELIVERED',
    timestamp: '2026-08-09 11:05',
    amount: '$299.00',
  },
];

export default function RequisitionLogPage() {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredLogs = filter === 'ALL'
    ? MOCK_REQUISITIONS
    : MOCK_REQUISITIONS.filter((r) => r.status === filter);

  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 min-h-screen bg-[#05050a] text-white">
      <header className="border-b border-brand/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-brand uppercase font-bold flex items-center gap-2">
            <span className="size-2 rounded-full bg-brand-light animate-pulse" />
            Citizen Requisition & Order Log
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Requisition History & Cargo Log</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            Track civilizational hardware acquisitions, codex passes, and active network order receipts.
          </p>
        </div>
        <Link
          href="/vanguards"
          className="px-5 py-3 rounded-xl bg-brand text-black font-extrabold text-xs font-mono hover:bg-brand-light transition-all self-start md:self-auto shadow-lg shadow-brand/20"
        >
          + Requisition New Unit →
        </Link>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', 'DELIVERED', 'PROCESSING'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              filter === f ? 'bg-brand text-black shadow-md' : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Requisition Table Surface */}
      <div className="rounded-3xl border border-brand/30 bg-[#0a0a0f] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-[10px] font-mono font-bold text-brand-light uppercase tracking-wider">
                <th className="py-4 px-6">Requisition ID</th>
                <th className="py-4 px-6">Item / Artifact</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-mono">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log) => (
                  <motion.tr
                    layout
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-brand-light">{log.id}</td>
                    <td className="py-4 px-6 font-sans text-white font-semibold">{log.item}</td>
                    <td className="py-4 px-6 text-zinc-400">{log.category}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        log.status === 'DELIVERED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-brand/20 text-brand-light border-brand/30 animate-pulse'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-zinc-400">{log.timestamp}</td>
                    <td className="py-4 px-6 text-right font-bold text-white">{log.amount}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
