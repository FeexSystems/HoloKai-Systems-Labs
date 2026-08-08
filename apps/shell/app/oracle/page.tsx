import React from 'react';

export const metadata = {
  title: 'HoloKai · Oracle AI Research & Triangulation Portal',
  description: 'Grounded multi-agent historical query synthesis for African civilizations.',
};

export default function OraclePage() {
  return (
    <main className="min-h-screen bg-[#05050a] text-zinc-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="border-b border-amber-500/20 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Epistemic Synthesis Portal</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">Oracle AI Engine</h1>
          </div>
          <span className="px-3 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
            5 Agents Online
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-2xl border border-amber-500/20 bg-[#12121a] space-y-4">
            <h2 className="text-lg font-semibold text-amber-400">Multi-Agent Query Interface</h2>
            <div className="p-4 rounded-xl bg-black/40 border border-amber-500/10 text-sm text-zinc-300">
              Query the 5 Specialist Agents (Historian, Archaeologist, Anthropologist, Linguist, Ethicist) backed by the 16-Volume Ancient African Knowledge Corpus and Wolfram Alpha Computational Engine.
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about Sungbo's Eredo, Kemet mathematics, or Great Zimbabwe..."
                className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50"
                readOnly
              />
              <button className="px-6 py-3 bg-amber-500 text-black font-semibold text-sm rounded-xl hover:bg-amber-400 transition-colors">
                Synthesize
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#12121a] space-y-4">
            <h3 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Domain Specialist Agents</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-emerald-500/20">
                <span className="font-semibold text-white">Historian Agent</span>
                <span className="text-emerald-400 font-mono">Consensus 0.98</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-blue-500/20">
                <span className="font-semibold text-white">Archaeologist Agent</span>
                <span className="text-blue-400 font-mono">Active</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-amber-500/20">
                <span className="font-semibold text-white">Anthropologist Agent</span>
                <span className="text-amber-400 font-mono">Active</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-purple-500/20">
                <span className="font-semibold text-white">Linguist Agent</span>
                <span className="text-purple-400 font-mono">Active</span>
              </li>
              <li className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-rose-500/20">
                <span className="font-semibold text-white">Ethicist Agent</span>
                <span className="text-rose-400 font-mono">Verified</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
