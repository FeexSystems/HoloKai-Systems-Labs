import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { CIVILIZATION_ARCHIVE } from '@/lib/civilizationArchiveData';
import { getTranslatedSummary } from '@/lib/translations';
import { useHoloKai } from '@/lib/HoloKaiContext';

export default function CommandPalette({ isOpen, onClose, query, setQuery, onSelectRecord }) {
  const inputRef = useRef(null);
  const { language } = useHoloKai();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredSearchResults = CIVILIZATION_ARCHIVE.filter((civ) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      civ.name.toLowerCase().includes(q) ||
      civ.region.toLowerCase().includes(q) ||
      civ.era?.toLowerCase().includes(q) ||
      civ.summary.toLowerCase().includes(q) ||
      civ.keyAchievements.some((a) => a.toLowerCase().includes(q)) ||
      civ.keyRulers.some((r) => r.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Global Command Search Palette"
    >
      <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-4 shadow-[0_0_50px_rgba(217,119,6,0.25)] space-y-4">
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search empires, manuscripts, rulers, or oral traditions..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none font-mono"
            aria-label="Command palette search input"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close command palette"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
          <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold">
            Civilization Archives & Primary Records
          </p>

          {filteredSearchResults.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-zinc-500">
              No records matching "{query}"
            </div>
          ) : (
            filteredSearchResults.map((civ) => (
              <button
                key={civ.id}
                onClick={() => {
                  onSelectRecord(civ);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-900 border border-white/5 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between group focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-amber-300 font-display">
                      {civ.name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/80">
                      {civ.era}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {getTranslatedSummary(civ.id, language, civ.summary)}
                  </p>
                </div>

                <span className="text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                  Inspect →
                </span>
              </button>
            ))
          )}
        </div>

        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Press <strong>ESC</strong> to exit command palette</span>
          <span className="text-amber-400/80">HoloKai Monolithic Index</span>
        </div>
      </div>
    </div>
  );
}
