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
  title?: string;
  steps?: ProcessStep[];
  className?: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  {
    id: 'choose',
    number: '01',
    title: 'Choose Research Domain',
    description: 'Select from Nile Valley epigraphy, Timbuktu manuscript astronomy, Great Zimbabwe masonry, or Ifa binary divination.',
    image: '/assets/vanguard-orbit/KEMET-ALPHA full body.JPG',
  },
  {
    id: 'connect',
    number: '02',
    title: 'Connect Vector Stores & Knowledge',
    description: 'Connect vector stores, 16-Volume ancient history library, and peer-reviewed archaeological datasets.',
    image: '/assets/vanguard-orbit/KUSH-PRIME-fullbody.JPG',
  },
  {
    id: 'configure',
    number: '03',
    title: 'Configure Epistemic Rigor',
    description: 'Set confidence heuristics and verify claims across 6-state epistemic classifications (Established to Speculative).',
    image: '/assets/vanguard-orbit/ASANTE-V fullbody.JPG',
  },
  {
    id: 'create',
    number: '04',
    title: 'Synthesize & Publish Dossier',
    description: 'Generate multi-agent research dossiers, primary source citations, and 3D spatial visual representations.',
    image: '/assets/vanguard-orbit/BANTU-NODE-fullbody.JPG',
  },
];

export function ProcessSection({ title, steps = DEFAULT_STEPS, className = '' }: ProcessSectionProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeStep = steps[activeIdx] || steps[0];

  return (
    <div className={`rounded-[32px] border border-border bg-background p-8 lg:p-12 space-y-10 shadow-2xl ${className}`}>
      <div className="border-b border-border-subtle pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-brand font-bold">
          Research Pipeline Workflow
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
          {title || "Unbox the HoloKai OS Engine"}
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
                  ? 'bg-surface-hover border-brand text-white shadow-glow-brand -translate-y-1'
                  : 'bg-surface border-white/5 text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className={`text-xs font-mono font-bold block ${isActive ? 'text-brand' : 'text-zinc-500'}`}>
                STEP {step.number}
              </span>
              <span className="text-sm font-bold mt-1 block">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Step Panel & Visual Crossfade */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-2xl bg-surface border border-white/5">
        <div className="space-y-4">
          <span className="text-xs font-mono text-brand uppercase font-bold tracking-widest">
            Phase {activeStep.number} · {activeStep.title}
          </span>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
            {activeStep.title}
          </h3>
          <p className="text-base text-zinc-300 font-light leading-relaxed">
            {activeStep.description}
          </p>
        </div>

        <div className="h-64 md:h-80 rounded-xl bg-zinc-950 flex flex-col items-center justify-center p-4 overflow-hidden border border-white/5 relative group cursor-pointer hover:bg-zinc-900 hover:border-white/20 transition-all duration-200">
          {activeStep.image && (
            <img
              src={activeStep.image}
              alt={activeStep.title}
              className="absolute inset-0 h-full w-full object-contain opacity-20 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
            />
          )}
          <form className="w-full max-w-sm space-y-4 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder={`Query ${activeStep.title}...`}
              className="w-full bg-transparent border-b border-white/20 text-white p-2 focus:outline-none focus:border-brand transition-colors placeholder:text-zinc-600"
            />
            <button 
              type="submit" 
              className="w-full bg-brand hover:bg-brand-contrast text-black font-bold rounded py-2 transition-colors shadow-glow-brand"
            >
              Submit Query
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
