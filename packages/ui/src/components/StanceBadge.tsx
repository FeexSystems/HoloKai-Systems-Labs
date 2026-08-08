import React from 'react';
import { EpistemicStance } from '@holokai/contracts';
import { EPISTEMIC_STANCE_TOKENS } from '@holokai/design-system';

export interface StanceBadgeProps {
  stance: EpistemicStance;
  confidence?: number;
  className?: string;
}

export function StanceBadge({ stance, confidence, className = '' }: StanceBadgeProps) {
  const token = EPISTEMIC_STANCE_TOKENS[stance] || EPISTEMIC_STANCE_TOKENS.HYPOTHETICAL;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${className}`}
      style={{
        color: token.color,
        backgroundColor: token.bg,
        borderColor: token.border,
        borderWidth: '1px',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: token.color }} />
      {stance} {confidence !== undefined ? `(${(confidence * 100).toFixed(0)}%)` : ''}
    </span>
  );
}
