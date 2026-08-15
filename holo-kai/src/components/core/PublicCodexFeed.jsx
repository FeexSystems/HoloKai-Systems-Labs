import React, { useState } from 'react';
import { MOCK_SOURCES, MOCK_MANUSCRIPTS } from '@/lib/mockData';
import { BookOpen, Sparkles, Filter, ChevronRight, ExternalLink, Cpu } from 'lucide-react';

export default function PublicCodexFeed({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allItems = [
    ...MOCK_SOURCES.map((s) => ({ ...s, itemType: 'source' })),
    ...MOCK_MANUSCRIPTS.map((m) => ({ ...m, itemType: 'manuscript' })),
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'sources' && item.itemType === 'source') ||
      (activeTab === 'manuscripts' && item.itemType === 'manuscript');

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      (item.civilization && item.civilization.toLowerCase().includes(q)) ||
      (item.summary && item.summary.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">
      {/* Controls & Filter Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 bg-zinc-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
              activeTab === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Archives
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
              activeTab === 'sources'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sources
          </button>
          <button
            onClick={() => setActiveTab('manuscripts')}
            className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all ${
              activeTab === 'manuscripts'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Manuscripts
          </button>
        </div>

        <input
          type="text"
          placeholder="Filter codices by kingdom, era, title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/40"
        />
      </div>

      {/* Grid of Public Codices */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.slice(0, 6).map((item, idx) => (
          <div
            key={item.slug || item.id || idx}
            className="group relative bg-zinc-900/70 border border-white/10 hover:border-amber-500/40 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {item.civilization || 'Pan-African'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {item.era || item.date}
                </span>
              </div>

              <h4 className="text-sm font-display font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                {item.title}
              </h4>

              <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                {item.summary || (item.hasTranslation ? 'Full manuscript translation available.' : 'Original transcription record.')}
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">
                {item.type || item.language}
              </span>
              <button
                onClick={() => onNavigate('/codex')}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Inspect Codex <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
