import React, { useState } from 'react';
import { Activity } from 'lucide-react';

interface EraMetric {
  id: string;
  name: string;
  period: string;
  innovation: string;
  metricLabel: string;
  metricValue: string;
  color: string;
}

const HISTORICAL_ERAS: EraMetric[] = [
  {
    id: "kush",
    name: "Kingdom of Kush",
    period: "1070 BCE – 350 CE",
    innovation: "Iron Smelting & Meroitic Script",
    metricLabel: "Iron Furnace Output",
    metricValue: "12,000 Tons/Yr",
    color: "#f59e0b"
  },
  {
    id: "aksum",
    name: "Aksumite Empire",
    period: "100 CE – 940 CE",
    innovation: "Monolithic Stelae & Coinage",
    metricLabel: "Red Sea Trade Index",
    metricValue: "98.4 Scale",
    color: "#d97706"
  },
  {
    id: "mali",
    name: "Mali Empire",
    period: "1235 CE – 1670 CE",
    innovation: "Sankore University & Gold Standard",
    metricLabel: "Academic Manuscript Count",
    metricValue: "700,000 Volume",
    color: "#fbbf24"
  },
  {
    id: "zimbabwe",
    name: "Great Zimbabwe",
    period: "1100 CE – 1450 CE",
    innovation: "Mortarless Dry-Stone Architecture",
    metricLabel: "Structural Integrity",
    metricValue: "100% Intact",
    color: "#b45309"
  }
];

export function CivilizationPulseChart() {
  const [selectedEra, setSelectedEra] = useState<EraMetric>(HISTORICAL_ERAS[2]);

  return (
    <div className="w-full my-8 p-6 rounded-none bg-zinc-950/80 border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Activity className="w-5 h-5 animate-pulse text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-light text-zinc-100 flex items-center gap-3 tracking-wide">
              Civilization Pulse & Historical Innovation Chart
              <span className="text-[9px] px-2.5 py-0.5 rounded-none bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono tracking-[0.2em]">
                CHRONOLOGY DATA
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Interactive historical metrics across African classical eras</p>
          </div>
        </div>
      </div>

      {/* Eras Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
        {HISTORICAL_ERAS.map((era) => {
          const isSelected = selectedEra.id === era.id;
          return (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era)}
              className={`p-3.5 rounded-none border text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-200'
                  : 'bg-[#020202]/80 border-amber-900/40 text-zinc-400 hover:text-zinc-200 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-display font-bold tracking-wide text-zinc-200">{era.name}</span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: era.color }} />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 block tracking-wider">{era.period}</span>
            </button>
          );
        })}
      </div>

      {/* Visual Chart Metrics Panel */}
      <div className="p-5 rounded-none bg-[#020202]/90 border border-amber-900/40 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-500/15 pb-3">
          <div>
            <h4 className="text-sm font-display font-bold text-amber-300 flex items-center gap-2 tracking-wide">
              {selectedEra.name}
              <span className="text-xs font-mono font-normal text-zinc-500">({selectedEra.period})</span>
            </h4>
            <p className="text-xs text-zinc-300 font-light mt-1">Key Innovation: <span className="text-amber-200 font-normal">{selectedEra.innovation}</span></p>
          </div>
          <div className="text-right font-mono">
            <span className="text-[10px] uppercase text-zinc-500 tracking-wider block">{selectedEra.metricLabel}</span>
            <span className="text-base font-bold text-amber-400 tracking-wider">{selectedEra.metricValue}</span>
          </div>
        </div>

        {/* Animated Bar Graphic */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono tracking-wider">
            <span>HISTORICAL TECHNOLOGICAL SCALING</span>
            <span>VERIFIED ARCHIVAL RECORD</span>
          </div>
          <div className="w-full h-3 bg-zinc-900/90 rounded-none overflow-hidden p-0.5 border border-amber-500/20">
            <div
              className="h-full rounded-none transition-all duration-700 ease-out"
              style={{
                width: '88%',
                backgroundColor: selectedEra.color,
                boxShadow: `0 0 14px ${selectedEra.color}aa`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
