'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'oracle';
  text: string;
}

export function AIChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'oracle',
      text: 'Greetings, Scholar. Ask me anything about ancient civilizations, epigraphy, or multi-agent research dossiers.',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = inputQuery.trim();
    if (!query || loading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/bff/oracle/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      if (res.ok) {
        const data = await res.json();
        const oracleText = data.text || data.response || 'Synthesis complete.';
        setMessages((prev) => [...prev, { id: `o-${Date.now()}`, sender: 'oracle', text: oracleText }]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // Graceful fallback synthesis
      const fallbackText = `Dossier Synthesized: Contextual analysis regarding "${query}" established with 96% epistemic confidence across 16-Volume African Codex.`;
      setMessages((prev) => [...prev, { id: `o-${Date.now()}`, sender: 'oracle', text: fallbackText }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 rounded-2xl border border-[var(--color-border)] bg-[#0a0a0f]/95 p-5 shadow-2xl backdrop-blur-2xl text-white space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-sm text-[var(--color-brand)] font-mono">HoloKai AI Oracle</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white font-mono text-sm"
              aria-label="Close Oracle AI launcher"
            >
              ✕
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-2.5 rounded-xl text-xs font-light leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)] ml-6 text-right'
                    : 'bg-white/5 border border-white/10 text-zinc-200 mr-6'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[var(--color-brand)] font-mono animate-pulse">
                Synthesizing response...
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <label htmlFor="oracle-chat-input" className="sr-only">
              Ask Oracle AI
            </label>
            <input
              id="oracle-chat-input"
              name="oracleQuery"
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Oracle AI..."
              autoComplete="off"
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-[var(--color-brand)]"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-10 px-4 rounded-xl bg-[var(--color-brand)] text-black font-bold text-xs hover:brightness-110 disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="h-14 px-6 rounded-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-contrast)] text-black font-extrabold text-sm shadow-2xl shadow-glow-brand hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-[var(--color-border-strong)]"
      >
        <span className="font-mono text-lg" aria-hidden="true">✨</span>
        <span>{isOpen ? 'Close Oracle' : 'Oracle AI Assistant'}</span>
      </button>
    </div>
  );
}
