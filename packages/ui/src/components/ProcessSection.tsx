'use client';

import React, { useState } from 'react';

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
  image?: string;
}

export interface ProcessSectionProps {
  steps?: ProcessStep[];
  className?: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    id: 'choose',
    number: '01',
    title: 'Choose Research Domain',
    description: 'Select from Nile Valley epigraphy, Timbuktu manuscript astronomy, Great Zimbabwe masonry, or Ifa binary divination.',
    image: '/images/vanguard/kemet-alpha-fullbody.png',
  },
  {
    id: 'connect',
    number: '02',
    title: 'Connect Vector Stores & Knowledge',
    description: 'Connect vector stores, 16-Volume ancient history library, and peer-reviewed archaeological datasets.',
    image: '/images/vanguard/kush-prime-fullbody.png',
  },
  {
    id: 'configure',
    number: '03',
    title: 'Configure Epistemic Rigor',
    description: 'Set confidence heuristics and verify claims across 6-state epistemic classifications (Established to Speculative).',
    image: '/images/vanguard/asante-v-fullbody.jpg',
  },
  {
    id: 'create',
    number: '04',
    title: 'Synthesize & Publish Dossier',
    description: 'Generate multi-agent research dossiers, primary source citations, and 3D spatial visual representations.',
    image: '/images/vanguard/bantu-node-fullbody.png',
  },
];

export function ProcessSection({ steps = DEFAULT_STEPS, className = '' }: ProcessSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = steps[activeIdx] || steps[0];

  return (
    <div className={`rounded-[32px] border border-amber-500/30 bg-[#0a0a0f] p-8 lg:p-12 space-y-10 shadow-2xl ${className}`}>
      <div className="border-b border-amber-500/20 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
          Research Pipeline Workflow
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
          Unbox the HoloKai OS Engine
        </h2>
      </div>

      {/* Step Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const isActive = idx === activeIdx;
          return (
            <button
              key={step.id}
              onClick={() => setActiveIdx(idx)}
              className={`p-5 rounded-2xl border text-left transition-all duration-300 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400 text-white shadow-xl shadow-amber-500/10 -translate-y-1'
                  : 'bg-[#12121a] border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-xs font-mono font-bold block ${isActive ? 'text-amber-300' : 'text-zinc-500'}`}>
                STEP {step.number}
              </span>
              <span className="text-sm font-bold mt-1 block">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Panel & Visual Crossfade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-2xl bg-[#12121a] border border-white/5">
        <div className="space-y-4">
          <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-widest">
            Phase {activeStep.number} · {activeStep.title}
          </span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {activeStep.title}
          </h3>
          <p className="text-base text-zinc-300 font-light leading-relaxed">
            {activeStep.description}
          </p>
        </div>

        <div className="h-64 md:h-80 rounded-xl bg-zinc-950 flex items-center justify-center p-4 overflow-hidden border border-white/5">
          {activeStep.image && (
            <img
              src={activeStep.image}
              alt={activeStep.title}
              className="h-full w-auto object-contain transition-all duration-500 animate-in fade-in zoom-in-95"
            />
          )}
        </div>
      </div>
    </div>
  );
}
