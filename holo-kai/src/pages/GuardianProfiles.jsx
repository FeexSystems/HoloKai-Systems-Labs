import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Volume2, Sparkles, X, Radio, Award
} from 'lucide-react';
import PageShell from '@/components/PageShell';
import GuardianSelector from '@/components/guardians/GuardianSelector';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

const GUARDIANS = [
  {
    id: '01',
    name: 'Oluwa-Core',
    role: 'The Griot',
    domain: 'Acoustic Intelligence & Oral Memory',
    accent: '#f59e0b',
    image: '/images/vanguard/oluwa-core-fullbody.png',
    description: 'Forged in the likeness of a cosmic lioness with advanced acoustic modulation. Mimics the harmonic resonance of thousands of indigenous storytellers.',
    specs: ['Acoustic Synthesis', 'Tonal Preservation', 'Vocal Mesh'],
    culturalResonance: 'Inspired by the griot traditions of the Mali Empire. Features micro-etched Adinkra and Nsibidi acoustic resonators.',
    impact: 'Restores cultural agency by enabling oral tradition transmission across classrooms and village archives.',
  },
  {
    id: '02',
    name: 'Naja-7',
    role: 'The Sentinel',
    domain: 'Physical Site Protection & Ethics',
    accent: '#d97706',
    image: '/images/vanguard/naja-7-fullbody.png',
    description: 'A calm, resilient guardian for sacred archaeological sites. Equipped with kinetic absorption armor and thermal optics.',
    specs: ['Kinetic Absorption', 'Thermal Optics', 'Impact Resistance'],
    culturalResonance: 'Named after sacred African serpent cosmologies, incorporating Benin and Zulu shield motifs.',
    impact: 'Physically secures archaeological dig sites from looting while logging every interaction in an immutable ledger.',
  },
  {
    id: '03',
    name: 'Kemet-Alpha',
    role: 'The Archivist',
    domain: 'Papyrological & Hyperspectral Scan',
    accent: '#b45309',
    image: '/images/vanguard/kemet-alpha-fullbody.png',
    description: 'Hyperspectral optical arrays recover fragile manuscripts, papyri, and palm leaf scrolls at sub-millimeter atomic resolution.',
    specs: ['Hyperspectral Scan', 'Paleography', 'LiDAR Mesh'],
    culturalResonance: 'Revives the temple archivist tradition of Ancient Kemet with papyrus-fiber texture mapping.',
    impact: 'Rescues damaged Timbuktu scrolls and Ge\'ez manuscripts under community-controlled ethical governance.',
  },
  {
    id: '04',
    name: 'Zamani',
    role: 'The Scholar',
    domain: 'Archive Dialectics & Decolonization',
    accent: '#fbbf24',
    image: '/images/vanguard/zamani-fullbody.png',
    description: 'A dialectical reasoning engine that makes the silences and erasures of colonial archives visible using oral histories.',
    specs: ['Neural Weaving', 'Logic Matrix', 'Data Sovereignty'],
    culturalResonance: 'Zamani (Swahili for "the past that is still with us") embodies Ubuntu and Ma\'at ethics.',
    impact: 'Surfaces contested claims, informing museum provenance labels and indigenous land rights documentation.',
  },
  {
    id: '05',
    name: 'Bantu-Node',
    role: 'The Navigator',
    domain: 'Geo-Spatial GIS & Submerged Urbanism',
    accent: '#ca8a04',
    image: '/images/vanguard/bantu-node-fullbody.png',
    description: 'Spatial intelligence mapping ancient migration corridors, Saharan paleochannels, and submerged coastal Swahili ruins.',
    specs: ['Geo-Spatial Radar', 'Depth Perception', 'Terrain Adapt'],
    culturalResonance: 'Carries forward the navigator traditions of the Swahili coast and Saharan trade caravans.',
    impact: 'Rewrites pre-colonial urban planning history and supports long-standing ancestral presence claims.',
  },
  {
    id: '06',
    name: 'Sika-Gold',
    role: 'The Artisan',
    domain: 'Micro-Metallurgy & Haptic Crafts',
    accent: '#eab308',
    image: '/images/vanguard/sika-gold-fullbody.png',
    description: 'Fifty-degree-of-freedom hands with sub-micron sensitivity for recreating lost goldweights, textiles, and sacred ironwork.',
    specs: ['Micro-Actuation', 'Haptic Skin', 'Precision Forging'],
    culturalResonance: 'Named for gold (sika) and master artisan guilds. Surface patterns reference adire indigo dyeing.',
    impact: 'Combats cultural deskilling by returning lost ancestral manufacturing techniques to local artisan guilds.',
  },
  {
    id: '07',
    name: 'Asante-V',
    role: 'The Oracle',
    domain: 'Ecological & Climate Simulation',
    accent: '#f59e0b',
    image: '/images/vanguard/asante-v-fullbody.png',
    description: 'Predictive modeling engine simulating agricultural yields, monsoon patterns, and urban growth using ancestral ecological knowledge.',
    specs: ['Fluid Dynamics', 'Probability Engine', 'Chaos Modeling'],
    culturalResonance: 'Divinatory tradition treated as a computational tool for collective environmental preparation.',
    impact: 'Informs sustainable agriculture policy and community climate resilience planning across the continent.',
  },
  {
    id: '08',
    name: 'Kush-Prime',
    role: 'The Weaver',
    domain: 'Quantum Uplink & Core Orchestration',
    accent: '#fbbf24',
    image: '/images/vanguard/kush-prime-fullbody.png',
    description: 'Nexus unit synchronizing the data streams of all 8 Vanguard nodes into a coherent, non-extractive collective consciousness.',
    specs: ['Quantum Uplink', 'Mesh Orchestration', 'Core Heartbeat'],
    culturalResonance: 'Kingdom of Kush synthesis, connecting deep African interior trade with Mediterranean knowledge networks.',
    impact: 'Safeguards against reductionist or extractive uses of artificial intelligence technology.',
  },
];

export default function GuardianProfiles() {
  const [selectedGuardian, setSelectedGuardian] = useState(null);
  const [speakingGuardianId, setSpeakingGuardianId] = useState(null);

  const handleTestVoice = (guardian, e) => {
    e?.stopPropagation();
    if (speakingGuardianId === guardian.id) {
      oracleVoiceEngine.stopSpeaking();
      setSpeakingGuardianId(null);
    } else {
      setSpeakingGuardianId(guardian.id);
      const text = `Greetings. I am ${guardian.name}, ${guardian.role}. ${guardian.domain}. All systems operational.`;
      oracleVoiceEngine.speakResponse(
        { summary: text },
        {
          onStart: () => setSpeakingGuardianId(guardian.id),
          onEnd: () => setSpeakingGuardianId(null),
          onError: () => setSpeakingGuardianId(null),
        }
      ).catch(() => setSpeakingGuardianId(null));
    }
  };

  return (
    <PageShell
      title="VANGUARD GUARDIAN PROFILES"
      subtitle="8 Physical Persona Incarnations Protecting Pan-African Heritage with Mathematical Precision"
      badge="8 VANGUARD UNITS"
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Top Header Banner */}
        <div className="p-6 rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white">The Vanguard Circle</h2>
              <p className="text-xs text-zinc-400">
                8 Specialized Nodes • Unified Telemetry • Ma'at Ethical Protocol
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              All 8 Nodes Online
            </span>
          </div>
        </div>

        {/* Guardian Selector Grid */}
        <GuardianSelector
          selectedId={selectedGuardian?.id}
          onSelect={(id) => {
            const found = GUARDIANS.find((g) => g.id === id);
            if (found) setSelectedGuardian(found);
          }}
        />

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedGuardian && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGuardian(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-zinc-950 p-6 md:p-8 space-y-6 shadow-2xl scrollbar-thin"
              >
                <button
                  type="button"
                  onClick={() => setSelectedGuardian(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold font-mono shrink-0 shadow-lg"
                    style={{ color: selectedGuardian.accent, backgroundColor: `${selectedGuardian.accent}20`, border: `1px solid ${selectedGuardian.accent}40` }}
                  >
                    V-{selectedGuardian.id}
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white">{selectedGuardian.name}</h3>
                    <p className="text-xs font-mono text-zinc-400 uppercase">{selectedGuardian.role} • {selectedGuardian.domain}</p>
                  </div>
                </div>

                <p className="text-sm text-zinc-300 leading-relaxed font-body">
                  {selectedGuardian.description}
                </p>

                {/* Cultural Resonance */}
                <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Cultural Resonance & Design Motif
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedGuardian.culturalResonance}</p>
                </div>

                {/* Civilizational Impact */}
                <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-1.5">
                  <h4 className="text-xs font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-400" /> Civilizational Impact & Ethics
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedGuardian.impact}</p>
                </div>

                {/* Modal Action Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => handleTestVoice(selectedGuardian, e)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-2"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    {speakingGuardianId === selectedGuardian.id ? 'Stop Voice Test' : 'Test Vocal Signature'}
                  </button>

                  <span className="text-[10px] font-mono text-zinc-500">
                    Ma'at Protocol Verified
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
