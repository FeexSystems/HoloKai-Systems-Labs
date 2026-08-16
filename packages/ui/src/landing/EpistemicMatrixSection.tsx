import React from 'react';
import { ShieldCheck, X, Scale } from 'lucide-react';

export function EpistemicMatrixSection() {
  const comparisonData = [
    { feature: "Primary Manuscript Grounding", holokai: true, genericLlm: false, detail: "100% verified archival citations from African manuscripts" },
    { feature: "Ethnomathematical Formula Verification", holokai: true, genericLlm: false, detail: "Wolfram Language geometry and fractal calculation" },
    { feature: "Epistemic Classification (Established vs Esoteric)", holokai: true, genericLlm: false, detail: "Explicit confidence heuristic rating on all claims" },
    { feature: "Multi-Agent Knowledge Graph RAG", holokai: true, genericLlm: false, detail: "Alive Engine graph memory persistence" },
    { feature: "Deepgram Cloud Voice Speech Engine", holokai: true, genericLlm: false, detail: "Deepgram Aura Zeus TTS + Nova-3 STT (Cloud Voice Only)" },
  ];

  return (
    <div className="w-full my-12 p-8 rounded-none bg-background/80 border border-brand/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-brand/10 border border-brand/30 text-brand text-xs font-mono mb-3 tracking-[0.2em]">
          <Scale className="w-3.5 h-3.5 text-brand" />
          EPISTEMIC TRUST MATRIX
        </div>
        <h2 className="text-3xl font-light text-zinc-100 font-display tracking-tight">HoloKai Grounded Research vs Generic LLMs</h2>
        <p className="text-xs text-muted font-light mt-2">Rigorous scientific verification built for scholars, historians, and spatial computing.</p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-brand/20 text-muted font-mono tracking-wider">
              <th className="py-3 px-4 font-bold uppercase">Research Capability</th>
              <th className="py-3 px-4 text-brand font-bold bg-brand/10 tracking-wider uppercase">HoloKai Oracle</th>
              <th className="py-3 px-4 font-bold uppercase">Standard Un-Grounded LLM</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-500/10">
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="hover:bg-brand/5 transition duration-200">
                <td className="py-3.5 px-4 text-zinc-200 font-medium font-display tracking-wide">
                  {row.feature}
                  <span className="block text-[10px] text-muted font-mono font-light mt-0.5 tracking-normal">{row.detail}</span>
                </td>
                <td className="py-3.5 px-4 bg-brand/5 font-semibold text-brand font-mono">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand" />
                    <span className="tracking-wider">VERIFIED</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted font-mono">
                  <div className="flex items-center gap-1.5 text-red-400/80">
                    <X className="w-4 h-4 text-red-500/80" />
                    <span className="tracking-wider">UNVERIFIED</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
