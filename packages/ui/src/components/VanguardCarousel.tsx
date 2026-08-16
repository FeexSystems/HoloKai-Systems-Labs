'use client';

import React, { useRef, useState } from 'react';

export interface VanguardUnitData {
  id: string;
  name: string;
  title: string;
  role: string;
  image: string;
  video: string;
  color: string;
  archetype: string;
  description: string;
  metrics: {
    epistemicIndex: string;
    vectorMemory: string;
    ingestionSpeed: string;
    primaryDomain: string;
  };
}

export const VANGUARD_ROSTER: VanguardUnitData[] = [
  {
    id: '01',
    name: 'Kemet-Alpha',
    title: 'The Archivist',
    role: 'Preserver & Scanner',
    image: '/assets/vanguard-orbit/KEMET-ALPHA full body.JPG',
    video: '/assets/vanguard-orbit/KEMET-ALPHA.MP4',
    color: 'text-brand',
    archetype: 'Nile Epigraphy Specialist',
    description: 'Scans, digitizes, and reconstructs damaged papyri, stelae, and hieroglyphic inscriptions with sub-millimeter precision.',
    metrics: { epistemicIndex: '99.8%', vectorMemory: '18.4 TB', ingestionSpeed: '5.2k folios/s', primaryDomain: 'Nile Valley Epigraphy' },
  },
  {
    id: '02',
    name: 'Kush-Prime',
    title: 'The Weaver',
    role: 'Nexus Synchronizer',
    image: '/assets/vanguard-orbit/KUSH-PRIME-fullbody.JPG',
    video: '/assets/vanguard-orbit/KUSH-PRIME (1).MP4',
    color: 'text-emerald-400',
    archetype: 'Meroitic Trade Synchronizer',
    description: 'Weaves distributed knowledge graphs connecting Nubian iron metallurgy, trans-Saharan trade routes, and royal pyramids.',
    metrics: { epistemicIndex: '98.9%', vectorMemory: '14.2 TB', ingestionSpeed: '4.8k folios/s', primaryDomain: 'Nubian Metallurgy & Trade' },
  },
  {
    id: '03',
    name: 'Asante-V',
    title: 'The Oracle',
    role: 'Predictor & Visionary',
    image: '/assets/vanguard-orbit/ASANTE-V fullbody.JPG',
    video: '/assets/vanguard-orbit/ASANTE-V.MP4',
    color: 'text-yellow-300',
    archetype: 'Golden Stela Predictor',
    description: 'Forecasts cultural, astronomical, and linguistic shifts using multi-agent LLM probability models.',
    metrics: { epistemicIndex: '99.2%', vectorMemory: '22.1 TB', ingestionSpeed: '6.1k folios/s', primaryDomain: 'Akan Gold & Epistemology' },
  },
  {
    id: '04',
    name: 'Bantu-Node',
    title: 'The Navigator',
    role: 'Explorer & Mapper',
    image: '/assets/vanguard-orbit/BANTU-NODE-fullbody.JPG',
    video: '/assets/vanguard-orbit/KUSH-PRIME (1).MP4',
    color: 'text-cyan-400',
    archetype: 'Great Zimbabwe Architect',
    description: 'Maps the mortarless stone architecture, star alignment geometry, and trade networks of Great Zimbabwe.',
    metrics: { epistemicIndex: '97.8%', vectorMemory: '12.8 TB', ingestionSpeed: '3.9k folios/s', primaryDomain: 'Stone Architecture & Astronomy' },
  },
  {
    id: '05',
    name: 'Sika-Gold',
    title: 'The Artisan',
    role: 'Creator & Craftsman',
    image: '/assets/vanguard-orbit/SIKA-GOLD fullbody.JPG',
    video: '/assets/vanguard-orbit/SIKA-GOLD (1).MP4',
    color: 'text-brand-contrast',
    archetype: 'Metallurgical Master',
    description: 'Analyzes ancient lost-wax casting, bronze metallurgy, and goldsmithing techniques across Ife, Benin, and Ashanti.',
    metrics: { epistemicIndex: '99.1%', vectorMemory: '16.5 TB', ingestionSpeed: '4.5k folios/s', primaryDomain: 'Benin & Ife Bronze Craft' },
  },
  {
    id: '06',
    name: 'Zamani',
    title: 'The Scholar',
    role: 'Dialectician & Cross-Referencer',
    image: '/assets/vanguard-orbit/ZAMANI-fullbody.JPG',
    video: '/assets/vanguard-orbit/ZAMANI (1).MP4',
    color: 'text-purple-400',
    archetype: 'Timbuktu Scroll Scholar',
    description: 'Cross-references Shankore university manuscripts on astronomy, mathematics, jurisprudence, and medicine.',
    metrics: { epistemicIndex: '99.5%', vectorMemory: '25.6 TB', ingestionSpeed: '7.2k folios/s', primaryDomain: 'Timbuktu Shankore Manuscripts' },
  },
  {
    id: '07',
    name: 'Naja-7',
    title: 'The Sentinel',
    role: 'Tactical Guardian',
    image: '/assets/vanguard-orbit/NAJA-7 fullbody.JPG',
    video: '/assets/vanguard-orbit/NAJA-7.MP4',
    color: 'text-red-400',
    archetype: 'Dahomey Tactical Specialist',
    description: 'Guards civilizational memory, enforces epistemic security protocols, and audits primary source authenticity.',
    metrics: { epistemicIndex: '99.9%', vectorMemory: '19.8 TB', ingestionSpeed: '5.8k folios/s', primaryDomain: 'Dahomey Epistemic Security' },
  },
  {
    id: '08',
    name: 'Oluwa-Core',
    title: 'The Binary Diviner',
    role: 'Odu Mathematical Engine',
    image: '/assets/vanguard-orbit/OLUWA-CORE fullbody.JPG',
    video: '/assets/vanguard-orbit/OLIWA-CORE.MP4',
    color: 'text-emerald-300',
    archetype: 'Ifá 256-Matrix Engine',
    description: 'Computes probability distributions across 256 Odu binary signatures, preserving ancient algorithmic wisdom.',
    metrics: { epistemicIndex: '99.7%', vectorMemory: '31.2 TB', ingestionSpeed: '8.4k folios/s', primaryDomain: 'Ifá Binary Divination' },
  },
];

export interface VanguardCarouselProps {
  onSelectUnit?: (unit: VanguardUnitData) => void;
  className?: string;
}

export function VanguardCarousel({ onSelectUnit, className = '' }: VanguardCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeUnit = VANGUARD_ROSTER[activeIndex];
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % VANGUARD_ROSTER.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + VANGUARD_ROSTER.length) % VANGUARD_ROSTER.length);
  };

  const handleVoiceSample = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `ElevenLabs Voice Persona Activated. I am ${activeUnit.name}, ${activeUnit.title}. Specializing in ${activeUnit.metrics.primaryDomain}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`rounded-[36px] border border-border bg-gradient-to-b from-[#12121e] via-background to-background p-8 lg:p-12 text-white shadow-2xl space-y-8 backdrop-blur-2xl ${className}`}>
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand font-bold">
            Cinematic 3D Vanguard Gallery
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
            Meet the Vanguard VIII Guardians
          </h2>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrev}
            className="size-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-brand hover:text-black font-mono text-lg transition-all flex items-center justify-center shadow-lg"
            aria-label="Previous Vanguard Unit"
          >
            ←
          </button>
          <span className="font-mono text-xs text-brand font-bold px-2">
            {activeIndex + 1} / {VANGUARD_ROSTER.length}
          </span>
          <button
            onClick={handleNext}
            className="size-12 rounded-full border border-white/10 bg-white/5 text-white hover:bg-brand hover:text-black font-mono text-lg transition-all flex items-center justify-center shadow-lg"
            aria-label="Next Vanguard Unit"
          >
            →
          </button>
        </div>
      </div>

      {/* Main 3D Coverflow Display & Spec Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: 3D Video & Artwork Showcase */}
        <div className="lg:col-span-7 relative h-96 md:h-[460px] rounded-3xl overflow-hidden bg-black border border-border-strong shadow-2xl group flex items-center justify-center">
          {/* Static Fullbody Artwork */}
          <img
            src={activeUnit.image}
            alt={activeUnit.name}
            className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
          />

          {/* Autoplay MP4 Video Loop */}
          <video
            ref={videoRef}
            src={activeUnit.video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition-opacity duration-500"
          />

          {/* Overlay Status Badge */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-black/80 border border-border-strong text-xs font-mono font-bold text-brand backdrop-blur-md flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>UNIT {activeUnit.id} · {activeUnit.archetype.toUpperCase()}</span>
          </div>
        </div>

        {/* Right Column: Character Specs & Metrics */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-brand">
              Vanguard Guardian Persona
            </span>
            <h3 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              {activeUnit.name}
            </h3>
            <p className={`text-sm font-mono font-bold mt-1 ${activeUnit.color}`}>
              {activeUnit.title} · {activeUnit.role}
            </p>
          </div>

          <p className="text-sm text-zinc-300 leading-relaxed font-light">
            {activeUnit.description}
          </p>

          {/* 4-Metric Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 font-mono">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Epistemic Rigor</span>
              <span className="text-lg font-extrabold text-brand">{activeUnit.metrics.epistemicIndex}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Vector Memory</span>
              <span className="text-lg font-extrabold text-brand">{activeUnit.metrics.vectorMemory}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Ingestion Speed</span>
              <span className="text-lg font-extrabold text-emerald-400">{activeUnit.metrics.ingestionSpeed}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Primary Domain</span>
              <span className="text-xs font-bold text-white truncate block">{activeUnit.metrics.primaryDomain}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleVoiceSample}
              className="h-12 px-6 rounded-xl bg-brand text-black font-extrabold text-xs hover:brightness-110 shadow-lg shadow-glow-brand transition-all flex items-center justify-center gap-2"
            >
              <span>🔊</span>
              <span>Listen ElevenLabs Voice</span>
            </button>
            <button
              onClick={() => onSelectUnit && onSelectUnit(activeUnit)}
              className="h-12 px-6 rounded-xl border border-border-strong bg-white/5 text-brand font-bold text-xs hover:bg-white/10 transition-all flex items-center justify-center"
            >
              Inspect Matrix Dossier →
            </button>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 pt-4">
        {VANGUARD_ROSTER.map((unit, idx) => (
          <button
            key={unit.id}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === activeIndex ? 'w-8 bg-brand' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
