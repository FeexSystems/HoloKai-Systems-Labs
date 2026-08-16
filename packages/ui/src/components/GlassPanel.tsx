import React from 'react';
import { COLOR_TOKENS } from '@holokai/design-system';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'amber' | 'blue' | 'emerald' | 'dark';
  glow?: boolean;
}

export function GlassPanel({ children, className = '', variant = 'amber', glow = false }: GlassPanelProps) {
  const borderStyles =
    variant === 'amber'
      ? 'border-border bg-surface/90'
      : variant === 'blue'
      ? 'border-blue-500/20 bg-[#0f121d]/90'
      : variant === 'emerald'
      ? 'border-emerald-500/20 bg-[#0a1813]/90'
      : 'border-white/10 bg-black/80';

  const glowStyles = glow ? 'shadow-[0_0_30px_rgba(169,213,176,0.15)]' : '';

  return (
    <div className={`rounded-2xl border backdrop-blur-xl p-6 transition-all duration-300 ${borderStyles} ${glowStyles} ${className}`}>
      {children}
    </div>
  );
}
