'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const ARCHIVE_ENTRIES = [
  {
    era: 'Era 1 · Pre-3000 BCE',
    id: 'era-1',
    title: 'Ancient Kemet & Nubian Kingdom',
    subtitle: 'Nile Valley Civilization',
    tag: 'Epigraphy · Astronomy',
    description:
      'Early dynastic metallurgy, astronomical alignment at Nabta Playa, hieroglyphic inscription systems, and Nile valley agricultural innovations rooted in ma\'at cosmology.',
    entries: 142,
    confidence: 'ESTABLISHED',
    color: 'amber',
    icon: '𓂀',
    topics: ['Hieroglyphics', 'Nabta Playa', 'Papyrus', 'Maat Philosophy', 'Pyramid Alignment'],
  },
  {
    era: 'Era 2 · 1000 BCE – 500 CE',
    id: 'era-2',
    title: 'Axumite Empire & Nok Terracotta',
    subtitle: 'Red Sea Trade Corridor',
    tag: 'Metallurgy · Maritime Trade',
    description:
      'Red Sea maritime trade routes, Ge\'ez script epigraphy, obelisk construction, advanced iron smelting and the first Sub-Saharan coinage system.',
    entries: 87,
    confidence: 'ESTABLISHED',
    color: 'emerald',
    icon: '⛵',
    topics: ["Ge'ez Script", 'Axum Obelisks', 'Iron Smelting', 'Coinage', 'Christianity in Africa'],
  },
  {
    era: 'Era 3 · 500 – 1500 CE',
    id: 'era-3',
    title: 'Mali, Songhai & Great Zimbabwe',
    subtitle: 'Golden Age of West Africa',
    tag: 'Architecture · Scholarship',
    description:
      'Timbuktu manuscripts at Sankore University, transcontinental Saharan trade, dry-stone masonry at Great Zimbabwe, and the Mansa Musa pilgrimage.',
    entries: 213,
    confidence: 'ESTABLISHED',
    color: 'amber',
    icon: '📚',
    topics: ['Timbuktu Manuscripts', 'Sankore University', 'Mansa Musa', 'Dry-Stone Masonry', 'Saharan Trade'],
  },
  {
    era: 'Era 4 · 1400 – 1800 CE',
    id: 'era-4',
    title: 'Benin Kingdom & Dahomey Empire',
    subtitle: 'Bronze & Military Excellence',
    tag: 'Bronze Casting · Oral Tradition',
    description:
      'Lost-wax bronze casting, the Ife terracotta traditions, Benin City urban planning, the Dahomey Amazons (Agojie), and Yoruba Ifá binary divination matrices.',
    entries: 164,
    confidence: 'ESTABLISHED',
    color: 'rose',
    icon: '🗿',
    topics: ['Benin Bronzes', 'Ife Terracotta', 'Ifá Divination', 'Agojie Warriors', 'Yoruba Cosmology'],
  },
  {
    era: 'Era 5 · 1800 CE – Present',
    id: 'era-5',
    title: 'Colonial Resistance & Renaissance',
    subtitle: 'Liberation & Cultural Memory',
    tag: 'History · Decolonization',
    description:
      'Pan-Africanism, the Zulu and Ashanti resistance campaigns, the Sungbo\'s Eredo earthwork rediscovery, and the post-colonial digital archiving movement.',
    entries: 98,
    confidence: 'SCHOLARLY_DEBATE',
    color: 'blue',
    icon: '✊',
    topics: ["Sungbo's Eredo", 'Pan-Africanism', 'Zulu Kingdom', 'Ashanti Wars', 'Oral Archives'],
  },
];

const confidenceColors: Record<string, string> = {
  ESTABLISHED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  SCHOLARLY_DEBATE: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  PROBABILISTIC: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
};

const eraColors: Record<string, string> = {
  amber: 'border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40',
  emerald: 'border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40',
  rose: 'border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40',
  blue: 'border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
};

const eraTagColors: Record<string, string> = {
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  rose: 'text-rose-400',
  blue: 'text-blue-400',
};

export default function ArchivePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState('ALL');

  const filteredEntries = useMemo(() => {
    let entries = ARCHIVE_ENTRIES;
    if (selectedEra !== 'ALL') {
      entries = entries.filter((e) => e.id === selectedEra);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.topics.some((t) => t.toLowerCase().includes(q)) ||
          e.tag.toLowerCase().includes(q)
      );
    }
    return entries;
  }, [searchQuery, selectedEra]);

  const totalEntries = ARCHIVE_ENTRIES.reduce((sum, e) => sum + e.entries, 0);

  return (
    <main className="min-h-screen bg-[#05050a] text-zinc-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <header className="border-b border-amber-500/20 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Vector RAG Store</span>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">Civilization Archive</h1>
              <p className="text-sm text-zinc-400 mt-2">
                {totalEntries}+ curated entries across 5 epochs · Cross-referenced with 16-Volume African Codex
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                5 Eras · {totalEntries}+ Entries
              </span>
              <Link
                href="/oracle"
                className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold hover:bg-amber-500/20 transition-all"
              >
                Ask Oracle AI →
              </Link>
            </div>
          </div>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search civilizations, topics, eras..."
              className="w-full pl-9 pr-4 py-3 bg-[#12121a] border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-amber-500/50 text-white placeholder-zinc-600 transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['ALL', ...ARCHIVE_ENTRIES.map((e) => e.id)].map((era) => (
              <button
                key={era}
                onClick={() => setSelectedEra(era)}
                className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                  selectedEra === era
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#12121a] border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                }`}
              >
                {era === 'ALL' ? 'All Eras' : `Era ${era.replace('era-', '')}`}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <p className="text-xs font-mono text-zinc-500">
            {filteredEntries.length} era{filteredEntries.length !== 1 ? 's' : ''} match &ldquo;{searchQuery}&rdquo;
          </p>
        )}

        {/* Era Cards Grid */}
        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, idx) => (
              <motion.article
                key={entry.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-6 rounded-2xl border transition-all ${eraColors[entry.color]} group`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Icon */}
                  <div className="shrink-0 w-12 h-12 rounded-xl border border-current/20 flex items-center justify-center text-2xl bg-black/40">
                    {entry.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <span className={`text-[10px] font-mono tracking-widest uppercase ${eraTagColors[entry.color]}`}>
                          {entry.era}
                        </span>
                        <h2 className="text-xl font-bold text-white mt-1">{entry.title}</h2>
                        <p className={`text-xs font-mono mt-0.5 ${eraTagColors[entry.color]}`}>{entry.subtitle}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${confidenceColors[entry.confidence]}`}>
                          {entry.confidence.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">{entry.entries} entries</span>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-400 leading-relaxed">{entry.description}</p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                      {entry.topics.map((topic) => (
                        <button
                          key={topic}
                          onClick={() => setSearchQuery(topic)}
                          className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-black/40 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                      <Link
                        href={`/oracle?q=${encodeURIComponent(entry.title)}`}
                        className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all ${
                          entry.color === 'amber' ? 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10' :
                          entry.color === 'emerald' ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' :
                          entry.color === 'rose' ? 'border-rose-500/30 text-rose-400 hover:bg-rose-500/10' :
                          'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'
                        }`}
                      >
                        Query Oracle AI →
                      </Link>
                      <span className="text-xs font-mono text-zinc-600 px-3 py-1.5">{entry.tag}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <div className="text-center py-20 space-y-4">
              <div className="text-4xl">📜</div>
              <p className="text-zinc-500 text-sm">No entries found for &ldquo;{searchQuery}&rdquo;</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedEra('ALL'); }}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
