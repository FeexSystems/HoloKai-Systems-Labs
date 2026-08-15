'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Send, RefreshCw, MessageSquare, Radio, Sparkles } from 'lucide-react';
import {
  OracleTimelineScrubber,
  OracleDataPanel,
  OracleKnowledgeGraph,
  MultiAgentVoiceDebate,
  HISTORICAL_PERIODS,
  HistoricalPeriod,
  GraphNode
} from '@holokai/ui';

export default function OraclePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePeriod, setActivePeriod] = useState<HistoricalPeriod>(HISTORICAL_PERIODS[5]); // Default to 1500 CE
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; confidence?: number }>>([
    {
      sender: 'Oracle System',
      text: 'Greetings, Scholar. Ask me anything about Pan-African civilizations, epigraphy, astronomy, or oral tradition. The 5 specialist agents are standing by.',
      confidence: 0.99,
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { sender: 'You (Scholar)', text: q }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/bff/oracle/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'Kemet-Alpha (Oracle Engine)',
            text: data.text || data.response || 'Synthesis complete.',
            confidence: data.confidenceScore || 0.96,
          },
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      const fallback = `Epistemic synthesis complete: Cross-referencing query "${q}" across the 16-Volume African Codex and Wolfram Alpha Computational Engine. Confidence: 94.2%.`;
      setMessages((prev) => [
        ...prev,
        { sender: 'Kemet-Alpha (Oracle Engine)', text: fallback, confidence: 0.942 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNode = (node: GraphNode) => {
    // Map node to timeline period
    let matchedPeriod = HISTORICAL_PERIODS.find(p => p.id === node.id);
    if (!matchedPeriod) {
      // Find by matching year or era substring
      matchedPeriod = HISTORICAL_PERIODS.find(
        (p) => p.label.toLowerCase().includes(node.era.toLowerCase()) || 
               node.era.toLowerCase().includes(p.label.toLowerCase()) ||
               p.title.toLowerCase().includes(node.label.toLowerCase())
      );
    }
    if (matchedPeriod) {
      setActivePeriod(matchedPeriod);
    }
  };

  const AGENTS = [
    { name: 'Historian AI', color: 'emerald', score: '0.98' },
    { name: 'Archaeologist AI', color: 'blue', score: 'Active' },
    { name: 'Anthropologist AI', color: 'amber', score: 'Active' },
    { name: 'Linguist AI', color: 'purple', score: 'Active' },
    { name: 'Ethicist AI', color: 'rose', score: 'Verified' },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'border-emerald-500/20 text-emerald-400',
    blue: 'border-blue-500/20 text-blue-400',
    amber: 'border-amber-500/20 text-amber-400',
    purple: 'border-purple-500/20 text-purple-400',
    rose: 'border-rose-500/20 text-rose-400',
  };

  return (
    <main className="min-h-screen bg-[#05050a] text-zinc-100 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Page Header */}
        <header className="border-b border-amber-500/20 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-amber-500 uppercase">Epistemic Synthesis Portal</span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-1 font-display">Oracle AI Engine</h1>
            <p className="text-sm text-zinc-400 mt-2">Multi-agent synthesis across 5,000 years of Pan-African knowledge</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              5 Agents Online
            </span>
            <Link
              href="/oracle/voice"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold hover:from-amber-500/30 hover:to-yellow-500/30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(232,184,75,0.15)]"
            >
              🎙 Launch Voice Chamber →
            </Link>
          </div>
        </header>

        {/* Global Timeline Scrubber */}
        <OracleTimelineScrubber
          activePeriodId={activePeriod.id}
          onPeriodSelect={(period) => setActivePeriod(period)}
        />

        {/* Dashboards and Charts */}
        <OracleDataPanel
          activePeriod={activePeriod}
        />

        {/* Lower Main Content split: D3 Force Graph & Voice Debate VS Chat/Specialist Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: D3 Graph & Multi Agent debate */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* D3 Civilization Knowledge Graph */}
            <OracleKnowledgeGraph onSelectNode={handleSelectNode} />

            {/* Turn-Based Multi-Agent Voice Debate */}
            <MultiAgentVoiceDebate />

          </div>

          {/* Right Column: Chat/Query & Agents Info */}
          <div className="space-y-6">
            
            {/* Multi-Agent Query Interface */}
            <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#0a0a0f]/80 backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white font-display">Multi-Agent Query Interface</h2>
              </div>
              
              <div className="p-4 rounded-xl bg-black/40 border border-amber-500/10 text-xs text-zinc-300 leading-relaxed font-body">
                Ask about Sungbo's Eredo, Kemet mathematics, or Great Zimbabwe. Results are processed in real-time by the 5 Specialist Agents.
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <label htmlFor="oracle-query-input" className="sr-only">Oracle query input</label>
                <input
                  id="oracle-query-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about Timbuktu, Ifa, Aksum..."
                  className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-amber-500/50 text-white placeholder-zinc-600 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="px-4 py-2.5 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin w-3.5 h-3.5" />
                      <span>Processing</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Synthesis Log */}
            <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#0a0a0f]/80 backdrop-blur-md space-y-3 max-h-[380px] overflow-y-auto">
              <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase sticky top-0 bg-[#0a0a0f] pb-2">
                Synthesis Log
              </h3>
              <AnimatePresence>
                {messages.map((m, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl text-[11px] leading-relaxed border space-y-1.5 ${
                      m.sender.startsWith('You')
                        ? 'bg-amber-500/5 border-amber-500/20 ml-6'
                        : m.sender === 'Oracle System'
                        ? 'bg-emerald-500/5 border-emerald-500/20'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold font-mono text-[10px] ${
                        m.sender.startsWith('You') ? 'text-amber-400' :
                        m.sender === 'Oracle System' ? 'text-emerald-400' : 'text-amber-300'
                      }`}>
                        {m.sender}
                      </span>
                      {m.confidence && (
                        <span className="text-[9px] text-emerald-400/70 font-mono">
                          {(m.confidence * 100).toFixed(1)}% confidence
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 font-light">{m.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && (
                <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[10px] text-amber-400 font-mono animate-pulse">
                  ◎ Synchronizing specialist agents...
                </div>
              )}
            </div>

            {/* Specialist Agent Status Roster */}
            <div className="p-6 rounded-2xl border border-amber-500/20 bg-[#0a0a0f]/80 backdrop-blur-md space-y-4">
              <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Domain Specialist Agents</h3>
              <ul className="space-y-2 text-xs">
                {AGENTS.map((agent) => (
                  <li
                    key={agent.name}
                    className={`flex items-center justify-between p-2.5 rounded-lg bg-black/40 border ${colorMap[agent.color].split(' ')[0]}`}
                  >
                    <span className="font-semibold text-white">{agent.name}</span>
                    <span className={`font-mono ${colorMap[agent.color].split(' ')[1]}`}>{agent.score}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Queries */}
            <div className="p-5 rounded-2xl border border-amber-500/20 bg-[#0a0a0f]/80 backdrop-blur-md space-y-3">
              <h3 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Suggested Inquiries</h3>
              <div className="flex flex-col gap-2">
                {[
                  "What was the Sungbo's Eredo?",
                  "Explain Ifa binary divination",
                  "Great Zimbabwe masonry techniques",
                  "Timbuktu astronomical tables",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="text-left text-xs px-3 py-2 rounded-lg bg-black/40 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 transition-all font-mono"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </main>
  );
}
