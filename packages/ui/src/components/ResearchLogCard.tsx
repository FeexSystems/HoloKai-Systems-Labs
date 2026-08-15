'use client';

import React from 'react';
import { motion } from 'motion/react';
import { holokaiVariants, humanoidSyncTransition, ancientEpistemicTransition } from '../motion/profiles';

export interface ResearchLogCardProps {
  title: string;
  domain: string;
  era?: string;
  region?: string;
  text: string;
}

export function ResearchLogCard({ title, domain, era, region, text }: ResearchLogCardProps) {
  return (
    <motion.div 
      variants={holokaiVariants.cardEntrance}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ scale: 1.01, transition: humanoidSyncTransition }}
      className="p-6 rounded-2xl bg-[#0a0a0f] border border-white/5 hover:border-[var(--color-border)] transition-colors duration-300"
    >
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="text-xl font-bold text-[var(--color-brand)]">{title}</h3>
        <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
          <span className="px-2 py-1 rounded bg-white/5 uppercase tracking-wider">{domain}</span>
          {era && <span className="px-2 py-1 rounded bg-white/5">{era}</span>}
          {region && <span className="px-2 py-1 rounded bg-white/5">{region}</span>}
        </div>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">
        {text}
      </p>
    </motion.div>
  );
}
