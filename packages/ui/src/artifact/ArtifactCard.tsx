'use client';

import React from 'react';
import { EpistemicBadge } from '../epistemology/EpistemicBadge';
import { EpistemicStance } from '@holokai/contracts';

export interface ArtifactCardProps {
  title: string;
  civilization: string;
  dateOrEra: string;
  medium: string;
  image: string;
  provenance: string;
  epistemicStance?: EpistemicStance;
  onInspect?: () => void;
  className?: string;
}

export function ArtifactCard({
  title,
  civilization,
  dateOrEra,
  medium,
  image,
  provenance,
  epistemicStance = 'ESTABLISHED',
  onInspect,
  className = '',
}: ArtifactCardProps) {
  return (
    <div
      className={`group relative rounded-3xl border border-amber-500/20 bg-[#12121a] overflow-hidden flex flex-col hover:border-amber-500/40 transition-all duration-300 shadow-xl ${className}`}
    >
      <div className="relative h-64 w-full bg-zinc-950 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-10">
          <EpistemicBadge stance={epistemicStance} confidence={0.95} showTooltip={false} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent opacity-80" />
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
            {civilization} · {dateOrEra}
          </span>
          <h4 className="text-xl font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-zinc-400 mt-2 font-mono">Medium: {medium}</p>
          <p className="text-xs text-zinc-300 mt-2 leading-relaxed italic">"{provenance}"</p>
        </div>

        {onInspect && (
          <button
            onClick={onInspect}
            className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Inspect Provenance & 3D Model</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
}
