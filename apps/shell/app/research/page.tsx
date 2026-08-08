import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'HoloKai · Epistemic Research Portfolio',
  description: 'Multidisciplinary evidence matrix & primary source research portfolio.',
};

export default function ResearchPage() {
  return (
    <main className="max-w-6xl mx-auto space-y-8 p-6 md:p-12">
      <header className="border-b border-amber-500/20 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Epistemic Framework</span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1">Research Portfolio</h1>
        </div>
        <Link
          href="/oracle"
          className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono hover:bg-amber-500/20 transition-colors"
        >
          Ask Oracle AI →
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#12121a] border border-amber-500/20 space-y-3">
          <span className="text-xs font-mono text-amber-400">Methodology 01</span>
          <h3 className="text-xl font-bold text-white">Triangulated Reasoning</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Every historical assertion is validated across archaeology, primary manuscript codices, etymological cognates, and computational astronomy.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#12121a] border border-amber-500/20 space-y-3">
          <span className="text-xs font-mono text-amber-400">Methodology 02</span>
          <h3 className="text-xl font-bold text-white">Epistemic Stance Engine</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Claims are tagged with explicit confidence scores (`ESTABLISHED`, `PROBABILISTIC`, `HYPOTHETICAL`, `CONTESTED`) to ensure academic transparency.
          </p>
        </div>
      </div>
    </main>
  );
}
