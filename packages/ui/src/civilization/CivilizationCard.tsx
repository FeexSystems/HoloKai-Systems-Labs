'use client';

import React from 'react';
import { CivilizationEntry, EpistemicStance } from '@holokai/contracts';
import { EpistemicBadge } from '../epistemology/EpistemicBadge';

export interface CivilizationCardProps {
  civilization: CivilizationEntry;
  onExplore?: (civilization: CivilizationEntry) => void;
  className?: string;
}

export function CivilizationCard({ civilization, onExplore, className = '' }: CivilizationCardProps) {
  return (
    <div
      className={`group relative rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[#12121a] to-[#0a0a0f] p-6 space-y-4 hover:border-[var(--color-border)] transition-all duration-300 shadow-xl overflow-hidden ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-[var(--color-brand)] uppercase tracking-widest block font-semibold">
            {civilization.region} · {civilization.centuryRange}
          </span>
          <h3 className="text-xl md:text-2xl font-extrabold text-white mt-1 group-hover:text-[var(--color-brand)] transition-colors">
            {civilization.name}
          </h3>
        </div>
        <EpistemicBadge stance="ESTABLISHED" confidence={0.96} showTooltip={false} />
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-3">
        {civilization.description}
      </p>

      {/* Key Achievements Badges */}
      <div className="space-y-2 pt-2 border-t border-white/5">
        <span className="text-[10px] font-mono text-zinc-400 uppercase">Key Contributions</span>
        <div className="flex flex-wrap gap-1.5">
          {civilization.achievements.map((ach, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)] text-[11px] font-mono"
            >
              {ach}
            </span>
          ))}
        </div>
      </div>

      {onExplore && (
        <button
          onClick={() => onExplore(civilization)}
          className="w-full py-2.5 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
        >
          <span>Open Civilization Dossier</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
}
