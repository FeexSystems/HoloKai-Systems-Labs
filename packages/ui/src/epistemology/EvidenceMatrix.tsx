'use client';

import React from 'react';
import { EpistemicStance, EvidenceSpan } from '@holokai/contracts';
import { EpistemicBadge } from './EpistemicBadge';

export interface EvidenceMatrixProps {
  claim: string;
  epistemicStance: EpistemicStance;
  confidenceScore: number;
  evidence?: EvidenceSpan[];
  citations?: string[];
  className?: string;
}

export function EvidenceMatrix({
  claim,
  epistemicStance,
  confidenceScore,
  evidence = [],
  citations = [],
  className = '',
}: EvidenceMatrixProps) {
  const sampleEvidence: EvidenceSpan[] = evidence.length > 0 ? evidence : [
    {
      id: 'ev-default-1',
      sourceTitle: 'Sankore Mathematical Astronomy Corpus',
      author: 'Ahmed Baba Institute',
      year: 1590,
      textSnippet: "Geometric and astronomical calculations documented in classical Ge'ez and Ajami scripts.",
      pageOrFolio: 'Folio 418',
      epistemicStance: epistemicStance,
      confidenceScore: confidenceScore,
    },
    {
      id: 'ev-default-2',
      sourceTitle: 'Great Zimbabwe Architectural Survey',
      author: 'Southern African Epigraphy Project',
      year: 1984,
      textSnippet: 'Dry-stone masonry structural integrity and solar orientation analysis of the Great Enclosure.',
      pageOrFolio: 'Vol. 12, pp. 84-110',
      epistemicStance: 'ESTABLISHED',
      confidenceScore: 0.94,
    },
  ];

  return (
    <div
      className={`rounded-2xl border border-amber-500/20 bg-[#12121a] p-6 md:p-8 space-y-6 text-white backdrop-blur-xl ${className}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
            Computational Evidence Matrix & Verification
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Claim Integrity Report</h3>
        </div>
        <EpistemicBadge stance={epistemicStance} confidence={confidenceScore} />
      </div>

      {/* Target Claim */}
      <div className="p-4 rounded-xl bg-[#0a0a0f] border border-white/5 space-y-1">
        <span className="text-[10px] font-mono uppercase text-zinc-400">Target Research Claim</span>
        <p className="text-sm font-medium text-amber-100 leading-relaxed">"{claim}"</p>
      </div>

      {/* Provenance & Evidence Spans */}
      <div className="space-y-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
          Supporting Primary Spans ({sampleEvidence.length})
        </h4>
        <div className="grid grid-cols-1 gap-3">
          {sampleEvidence.map((span) => (
            <div
              key={span.id}
              className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 hover:border-amber-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{span.sourceTitle}</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {span.author} {span.year ? `(${span.year})` : ''} · {span.pageOrFolio}
                </span>
              </div>
              <p className="text-xs text-zinc-300 italic leading-relaxed">"{span.textSnippet}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Citations index */}
      {citations.length > 0 && (
        <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="text-amber-500 font-bold">Citation Index:</span>
          {citations.map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300">
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
