'use client';

import React from 'react';
import { CivilizationEntry } from '@holokai/contracts';
import { EpistemicBadge } from '../epistemology/EpistemicBadge';
import { EvidenceMatrix } from '../epistemology/EvidenceMatrix';

export interface CivilizationDossierProps {
  civilization: CivilizationEntry;
  onClose?: () => void;
  className?: string;
}

export function CivilizationDossier({ civilization, onClose, className = '' }: CivilizationDossierProps) {
  return (
    <div className={`rounded-3xl border border-[var(--color-border)] bg-[#0a0a0f] p-8 md:p-12 space-y-8 text-white shadow-2xl backdrop-blur-2xl ${className}`}>
      {/* Dossier Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[var(--color-border-subtle)] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono font-bold uppercase">
              Civilization Research Dossier
            </span>
            <span className="text-xs font-mono text-zinc-400">{civilization.era} · {civilization.region}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-2">{civilization.name}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 self-start md:self-auto transition-colors"
          >
            Close Dossier ✕
          </button>
        )}
      </div>

      {/* Description & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-[var(--color-brand)] border-b border-white/10 pb-2">Historical Overview</h3>
          <p className="text-sm md:text-base text-zinc-200 leading-relaxed font-light">{civilization.description}</p>
        </div>

        <div className="space-y-4 p-6 rounded-2xl bg-[#12121a] border border-[var(--color-border)]">
          <h4 className="text-xs font-mono uppercase text-[var(--color-brand)] font-bold">Key Figures & Dynasties</h4>
          <ul className="space-y-2 text-xs text-zinc-300 font-mono">
            {civilization.keyFigures.map((fig, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)]" />
                <span>{fig}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Embedded Evidence Matrix */}
      <EvidenceMatrix
        claim={`The ${civilization.name} established foundational advancements in ${civilization.achievements.join(', ')}.`}
        epistemicStance="ESTABLISHED"
        confidenceScore={0.97}
      />
    </div>
  );
}
