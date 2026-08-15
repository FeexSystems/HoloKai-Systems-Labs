import React from 'react';

export const metadata = {
  title: 'HoloKai · Civilization Archive & Vector RAG Store',
  description: 'Pan-African historical knowledge base indexed across 5 major eras.',
};

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-zinc-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="border-b border-amber-500/20 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Vector RAG Store</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">Civilization Archive</h1>
          </div>
          <span className="px-3 py-1 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
            5 Eras · 50+ Curated Entries
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#12121a] space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase">Era 1 · Pre-3000 BCE</span>
            <h3 className="text-xl font-bold text-white">Ancient Kemet & Nubian Kingdom</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Early dynastic metallurgy, astronomical alignment, and Nile valley agricultural innovations.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#12121a] space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase">Era 2 · 1000 BCE - 500 CE</span>
            <h3 className="text-xl font-bold text-white">Axumite Empire & Nok Terracotta</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Red Sea maritime trade routes, Ge'ez script epigraphy, and advanced iron smelting.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#12121a] space-y-3">
            <span className="text-xs font-mono text-amber-400 uppercase">Era 3 · 500 CE - 1500 CE</span>
            <h3 className="text-xl font-bold text-white">Mali, Songhai & Great Zimbabwe</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Timbuktu manuscripts, Sankore University scholarship, and dry-stone masonry architecture.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
