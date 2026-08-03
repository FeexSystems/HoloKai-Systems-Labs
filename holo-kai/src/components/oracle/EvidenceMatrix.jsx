import React from 'react';
import EpistemicBadge from './EpistemicBadge';
import ConfidenceIndicator from './ConfidenceIndicator';
import ComputationResult from './ComputationResult';
import { Database } from 'lucide-react';

export default function EvidenceMatrix({ claim, evidenceData, computationData, className = '' }) {
  if (!claim) return null;

  const { epistemicLevel = 'ESTABLISHED', confidenceScore = 0.90, evidenceSources = {} } = evidenceData || {};

  return (
    <div className={`p-5 rounded-2xl border border-white/10 bg-zinc-950/90 text-zinc-100 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            HoloKai Evidence Matrix Record
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <EpistemicBadge level={epistemicLevel.name || epistemicLevel} />
          <ConfidenceIndicator score={confidenceScore} />
        </div>
      </div>

      {/* Claim Title */}
      <div className="bg-zinc-900/80 p-3 rounded-xl border border-white/5">
        <span className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider font-semibold block mb-1">
          Historical Claim Under Evaluation:
        </span>
        <p className="text-xs font-sans text-zinc-200 leading-relaxed font-medium">
          "{claim}"
        </p>
      </div>

      {/* Multidisciplinary Evidence Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${evidenceSources.archaeology ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Archaeology</span>
          <span className="font-bold mt-1">{evidenceSources.archaeology ? 'Verified Artifacts' : 'Unconfirmed'}</span>
        </div>

        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${evidenceSources.textual ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Primary Texts</span>
          <span className="font-bold mt-1">{evidenceSources.textual ? 'Codex / Inscriptions' : 'None'}</span>
        </div>

        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${evidenceSources.linguistics ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Linguistics</span>
          <span className="font-bold mt-1">{evidenceSources.linguistics ? 'Etymological Link' : 'No Cognates'}</span>
        </div>

        <div className={`p-2.5 rounded-lg border flex flex-col justify-between ${evidenceSources.wolframVerified ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Wolfram Engine</span>
          <span className="font-bold mt-1">{evidenceSources.wolframVerified ? 'Compute Active' : 'Qualitative'}</span>
        </div>
      </div>

      {/* Computation Result (if active) */}
      {computationData && (
        <div className="pt-1">
          <ComputationResult data={computationData} />
        </div>
      )}
    </div>
  );
}
