'use client';

import React, { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MFEErrorBoundary, MFELoadingSkeleton, ResearchLogCard, Input, Select, Spinner } from '@holokai/ui';

interface KnowledgeEntry {
  text: string;
  metadata: {
    domain: string;
    source: string;
    title: string;
    era?: string;
    region?: string;
  };
}

function ResearchMFEContent() {
  const [search, setSearch] = useState('');
  const [domain, setDomain] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<KnowledgeEntry | null>(null);

  const { data: records, isLoading, isError } = useQuery<KnowledgeEntry[]>({
    queryKey: ['research', search, domain],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (domain) params.append('domain', domain);
      
      const res = await fetch(`/api/bff/research?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch research records');
      return res.json();
    },
  });

  return (
    <main className="max-w-7xl mx-auto space-y-8 p-6 md:p-12 min-h-screen bg-[#05050a] text-white relative">
      <header className="border-b border-rose-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-rose-500 uppercase">
            Micro-Frontend Remote · Port 3003
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-400 animate-ping" />
            Research Portfolio
          </h1>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 p-6 rounded-2xl bg-[#0a0a0f] border border-white/5">
        <div className="flex-1">
          <Input 
            label="Global Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, titles, or events..."
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            label="Filter Domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            options={[
              { label: 'All Domains', value: '' },
              { label: 'Historian', value: 'historian' },
              { label: 'Archaeology', value: 'archaeology' },
              { label: 'Anthropology', value: 'anthropology' },
              { label: 'Ethics', value: 'ethics' }
            ]}
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spinner className="text-rose-500" />
          </div>
        ) : isError ? (
          <div className="p-6 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400">
            Error loading research records. Please ensure the Planetary BFF is active.
          </div>
        ) : records?.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 border border-white/5 rounded-2xl border-dashed">
            No research logs found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {records?.map((entry, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedEntry(entry)}
                className="cursor-pointer transition-transform hover:-translate-y-1"
              >
                <ResearchLogCard
                  title={entry.metadata.title}
                  domain={entry.metadata.domain}
                  era={entry.metadata.era}
                  region={entry.metadata.region}
                  text={entry.text}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Research Entry Detail Modal Drawer */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-rose-500/30 bg-[#0a0a0f] p-8 text-white shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-rose-500/20 pb-4">
              <div>
                <span className="text-xs font-mono uppercase text-rose-400 font-bold block">
                  Domain: {selectedEntry.metadata.domain}
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-1">{selectedEntry.metadata.title}</h2>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="size-8 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white font-mono text-sm flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-200 font-light leading-relaxed">
              <p className="p-4 rounded-xl bg-white/5 border border-white/10">{selectedEntry.text}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono text-zinc-400">
              <div>
                <span className="text-zinc-500 block text-[10px]">SOURCE CITATION</span>
                <span className="text-rose-300 font-bold">{selectedEntry.metadata.source}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">REGION / ERA</span>
                <span className="text-white font-bold">{selectedEntry.metadata.region || 'Pan-African'} · {selectedEntry.metadata.era || 'Codex Index'}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function ResearchMFEPage() {
  return (
    <MFEErrorBoundary zoneName="Research Dashboard">
      <Suspense fallback={<MFELoadingSkeleton />}>
        <ResearchMFEContent />
      </Suspense>
    </MFEErrorBoundary>
  );
}
