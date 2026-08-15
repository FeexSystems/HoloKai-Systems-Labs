'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VanguardCard from '../../components/vanguards/VanguardCard';
import UnitModal from '../../components/vanguards/UnitModal';
import { units } from '@holokai/ui';
import { Unit } from '@holokai/contracts';

export default function VanguardsPage() {
  const [selectedSpec, setSelectedSpec] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Extract unique specs for filtering
  const allSpecs = Array.from(new Set(units.flatMap(u => u.specs)));
  const filterSpecs = ['ALL', 'Optical', 'Logic', 'Geo-spatial', 'Fluid dynamics', 'Acoustic synthesis'];

  const filteredVanguards = selectedSpec === 'ALL'
    ? units
    : units.filter((v) => v.specs.some(spec => spec.toLowerCase().includes(selectedSpec.toLowerCase()) || selectedSpec.toLowerCase().includes(spec.toLowerCase())));

  const handleAddToRequisition = (name: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('holokai_cart_change', { detail: { count: 1 } }));
    }
    setToastMessage(`✓ ${name} added to Requisition Roster.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12 min-h-screen bg-[#05050a] text-white">
      {/* Toast Notification Banner */}
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
          <span className="text-xs font-mono tracking-widest text-brand uppercase font-bold">
            Guardian Roster & Units
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Vanguard Units & Roster</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl font-light leading-relaxed">
            8 Specialized Afrofuturist Vanguard character units preserving Pan-African civilization epigraphy, metallurgy, astronomy, and oral memory.
          </p>
        </div>
        <Link
          href="/lab"
          className="px-5 py-3 rounded-xl bg-brand/10 border border-brand/30 text-brand-light text-xs font-mono font-bold hover:bg-brand/20 transition-all self-start md:self-auto"
        >
          View in 3D Orbital Lab →
        </Link>
      </header>

      {/* Discipline Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {filterSpecs.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedSpec(d)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedSpec === d
                ? 'bg-brand text-black shadow-lg shadow-brand/20'
                : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Vanguard Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVanguards.map((vanguard) => (
            <motion.div layout key={vanguard.id} className="h-[480px]" style={{ perspective: 1000 }}>
              <VanguardCard vanguard={vanguard} onAdd={handleAddToRequisition} onClick={() => setSelectedUnit(vanguard)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {selectedUnit && (
        <UnitModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} onAdd={handleAddToRequisition} />
      )}
    </main>
  );
}
