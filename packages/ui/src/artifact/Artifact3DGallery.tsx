"use client";

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box, ChevronLeft, ChevronRight, Play, Pause, Compass, Layers
} from 'lucide-react';
import { retroAudio } from '../lib/audioFeedback';
import { CIVILIZATIONS as CIVILIZATION_ARCHIVE } from '../data/civilizationsData';

const Spline = lazy(() => import('@splinetool/react-spline'));
const DEFAULT_SPLINE_URL = (process.env.NEXT_PUBLIC_SPLINE_SCENE_URL || 'https://prod.spline.design/UxqPsHJtrHQardbV/scene.splinecode').trim();

export const ARTIFACT_COLLECTION = [
  {
    id: 'art-kush-1',
    civId: 'kush',
    civName: 'Kingdom of Kush',
    title: 'Golden Shield of Kandake Amanishakheto',
    era: '1st Century BCE',
    material: 'Hammered Gold, Lapis Lazuli & Carnelian',
    provenance: 'Royal Pyramid N6, Meroë',
    description: 'A magnificent ceremonial gold shield and armlet set belonging to Queen Amanishakheto. It features embossed images of the ram-headed Amun and Kandake victorious over invaders.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gold', 'Kandake', 'Royal Regalia', 'Armory'],
    interactiveProps: { rotationSpeed: 0.8, wireframe: false, glowColor: '#A9D5B0' }
  },
  {
    id: 'art-kush-2',
    civId: 'kush',
    civName: 'Kingdom of Kush',
    title: 'Meroïtic Ceremonial Iron Blade',
    era: '300 BCE',
    material: 'Smelted Steel & Bronze Inlay',
    provenance: 'Iron Slag Heaps of Meroë',
    description: 'A double-edged ceremonial iron sword forged in the massive iron blast furnaces of Meroë—known as the "Birmingham of Ancient Africa".',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    tags: ['Iron Age', 'Metallurgy', 'Meroë', 'Weapons'],
    interactiveProps: { rotationSpeed: 1.2, wireframe: false, glowColor: '#d97706' }
  },
  {
    id: 'art-kemet-1',
    civId: 'kemet',
    civName: 'Kemet (Ancient Egypt)',
    title: 'Golden Burial Mask of Tutankhamun',
    era: '1323 BCE',
    material: 'Gold, Lapis Lazuli, Turquoise & Obsidian',
    provenance: 'Valley of the Kings, KV62',
    description: 'The iconic golden death mask inlaid with semi-precious stones, representing the divine rebirth of the pharaoh as Osiris.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gold', 'Pharaoh', 'Nile', 'Sacred'],
    interactiveProps: { rotationSpeed: 0.6, wireframe: false, glowColor: '#fbbf24' }
  },
  {
    id: 'art-aksum-1',
    civId: 'aksum',
    civName: 'Aksumite Empire',
    title: 'Gold Coin of King Ezana',
    era: '330 CE',
    material: 'Solid Struck Gold (Dinar)',
    provenance: 'Aksum Royal Mint',
    description: 'A finely struck gold currency bearing the portrait of King Ezana framed by wheat stalks, marked with early Ge\'ez script and Christian cross iconography.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Numismatics', 'Ezana', 'Ge\'ez', 'Trade'],
    interactiveProps: { rotationSpeed: 1.0, wireframe: false, glowColor: '#A9D5B0' }
  },
  {
    id: 'art-mali-1',
    civId: 'mali',
    civName: 'Mali Empire',
    title: 'Astrolabe of Timbuktu Scholars',
    era: '1350 CE',
    material: 'Engraved Brass & Silver Inlay',
    provenance: 'Sankore University Archive, Timbuktu',
    description: 'A precision astronomical instrument used by Timbuktu astronomers to calculate planetary coordinates, navigation headings, and celestial calendars.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Astronomy', 'Timbuktu', 'Manuscripts', 'Brass'],
    interactiveProps: { rotationSpeed: 0.7, wireframe: false, glowColor: '#3b82f6' }
  },
  {
    id: 'art-benin-1',
    civId: 'benin',
    civName: 'Kingdom of Benin',
    title: 'Benin Royal Bronze Pendant Mask of Queen Idia',
    era: '16th Century CE',
    material: 'Cast Ivory, Iron Inlay & Bronze',
    provenance: 'Royal Palace of Benin City',
    description: 'A masterwork pendant mask depicting Queen Idia (Iyoba), mother of Oba Esigie, featuring Portuguese merchant portraits and mudfish carved along her crown.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    tags: ['Ivory', 'Iyoba', 'Bronze', 'Benin'],
    interactiveProps: { rotationSpeed: 0.5, wireframe: false, glowColor: '#A9D5B0' }
  },
  {
    id: 'art-zimbabwe-1',
    civId: 'zimbabwe',
    civName: 'Great Zimbabwe',
    title: 'Soapstone Zimbabwe Bird Monument',
    era: '1200 CE',
    material: 'Carved Soapstone (Steatite)',
    provenance: 'Great Enclosure, Great Zimbabwe',
    description: 'The emblem bird sculpture combining eagle and human attributes, carved atop a monolith that guarded the royal complex of Great Zimbabwe.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1569091791842-7cfb64e04797?auto=format&fit=crop&w=1200&q=80',
    tags: ['Soapstone', 'Monument', 'Royal Seal', 'Stone Masonry'],
    interactiveProps: { rotationSpeed: 0.9, wireframe: false, glowColor: '#eab308' }
  },
  {
    id: 'art-zimbabwe-2',
    civId: 'zimbabwe',
    civName: 'Great Zimbabwe',
    title: 'Golden Rhinoceros of Mapungubwe',
    era: '1220 CE',
    material: 'Hammered Gold Foil over Carved Wood',
    provenance: 'Mapungubwe Hill Grave Site',
    description: 'A famous statuette crafted from thin sheets of gold foil held together with gold tacks, symbolizing sacred leadership and trade mastery.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gold Foil', 'Mapungubwe', 'Royal Animal', 'Southern Africa'],
    interactiveProps: { rotationSpeed: 0.8, wireframe: false, glowColor: '#fbbf24' }
  },
  {
    id: 'art-nok-1',
    civId: 'nok',
    civName: 'Nok Culture',
    title: 'Nok Terracotta Royal Head',
    era: '500 BCE',
    material: 'High-Fired Terracotta Clay',
    provenance: 'Jos Plateau, Nigeria',
    description: 'A dramatic terracotta head sculpture with pierced almond-shaped eyes, elaborate coiffure, and regal facial geometry, created using hollow clay modeling.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    tags: ['Terracotta', 'Ceramics', 'Nok', 'Ancient Sculpture'],
    interactiveProps: { rotationSpeed: 0.6, wireframe: false, glowColor: '#b45309' }
  },
  {
    id: 'art-yoruba-1',
    civId: 'yoruba',
    civName: 'Yoruba (Ifẹ Kingdom)',
    title: 'Naturalistic Brass Head of Ooni',
    era: '13th Century CE',
    material: 'Lost-Wax Cast Copper-Alloy Brass',
    provenance: 'Wunmonije Compound, Ile-Ife',
    description: 'An astonishing naturalistic portrait head of a Yorùbá divine king (Ooni), demonstrating unprecedented casting mastery that astonished global art historians.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Lost-Wax', 'Brass', 'Ifẹ', 'Naturalism'],
    interactiveProps: { rotationSpeed: 0.7, wireframe: false, glowColor: '#A9D5B0' }
  },
  {
    id: 'art-ashanti-1',
    civId: 'ashanti',
    civName: 'Ashanti Empire',
    title: 'Golden Pendant Mask of Osei Bonsu',
    era: '18th Century CE',
    material: 'Solid Struck Gold & Granulation',
    provenance: 'Kumasi Palace Treasury',
    description: 'A royal gold ornament worn on ceremonial belts, cast with intricate traditional symbols representing royal strength and unyielding courage.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    tags: ['Gold', 'Kumasi', 'Ashanti', 'Pendant'],
    interactiveProps: { rotationSpeed: 0.8, wireframe: false, glowColor: '#eab308' }
  },
  {
    id: 'art-ethiopia-1',
    civId: 'ethiopian',
    civName: 'Ethiopian Empire',
    title: 'Afenso Cross of Lalibela',
    era: '12th Century CE',
    material: 'Gilded Bronze & Filigree',
    provenance: 'Biete Medhane Alem, Lalibela',
    description: 'A magnificent processional cross with intricate cross-hatched filigree, carried during sacred Epiphany (Timkat) festivals at the rock churches.',
    splineUrl: DEFAULT_SPLINE_URL,
    imageFallback: 'https://images.unsplash.com/photo-1548625361-1851e44384a2?auto=format&fit=crop&w=1200&q=80',
    tags: ['Processional Cross', 'Lalibela', 'Gold Filigree', 'Sacred'],
    interactiveProps: { rotationSpeed: 0.5, wireframe: false, glowColor: '#fbbf24' }
  }
];

export default function Artifact3DGallery({ initialCivId = null, onClose = null }: { initialCivId?: string | null, onClose?: (() => void) | null }) {
  const theme = 'dark';
  const soundEffectsEnabled = true;
  const [selectedCivFilter, setSelectedCivFilter] = useState(initialCivId || 'all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);
  const [splineFailed, setSplineFailed] = useState(false);
  const [showDossier, setShowDossier] = useState(true);

  // Filter artifacts
  const filteredArtifacts = selectedCivFilter === 'all'
    ? ARTIFACT_COLLECTION
    : ARTIFACT_COLLECTION.filter(a => a.civId === selectedCivFilter);

  const currentArtifact = filteredArtifacts[currentIndex] || ARTIFACT_COLLECTION[0];

  // Auto-tour rotation timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isAutoWalking) {
      timer = setInterval(() => {
        handleNext();
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isAutoWalking, filteredArtifacts.length, currentIndex]);

  // Continuous 3D viewport rotater animation (disabled if prefers-reduced-motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let animId: number;
    const animate = () => {
      setRotationAngle((prev) => (prev + 0.4) % 360);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleNext = () => {
    if (soundEffectsEnabled) retroAudio.playClick();
    setCurrentIndex((prev) => (prev + 1) % filteredArtifacts.length);
  };

  const handlePrev = () => {
    if (soundEffectsEnabled) retroAudio.playClick();
    setCurrentIndex((prev) => (prev - 1 + filteredArtifacts.length) % filteredArtifacts.length);
  };

  const toggleAutoWalk = () => {
    if (soundEffectsEnabled) retroAudio.playClick();
    setIsAutoWalking(!isAutoWalking);
  };

  const toggleWireframe = () => {
    if (soundEffectsEnabled) retroAudio.playClick();
    setWireframeMode(!wireframeMode);
  };

  return (
    <div className="w-full min-h-[600px] rounded-3xl border overflow-hidden flex flex-col relative font-sans transition-all duration-500 shadow-2xl bg-[#050609] border-[var(--color-border)] text-zinc-100 shadow-black/90">
      {/* Top Gallery Controls Header */}
      <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 z-20 backdrop-blur-md border-white/10 bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-brand)]">
            <Box className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2">
              Virtual 3D Artifact Gallery
              <span className="text-[10px] px-2 py-0.5 rounded-full border bg-[var(--color-surface-hover)] border-[var(--color-border)] text-[var(--color-brand)] font-mono">
                WALKTHROUGH
              </span>
            </h2>
            <p className="text-xs opacity-60 font-mono">
              Exhibition Hall • {currentArtifact.civName} ({filteredArtifacts.length} Artifacts)
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCivFilter}
            onChange={(e) => {
              if (soundEffectsEnabled) retroAudio.playClick();
              setSelectedCivFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono outline-none border transition-all bg-zinc-900 border-white/10 text-zinc-200 focus:border-[var(--color-border)]"
          >
            <option value="all">🏛️ All Civilizations</option>
            {CIVILIZATION_ARCHIVE.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={toggleAutoWalk}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
              isAutoWalking
                ? 'bg-[var(--color-brand)] text-zinc-950 border-[var(--color-border)] animate-pulse'
                : 'bg-zinc-900 border-white/10 text-zinc-300 hover:text-white'
            }`}
          >
            {isAutoWalking ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoWalking ? 'Pause Tour' : 'Auto Walkthrough'}</span>
          </button>

          <button
            onClick={toggleWireframe}
            className={`p-2 rounded-xl text-xs font-mono flex items-center gap-1 transition-all border ${
              wireframeMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-zinc-900 border-white/10 text-zinc-300'
            }`}
            title="Toggle Structural Wireframe Overlay"
          >
            <Layers className="w-4 h-4" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-mono bg-[var(--color-surface-hover)] text-[var(--color-brand)] hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              Exit Exhibition
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Exhibition Canvas Stage */}
      <div className="flex-1 relative min-h-[460px] flex items-center justify-center overflow-hidden">
        {/* Ambient Pedestal Light Glow */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 opacity-20"
          style={{ backgroundColor: currentArtifact.interactiveProps.glowColor || '#A9D5B0' }}
        />

        {/* Spline 3D Scene Layer */}
        {!splineFailed && (
          <Suspense fallback={null}>
            <Spline
              scene={currentArtifact.splineUrl || DEFAULT_SPLINE_URL}
              onLoad={() => setIsSplineLoaded(true)}
              onError={() => setSplineFailed(true)}
              className="absolute inset-0 w-full h-full opacity-40 hover:opacity-100 transition-opacity duration-500 pointer-events-auto"
            />
          </Suspense>
        )}

        {/* 3D Volumetric Museum Pedestal Viewport */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
          {/* Volumetric Floating Artifact Model Display */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group">
            {/* Holographic Pedestal Ring */}
            <div className="absolute bottom-2 w-56 h-12 rounded-[100%] border border-[var(--color-border)] bg-[var(--color-brand)]/5 blur-[2px] animate-pulse" />
            <div className="absolute bottom-4 w-40 h-8 rounded-[100%] border border-[var(--color-border)] bg-[var(--color-brand)]/10" />

            {/* Rotating Artifact Mesh */}
            <div
              className={`relative w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300 ${
                wireframeMode ? 'border-cyan-400/80 shadow-cyan-500/20 bg-cyan-950/20' : 'border-[var(--color-border)] shadow-glow-brand'
              }`}
              style={{
                transform: `rotateY(${rotationAngle}deg) rotateX(10deg)`,
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              <img
                src={currentArtifact.imageFallback}
                alt={currentArtifact.title}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  wireframeMode ? 'invert opacity-70 contrast-200 saturate-200' : 'brightness-105 contrast-105'
                }`}
              />

              {/* Wireframe Grid Overlay */}
              {wireframeMode && (
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              )}
            </div>

            {/* Orbiting Particles */}
            <div className="absolute inset-0 pointer-events-none animate-spin-slow">
              <div className="w-2 h-2 rounded-full bg-[var(--color-brand)] shadow-[0_0_10px_#A9D5B0] absolute top-2 left-1/2" />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_#fde047] absolute bottom-4 right-10" />
            </div>
          </div>

          {/* Quick Artifact Title Tag */}
          <div className="mt-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand)] font-bold block mb-1">
              Exhibit #{currentIndex + 1} of {filteredArtifacts.length}
            </span>
            <h3 className="text-lg md:text-xl font-bold font-mono tracking-wide">
              {currentArtifact.title}
            </h3>
          </div>
        </div>

        {/* Left / Right Carousel Controls */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl border shadow-2xl z-30 transition-all hover:scale-110 bg-zinc-900/90 hover:bg-zinc-800 border-[var(--color-border)] text-[var(--color-brand)]"
          title="Previous Artifact"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl border shadow-2xl z-30 transition-all hover:scale-110 bg-zinc-900/90 hover:bg-zinc-800 border-[var(--color-border)] text-[var(--color-brand)]"
          title="Next Artifact"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Artifact Dossier Bottom Drawer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentArtifact.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 border-t z-20 backdrop-blur-md border-white/10 bg-zinc-950/90"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)]">
                  {currentArtifact.era}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-stone-800/20 text-stone-400 border border-white/5">
                  Material: {currentArtifact.material}
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {currentArtifact.description}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <Compass className="w-3.5 h-3.5 text-[var(--color-brand)]" />
                <span className="text-[11px] font-mono opacity-70">
                  Provenance: {currentArtifact.provenance}
                </span>
              </div>
            </div>

            {/* Tag Pills & Oracle Query Button */}
            <div className="flex flex-col gap-3 justify-center md:items-end">
              <div className="flex flex-wrap gap-1.5 md:justify-end">
                {currentArtifact.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md border bg-zinc-900 border-white/10 text-zinc-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
