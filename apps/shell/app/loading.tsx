import React from 'react';

export default function ShellLoading() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-zinc-900 rounded-xl" />
      <div className="h-6 w-96 bg-zinc-900/60 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="h-32 bg-zinc-900 rounded-xl border border-white/5" />
        <div className="h-32 bg-zinc-900 rounded-xl border border-white/5" />
        <div className="h-32 bg-zinc-900 rounded-xl border border-white/5" />
      </div>
    </div>
  );
}
