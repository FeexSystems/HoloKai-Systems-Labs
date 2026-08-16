'use client';

import React, { useState } from 'react';

export interface DomainSearchProps {
  defaultValue?: string;
  placeholder?: string;
  onSearch?: (query: string, beastMode: boolean) => void;
  className?: string;
}

export function DomainSearch({
  defaultValue = '',
  placeholder = 'Search civilizations, manuscripts, oral corpora, or epigraphy...',
  onSearch,
  className = '',
}: DomainSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [beastMode, setBeastMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && query.trim()) {
      onSearch(query, beastMode);
    }
  };

  return (
    <div
      className={`rounded-[24px] border border-border bg-background/90 p-3 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-border ${className}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 w-full">
          <label htmlFor="domain-search-input" className="sr-only">
            Search HoloKai OS
          </label>
          <span className="text-brand font-mono text-lg" aria-hidden="true">🔍</span>
          <input
            id="domain-search-input"
            name="searchQuery"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full h-12 bg-transparent text-white placeholder-zinc-500 text-sm md:text-base outline-none font-medium"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto px-2">
          {/* Beast Mode Toggle */}
          <button
            type="button"
            onClick={() => setBeastMode(!beastMode)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
              beastMode
                ? 'bg-surface-hover border-brand text-brand shadow-md shadow-glow-brand'
                : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            {beastMode ? '⚡ Beast Mode ON' : 'Beast Mode'}
          </button>

          {/* Search Action Button */}
          <button
            type="submit"
            className="h-12 rounded-[18px] px-8 bg-gradient-to-r from-brand to-brand-contrast text-black font-extrabold text-sm hover:brightness-110 shadow-glow-brand transition-all"
          >
            Search OS →
          </button>
        </div>
      </form>
    </div>
  );
}
