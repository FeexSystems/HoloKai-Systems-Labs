'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import VanguardCard from '../../components/vanguards/VanguardCard';

const VANGUARDS = [
  {
    id: 'kemet-alpha',
    name: 'Kemet-Alpha',
    role: 'The Archivist (Preserver & Scanner)',
    image: '/images/vanguard/kemet-alpha-fullbody.png',
    discipline: 'Epigraphy & Papyrus Digitization',
    origin: 'Nile Valley & Alexandrian Library Codex',
    lore: 'Master of hieroglyphic codices, optical epigraphy, and high-frequency document restoration.',
    badge: 'LEAD ARCHIVIST',
    color: 'emerald',
  },
  {
    id: 'kush-prime',
    name: 'Kush-Prime',
    role: 'The Metallurgist (Iron & Pyramids)',
    image: '/images/vanguard/kush-prime-fullbody.png',
    discipline: 'Meroitic Iron Smelting & Masonry',
    origin: 'Kingdom of Kush & Meroe',
    lore: 'Protector of royal funerary pyramids, bloomery iron furnaces, and high-density defensive structures.',
    badge: 'CHIEF ENGINEER',
    color: 'amber',
  },
  {
    id: 'asante-v',
    name: 'Asante-V',
    role: 'The Oracle (Predictor & Visionary)',
    image: '/images/vanguard/asante-v-fullbody.jpg',
    discipline: 'Golden Stool Sovereignty & Adinkra Logic',
    origin: 'Asante Empire & Kumasi Citadel',
    lore: 'Engineered with quantum Adinkra symbol processing to compute probabilistic future timelines.',
    badge: 'VISIONARY ORACLE',
    color: 'amber',
  },
  {
    id: 'bantu-node',
    name: 'Bantu-Node',
    role: 'The Navigator (Explorer & Mapper)',
    image: '/images/vanguard/bantu-node-fullbody.png',
    discipline: 'Sub-Saharan Migrations & Geodesic Navigation',
    origin: 'Great Lakes & Congo Basin',
    lore: 'Specializes in geodesic star-mapping, forest acoustic communications, and trans-continental routes.',
    badge: 'GEODESIC MAPPER',
    color: 'blue',
  },
  {
    id: 'oluwa-core',
    name: 'Oluwa-Core',
    role: 'The Griot (Oral Lineage & Memory)',
    image: '/images/vanguard/oluwa-core-fullbody.png',
    discipline: 'Ifa Binary Divination & Sonic Memory',
    origin: 'Yoruba & Benin Kingdom',
    lore: 'Preserves 256 Odù Ifá binary matrices and acoustic drum speech frequencies.',
    badge: 'SONIC GRIOT',
    color: 'purple',
  },
  {
    id: 'sika-gold',
    name: 'Sika-Gold',
    role: 'The Artisan (Creator & Craftsman)',
    image: '/images/vanguard/sika-gold-fullbody.png',
    discipline: 'Lost-Wax Bronze Casting & Metallurgy',
    origin: 'Kingdom of Benin & Ife',
    lore: 'Master craftsman of terracotta heads, bronze reliefs, and ceremonial goldweights.',
    badge: 'MASTER ARTISAN',
    color: 'amber',
  },
  {
    id: 'zamani-scholar',
    name: 'Zamani',
    role: 'The Scholar (Dialectician & Historian)',
    image: '/images/vanguard/zamani-fullbody.png',
    discipline: 'Timbuktu Manuscripts & Astronomical Tables',
    origin: 'Sankore University & Mali Empire',
    lore: 'Decipherer of Ajami scripts, mathematical treatises, and medieval African star charts.',
    badge: 'CHIEF SCHOLAR',
    color: 'blue',
  },
  {
    id: 'naja-7',
    name: 'Naja-7',
    role: 'The Sentinel (Defensive Guardian)',
    image: '/images/vanguard/naja-7-fullbody.png',
    discipline: 'Sungbo Eredo Ramparts & Defense Systems',
    origin: 'Ijebu Kingdom Eredo Enclosure',
    lore: 'Defensive guardian over 100-mile earthen ramparts and moat fortification networks.',
    badge: 'RAMPART GUARDIAN',
    color: 'rose',
  },
];

export default function VanguardsPage() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string>('');

  const disciplines = ['ALL', 'Epigraphy', 'Metallurgy', 'Oracle', 'Navigation'];

  const filteredVanguards = selectedDiscipline === 'ALL'
    ? VANGUARDS
    : VANGUARDS.filter((v) => v.discipline.toLowerCase().includes(selectedDiscipline.toLowerCase()) || v.badge.toLowerCase().includes(selectedDiscipline.toLowerCase()));

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
        {disciplines.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDiscipline(d)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedDiscipline === d
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
              <VanguardCard vanguard={vanguard} onAdd={handleAddToRequisition} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </main>
  );
}
