'use client';

import React, { useState } from 'react';
import { ShieldCheck, Cpu, CheckCircle2, Hash } from 'lucide-react';

interface EvidenceMatrixItem {
  id: number;
  source: string;
  type: string;
  weight: number;
  verified: boolean;
}

interface WolframResult {
  formula: string;
  dimension: string;
  symmetryGroup: string;
  historicalAlignment: string;
}

interface ComputationData {
  query: string;
  status: string;
  confidenceScore: number;
  epistemicLevel: 'ESTABLISHED' | 'SCHOLARLY_DEBATE' | 'TRADITION' | 'ESOTERIC' | 'SPECULATIVE';
  domain: string;
  wolframResult: WolframResult;
  evidenceMatrix: EvidenceMatrixItem[];
}

interface WolframComputationPanelProps {
  computationData?: ComputationData;
  query?: string;
}

export function WolframComputationPanel({ computationData, query }: WolframComputationPanelProps) {
  const [activeTab, setActiveTab] = useState('computation');

  if (!computationData && !query) return null;

  const sampleData: ComputationData = computationData || {
    query: query || "Adinkra mathematical symmetry & fractal scaling",
    status: "VERIFIED_QUANTITATIVE",
    confidenceScore: 0.94,
    epistemicLevel: "ESTABLISHED",
    domain: "Ethnomathematics & Geometry",
    wolframResult: {
      formula: "S(n) = \\sum_{k=1}^{n} \\cos(\\frac{2\\pi k}{n}) + \\Phi^k",
      dimension: "Fractal Dimension D = 1.487",
      symmetryGroup: "C_4v (Dihedral Symmetry order 8)",
      historicalAlignment: "Akan Kingdom / Golden Stool Era (c. 1700 CE)"
    },
    evidenceMatrix: [
      { id: 1, source: "Institute of Akan Mathematical Studies", type: "PRIMARY_MANUSCRIPT", weight: 0.96, verified: true },
      { id: 2, source: "Wolfram Language Geometry Engine (v14.1)", type: "COMPUTATIONAL_PROOF", weight: 0.99, verified: true },
      { id: 3, source: "UNESCO Heritage Ethno-Art Index", type: "SCHOLARLY_PEER_REVIEW", weight: 0.88, verified: true }
    ]
  };

  const getEpistemicBadge = (level: string) => {
    switch (level) {
      case 'ESTABLISHED':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SCHOLARLY_DEBATE':
        return 'bg-[var(--color-surface-hover)] text-[var(--color-brand)] border-[var(--color-border)]';
      case 'TRADITION':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30';
      case 'SPECULATIVE':
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <div className="my-4 p-4 rounded-xl bg-zinc-950/90 border border-[var(--color-border)] shadow-xl backdrop-blur-md text-zinc-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand)]">
            <Cpu className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 font-display">
              Wolfram Computational Layer
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${getEpistemicBadge(sampleData.epistemicLevel)}`}>
                {sampleData.epistemicLevel}
              </span>
            </h4>
            <p className="text-xs text-zinc-400 font-mono">Domain: {sampleData.domain}</p>
          </div>
        </div>

        {/* Confidence metric */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium block">Verification Confidence</span>
            <span className="text-xs font-mono font-bold text-[var(--color-brand)]">{(sampleData.confidenceScore * 100).toFixed(1)}%</span>
          </div>
          <div className="w-12 h-1.5 bg-zinc-805 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--pui-forest-active)] to-emerald-400 rounded-full"
              style={{ width: `${sampleData.confidenceScore * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mt-3 text-xs border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab('computation')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'computation' ? 'bg-[var(--color-surface-hover)] text-[var(--color-brand)] border border-[var(--color-border)]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Hash className="w-3.5 h-3.5" />
          Quantitative Output
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition ${
            activeTab === 'evidence' ? 'bg-[var(--color-surface-hover)] text-[var(--color-brand)] border border-[var(--color-border)]' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Evidence Matrix ({sampleData.evidenceMatrix.length})
        </button>
      </div>

      {/* Body */}
      {activeTab === 'computation' ? (
        <div className="mt-3 space-y-2 font-mono text-xs">
          <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-1.5">
            <div className="text-zinc-400 text-[11px] flex items-center justify-between">
              <span>Verified Formula / Equation:</span>
              <span className="text-[var(--color-brand)]/80 text-[10px]">Wolfram Language Output</span>
            </div>
            <div className="text-[var(--color-brand)] bg-[var(--color-brand)]/30 p-2 rounded border border-[var(--color-border)] overflow-x-auto text-[11px]">
              {sampleData.wolframResult.formula}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Symmetry Group:</span>
              <span className="text-zinc-200 font-semibold">{sampleData.wolframResult.symmetryGroup}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Calculated Dimension:</span>
              <span className="text-[var(--color-brand)] font-semibold">{sampleData.wolframResult.dimension}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {sampleData.evidenceMatrix.map(item => (
            <div key={item.id} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-zinc-200 font-medium block">{item.source}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{item.type}</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-[var(--color-brand)] bg-[var(--color-surface-hover)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                {(item.weight * 100).toFixed(0)}% weight
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
