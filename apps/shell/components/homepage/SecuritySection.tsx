'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ScrollReveal, ScrollRevealStagger, holokaiVariants } from '@holokai/ui';

const SECURITY_FEATURES = [
  {
    id: 'epistemic',
    icon: '🔬',
    title: 'Epistemic Classification',
    description: 'Every claim auto-labeled: ESTABLISHED, SCHOLARLY_DEBATE, TRADITION, SPECULATIVE, or FICTIONAL.',
  },
  {
    id: 'evidence',
    icon: '📜',
    title: 'Source-Anchored Evidence',
    description: 'Responses trace back to primary epigraphic, archaeological, and astronomical sources.',
  },
  {
    id: 'confidence',
    icon: '📊',
    title: 'Confidence Scoring',
    description: 'Calibrated 0–1.0 confidence scores surfaced at every claim level, not just per query.',
  },
];

export function SecuritySection() {
  return (
    <section className="py-24 md:py-32 bg-[#05050a]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">

        <ScrollReveal className="text-center mb-16">
          <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
            Research Integrity
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Trust the knowledge
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            HoloKai doesn't just retrieve — it classifies certainty. Every piece of historical knowledge
            carries its epistemic weight, clearly labeled.
          </p>
        </ScrollReveal>

        <ScrollRevealStagger className="grid gap-5 md:grid-cols-3">
          {SECURITY_FEATURES.map((feat) => (
            <motion.div
              key={feat.id}
              variants={holokaiVariants.cardEntrance}
              className="group rounded-3xl border border-brand/20 bg-gradient-to-b from-[#14141e] to-[#08080f] p-8 hover:border-brand/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-6" aria-hidden="true">{feat.icon}</div>
              <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-brand-light transition-colors">
                {feat.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
