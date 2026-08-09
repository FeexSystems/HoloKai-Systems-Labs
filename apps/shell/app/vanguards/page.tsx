import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'HoloKai · Vanguard Guardians & Units',
  description: 'Pan-African Afrofuturist Vanguard character units, specialization disciplines & technical blueprints.',
};

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
  return (
    <main className="max-w-7xl mx-auto space-y-10 p-6 md:p-12">
      <header className="border-b border-amber-500/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Guardian Roster</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Vanguard Units & Roster</h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
            8 Specialized Afrofuturist Vanguard character units preserving Pan-African civilization epigraphy, metallurgy, astronomy, and oral memory.
          </p>
        </div>
        <Link
          href="/lab"
          className="px-5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/20 transition-colors self-start md:self-auto"
        >
          View in 3D Orbital Lab →
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {VANGUARDS.map((vanguard) => (
          <div
            key={vanguard.id}
            className="rounded-2xl border border-amber-500/20 bg-[#12121a] overflow-hidden flex flex-col hover:border-amber-500/40 transition-all duration-300 group"
          >
            <div className="relative h-72 w-full bg-zinc-950 flex items-center justify-center p-4">
              <img
                src={vanguard.image}
                alt={vanguard.name}
                className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono tracking-wider font-semibold">
                {vanguard.badge}
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="text-xl font-extrabold text-white group-hover:text-amber-400 transition-colors">
                  {vanguard.name}
                </h3>
                <span className="text-xs text-amber-400/90 font-medium block mt-0.5">{vanguard.role}</span>
                <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">{vanguard.lore}</p>
              </div>

              <div className="border-t border-white/5 pt-3 space-y-1">
                <div className="text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-400">Origin:</span> {vanguard.origin}
                </div>
                <div className="text-[11px] font-mono text-zinc-400">
                  <span className="text-zinc-400">Field:</span> {vanguard.discipline}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
