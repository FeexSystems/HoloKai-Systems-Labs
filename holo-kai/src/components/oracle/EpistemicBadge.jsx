import React from 'react';
import { HK_EPISTEMIC } from '@/lib/tokens';
import { ShieldCheck, HelpCircle, BookOpen, Sparkles, AlertTriangle, FileCode } from 'lucide-react';

const ICONS = {
  ESTABLISHED: ShieldCheck,
  SCHOLARLY_DEBATE: HelpCircle,
  TRADITION: BookOpen,
  ESOTERIC: Sparkles,
  SPECULATIVE: AlertTriangle,
  FICTIONAL: FileCode,
};

export default function EpistemicBadge({ level = 'ESTABLISHED', className = '' }) {
  const meta = HK_EPISTEMIC[level] || HK_EPISTEMIC.ESTABLISHED;
  const Icon = ICONS[level] || ShieldCheck;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border transition-all ${className}`}
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
        borderColor: meta.border,
      }}
      title={`${meta.label}: ${meta.description}`}
    >
      <Icon className="w-3 h-3 shrink-0" style={{ color: meta.color }} />
      <span>{meta.label}</span>
    </div>
  );
}
