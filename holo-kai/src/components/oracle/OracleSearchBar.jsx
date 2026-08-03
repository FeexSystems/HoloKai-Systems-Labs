import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import TerminalText from '@/components/ui/TerminalText';
import { retroAudio } from '@/lib/audioFeedback';

export default function OracleSearchBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search manuscripts, oral archives, or civilizational epochs...",
  className = ""
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-display font-bold text-white tracking-wider flex items-center gap-2">
              HISTORICAL RECORD SEARCH
              <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                LIVE INDEX
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              Query 14,800+ digitized Sahelian codices, Ifá binaries, and Aksumite stelae.
            </p>
          </div>
        </div>

        {searchQuery && (
          <button
            onClick={() => {
              retroAudio.playGlassHoverHum();
              onSearchChange('');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-amber-500/20 text-zinc-400 hover:text-white text-xs font-mono self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5 text-amber-400" /> Clear Filter
          </button>
        )}
      </div>

      {/* Input box with TerminalText style typing animation overlay */}
      <div className="relative">
        <input
          type="text"
          id="oracle_search_bar_query"
          name="oracle_search_bar_query"
          value={searchQuery}
          onFocus={() => {
            retroAudio.playGlassHoverHum();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            retroAudio.playTerminalKeyClick();
            onSearchChange(e.target.value);
          }}
          onMouseEnter={() => retroAudio.playGlassHoverHum()}
          placeholder={placeholder}
          className="w-full bg-zinc-950/90 border border-amber-500/30 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-transparent focus:outline-none focus:border-amber-400 transition-all font-mono"
        />
        <Search className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-3.5 pointer-events-none" />

        {/* Dynamic TerminalText overlay when input is empty */}
        {!searchQuery && (
          <div className="absolute left-10 top-3 pointer-events-none text-xs text-zinc-500 font-mono flex items-center gap-1">
            <TerminalText
              prefix="QUERY::"
              text={[
                "Type 'Timbuktu Shankore' or 'Ifá Divination'...",
                "Type 'Aksum Ezana Stelae'...",
                "Type 'Great Zimbabwe Masonry'...",
              ][Math.floor(Date.now() / 6000) % 3]}
              speed={35}
              cursor={isFocused}
              playSound={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
