'use client';

import React from 'react';
import { Database } from 'lucide-react';
import { EpistemicStance } from '@holokai/contracts';
import { StanceBadge } from '@holokai/ui';

export interface EvidenceSources {
  archaeology?: boolean;
  textual?: boolean;
  linguistics?: boolean;
  wolframVerified?: boolean;
}

export interface EvidenceMatrixProps {
  claim?: string;
  epistemicStance?: EpistemicStance;
  confidenceScore?: number;
  evidenceSources?: EvidenceSources;
  className?: string;
}

export function EvidenceMatrix({
  claim = 'Mathematical astronomy manuscripts of Sankore University',
  epistemicStance = 'ESTABLISHED',
  confidenceScore = 0.96,
  evidenceSources = { archaeology: true, textual: true, linguistics: true, wolframVerified: true },
  className = '',
}: EvidenceMatrixProps) {
  if (!claim) return null;

  return (
    <div className={`p-6 rounded-2xl border border-amber-500/20 bg-[#12121a]/95 text-zinc-100 space-y-4 backdrop-blur-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/20 pb-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            HoloKai Epistemic Evidence Matrix Record
          </h3>
        </div>
        <StanceBadge stance={epistemicStance} confidence={confidenceScore} />
      </div>

      {/* Claim Title */}
      <div className="bg-black/60 p-4 rounded-xl border border-white/5 space-y-1">
        <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider font-semibold block">
          Historical Claim Under Evaluation:
        </span>
        <p className="text-sm font-sans text-zinc-100 leading-relaxed font-medium">
          "{claim}"
        </p>
      </div>

      {/* Multidisciplinary Evidence Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono">
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${evidenceSources.archaeology ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Archaeology</span>
          <span className="font-bold mt-1.5">{evidenceSources.archaeology ? 'Verified Artifacts' : 'Unconfirmed'}</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${evidenceSources.textual ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Primary Texts</span>
          <span className="font-bold mt-1.5">{evidenceSources.textual ? 'Codex / Inscriptions' : 'None'}</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${evidenceSources.linguistics ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Linguistics</span>
          <span className="font-bold mt-1.5">{evidenceSources.linguistics ? 'Etymological Link' : 'No Cognates'}</span>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${evidenceSources.wolframVerified ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
          <span className="text-[9px] uppercase tracking-wider">Wolfram Engine</span>
          <span className="font-bold mt-1.5">{evidenceSources.wolframVerified ? 'Compute Active' : 'Qualitative'}</span>
        </div>
      </div>
    </div>
  );
}
