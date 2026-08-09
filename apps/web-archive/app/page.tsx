'use client';

import React, { useEffect, useState } from 'react';
import { eventBus } from '@holokai/event-bus';
import { OracleQueryResponse } from '@holokai/contracts';
import { EpistemicBadge, CivilizationCard } from '@holokai/ui';

export default function ArchiveMFEPage() {
  const [lastQuery, setLastQuery] = useState<OracleQueryResponse | null>(null);

  useEffect(() => {
    // Listen for cross-MFE Oracle Query Events
    const unsubscribe = eventBus.subscribe<OracleQueryResponse>('ORACLE_QUERY_COMPLETED', (data) => {
      setLastQuery(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="max-w-6xl mx-auto space-y-8 p-6 md:p-12">
      {/* Header Banner */}
      <header className="border-b border-amber-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
            Micro-Frontend Remote · Port 3002
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-500 animate-pulse" />
            Civilization Archive MFE
          </h1>
        </div>
        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          EventBus Status: Subscribed
        </div>
      </header>

      {/* Live EventBus Listener Banner */}
      {lastQuery ? (
        <section className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-6 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              ⚡ Live Inter-MFE Sync Event Received
            </span>
            <EpistemicBadge stance={lastQuery.epistemicStance} confidence={lastQuery.confidenceScore} />
          </div>
          <p className="text-sm text-zinc-200">
            Archive matched primary sources for query: <strong className="text-white">"{lastQuery.text}"</strong>
          </p>
        </section>
      ) : (
        <section className="rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-zinc-400 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          Awaiting query broadcast from <code className="text-amber-400 font-mono">web-oracle</code> remote over global EventBus...
        </section>
      )}

      {/* Historical Era Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CivilizationCard
          civilization={{
            id: 'kemet-vaults',
            name: 'Ancient Kemet & Nubia',
            region: 'Nile Valley',
            era: 'Pre-3000 BCE',
            centuryRange: '31st c. BCE',
            description: 'Early Nile Valley dynastic metallurgy, astronomical alignment, and architectural geometry.',
            achievements: ['Metallurgy', 'Solar Astronomy', 'Monumental Stone'],
            keyFigures: ['Imhotep', 'Narmer'],
          }}
        />
        <CivilizationCard
          civilization={{
            id: 'axumite-nok',
            name: 'Axumite & Nok Heritage',
            region: 'Horn & West Africa',
            era: '1000 BCE - 500 CE',
            centuryRange: '1st c. CE',
            description: 'Red Sea trade routes, Ge\'ez script manuscript preservation, and terracotta metallurgy.',
            achievements: ['Ge\'ez Epigraphy', 'Terracotta Arts', 'Red Sea Commerce'],
            keyFigures: ['Ezana', 'Kaleb'],
          }}
        />
        <CivilizationCard
          civilization={{
            id: 'mali-songhai-archive',
            name: 'Mali & Timbuktu Codex',
            region: 'Niger Bend',
            era: '500 CE - 1500 CE',
            centuryRange: '14th c. CE',
            description: 'Sankore University manuscripts, astronomy, and dry-stone masonry of Great Zimbabwe.',
            achievements: ['Sankore Library', 'Mathematical Astronomy', 'Trade Law'],
            keyFigures: ['Mansa Musa', 'Askia Muhammad'],
          }}
        />
      </section>
    </main>
  );
}
