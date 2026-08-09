'use client';

import React, { useState } from 'react';
import { EpistemicStance } from '@holokai/contracts';
import { EPISTEMIC_STANCE_TOKENS } from '@holokai/design-system';

export interface EpistemicBadgeProps {
  stance: EpistemicStance;
  confidence?: number;
  showTooltip?: boolean;
  className?: string;
}

export function EpistemicBadge({
  stance,
  confidence,
  showTooltip = true,
  className = '',
}: EpistemicBadgeProps) {
  const [hovered, setHovered] = useState(false);
  const token = EPISTEMIC_STANCE_TOKENS[stance] || {
    label: stance,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.3)',
    description: 'Epistemic classification score',
  };

  return (
    <div className="relative inline-block">
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        tabIndex={0}
        aria-label={`Epistemic stance: ${token.label}. ${token.description}`}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider cursor-help transition-all duration-200 ${className}`}
        style={{
          color: token.color,
          backgroundColor: token.bg,
          borderColor: token.border,
          borderWidth: '1px',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: token.color }} />
        <span>{token.label}</span>
        {confidence !== undefined && (
          <span className="opacity-80">({(confidence * 100).toFixed(0)}%)</span>
        )}
      </span>

      {showTooltip && hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-xl bg-[#0a0a0f] border border-amber-500/30 text-white text-xs z-50 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="font-mono text-[10px] uppercase font-bold text-amber-400 mb-1">
            Epistemic Definition
          </div>
          <p className="text-zinc-300 text-[11px] leading-relaxed">{token.description}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a0a0f]" />
        </div>
      )}
    </div>
  );
}
