'use client';

import React from 'react';
import { ProcessSection } from '@holokai/ui';

const RESEARCH_STEPS = [
  {
    id: 'query',
    number: '01',
    title: 'Ask the Oracle',
    description:
      'Submit any historical query. The Oracle parses intent, identifies civilizational focus, and selects the optimal research modality — epigraphy, archaeology, astronomy, or oral tradition.',
  },
  {
    id: 'synthesize',
    number: '02',
    title: 'Multi-Agent Synthesis',
    description:
      'Specialized AI agents cross-reference sources, apply epistemic scoring, and converge on an evidence-backed answer — surfacing confidence levels and contested claims.',
  },
  {
    id: 'classify',
    number: '03',
    title: 'Epistemic Classification',
    description:
      'Every claim is labeled: ESTABLISHED, SCHOLARLY_DEBATE, TRADITION, SPECULATIVE, or FICTIONAL — giving researchers an honest signal about the state of historical knowledge.',
  },
  {
    id: 'archive',
    number: '04',
    title: 'Archive & Share',
    description:
      'Discoveries are saved to your personal research archive, connected to the 16-volume codex, and optionally published to the HoloKai knowledge network.',
  },
];

export function UnboxSection() {
  return (
    <section className="py-24 md:py-32 bg-[#05050a]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <div className="text-center mb-16">
          <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
            Research Workflow
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            How HoloKai works
          </h2>
        </div>

        <ProcessSection steps={RESEARCH_STEPS} />
      </div>
    </section>
  );
}
