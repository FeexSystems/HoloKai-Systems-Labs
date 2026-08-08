'use client';

import React, { useState } from 'react';
import { eventBus } from '@holokai/event-bus';
import { OracleQueryResponse } from '@holokai/contracts';

export default function OracleMFEPage() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<OracleQueryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/oracle/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, civilizationFocus: 'Timbuktu Scholars' }),
      });

      if (!res.ok) throw new Error('Query failed');
      const data: OracleQueryResponse = await res.json();
      setResult(data);

      // Publish event across Micro-Frontend EventBus boundary
      eventBus.publish('ORACLE_QUERY_COMPLETED', data);
    } catch (err: any) {
      console.error('Oracle Query Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-amber-500/20 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          Oracle AI Research Engine MFE
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Isolated Micro-Frontend Remote (`web-oracle`) communicating over global EventBus.
        </p>
      </div>

      <form onSubmit={handleQuery} className="flex gap-3">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Oracle research query (e.g. Ancient African astronomy & trade)..."
          className="flex-1 rounded-xl border border-white/10 bg-zinc-900/80 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-700 px-6 py-3 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Synthesizing...' : 'Query Oracle'}
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-amber-500/30 bg-zinc-900/80 p-6 space-y-4 shadow-xl shadow-amber-500/10">
          <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
            <span>STANCE: {result.epistemicStance}</span>
            <span>CONFIDENCE: {(result.confidenceScore * 100).toFixed(0)}%</span>
          </div>
          <p className="text-zinc-200 leading-relaxed text-sm">{result.text}</p>
          <div className="pt-2 border-t border-white/5 text-xs text-zinc-400">
            <strong>Evidence:</strong> {result.evidence[0]?.sourceTitle} ({result.evidence[0]?.year})
          </div>
        </div>
      )}
    </div>
  );
}
