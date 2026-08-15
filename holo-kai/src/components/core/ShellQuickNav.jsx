import React from 'react';
import { Landmark, Clock, Map, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'archive', label: 'Archive', icon: Landmark },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'oracle', label: 'Oracle', icon: Sparkles },
];

export default function ShellQuickNav({ currentView, onNavigate }) {
  return (
    <nav
      aria-label="Floating quick section menu"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-zinc-950/90 backdrop-blur-xl border border-amber-500/40 p-1.5 rounded-full shadow-[0_0_30px_rgba(0,0,0,0.85)] flex items-center gap-1.5"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isActive
                ? 'bg-amber-500 text-zinc-950 shadow-[0_0_15px_rgba(217,119,6,0.5)] scale-105 font-bold'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/10'
            }`}
            title={`Quick scroll / navigate to ${item.label}`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-950' : 'text-amber-400'}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
