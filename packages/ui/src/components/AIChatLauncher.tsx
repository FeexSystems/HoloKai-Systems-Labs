'use client';

import React, { useState } from 'react';

export function AIChatLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 rounded-2xl border border-amber-500/30 bg-[#0a0a0f]/95 p-5 shadow-2xl backdrop-blur-2xl text-white space-y-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-sm text-amber-300 font-mono">HoloKai AI Oracle</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white font-mono text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Greetings, Scholar. Ask me anything about ancient civilizations, epigraphy, or multi-agent research dossiers.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Oracle AI..."
              className="w-full h-10 px-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
            />
            <button className="h-10 px-4 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400">
              Send
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 px-6 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-sm shadow-2xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-amber-400/50"
      >
        <span className="font-mono text-lg">✨</span>
        <span>{isOpen ? 'Close Oracle' : 'Oracle AI Assistant'}</span>
      </button>
    </div>
  );
}
