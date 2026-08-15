import React from 'react';
import { Cpu, Radio, Shield, Sparkles } from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  role: string;
  domain: string;
  status: 'ACTIVE' | 'QUERYING' | 'READY';
  latency: string;
}

const AGENT_SQUAD: AgentStatus[] = [
  { id: 'griota', name: 'Griota Oral Guardian', role: 'Living Memory & Narration', domain: 'Oral History', status: 'ACTIVE', latency: '42ms' },
  { id: 'wolfram', name: 'Wolfram Epistemic Engine', role: 'Quantitative Proof Verification', domain: 'Mathematics & Astronomy', status: 'READY', latency: '18ms' },
  { id: 'vanguard', name: 'Vanguard Architect', role: 'Structural Engineering & Masonry', domain: 'Architecture', status: 'ACTIVE', latency: '35ms' },
  { id: 'alive', name: 'HoloKai Alive Core', role: 'Multi-Agent Knowledge Graph RAG', domain: 'Civilization Graph', status: 'QUERYING', latency: '65ms' }
];

export function AgentSquadWidget() {
  return (
    <div className="w-full my-8 p-6 rounded-none bg-zinc-950/80 border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Radio className="w-5 h-5 animate-pulse text-amber-400" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h3 className="text-base sm:text-lg font-display font-light text-zinc-100 tracking-wide">
                HoloKai Autonomous AI Agent Squad
              </h3>
              <span className="text-[9px] px-2.5 py-0.5 rounded-none bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono tracking-[0.18em] shrink-0">
                MULTI-AGENT RUNTIME
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Real-time telemetry & execution status of specialized historical AI agents</p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AGENT_SQUAD.map((agent) => (
          <div key={agent.id} className="p-4 rounded-none bg-[#020202]/90 border border-amber-900/40 flex items-center justify-between gap-3 hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-amber-950/30 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-display font-bold text-zinc-200 tracking-wide">{agent.name}</h4>
                <p className="text-[11px] text-zinc-400 font-light">{agent.role}</p>
              </div>
            </div>

            <div className="text-right font-mono text-[10px]">
              <span className="inline-flex items-center gap-1.5 text-amber-300 px-2 py-0.5 rounded-none bg-amber-500/10 border border-amber-500/30 mb-1 tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                {agent.status}
              </span>
              <span className="block text-zinc-500 tracking-wider">{agent.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
