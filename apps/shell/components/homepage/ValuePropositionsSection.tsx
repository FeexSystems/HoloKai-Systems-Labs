'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ScrollReveal, ScrollRevealStagger, holokaiVariants } from '@holokai/ui';

const VALUE_PROPOSITIONS = [
  {
    id: 'synthesis',
    icon: '🔭',
    title: 'AI Synthesis Engine',
    description:
      'Multi-agent research cross-references hieroglyphic records, astronomical data, and epigraphic archives across 5,000 years of civilizational knowledge.',
  },
  {
    id: 'epistemic',
    icon: '🔬',
    title: 'Epistemic Classification',
    description:
      'Every claim auto-labeled ESTABLISHED, SCHOLARLY_DEBATE, TRADITION, or SPECULATIVE — with calibrated 0–1.0 confidence scores at every level.',
  },
  {
    id: 'archive',
    icon: '📚',
    title: '16-Volume Archive',
    description:
      'Pan-African epigraphy, oral tradition codices, and archaeological dossiers — searchable, citable, and continuously indexed.',
  },
  {
    id: 'voice',
    icon: '🎙️',
    title: 'Voice Oracle Interface',
    description:
      'Query civilizations by voice or text. Responses stream in real time with optional ancient-voice synthesis and transcription.',
  },
  {
    id: 'spatial',
    icon: '🌐',
    title: 'Spatial Research Lab',
    description:
      'Explore artifacts in 3D orbital space. WebGL-powered visualization brings ancient objects into immersive, interactive context.',
  },
];

export function ValuePropositionsSection() {
  return (
    <section className="py-24 md:py-32 bg-[#07070d]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <ScrollReveal className="text-center mb-16">
          <span className="text-[10px] font-mono text-[var(--color-brand)] uppercase tracking-[0.2em] block mb-4">
            Why HoloKai
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Civilization-scale research, reimagined
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            From epigraphic archives to AI synthesis — HoloKai gives researchers the tools
            to query, classify, and preserve knowledge across millennia.
          </p>
        </ScrollReveal>

        <ScrollRevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPOSITIONS.map((prop) => (
            <motion.div
              key={prop.id}
              variants={holokaiVariants.cardEntrance}
              className="group rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[#14141e] to-[#08080f] p-8 hover:border-[var(--color-brand)]/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-6" aria-hidden="true">{prop.icon}</div>
              <h3 className="text-xl font-extrabold text-white mb-3 group-hover:text-[var(--color-brand)] transition-colors">
                {prop.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{prop.description}</p>
            </motion.div>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
