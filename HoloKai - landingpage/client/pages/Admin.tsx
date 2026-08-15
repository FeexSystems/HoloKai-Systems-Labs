import React from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <div className="min-h-screen bg-[#05050a] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="border-b border-amber-500/20 pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Admin Control</span>
            <h1 className="text-3xl font-bold text-white mt-1">Landing Page Portal Admin</h1>
          </div>
          <Link to="/" className="text-xs text-amber-400 hover:underline">← Back to Home</Link>
        </header>
        <div className="p-6 rounded-2xl bg-[#12121a] border border-amber-500/20 space-y-4">
          <p className="text-sm text-zinc-300">
            Telemetry, asset registries, and system pulse controls for the HoloKai landing portal.
          </p>
        </div>
      </div>
    </div>
  );
}
