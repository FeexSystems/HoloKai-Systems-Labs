'use client';

import React from 'react';
import { Launchpad } from '@holokai/ui';

const PLATFORM_ITEMS = [
  {
    id: 'oracle',
    name: 'Oracle Engine',
    description: 'Multi-agent AI research synthesis with epistemic classification.',
    href: '/oracle',
    category: 'Research',
    badge: 'LIVE',
    featured: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M9 5v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'voice',
    name: 'Voice Oracle Chamber',
    description: 'Speak to 8 AI Vanguard personas with 3D visualization and TTS.',
    href: '/oracle/voice',
    category: 'Research',
    badge: 'NEW',
    featured: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2v10M6 5v4M12 4v6M3 8v2M15 7v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'archive',
    name: '16-Volume Archive',
    description: 'Pan-African codex spanning epigraphy, astronomy & oral records.',
    href: '/archive',
    category: 'Research',
    badge: 'CODEX',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'vanguards',
    name: 'Vanguard Units',
    description: 'Specialized AI guardians built for civilizational knowledge.',
    href: '/vanguards',
    category: 'AI',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M9 2l2 5h5l-4 3 1.5 5L9 12l-4.5 3L6 10 2 7h5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'lab',
    name: '3D Orbital Lab',
    description: 'Immersive WebGL environment for spatial artifact exploration.',
    href: '/lab',
    category: 'Spatial',
    badge: 'BETA',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <ellipse cx="9" cy="9" rx="8" ry="4" stroke="currentColor" strokeWidth="1.5"/>
        <ellipse cx="9" cy="9" rx="8" ry="4" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 9 9)"/>
      </svg>
    ),
  },
  {
    id: 'research',
    name: 'Research Notes',
    description: 'Personal knowledge capture connected to the Oracle engine.',
    href: '/research',
    category: 'Research',
  },
  {
    id: 'system',
    name: 'System Metrics',
    description: 'Edge runtime observability, AI model performance & uptime.',
    href: '/system',
    category: 'Platform',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 13l3-4 2 2 3-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export function LaunchpadSection() {
  return (
    <section className="py-24 md:py-32 bg-[#06060c]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
            Platform Launcher
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Everything in one command
          </h2>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto">
            Access research tools, archives, AI guardians, and spatial labs from a single launchpad.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Launchpad items={PLATFORM_ITEMS} columns={3} searchPlaceholder="Search platform tools…" />
        </div>
      </div>
    </section>
  );
}
