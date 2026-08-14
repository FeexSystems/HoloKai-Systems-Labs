'use client';

import React from 'react';
import { FeatureSection } from '@holokai/ui';

export function AlfSection() {
  const visual = (
    <div className="relative text-center px-4">
      <div className="text-6xl mb-4" aria-hidden="true">🏛️</div>
      <p className="font-mono text-xs text-brand-light uppercase tracking-widest mb-3">
        Vanguard AI Guardian
      </p>
      <h3 className="text-2xl font-extrabold text-white mb-2">Kemet-Alpha</h3>
      <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
        "The Archivist" — Autonomous scanning unit for high-precision hieroglyphic
        vectorization and papyrus restoration.
      </p>
      <div className="mt-4 flex justify-center gap-2 flex-wrap">
        {['Epigraphy', 'Vectorization', 'Restoration', 'NLP'].map((cap) => (
          <span
            key={cap}
            className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-brand/10 border border-brand/20 text-brand-light"
          >
            {cap}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <FeatureSection
      eyebrow="Vanguard Guardian Units"
      heading="AI guardians built for civilizational memory"
      description="Each Vanguard is a specialized AI agent trained on a specific African civilization — from Kemet epigraphy to Benin bronze metallurgy. They don't just retrieve; they understand."
      cta={{ label: 'Meet the Vanguards', href: '/vanguards' }}
      visual={visual}
      className="bg-[#07070d]"
    />
  );
}
