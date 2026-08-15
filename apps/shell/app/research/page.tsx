'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  EvidenceMatrix, 
  CitationChainViewer, 
  TriangulationReasoningPanel, 
  SourceDrawer 
} from '@holokai/ui';

export default function ResearchPage() {
  const [selectedCitation, setSelectedCitation] = useState<any>(null);

  const citations = [
    { id: '1', title: 'Sankore Mathematical Astronomy Corpus', type: 'Primary Source' },
    { id: '2', title: 'Great Zimbabwe Architectural Survey', type: 'Archaeological Record' },
    { id: '3', title: 'Mali Empire Oral Histories (Griot Traditions)', type: 'Oral Tradition' }
  ];

  return (
    <main className="max-w-7xl mx-auto space-y-12 p-6 md:p-12">
      <header className="border-b border-amber-500/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Epistemic Framework</span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-2">Research Portfolio</h1>
          <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
            HoloKai utilizes a multi-modal knowledge graph architecture to reconstruct African history with rigorous epistemic grounding. Every narrative is backed by triangulated evidence spanning archaeology, linguistics, and primary manuscripts.
          </p>
        </div>
        <Link
          href="/oracle"
          className="px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-mono hover:bg-amber-500/20 transition-colors whitespace-nowrap"
        >
          Consult Oracle AI →
        </Link>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Live Triangulation Engine</h2>
          <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-widest">
            Active
          </div>
        </div>
        <TriangulationReasoningPanel 
          response={{
            sources_consulted: 12,
            active_agents: ['Archaeologist', 'Historian', 'Ethnomathematician'],
            confidence: 0.96,
            vanguard_unit: 'Vanguard-01 (Kemet)'
          }}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white">Evidence & Provenance Matrix</h2>
          <EvidenceMatrix 
            claim="The architectural alignment of the Great Enclosure at Great Zimbabwe encodes advanced astronomical knowledge, specifically tracking the solstices and lunar cycles."
            epistemicStance="ESTABLISHED"
            confidenceScore={0.92}
            citations={['GZ-ARCH-1984', 'SANKORE-ASTRO-1590']}
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Citation Chain</h2>
          <CitationChainViewer 
            citations={citations}
            onSelectCitation={setSelectedCitation}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-amber-500/10">
        <div className="p-8 rounded-3xl bg-[#12121a] border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-colors">
          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">Methodology 01</span>
          <h3 className="text-2xl font-bold text-white">Triangulated Reasoning</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Every historical assertion is validated across multiple independent data streams: physical archaeology, primary manuscript codices (e.g., Timbuktu), etymological cognates, and computational astronomy.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#12121a] border border-amber-500/20 space-y-4 hover:border-amber-500/40 transition-colors">
          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">Methodology 02</span>
          <h3 className="text-2xl font-bold text-white">Epistemic Stance Engine</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Claims are tagged with explicit confidence scores and stances (`ESTABLISHED`, `PROBABILISTIC`, `HYPOTHETICAL`, `CONTESTED`) to ensure academic transparency and intellectual honesty.
          </p>
        </div>
      </div>

      <SourceDrawer 
        open={!!selectedCitation} 
        onClose={() => setSelectedCitation(null)} 
        citation={selectedCitation} 
      />
    </main>
  );
}
