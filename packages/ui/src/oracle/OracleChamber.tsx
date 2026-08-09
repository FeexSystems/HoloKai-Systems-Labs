'use client';

import React, { useState } from 'react';
import { OracleQueryResponse, EpistemicStance } from '@holokai/contracts';
import { EpistemicBadge } from '../epistemology/EpistemicBadge';
import { EvidenceMatrix } from '../epistemology/EvidenceMatrix';

export interface OracleChamberProps {
  onQuerySubmit?: (prompt: string) => Promise<void>;
  initialResponse?: OracleQueryResponse | null;
  loading?: boolean;
  className?: string;
}

export function OracleChamber({
  onQuerySubmit,
  initialResponse,
  loading = false,
  className = '',
}: OracleChamberProps) {
  const [prompt, setPrompt] = useState('Analyze the astronomical alignment of Nabta Playa and the Sankore manuscripts.');
  const [response, setResponse] = useState<OracleQueryResponse | null>(
    initialResponse || {
      queryId: 'oracle-demo-1',
      text: 'The megalithic alignment at Nabta Playa (circa 5000 BCE) demonstrates early Nile Valley pastoralist astronomy calibrated to the summer solstice. Concurrently, the 16th-century Sankore University manuscripts of Timbuktu synthesize these celestial observations into formal mathematical treatises.',
      epistemicStance: 'ESTABLISHED',
      confidenceScore: 0.96,
      evidence: [
        {
          id: 'ev-nabta-1',
          sourceTitle: 'Holocene Megalithic Astronomy of Nabta Playa',
          author: 'Wendorf & Schild',
          year: 2001,
          textSnippet: 'Archaeoastronomical alignment of megalithic stone circles marking the summer solstice monsoon arrival.',
          pageOrFolio: 'Nature Vol. 392',
          epistemicStance: 'ESTABLISHED',
          confidenceScore: 0.98,
        },
        {
          id: 'ev-timbuktu-1',
          sourceTitle: 'Sankore Mathematical Astronomy Treatise',
          author: 'Ahmed Baba Institute',
          year: 1590,
          textSnippet: 'Trigonometric tables calculating lunar stations and planetary longitude.',
          pageOrFolio: 'Manuscript 418',
          epistemicStance: 'ESTABLISHED',
          confidenceScore: 0.95,
        },
      ],
      citations: ['Wendorf et al. (2001) Nature', 'UNESCO Timbuktu Corpus Folio 418'],
      modelUsed: 'HoloKai-Oracle-CivilizationCore-v11',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !onQuerySubmit) return;
    await onQuerySubmit(prompt);
  };

  return (
    <div className={`rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#12121a] via-[#0a0a0f] to-[#05050a] p-6 md:p-10 space-y-8 backdrop-blur-2xl shadow-2xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-500/20 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            Oracle Intelligence Response Chamber
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1">
            Civilization Epistemic Synthesis
          </h2>
        </div>
        <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          Model: HoloKai Genkit AI Synthesis
        </div>
      </div>

      {/* Query Form Input */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Oracle about Sungbo's Eredo, Kemet geometry, or Aksumite epigraphy..."
          className="flex-1 bg-black/70 border border-amber-500/30 rounded-2xl px-5 py-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-sm rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
        >
          {loading ? 'Synthesizing Dossier...' : 'Query Oracle →'}
        </button>
      </form>

      {/* Synthesis Report Dossier Surface */}
      {response && (
        <div className="space-y-6 p-6 md:p-8 rounded-2xl bg-[#0a0a0f] border border-amber-500/25">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono uppercase text-amber-400 font-bold">
              Research Dossier #{response.queryId}
            </span>
            <EpistemicBadge stance={response.epistemicStance} confidence={response.confidenceScore} />
          </div>

          <p className="text-base md:text-lg text-zinc-100 font-light leading-relaxed">
            {response.text}
          </p>

          <EvidenceMatrix
            claim={response.text}
            epistemicStance={response.epistemicStance}
            confidenceScore={response.confidenceScore}
            evidence={response.evidence}
            citations={response.citations}
          />
        </div>
      )}
    </div>
  );
}
