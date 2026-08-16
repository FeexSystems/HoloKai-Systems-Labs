import React from 'react';
import {
  Play, RefreshCw, Save, TrendingUp,
  Globe2, Cpu, Bookmark
} from 'lucide-react';

export interface ScenarioParams {
  tradeVolume: number;
  scholarlyExchange: number;
  metallurgyDiffusion: number;
  maritimeDefense: number;
}

export interface HistoricalScenario {
  id: string;
  title: string;
  civilization: string;
  description: string;
  defaultParams: ScenarioParams;
}

export const HISTORICAL_SCENARIOS: HistoricalScenario[] = [
  {
    id: 'timbuktu-nile-route',
    title: 'Trans-Saharan & Nile Trade Convergence',
    civilization: 'Mali Empire & Kemet',
    description: 'Simulates the geopolitical and economic impact if Mansa Musa\'s pilgrimage established a permanent trans-African canal & trade corridor linking the Niger and Nile Rivers.',
    defaultParams: {
      tradeVolume: 85,
      scholarlyExchange: 90,
      metallurgyDiffusion: 75,
      maritimeDefense: 60,
    }
  },
  {
    id: 'aksum-indian-ocean',
    title: 'Aksumite Indian Ocean Fleet Expansion',
    civilization: 'Aksumite Empire & Swahili Coast',
    description: 'Models the cultural and monetary ripple effects if King Ezana constructed a unified blue-water fleet connecting Adulis directly with Malacca and Canton.',
    defaultParams: {
      tradeVolume: 92,
      scholarlyExchange: 80,
      metallurgyDiffusion: 88,
      maritimeDefense: 95,
    }
  },
  {
    id: 'zimbabwe-coral-citadel',
    title: 'Great Zimbabwe & Kilwa Architectural Guild',
    civilization: 'Great Zimbabwe & Swahili Coast',
    description: 'Simulates the structural diffusion if dry-stone granite masonry and coral stone dome architecture were cross-engineered into a pan-African defensive nexus.',
    defaultParams: {
      tradeVolume: 78,
      scholarlyExchange: 85,
      metallurgyDiffusion: 94,
      maritimeDefense: 85,
    }
  }
];

export interface SimulationResult {
  gdpGrowth: string;
  literacyIndex: string;
  stabilityIndex: string;
  summary: string;
}

export interface SavedSimulation {
  id: string;
  civilization: string;
  scenarioTitle: string;
  result?: SimulationResult;
  authorName?: string;
}

export interface QuantumTimeSimulatorProps {
  scenarios?: HistoricalScenario[];
  selectedScenario: HistoricalScenario;
  params: ScenarioParams;
  isSimulating: boolean;
  simulationResult: SimulationResult | null;
  savedSimulations: SavedSimulation[];
  loading: boolean;
  onSelectScenario: (scenario: HistoricalScenario) => void;
  onParamsChange: (params: ScenarioParams) => void;
  onRunSimulation: () => void;
  onSaveSimulation: () => void;
  onDeleteSimulation: (id: string) => void;
}

export function QuantumTimeSimulator({
  scenarios = HISTORICAL_SCENARIOS,
  selectedScenario,
  params,
  isSimulating,
  simulationResult,
  savedSimulations,
  loading,
  onSelectScenario,
  onParamsChange,
  onRunSimulation,
  onSaveSimulation,
  onDeleteSimulation
}: QuantumTimeSimulatorProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl border border-brand/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[var(--pui-forest-deep)]/40 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/40 bg-brand/10 text-brand text-xs font-mono font-bold tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5 text-brand" />
              <span>Predictive Epistemic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
              Quantum Epistemic Time Simulator
            </h1>
            <p className="text-sm text-muted leading-relaxed font-sans">
              Model counterfactual historical scenarios, adjust geopolitical variables, and project economic, scholarly, and defensive outcomes across sovereign African empires.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRunSimulation}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition disabled:opacity-50"
            >
              <Play className={`w-4 h-4 fill-zinc-950 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Computing Quantum Vectors...' : 'Execute Simulation Run'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCENARIOS SELECTOR */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-bold text-brand uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            <span>Counterfactual Historical Scenarios</span>
          </h3>

          <div className="space-y-3">
            {scenarios.map((scen) => (
              <div
                key={scen.id}
                onClick={() => onSelectScenario(scen)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedScenario.id === scen.id
                    ? 'border-brand bg-brand/15 shadow-lg'
                    : 'border-border-subtle bg-background/80 hover:border-brand/40 hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-brand font-bold uppercase">
                    {scen.civilization}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-bold text-foreground">{scen.title}</h4>
                <p className="text-xs text-muted leading-relaxed line-clamp-3">{scen.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PARAMETER SLIDERS & SIMULATION TELEMETRY */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl border border-brand/30 bg-background/90 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div>
                <span className="text-xs font-mono text-brand uppercase tracking-wider">
                  Active Simulation
                </span>
                <h2 className="text-xl font-serif font-bold text-foreground">{selectedScenario.title}</h2>
              </div>

              {simulationResult && (
                <button
                  onClick={onSaveSimulation}
                  className="px-4 py-2 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Report</span>
                </button>
              )}
            </div>

            {/* PARAMETER SLIDERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Trade Route Capacity</span>
                  <span className="text-brand">{params.tradeVolume}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.tradeVolume}
                  onChange={(e) => onParamsChange({ ...params, tradeVolume: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Scholarly & Codex Exchange</span>
                  <span className="text-brand">{params.scholarlyExchange}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.scholarlyExchange}
                  onChange={(e) => onParamsChange({ ...params, scholarlyExchange: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Metallurgy & Technology Diffusion</span>
                  <span className="text-brand">{params.metallurgyDiffusion}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.metallurgyDiffusion}
                  onChange={(e) => onParamsChange({ ...params, metallurgyDiffusion: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Sovereign Fleet Defense</span>
                  <span className="text-brand">{params.maritimeDefense}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.maritimeDefense}
                  onChange={(e) => onParamsChange({ ...params, maritimeDefense: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* SIMULATION TELEMETRY OUTPUT */}
            {simulationResult ? (
              <div className="p-5 rounded-2xl border border-brand/40 bg-brand/10 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono text-brand font-bold uppercase">
                  <TrendingUp className="w-4 h-4 text-brand" />
                  <span>Simulation Outcome Telemetry</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-surface/80 rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-mono text-muted uppercase block">Trade Surplus</span>
                    <span className="text-lg font-bold font-mono text-brand">+{simulationResult.gdpGrowth}%</span>
                  </div>

                  <div className="p-3 bg-surface/80 rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-mono text-muted uppercase block">Codex Index</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{simulationResult.literacyIndex}%</span>
                  </div>

                  <div className="p-3 bg-surface/80 rounded-xl border border-border-subtle">
                    <span className="text-[10px] font-mono text-muted uppercase block">Stability</span>
                    <span className="text-lg font-bold font-mono text-blue-400">{simulationResult.stabilityIndex}%</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                  {simulationResult.summary}
                </p>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-border-subtle text-xs font-mono text-muted">
                Adjust simulation sliders above and click "Execute Simulation Run" to compute historical predictions.
              </div>
            )}
          </div>

          {/* SAVED REPORTS */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-brand uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Archived Quantum Simulations ({savedSimulations.length})</span>
            </h3>

            {loading ? (
              <div className="py-6 text-center text-xs font-mono text-muted flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand" />
                <span>Loading Archived Simulations...</span>
              </div>
            ) : savedSimulations.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-center text-xs text-muted font-mono">
                No archived quantum simulations saved yet. Execute a simulation run to record historical reports!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-4 rounded-2xl border border-border-subtle bg-background/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-brand uppercase font-bold">
                        {sim.civilization}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-zinc-200">{sim.scenarioTitle}</h4>
                      <p className="text-[11px] font-sans text-muted line-clamp-2">
                        {sim.result?.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-muted">
                      <span>By: {sim.authorName || 'Analyst'}</span>
                      <button
                        onClick={() => onDeleteSimulation(sim.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
