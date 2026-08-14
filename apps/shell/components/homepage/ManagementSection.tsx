'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ScrollReveal, ScrollRevealStagger, holokaiVariants } from '@holokai/ui';

const MANAGEMENT_CARDS = [
  {
    id: 'oracle',
    label: 'Oracle Engine',
    icon: '🔭',
    description: 'Multi-agent AI research hub',
    href: '/oracle',
    stat: '847 sources',
  },
  {
    id: 'archive',
    label: '16-Vol Archive',
    icon: '📚',
    description: 'Pan-African codex & epigraphy',
    href: '/archive',
    stat: '16 volumes',
  },
  {
    id: 'vanguards',
    label: 'Vanguard Units',
    icon: '🤖',
    description: 'AI civilization guardians',
    href: '/vanguards',
    stat: '12 guardians',
  },
  {
    id: 'lab',
    label: '3D Orbital Lab',
    icon: '🌐',
    description: 'Spatial artifact explorer',
    href: '/lab',
    stat: 'WebGL',
  },
  {
    id: 'research',
    label: 'Research Notes',
    icon: '📝',
    description: 'Personal knowledge capture',
    href: '/research',
    stat: 'Private',
  },
  {
    id: 'system',
    label: 'System Metrics',
    icon: '📡',
    description: 'Edge runtime observability',
    href: '/system',
    stat: '99.9% uptime',
  },
];

export function ManagementSection() {
  return (
    <section className="py-24 md:py-32 bg-[#07070d]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <ScrollReveal className="mb-12">
          <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
            Platform Overview
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            One platform, full power
          </h2>
        </ScrollReveal>

        <ScrollRevealStagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MANAGEMENT_CARDS.map((card) => (
            <motion.a
              key={card.id}
              variants={holokaiVariants.cardEntrance}
              href={card.href}
              data-track-el={`mgmt-${card.id}`}
              data-track-ec="management-section"
              data-track-ea="click"
              className="group flex items-center gap-4 rounded-2xl border border-brand/15 bg-[#0e0e16] p-5 hover:border-brand/40 hover:bg-[#13131c] transition-all duration-200"
            >
              <span className="shrink-0 text-2xl" aria-hidden="true">{card.icon}</span>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-white group-hover:text-brand-light transition-colors">
                  {card.label}
                </span>
                <span className="block text-xs text-zinc-500 truncate">{card.description}</span>
              </div>
              <span className="shrink-0 text-[10px] font-mono text-brand/60">{card.stat}</span>
            </motion.a>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  );
}
