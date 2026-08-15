'use client';
import React, { useState } from 'react';
import { CIVILIZATIONS, CivilizationCard, CivilizationDossier } from '@holokai/ui';
import { CivilizationEntry } from '@holokai/contracts';
import { Search, Map } from 'lucide-react';

export default function CivilizationsPage() {
  const [selectedCiv, setSelectedCiv] = useState<CivilizationEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCivs = CIVILIZATIONS.filter(civ => 
    civ.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    civ.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto space-y-12 p-6 md:p-12">
      <header className="border-b border-[var(--color-border)] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-[var(--color-brand)] uppercase">Civilization Archive</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2">The Great Empires</h1>
          <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
            Explore the sophisticated political, economic, and cultural powerhouses of African history. 
            From the mathematical prowess of Yoruba city-states to the formidable iron foundries of Kush.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[var(--color-brand)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search civilizations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-white text-sm focus:outline-none focus:border-[var(--color-brand)] transition-all w-full sm:w-64 font-mono placeholder-zinc-600"
            />
          </div>
          <button className="px-6 py-3 rounded-xl bg-[#12121a] border border-[var(--color-border)] hover:border-[var(--color-brand)] text-white text-sm font-mono transition-all flex items-center justify-center gap-2 whitespace-nowrap">
            <Map className="w-4 h-4 text-[var(--color-brand)]" />
            <span>Interactive Map</span>
          </button>
        </div>
      </header>

      {selectedCiv && (
        <section className="animate-in slide-in-from-top-4 fade-in duration-500">
          <CivilizationDossier 
            civilization={selectedCiv} 
            onClose={() => setSelectedCiv(null)} 
          />
        </section>
      )}

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCivs.map(civ => (
            <CivilizationCard 
              key={civ.id} 
              civilization={civ} 
              onExplore={setSelectedCiv} 
            />
          ))}
        </div>
        {filteredCivs.length === 0 && (
          <div className="py-24 text-center border border-dashed border-[var(--color-border)] rounded-3xl bg-[var(--color-surface-hover)]">
            <p className="text-zinc-500 font-mono">No civilizations found matching "{searchQuery}"</p>
          </div>
        )}
      </section>
    </main>
  );
}
