'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link2, ArrowRight } from 'lucide-react';
import { holokaiVariants } from '../motion/profiles';

export interface CitationChainViewerProps {
  citations: Array<{ id: string; title: string; type: string }>;
  onSelectCitation?: (citation: any) => void;
}

export function CitationChainViewer({ citations, onSelectCitation }: CitationChainViewerProps) {
  return (
    <motion.div 
      variants={holokaiVariants.cardEntrance}
      initial="hidden"
      animate="visible"
      className="p-5 rounded-2xl bg-[#0a0a0f] border border-zinc-800"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
        <Link2 className="w-4 h-4 text-[var(--color-brand)]" />
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
          Citation Chain
        </h3>
      </div>
      
      <div className="space-y-3">
        {citations.map((cite, idx) => (
          <div key={cite.id} className="flex flex-col relative group">
            {idx !== citations.length - 1 && (
              <div className="absolute left-[11px] top-7 bottom-[-16px] w-[2px] bg-zinc-800 group-hover:bg-[var(--color-surface-hover)] transition-colors" />
            )}
            <button 
              onClick={() => onSelectCitation?.(cite)}
              className="flex items-start gap-3 text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-0.5 z-10 group-hover:border-[var(--color-border)] group-hover:bg-[var(--color-surface-hover)] transition-colors">
                <span className="text-[10px] font-mono text-zinc-400 group-hover:text-[var(--color-brand)]">{idx + 1}</span>
              </div>
              <div>
                <p className="text-xs text-zinc-200 font-medium">{cite.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">{cite.type}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-[var(--color-brand)] transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </button>
          </div>
        ))}
        {citations.length === 0 && (
          <p className="text-xs text-zinc-500 font-mono italic">No citations in chain.</p>
        )}
      </div>
    </motion.div>
  );
}
