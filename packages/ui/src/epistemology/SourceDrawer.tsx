'use client';

import React from 'react';
import { X, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SourceDrawerProps {
  open: boolean;
  onClose: () => void;
  citation?: any;
}

export function SourceDrawer({ open, onClose, citation }: SourceDrawerProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-[120] w-full max-w-xl border-l border-white/10 bg-zinc-950/95 p-4 shadow-2xl"
            role="dialog"
            aria-label="Source details"
            aria-modal="true"
          >
            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-sm font-semibold text-zinc-100 font-mono tracking-widest uppercase">Evidence Record</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-white/10 p-1.5 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors focus-visible:outline-none"
                aria-label="Close source drawer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pb-10">
              {citation ? (
                <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-amber-500 font-mono">
                    <FileText className="h-3.5 w-3.5" /> Citation {citation.citation_id || citation.id}
                  </div>
                  <p className="text-sm text-zinc-100 font-medium">{citation.source_title || citation.title}</p>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-300 italic">"{citation.passage || citation.text}"</p>
                  <div className="mt-4 pt-3 border-t border-amber-500/10 flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Type: {citation.evidence_type || 'Primary Source'}</span>
                    {citation.url && (
                      <a href={citation.url} target="_blank" rel="noreferrer" className="text-amber-400 hover:text-amber-300 flex items-center gap-1">
                        View Source <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </section>
              ) : (
                <p className="text-sm text-zinc-400">No citation selected.</p>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
