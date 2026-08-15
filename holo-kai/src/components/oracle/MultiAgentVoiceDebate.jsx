import React, { useState } from 'react';
import { Radio, Play, Square, Users } from 'lucide-react';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

const ALL_8_VANGUARDS = [
  { id: "griota", name: "Griota Oral Historian", role: "Living Memory & Tradition", voice: "en-US-JennyNeural", openingLine: "Oral tradition preserves truths that physical stone cannot capture." },
  { id: "vanguard", name: "Vanguard Scholar", role: "Ethnomathematics & Geometry", voice: "en-US-GuyNeural", openingLine: "Yet the fractal dimensions of dry-stone masonry offer mathematical proof." },
  { id: "oluwa", name: "Oluwa Core", role: "Unified Civilization Consciousness", voice: "en-US-AriaNeural", openingLine: "Both lineage and geometry form the dual pillars of African civilization." },
  { id: "kushite", name: "Metallurgist Queen", role: "Ancient Kushite Iron Technology", voice: "en-US-AnaNeural", openingLine: "Iron smelting in Meroë reached temperatures exceeding European furnaces." },
  { id: "timbuktu", name: "Timbuktu Astronomer", role: "Sankore Observatory Science", voice: "en-US-[#4]", openingLine: "The manuscripts of Timbuktu map planetary motion prior to the Renaissance." },
  { id: "zimbabwe", name: "Zimbabwe Master Mason", role: "Mortarless Stone Engineering", voice: "en-US-ChristopherNeural", openingLine: "Our conical towers endure without mortar because gravity is our mortar." },
  { id: "aksumite", name: "Aksum Maritime Navigator", role: "Red Sea Trade Architecture", voice: "en-US-EricNeural", openingLine: "Our coinage linked Mediterranean trade to the Indian Ocean." },
  { id: "luba", name: "Lukasa Memory Master", role: "Tactile Memory Board Cipher", voice: "en-US-MichelleNeural", openingLine: "Each bead on the Lukasa board encodes a generation of governance." }
];

export default function MultiAgentVoiceDebate() {
  const [speakerA, setSpeakerA] = useState<VanguardGuardian>(ALL_8_VANGUARDS[0]);
  const [speakerB, setSpeakerB] = useState<VanguardGuardian>(ALL_8_VANGUARDS[1]);
  const [isDebating, setIsDebating] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  const startDebate = async () => {
    if (isDebating) {
      oracleVoiceEngine.stopSpeaking();
      setIsDebating(false);
      setActiveSpeaker(null);
      return;
    }

    setIsDebating(true);

    try {
      // Speaker A Turn
      setActiveSpeaker(speakerA.name);
      await oracleVoiceEngine.speakResponse(speakerA.openingLine, { rate: 0.9 });

      // Speaker B Turn
      if (isDebating) {
        setActiveSpeaker(speakerB.name);
        await oracleVoiceEngine.speakResponse(speakerB.openingLine, { rate: 0.9 });
      }
    } catch (err) {
      console.warn("Debate audio interrupted:", err);
    } finally {
      setIsDebating(false);
      setActiveSpeaker(null);
    }
  };

  return (
    <div className="my-6 p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-emerald-100 flex items-center gap-2">
              Multi-Agent Vanguard Voice Debate Engine
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                8 Guardians
              </span>
            </h3>
            <p className="text-xs text-slate-400">Pair any 2 Vanguard Guardians for a live spoken historical dialogue</p>
          </div>
        </div>
      </div>

      {/* Speaker Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Speaker A */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-[10px] uppercase font-mono text-amber-400 block">Select Guardian A (Opener):</label>
          <select
            value={speakerA.id}
            onChange={(e) => setSpeakerA(ALL_8_VANGUARDS.find(v => v.id === e.target.value) || ALL_8_VANGUARDS[0])}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 font-mono focus:border-amber-500"
          >
            {ALL_8_VANGUARDS.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.role})</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 italic">"{speakerA.openingLine}"</p>
        </div>

        {/* Speaker B */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <label className="text-[10px] uppercase font-mono text-emerald-400 block">Select Guardian B (Respondent):</label>
          <select
            value={speakerB.id}
            onChange={(e) => setSpeakerB(ALL_8_VANGUARDS.find(v => v.id === e.target.value) || ALL_8_VANGUARDS[1])}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 font-mono focus:border-emerald-500"
          >
            {ALL_8_VANGUARDS.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({v.role})</option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 italic">"{speakerB.openingLine}"</p>
        </div>
      </div>

      {/* Start Debate Control */}
      <div className="flex items-center justify-between">
        {activeSpeaker ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Active Speaker: <strong>{activeSpeaker}</strong></span>
          </div>
        ) : (
          <span className="text-xs text-slate-400 font-mono">Ready to initiate spoken dialogue</span>
        )}

        <button
          onClick={startDebate}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-lg ${
            isDebating
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
          }`}
        >
          {isDebating ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isDebating ? "Stop Dialogue" : "Start Spoken Debate"}</span>
        </button>
      </div>
    </div>
  );
}
