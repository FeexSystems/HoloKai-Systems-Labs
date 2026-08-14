'use client';

import React from 'react';
import { Accordion } from '@holokai/ui';

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'What civilizations does HoloKai cover?',
    answer:
      'HoloKai covers over 50 African civilizations spanning 5,000+ years — from Kemet (Ancient Egypt) and Nubia/Kush to the Mali Empire, Benin Kingdom, Great Zimbabwe, Aksum, Carthage, and many more. The 16-Volume Archive is continuously updated.',
  },
  {
    id: 'faq-2',
    question: 'What does "epistemic classification" mean?',
    answer:
      'Every claim in HoloKai carries an epistemic label: ESTABLISHED (peer-reviewed consensus), SCHOLARLY_DEBATE (active academic disagreement), TRADITION (oral or cultural memory), SPECULATIVE (inference beyond evidence), or FICTIONAL. This lets researchers calibrate trust appropriately.',
  },
  {
    id: 'faq-3',
    question: 'How does the Oracle Research Engine work?',
    answer:
      'The Oracle uses a multi-agent AI system: specialized Vanguard agents each trained on a specific civilization synthesize evidence from epigraphic, archaeological, astronomical, and oral sources — then return a unified response with confidence scores and citations.',
  },
  {
    id: 'faq-4',
    question: 'Is the 16-Volume Archive publicly accessible?',
    answer:
      'Core archive access is free. Deep-query features, Vanguard AI agents, and the 3D Orbital Lab require an account. Academic and institutional research access is available on request.',
  },
  {
    id: 'faq-5',
    question: 'Can I export research findings?',
    answer:
      'Yes — all Oracle responses, evidence matrices, and archive excerpts can be exported as structured JSON, Markdown, or academic citation format (Chicago, APA, MLA). PDF export with citation tracking is on the roadmap.',
  },
];

export function FAQSection() {
  return (
    <section className="py-24 md:py-32 bg-[#07070d]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">

        <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20 lg:items-start">
          <div>
            <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
              FAQ
            </span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              Have another question?{' '}
              <a
                href="mailto:research@holokai.io"
                className="text-brand-light hover:text-white underline underline-offset-4 transition-colors"
              >
                Ask the team →
              </a>
            </p>
          </div>

          <Accordion items={FAQ_ITEMS} allowMultiple />
        </div>
      </div>
    </section>
  );
}
