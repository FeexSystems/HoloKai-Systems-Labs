'use client';

import React, { useEffect, useState } from 'react';
import { eventBus } from '@holokai/event-bus';
import { OracleQueryResponse } from '@holokai/contracts';

export default function ArchiveMFEPage() {
  const [lastQuery, setLastQuery] = useState<OracleQueryResponse | null>(null);

  useEffect(() => {
    // Listen for cross-MFE Oracle Query Events
    const unsubscribe = eventBus.subscribe<OracleQueryResponse>('ORACLE_QUERY_COMPLETED', (data) => {
      setLastQuery(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-amber-500/20 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-blue-400" />
          Civilization Archive MFE Remote
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Isolated Micro-Frontend Remote (`web-archive`) with real-time EventBus synchronization.
        </p>
      </div>

      {lastQuery ? (
        <div className="rounded-xl border border-blue-500/30 bg-zinc-900/80 p-6 space-y-3">
          <div className="text-xs uppercase text-blue-400 font-semibold tracking-wider">
            Live Inter-MFE Sync Event Received
          </div>
          <p className="text-sm text-zinc-200">
            Archive matched primary sources for query: <em className="text-amber-400">"{lastQuery.text}"</em>
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-zinc-900/40 p-6 text-sm text-zinc-400">
          Awaiting query event from `web-oracle` remote over EventBus...
        </div>
      )}
    </div>
  );
}
