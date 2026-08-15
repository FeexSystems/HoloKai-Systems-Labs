'use client';

import React, { useState } from 'react';
import {
  Play, Pause, ChevronLeft, ChevronRight,
  Clock, Sparkles
} from 'lucide-react';
import { retroAudio } from '../lib/audioFeedback';

export interface HistoricalPeriod {
  id: string;
  year: number;
  label: string;
  title: string;
  location: string;
  digitizedManuscripts: number;
  griotOralArchives: number;
  civilizationNodes: number;
  precision: number;
  highlight: string;
}

export const HISTORICAL_PERIODS: HistoricalPeriod[] = [
  {
    id: '3000bce',
    year: -3000,
    label: '3000 BCE',
    title: 'Archaic Nilotic Epoch',
    location: 'Nile Valley & Nubia',
    digitizedManuscripts: 2400,
    griotOralArchives: 850,
    civilizationNodes: 14200,
    precision: 95.8,
    highlight: 'Early solar calendar reckoning, hieroglyphic papyri, and early flood gauges (Nilometers).',
  },
  {
    id: '1500bce',
    year: -1500,
    label: '1500 BCE',
    title: 'New Kingdom & Punt Era',
    location: 'Kerma, Thebes & Red Sea',
    digitizedManuscripts: 4800,
    griotOralArchives: 1200,
    civilizationNodes: 38400,
    precision: 97.2,
    highlight: 'Hatshepsut Punt expedition reliefs, medicinal Ebers scroll, and bronze casting.',
  },
  {
    id: '500bce',
    year: -500,
    label: '500 BCE',
    title: 'Meroë & Nok Terracotta Era',
    location: 'Central Sahel & Upper Nile',
    digitizedManuscripts: 7100,
    griotOralArchives: 1900,
    civilizationNodes: 62000,
    precision: 98.1,
    highlight: 'Meroitic cursive script, Nok iron smelting furnaces, and terracotta craftsmanship.',
  },
  {
    id: '330ce',
    year: 330,
    label: '330 CE',
    title: 'Aksumite Imperial Stelae',
    location: 'Horn of Africa & Red Sea',
    digitizedManuscripts: 9600,
    griotOralArchives: 2350,
    civilizationNodes: 84500,
    precision: 98.9,
    highlight: 'Ezana trilingual inscriptions, Ge\'ez parchment Gospel codices, and maritime currency.',
  },
  {
    id: '1000ce',
    year: 1000,
    label: '1000 CE',
    title: 'Ifá & Great Zimbabwe Era',
    location: 'West Africa & Southern Plateau',
    digitizedManuscripts: 12100,
    griotOralArchives: 2900,
    civilizationNodes: 105000,
    precision: 99.2,
    highlight: '256-state Ifá binary odu matrix, mortarless curved granite walls of Great Zimbabwe.',
  },
  {
    id: '1500ce',
    year: 1500,
    label: '1500 CE',
    title: 'Timbuktu Shankore Scholastic',
    location: 'Sahelian Belt & Swahili Coast',
    digitizedManuscripts: 14820,
    griotOralArchives: 3450,
    civilizationNodes: 128400,
    precision: 99.5,
    highlight: 'Hundreds of thousands of Sahelian manuscripts on optics, astronomy, and jurisprudence.',
  },
  {
    id: '2026ce',
    year: 2026,
    label: 'MODERN',
    title: 'Pan-African Quantum Archive',
    location: 'Global Triangulated Network',
    digitizedManuscripts: 18950,
    griotOralArchives: 4200,
    civilizationNodes: 156000,
    precision: 99.9,
    highlight: 'Full multi-modal digitization, high-density graph neural indexing, and zero-hallucination grounding.',
  },
];

interface OracleTimelineScrubberProps {
  activePeriodId?: string;
  onPeriodSelect: (period: HistoricalPeriod) => void;
  className?: string;
}

export function OracleTimelineScrubber({
  activePeriodId = '1500ce',
  onPeriodSelect,
  className = '',
}: OracleTimelineScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const activeIndex = HISTORICAL_PERIODS.findIndex((p) => p.id === activePeriodId);
  const currentPeriod = HISTORICAL_PERIODS[activeIndex] || HISTORICAL_PERIODS[5];

  const handleSelectIndex = (idx: number) => {
    if (idx < 0 || idx >= HISTORICAL_PERIODS.length) return;
    retroAudio.playOracleChime();
    const period = HISTORICAL_PERIODS[idx];
    if (onPeriodSelect) {
      onPeriodSelect(period);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    handleSelectIndex(val);
  };

  const toggleAutoPlay = () => {
    retroAudio.playGlassHoverHum();
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const interval = setInterval(() => {
        // Find next period and pass to onPeriodSelect
        const currIdx = HISTORICAL_PERIODS.findIndex((p) => p.id === activePeriodId);
        const nextIdx = (currIdx + 1) % HISTORICAL_PERIODS.length;
        retroAudio.playOracleChime();
        onPeriodSelect(HISTORICAL_PERIODS[nextIdx]);
      }, 3500);

      // Save interval reference to clear on stop
      (window as any).__timelineInterval = interval;
    }
  };

  React.useEffect(() => {
    if (!isPlaying && (window as any).__timelineInterval) {
      clearInterval((window as any).__timelineInterval);
      (window as any).__timelineInterval = null;
    }
    return () => {
      if ((window as any).__timelineInterval) {
        clearInterval((window as any).__timelineInterval);
      }
    };
  }, [isPlaying]);

  return (
    <div className={`glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-3 ${className}`}>
      {/* Top Controls & Current Period Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                HISTORICAL TIMELINE SCRUBBER
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700">
                {currentPeriod.label}
              </span>
            </div>
            <h4 className="text-sm font-display font-bold text-white">
              {currentPeriod.title} ({currentPeriod.location})
            </h4>
          </div>
        </div>

        {/* Step Navigation & Auto-Play */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            className="p-1.5 rounded-lg bg-zinc-900 border border-amber-500/20 text-amber-300 disabled:opacity-30 hover:bg-amber-500/20 text-xs transition-colors"
            title="Previous Period"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={toggleAutoPlay}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isPlaying
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_12px_rgba(232,184,75,0.3)] animate-pulse'
                : 'bg-zinc-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Scrubbing' : 'Auto-Scrub'}
          </button>

          <button
            onClick={() => handleSelectIndex(activeIndex + 1)}
            disabled={activeIndex === HISTORICAL_PERIODS.length - 1}
            className="p-1.5 rounded-lg bg-zinc-900 border border-amber-500/20 text-amber-300 disabled:opacity-30 hover:bg-amber-500/20 text-xs transition-colors"
            title="Next Period"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrub Bar Track */}
      <div className="space-y-2 pt-1">
        <div className="relative flex items-center">
          <input
            type="range"
            id="timeline_scrubber_range"
            name="timeline_scrubber_range"
            min="0"
            max={HISTORICAL_PERIODS.length - 1}
            step="1"
            value={activeIndex}
            onChange={handleSliderChange}
            className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-950 rounded-lg appearance-none border border-amber-500/30"
          />
        </div>

        {/* Period Labels */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {HISTORICAL_PERIODS.map((period, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={period.id}
                onClick={() => handleSelectIndex(idx)}
                onMouseEnter={() => retroAudio.playGlassHoverHum()}
                className={`py-1 rounded-lg text-[10px] font-mono transition-all border ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-[0_0_8px_rgba(232,184,75,0.3)]'
                    : 'bg-zinc-900/40 border-transparent text-zinc-400 hover:text-white hover:border-amber-500/20'
                }`}
              >
                {period.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Highlight Description Box */}
      <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-amber-500/20 text-xs text-zinc-300 font-body flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="truncate">{currentPeriod.highlight}</span>
      </div>
    </div>
  );
}
