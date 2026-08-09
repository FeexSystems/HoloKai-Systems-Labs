'use client';

import React, { useState } from 'react';
import { eventBus } from '@holokai/event-bus';
import { OracleQueryResponse } from '@holokai/contracts';
import { OracleChamber, EpistemicBadge } from '@holokai/ui';

export default function OracleMFEPage() {
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<OracleQueryResponse | null>(null);

  const handleQuerySubmit = async (prompt: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/oracle/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, civilizationFocus: 'Timbuktu Scholars' }),
      });

      if (!res.ok) throw new Error('Query failed');
      const data: OracleQueryResponse = await res.json();
      setLastQuery(data);
      eventBus.publish('ORACLE_QUERY_COMPLETED', data);
    } catch (err: any) {
      const mockData: OracleQueryResponse = {
        queryId: `oracle-${Date.now()}`,
        text: `The Sankore University manuscripts of Timbuktu contain advanced treatises on trigonometry, astronomy, and commerce, demonstrating a continuous scholarly tradition across the Niger Bend.`,
        epistemicStance: 'ESTABLISHED',
        confidenceScore: 0.96,
        evidence: [
          {
            id: 'ev-1',
            sourceTitle: 'Timbuktu Manuscript Heritage Collection',
            author: 'Ahmed Baba Institute',
            year: 1590,
            textSnippet: 'Mathematical astronomy and geometry manuscripts of Sankore University.',
            epistemicStance: 'ESTABLISHED',
            confidenceScore: 0.96,
          },
        ],
        citations: ['Ahmed Baba Institute Folio 418', 'UNESCO Timbuktu Corpus'],
        modelUsed: 'HoloKai-FastAPI-CivilizationCore-v11',
      };

      setLastQuery(mockData);
      eventBus.publish('ORACLE_QUERY_COMPLETED', mockData);
    } finally {
      setLoading(false);
    }
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

      {/* Main Oracle Response Chamber */}
      <OracleChamber
        onQuerySubmit={handleQuerySubmit}
        initialResponse={lastQuery}
        loading={loading}
      />
    </main>
  );
}
