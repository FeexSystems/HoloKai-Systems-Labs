import React from "react";
import { units } from "@/data/units";

export function MeetTheVanguard() {
  return (
    <section className="py-12 px-6 max-w-6xl mx-auto space-y-6">
      <header className="text-center space-y-2">
        <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Architectural Lineage</span>
        <h2 className="text-3xl font-bold text-white">Meet The Vanguard</h2>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {units.map((unit) => (
          <div key={unit.id} className="p-6 rounded-2xl bg-[#12121a] border border-amber-500/20 space-y-3">
            <span className="text-xs font-mono text-amber-400">{unit.subtitle}</span>
            <h3 className="text-xl font-bold text-white">{unit.name}</h3>
            <p className="text-xs text-zinc-400">{unit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
