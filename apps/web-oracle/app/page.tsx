'use client';

import React, { useState, Suspense } from 'react';
import { useMutation } from '@tanstack/react-query';
import { eventBus } from '@holokai/event-bus';
import { OracleQueryResponse } from '@holokai/contracts';
import { OracleChamber, EpistemicBadge, Select, MFEErrorBoundary, MFELoadingSkeleton } from '@holokai/ui';

function OracleMFEContent() {
  const [civilizationFocus, setCivilizationFocus] = useState('Pan-African');
  const [lastQuery, setLastQuery] = useState<OracleQueryResponse | null>(null);

  const queryMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch('/api/oracle/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, civilizationFocus }),
      });

      if (!res.ok) {
        throw new Error('Query failed');
      }
      return res.json() as Promise<OracleQueryResponse>;
    },
    onSuccess: (data) => {
      setLastQuery(data);
      eventBus.publish('ORACLE_QUERY_COMPLETED', data);
    },
    onError: (error) => {
      console.error('Oracle Query Error:', error);
    }
  });

  const handleQuerySubmit = async (prompt: string) => {
    queryMutation.mutate(prompt);
  };

  return (
    <main className="max-w-6xl mx-auto space-y-8 p-6 md:p-12">
      {/* Header Banner */}
      <header className="border-b border-amber-500/20 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">
            Micro-Frontend Remote · Port 3001
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-1 flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping" />
            Oracle AI Research Remote
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {lastQuery && (
            <EpistemicBadge stance={lastQuery.epistemicStance} confidence={lastQuery.confidenceScore} />
          )}
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
            EventBus Publisher: Active
          </div>
        </div>
      </header>

      {/* Control Panel */}
      <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-[#0a0a0f] border border-white/5">
        <div className="flex-1 max-w-sm">
          <Select
            label="Civilization Focus"
            value={civilizationFocus}
            onChange={(e) => setCivilizationFocus(e.target.value)}
            options={[
              { label: 'Pan-African / Global Black History', value: 'Pan-African' },
              { label: 'Ancient Egyptian & Nubian', value: 'Ancient Egyptian & Nubian' },
              { label: 'Mesoamerican & Andean', value: 'Mesoamerican & Andean' },
              { label: 'Indus Valley & Vedic', value: 'Indus Valley & Vedic' },
              { label: 'Polynesian & Oceanic', value: 'Polynesian & Oceanic' }
            ]}
          />
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm text-zinc-400">
            The Oracle's synthesis engine will prioritize historical records, cosmological evidence, and epistemic frameworks from the selected civilization.
          </p>
        </div>
      </div>

      {/* Main Oracle Response Chamber */}
      <OracleChamber
        onQuerySubmit={handleQuerySubmit}
        initialResponse={lastQuery}
        loading={queryMutation.isPending}
      />
    </main>
  );
}

export default function OracleMFEPage() {
  return (
    <MFEErrorBoundary zoneName="Oracle Dashboard">
      <Suspense fallback={<MFELoadingSkeleton />}>
        <OracleMFEContent />
      </Suspense>
    </MFEErrorBoundary>
  );
}
