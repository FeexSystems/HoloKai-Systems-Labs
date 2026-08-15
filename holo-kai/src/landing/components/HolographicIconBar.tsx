import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SymbolItem {
  id: string;
  name: string;
  meaning: string;
  mathProperty: string;
  svgPath: string;
}

const ADINKRA_SYMBOLS: SymbolItem[] = [
  {
    id: "gye-nyame",
    name: "Gye Nyame",
    meaning: "Supremacy of Divine Intelligence & Infinity",
    mathProperty: "Recursive Radial Symmetry (Order 4)",
    svgPath: "M20 5 L25 15 L35 15 L27 22 L30 32 L20 25 L10 32 L13 22 L5 15 L15 15 Z"
  },
  {
    id: "sankofa",
    name: "Sankofa",
    meaning: "Return and Retrieve Knowledge from Past Eras",
    mathProperty: "Logarithmic Spiral (Golden Ratio \\Phi)",
    svgPath: "M12 22 C12 12, 28 12, 28 22 C28 28, 18 32, 12 28 C8 25, 8 18, 14 14"
  },
  {
    id: "dwennimmen",
    name: "Dwennimmen",
    meaning: "Humility and Strength of Wisdom",
    mathProperty: "Bilateral Dual-Horn Bifurcation",
    svgPath: "M10 20 Q 20 5 30 20 Q 20 35 10 20 Z M5 20 Q 20 0 35 20"
  },
  {
    id: "funtunfunefu",
    name: "Funtunfunefu",
    meaning: "Unity of Purpose & Shared Memory Base",
    mathProperty: "Interlocking Toroidal Topology",
    svgPath: "M15 15 A 10 10 0 1 0 25 25 A 10 10 0 1 0 15 15"
  }
];

export function HolographicIconBar() {
  const [activeSymbol, setActiveSymbol] = useState<SymbolItem>(ADINKRA_SYMBOLS[0]);

  return (
    <div className="w-full my-8 p-4 sm:p-6 rounded-none bg-zinc-950 border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl text-zinc-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-none bg-amber-500/10 border border-amber-500/40 flex shrink-0 items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="text-base sm:text-lg font-display font-light text-zinc-100 tracking-wide">
                Adinkra Holographic Symbol Bar
              </h3>
              <span className="text-[9px] px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono tracking-[0.18em] shrink-0">
                ETHNOMATHEMATICS
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Interactive Akan geometric glyphs &amp; fractal symmetry principles</p>
          </div>
        </div>
      </div>

      {/* Glyph Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {ADINKRA_SYMBOLS.map((symbol) => {
          const isActive = activeSymbol.id === symbol.id;
          return (
            <button
              key={symbol.id}
              type="button"
              onClick={() => setActiveSymbol(symbol)}
              className={`p-3.5 sm:p-4 rounded-none border text-left transition-all duration-300 relative overflow-hidden group appearance-none ${
                isActive
                  ? 'bg-amber-950/60 border-amber-500/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] text-amber-100'
                  : 'bg-zinc-900/90 border-amber-900/40 hover:border-amber-500/40 text-zinc-300 hover:text-amber-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 stroke-current fill-none stroke-2" viewBox="0 0 40 40">
                  <path d={symbol.svgPath} className={isActive ? "stroke-amber-400 fill-amber-500/20" : "stroke-amber-500/70"} />
                </svg>
                {isActive && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
              </div>
              <h4 className="text-xs font-display font-bold text-amber-300 tracking-wide mb-1">{symbol.name}</h4>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-light leading-snug line-clamp-2">{symbol.meaning}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Detail Panel */}
      <div className="mt-5 p-4 rounded-none bg-zinc-900/90 border border-amber-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
        <div className="space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">SYMBOL MEANING:</span>
          <p className="text-amber-200 font-normal">{activeSymbol.meaning}</p>
        </div>
        <div className="p-2.5 sm:p-3 rounded-none bg-amber-950/40 border border-amber-500/30 text-amber-300 shrink-0">
          <span className="text-zinc-500 text-[9px] uppercase tracking-wider block mb-0.5">ETHNOMATHEMATICAL PROPERTY:</span>
          <span className="font-bold tracking-wide">{activeSymbol.mathProperty}</span>
        </div>
      </div>
    </div>
  );
}
