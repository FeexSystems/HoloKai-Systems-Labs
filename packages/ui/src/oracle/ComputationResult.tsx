'use client';

import React from 'react';
import { Cpu, CheckCircle2, Clock } from 'lucide-react';

interface ComputationResultProps {
  data?: {
    domain: string;
    wolframExpression?: string;
    result: Record<string, any>;
    provenance: string;
    referenceYear?: number | string;
  };
  className?: string;
}

export function ComputationResult({ data, className = '' }: ComputationResultProps) {
  if (!data) return null;

  const { domain, wolframExpression, result, provenance, referenceYear } = data;

  return (
    <div className={`p-4 rounded-xl border border-[var(--color-border)] bg-zinc-950/90 text-zinc-105 space-y-3 font-mono text-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[var(--color-brand)] animate-pulse" />
          <span className="font-bold text-[var(--color-brand)] uppercase tracking-wider text-[11px]">
            WOLFRAM COMPUTATIONAL LAYER — {domain}
          </span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-[var(--color-surface-hover)] px-2 py-0.5 rounded border border-[var(--color-border)]">
          VERIFIED
        </span>
      </div>

      {/* Wolfram WL Code Expression */}
      {wolframExpression && (
        <div className="bg-zinc-900 p-2.5 rounded-lg border border-white/5 text-[11px] text-[var(--color-brand)]/90 overflow-x-auto scrollbar-thin">
          <span className="text-zinc-500 select-none">wl&gt; </span>
          <code>{wolframExpression}</code>
        </div>
      )}

      {/* Data key-value display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
        {Object.entries(result).map(([key, val]) => {
          if (typeof val === 'object' && val !== null) {
            return (
              <div key={key} className="col-span-1 md:col-span-2 bg-zinc-900/60 p-2 rounded border border-white/5">
                <span className="text-zinc-400 uppercase tracking-wide text-[10px] block mb-1 font-semibold">{key}:</span>
                <div className="pl-2 space-y-0.5 text-zinc-200">
                  {Object.entries(val).map(([subK, subV]) => (
                    <div key={subK} className="flex justify-between">
                      <span className="text-zinc-400">{subK}:</span>
                      <span className="text-[var(--color-brand)] font-bold">{String(subV)}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={key} className="bg-zinc-900/60 p-2 rounded border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400 uppercase tracking-wide text-[10px]">{key}:</span>
              <span className="text-[var(--color-brand)] font-bold text-right ml-2 truncate max-w-[200px]" title={String(val)}>
                {String(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Provenance */}
      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/10 text-[10px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>Provenance: {provenance}</span>
        </div>
        {referenceYear && (
          <div className="flex items-center gap-1 text-[var(--color-brand)]/90 font-bold">
            <Clock className="w-3 h-3" />
            <span>Ref Year: {referenceYear}</span>
          </div>
        )}
      </div>
    </div>
  );
}
