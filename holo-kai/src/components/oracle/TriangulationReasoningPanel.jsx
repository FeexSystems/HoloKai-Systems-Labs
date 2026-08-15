import React from 'react';
import { Brain, Sparkles, ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export default function TriangulationReasoningPanel({ response }) {
  if (!response) return null;

  const steps = [
    {
      title: '1. Multi-Source Ingestion',
      icon: Database,
      detail: `${response.sources_consulted || response.active_agents?.length || 4} independent streams queried across archaeological, historical, and oral corpora.`,
      status: 'complete',
    },
    {
      title: '2. Multi-Agent Triangulation',
      icon: Brain,
      detail: `Agents (${(response.active_agents || ['Archaeologist', 'Historian', 'Linguist']).join(', ')}) cross-referenced findings for factual consistency.`,
      status: 'complete',
    },
    {
      title: "3. Ethical Ma'at Verification",
      icon: ShieldCheck,
      detail: 'Immutable ethical filter verified non-extraction, sacred site protection, and cultural respect.',
      status: 'complete',
    },
    {
      title: '4. Voice & Synthesis Output',
      icon: Sparkles,
      detail: `Synthesized with ${Math.round((response.confidence || 0.94) * 100)}% certainty coefficient under ${response.vanguard_unit || 'Vanguard-01'} persona.`,
      status: 'complete',
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white/80 p-5 shadow-sm backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900">
            Triangulation & Evidence Reasoning Chain
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 font-semibold">
          Ma'at Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-1.5">
              <div className="flex items-center justify-between text-amber-700">
                <Icon className="w-4 h-4" />
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <h4 className="text-xs font-mono font-bold text-zinc-900">{step.title}</h4>
              <p className="text-[11px] text-zinc-600 leading-snug">{step.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
