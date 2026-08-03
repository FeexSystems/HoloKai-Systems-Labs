import React from 'react';
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

const VANGUARD_UNITS = [
  { id: '01', name: 'Oluwa-Core', role: 'The Griot', accent: '#f59e0b', specs: ['Acoustic Synthesis', 'Tonal Preservation'] },
  { id: '02', name: 'Naja-7', role: 'The Sentinel', accent: '#d97706', specs: ['Impact Resistance', 'Thermal Optics'] },
  { id: '03', name: 'Kemet-Alpha', role: 'The Archivist', accent: '#b45309', specs: ['Hyperspectral Scan', 'LiDAR Mesh'] },
  { id: '04', name: 'Zamani', role: 'The Scholar', accent: '#fbbf24', specs: ['Neural Weaving', 'Data Sovereign'] },
  { id: '05', name: 'Bantu-Node', role: 'The Navigator', accent: '#ca8a04', specs: ['Geo-Spatial Radar', 'Terrain Adapt'] },
  { id: '06', name: 'Sika-Gold', role: 'The Artisan', accent: '#eab308', specs: ['Micro-Actuation', 'Precision Forging'] },
  { id: '07', name: 'Asante-V', role: 'The Oracle', accent: '#f59e0b', specs: ['Fluid Dynamics', 'Probability Engine'] },
  { id: '08', name: 'Kush-Prime', role: 'The Weaver', accent: '#fbbf24', specs: ['Quantum Uplink', 'Mesh Orchestration'] },
];

export default function VanguardUnitVoiceSelector({ activeUnitId = '01', onSelectUnit }) {
  const [testingUnitId, setTestingUnitId] = React.useState(null);

  const handleTestVoice = (unit, e) => {
    e.stopPropagation();
    if (testingUnitId === unit.id) {
      oracleVoiceEngine.stopSpeaking(unit.id);
      setTestingUnitId(null);
    } else {
      setTestingUnitId(unit.id);
      const text = `Greetings. I am ${unit.name}, ${unit.role}. Systems online and monitoring civilizational streams.`;
      oracleVoiceEngine.speakResponse(
        { summary: text },
        unit.id,
        {
          onStart: () => setTestingUnitId(unit.id),
          onEnd: () => setTestingUnitId(null),
          onError: () => setTestingUnitId(null),
        }
      ).catch(() => setTestingUnitId(null));
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-4 sm:p-5 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-100">
            Vanguard Voice Matrix (8 Persona Nodes)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase">
          Dynamic Persona Binding
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {VANGUARD_UNITS.map((unit) => {
          const isSelected = activeUnitId === unit.id;
          const isTesting = testingUnitId === unit.id;

          return (
            <div
              key={unit.id}
              className={`group relative text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-amber-500/50 bg-amber-500/10 shadow-sm'
                  : 'border-white/10 bg-zinc-900/60 hover:border-amber-500/30 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase"
                  style={{ color: unit.accent, backgroundColor: `${unit.accent}20` }}
                >
                  V-{unit.id}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleTestVoice(unit, e)}
                  title={`Test ${unit.name} voice`}
                  className={`p-1 rounded-md transition-colors ${
                    isTesting ? 'bg-amber-500 text-black font-bold animate-pulse' : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800'
                  }`}
                >
                  {isTesting ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={() => onSelectUnit && onSelectUnit(unit.id)}
                className="w-full text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded-md"
              >
                <h4 className="text-xs font-display font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                  {unit.name}
                </h4>
                <p className="text-[10px] font-mono text-zinc-400 uppercase">{unit.role}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {unit.specs.map((s, i) => (
                    <span key={i} className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-300 border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
