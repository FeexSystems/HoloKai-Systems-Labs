import React, { useState, useEffect } from 'react';
import {
  Play, RefreshCw, Save, TrendingUp,
  Globe2, Cpu, Bookmark
} from 'lucide-react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { retroAudio } from '@/lib/audioFeedback';

const HISTORICAL_SCENARIOS = [
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

export default function QuantumTimeSimulator() {
  const [selectedScenario, setSelectedScenario] = useState(HISTORICAL_SCENARIOS[0]);
  const [params, setParams] = useState(HISTORICAL_SCENARIOS[0].defaultParams);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const colRef = collection(db, 'quantumSimulations');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setSavedSimulations(fetched);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  const handleSelectScenario = (scen) => {
    retroAudio.playClick();
    setSelectedScenario(scen);
    setParams(scen.defaultParams);
    setSimulationResult(null);
  };

  const handleRunSimulation = () => {
    retroAudio.playClick();
    setIsSimulating(true);

    setTimeout(() => {
      const gdpGrowth = ((params.tradeVolume * 1.4 + params.metallurgyDiffusion * 1.1) / 2).toFixed(1);
      const literacyIndex = ((params.scholarlyExchange * 1.6 + params.tradeVolume * 0.4) / 2).toFixed(1);
      const stabilityIndex = ((params.maritimeDefense * 1.3 + params.metallurgyDiffusion * 0.7) / 2).toFixed(1);

      setSimulationResult({
        gdpGrowth,
        literacyIndex,
        stabilityIndex,
        summary: `Under parameter tuning, the ${selectedScenario.civilization} matrix achieves an estimated +${gdpGrowth}% trade economic surplus, a ${literacyIndex}% scholastic diffusion rate across university codices, and a ${stabilityIndex}% sovereign defense stability rating.`,
      });
      setIsSimulating(false);
      retroAudio.playSuccessChime();
    }, 1200);
  };

  const handleSaveSimulation = async () => {
    if (!simulationResult) return;
    retroAudio.playClick();

    try {
      await addDoc(collection(db, 'quantumSimulations'), {
        scenarioId: selectedScenario.id,
        scenarioTitle: selectedScenario.title,
        civilization: selectedScenario.civilization,
        params,
        result: simulationResult,
        userId: auth.currentUser?.uid || 'guest_analyst',
        authorName: auth.currentUser?.displayName || 'Quantum Historian',
        createdAt: serverTimestamp(),
      });
      retroAudio.playSuccessChime();
    } catch (err) {
      console.error('Error saving simulation:', err);
    }
  };

  const handleDeleteSimulation = async (id) => {
    retroAudio.playClick();
    try {
      await deleteDoc(doc(db, 'quantumSimulations', id));
    } catch (err) {
      console.error('Error deleting simulation:', err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>Predictive Epistemic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Quantum Epistemic Time Simulator
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Model counterfactual historical scenarios, adjust geopolitical variables, and project economic, scholarly, and defensive outcomes across sovereign African empires.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition disabled:opacity-50"
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
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            <span>Counterfactual Historical Scenarios</span>
          </h3>

          <div className="space-y-3">
            {HISTORICAL_SCENARIOS.map((scen) => (
              <div
                key={scen.id}
                onClick={() => handleSelectScenario(scen)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedScenario.id === scen.id
                    ? 'border-amber-500 bg-amber-500/15 shadow-lg'
                    : 'border-white/10 bg-zinc-950/80 hover:border-amber-500/40 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase">
                    {scen.civilization}
                  </span>
                </div>
                <h4 className="text-sm font-serif font-bold text-white">{scen.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{scen.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: PARAMETER SLIDERS & SIMULATION TELEMETRY */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-zinc-950/90 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Active Simulation
                </span>
                <h2 className="text-xl font-serif font-bold text-white">{selectedScenario.title}</h2>
              </div>

              {simulationResult && (
                <button
                  onClick={handleSaveSimulation}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Report</span>
                </button>
              )}
            </div>

            {/* PARAMETER SLIDERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>Trade Route Capacity</span>
                  <span className="text-amber-400">{params.tradeVolume}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.tradeVolume}
                  onChange={(e) => setParams({ ...params, tradeVolume: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>Scholarly & Codex Exchange</span>
                  <span className="text-amber-400">{params.scholarlyExchange}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.scholarlyExchange}
                  onChange={(e) => setParams({ ...params, scholarlyExchange: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>Metallurgy & Technology Diffusion</span>
                  <span className="text-amber-400">{params.metallurgyDiffusion}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.metallurgyDiffusion}
                  onChange={(e) => setParams({ ...params, metallurgyDiffusion: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>Sovereign Fleet Defense</span>
                  <span className="text-amber-400">{params.maritimeDefense}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={params.maritimeDefense}
                  onChange={(e) => setParams({ ...params, maritimeDefense: Number(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* SIMULATION TELEMETRY OUTPUT */}
            {simulationResult ? (
              <div className="p-5 rounded-2xl border border-amber-500/40 bg-amber-500/10 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold uppercase">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Simulation Outcome Telemetry</span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Trade Surplus</span>
                    <span className="text-lg font-bold font-mono text-amber-400">+{simulationResult.gdpGrowth}%</span>
                  </div>

                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Codex Index</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{simulationResult.literacyIndex}%</span>
                  </div>

                  <div className="p-3 bg-zinc-900/80 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Stability</span>
                    <span className="text-lg font-bold font-mono text-blue-400">{simulationResult.stabilityIndex}%</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-200 font-sans leading-relaxed">
                  {simulationResult.summary}
                </p>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-xs font-mono text-zinc-400">
                Adjust simulation sliders above and click "Execute Simulation Run" to compute historical predictions.
              </div>
            )}
          </div>

          {/* FIRESTORE SAVED REPORTS */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Archived Quantum Simulations ({savedSimulations.length})</span>
            </h3>

            {loading ? (
              <div className="py-6 text-center text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Loading Archived Simulations...</span>
              </div>
            ) : savedSimulations.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs text-zinc-400 font-mono">
                No archived quantum simulations saved yet. Execute a simulation run to record historical reports!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedSimulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-4 rounded-2xl border border-white/10 bg-zinc-950/80 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                        {sim.civilization}
                      </span>
                      <h4 className="text-xs font-serif font-bold text-zinc-200">{sim.scenarioTitle}</h4>
                      <p className="text-[11px] font-sans text-zinc-400 line-clamp-2">
                        {sim.result?.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>By: {sim.authorName || 'Analyst'}</span>
                      <button
                        onClick={() => handleDeleteSimulation(sim.id)}
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
