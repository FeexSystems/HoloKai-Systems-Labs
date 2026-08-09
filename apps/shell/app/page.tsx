'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CivilizationCard,
  ArtifactCard,
  OracleChamber,
  EpistemicBadge,
  SpatialCanvas,
} from '@holokai/ui';
import { CivilizationEntry } from '@holokai/contracts';

const FEATURED_CIVILIZATIONS: CivilizationEntry[] = [
  {
    id: 'kemet-nile',
    name: 'Ancient Kemet & Nile Valley',
    region: 'North-East Africa',
    era: '3100 BCE – 332 BCE',
    centuryRange: '31st c. BCE – 4th c. BCE',
    description: 'Foundational civilization of hieroglyphic epigraphy, solar calendar astronomy, architectural geometry, and monumental stone masonry along the Nile Bend.',
    achievements: ['Hieroglyphic Epigraphy', 'Solar Astronomy', 'Pyramid Geometry'],
    keyFigures: ['Imhotep', 'Hatshepsut', 'Ramses II'],
  },
  {
    id: 'kush-meroe',
    name: 'Kingdom of Kush & Meroë',
    region: 'Middle Nile / Nubia',
    era: '1070 BCE – 350 CE',
    centuryRange: '11th c. BCE – 4th c. CE',
    description: 'Famed empire of Nubian royal pyramids, bloomery iron metallurgy, Meroitic cursive script, and female sovereign Candaces (Kandakes).',
    achievements: ['Bloomery Metallurgy', 'Meroitic Script', 'Nubian Pyramids'],
    keyFigures: ['Piye', 'Taharqa', 'Amanirenas'],
  },
  {
    id: 'axumite-empire',
    name: 'Axumite Empire',
    region: 'Horn of Africa',
    era: '100 CE – 940 CE',
    centuryRange: '2nd c. CE – 10th c. CE',
    description: 'Global trading empire bridging Rome, Persia, and India. Pioneers of Ge\'ez script epigraphy, monolithic stelae obelisks, and gold coinage.',
    achievements: ['Ge\'ez Manuscript Script', 'Monolithic Stelae', 'International Currency'],
    keyFigures: ['Ezana', 'Kaleb', 'Yared'],
  },
  {
    id: 'mali-songhai',
    name: 'Mali & Songhai Empires',
    region: 'West Africa / Niger Bend',
    era: '1235 CE – 1591 CE',
    centuryRange: '13th c. CE – 16th c. CE',
    description: 'Intellectual capital of medieval West Africa centered at Timbuktu\'s Sankore University. Renowned for manuscript astronomy, trade law, and gold reserves.',
    achievements: ['Sankore Manuscripts', 'Mathematical Astronomy', 'Ajami Epigraphy'],
    keyFigures: ['Mansa Musa', 'Sundiata Keita', 'Askia Muhammad'],
  },
  {
    id: 'great-zimbabwe',
    name: 'Great Zimbabwe & Monomotapa',
    region: 'Southern Africa',
    era: '1100 CE – 1450 CE',
    centuryRange: '12th c. CE – 15th c. CE',
    description: 'Mastery of mortarless granite dry-stone architecture, gold smelting, and Indian Ocean trade networks connecting Kilwa to inland plateaus.',
    achievements: ['Dry-Stone Masonry', 'Gold Smelting', 'Indian Ocean Trade'],
    keyFigures: ['Chigwagu Rusvingo', 'Mutota', 'Matope'],
  },
  {
    id: 'yoruba-benin',
    name: 'Yoruba & Benin Kingdoms',
    region: 'West African Forest Zone',
    era: '1100 CE – 1897 CE',
    centuryRange: '12th c. CE – 19th c. CE',
    description: 'World-renowned lost-wax bronze casting, terracotta sculpture, 256 Odù Ifá binary divination matrices, and the 100-mile Sungbo\'s Eredo earthworks.',
    achievements: ['Lost-Wax Bronze Casting', 'Ifá Binary Code', 'Sungbo\'s Eredo Earthworks'],
    keyFigures: ['Oduduwa', 'Oranmiyan', 'Oba Ewuare the Great'],
  },
];

const VANGUARD_PREVIEWS = [
  { name: 'Kemet-Alpha', title: 'The Lead Archivist', image: '/images/vanguard/kemet-alpha-fullbody.png', color: 'text-emerald-400' },
  { name: 'Kush-Prime', title: 'The Metallurgist', image: '/images/vanguard/kush-prime-fullbody.png', color: 'text-amber-400' },
  { name: 'Asante-V', title: 'The Visionary Oracle', image: '/images/vanguard/asante-v-fullbody.jpg', color: 'text-amber-400' },
  { name: 'Bantu-Node', title: 'The Geodesic Mapper', image: '/images/vanguard/bantu-node-fullbody.png', color: 'text-blue-400' },
];

export default function CivilizationHomePage() {
  const [selectedCivilization, setSelectedCivilization] = useState<CivilizationEntry | null>(null);

  return (
    <main className="space-y-24 pb-20">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-12 overflow-hidden border-b border-amber-500/20">
        <SpatialCanvas className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(200,149,42,0.14),transparent_75%)]" />
        </SpatialCanvas>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <span>✨ HoloKai Spatial Research Operating System</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-none">
            Where Civilizations <br />
            <span className="bg-gradient-to-r from-[#ffd27a] via-[#e8b84b] to-[#c8952a] bg-clip-text text-transparent">
              Remember.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
            An edge-native spatial instrument and AI synthesis platform for Pan-African epigraphy, archaeoastronomy, metallurgy, and oral memory.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-4">
            <Link
              href="/oracle"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-base hover:brightness-110 transition-all shadow-xl shadow-amber-500/25 flex items-center gap-3"
            >
              <span>Query Oracle AI Engine</span>
              <span>→</span>
            </Link>
            <Link
              href="/archive"
              className="px-8 py-4 rounded-2xl bg-[#12121a] hover:bg-[#1a1a26] border border-amber-500/30 text-white font-bold text-base transition-colors"
            >
              Explore 16-Volume Archive
            </Link>
            <Link
              href="/lab"
              className="px-8 py-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono text-sm font-semibold transition-colors"
            >
              Enter 3D Orbital Lab
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LIVE CODEX TICKER ===== */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3 text-amber-400 font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Live Knowledge Ingestion Feed
          </div>
          <p className="text-zinc-300 truncate max-w-2xl">
            Latest Ingestion: "Timbuktu Folio 418 — Trigonometric tables on lunar stations and planetary longitude."
          </p>
          <EpistemicBadge stance="ESTABLISHED" confidence={0.98} showTooltip={false} />
        </div>
      </section>

      {/* ===== CIVILIZATION MEMORY GRID ===== */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Civilization Memory Explorer
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              Pan-African Heritage & Eras
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Six major epigraphic and intellectual epochs indexed by vector distance and peer-reviewed evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_CIVILIZATIONS.map((civ) => (
            <CivilizationCard
              key={civ.id}
              civilization={civ}
              onExplore={(selected) => setSelectedCivilization(selected)}
            />
          ))}
        </div>
      </section>

      {/* ===== ORACLE INTELLIGENCE RESPONSE CHAMBER DEMO ===== */}
      <section className="max-w-7xl mx-auto px-6">
        <OracleChamber />
      </section>

      {/* ===== VANGUARD ROSTER PREVIEW ===== */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Guardians of Memory
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              8 Pan-African Vanguard Units
            </h2>
          </div>
          <Link
            href="/vanguards"
            className="text-xs font-mono text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>View All 8 Guardians</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {VANGUARD_PREVIEWS.map((v, i) => (
            <Link
              key={i}
              href="/vanguards"
              className="group p-5 rounded-2xl bg-[#12121a] border border-amber-500/20 hover:border-amber-500/40 text-center space-y-3 transition-all duration-300"
            >
              <div className="h-48 flex items-center justify-center overflow-hidden">
                <img
                  src={v.image}
                  alt={v.name}
                  className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                {v.name}
              </h4>
              <span className={`text-xs font-mono ${v.color} block`}>{v.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== ARTIFACT SHOWCASE ===== */}
      <section className="max-w-7xl mx-auto px-6 space-y-10">
        <div className="border-b border-amber-500/20 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Museum-Grade Artifact Dossiers
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
            Epigraphy & Physical Culture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ArtifactCard
            title="Sankore Mathematical Astronomy Folios"
            civilization="Timbuktu / Mali Empire"
            dateOrEra="c. 1590 CE"
            medium="Vellum & Iron-Gall Ink"
            image="/images/vanguard/asante-v-fullbody.jpg"
            provenance="Ahmed Baba Institute of Higher Islamic Studies, Timbuktu."
          />
          <ArtifactCard
            title="Benin Royal Ceremonial Relief"
            civilization="Kingdom of Benin"
            dateOrEra="c. 16th Century CE"
            medium="Lost-Wax Cast Bronze"
            image="/images/vanguard/sika-gold-fullbody.png"
            provenance="Benin City Guild of Bronze Casters (Igun Eronmwon)."
          />
          <ArtifactCard
            title="Meroe Pyramidal Inscription Stele"
            civilization="Kingdom of Kush"
            dateOrEra="c. 2nd Century BCE"
            medium="Granite Carving & Meroitic Script"
            image="/images/vanguard/kush-prime-fullbody.png"
            provenance="Royal Cemetery of Meroe, Nubia."
          />
        </div>
      </section>

      {/* ===== EPISTEMIC CLASSIFICATION SYSTEM ===== */}
      <section className="max-w-7xl mx-auto px-6 p-8 md:p-12 rounded-3xl border border-amber-500/30 bg-[#0a0a0f] space-y-8">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Epistemic Rigor & Truth Standard
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-1">
            6-Tier Knowledge Classification Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl bg-[#12121a] border border-emerald-500/30 space-y-2">
            <EpistemicBadge stance="ESTABLISHED" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Peer-reviewed archaeological, epigraphic, and genetic consensus with multiple primary sources.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-blue-500/30 space-y-2">
            <EpistemicBadge stance="SCHOLARLY_DEBATE" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Active academic discussion with competing hypotheses supported by partial physical evidence.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-amber-500/30 space-y-2">
            <EpistemicBadge stance="TRADITION" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Preserved oral lineage, Griot recitations, and elder memory corpora passed down through generations.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-purple-500/30 space-y-2">
            <EpistemicBadge stance="ESOTERIC" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Symbolic, cosmological, or ritual interpretations preserved in sacred geometric motifs.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-pink-500/30 space-y-2">
            <EpistemicBadge stance="SPECULATIVE" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Unverified structural or historical hypotheses requiring further archaeological ground-truth.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-[#12121a] border border-zinc-500/30 space-y-2">
            <EpistemicBadge stance="FICTIONAL" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Literary or mythological narrative elements demarcated for creative context.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
