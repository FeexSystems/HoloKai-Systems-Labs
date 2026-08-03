import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, Library, Clock, Map, GitBranch, ScrollText,
  Scale, Volume2, ChevronLeft, ShieldCheck, PenTool, Sparkles, Landmark, Box, X, Compass
} from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { GUARDIANS } from '@/lib/guardians';
import { Image } from '@/components/ui/image';

const NAV_GROUPS = [
  {
    title: 'Explore',
    items: [
      { id: 'oracle', label: 'Oracle Portal', icon: Sparkles },
      { id: 'navigator', label: 'Knowledge Navigator', icon: Compass },
      { id: 'archive', label: 'Civilization Archive', icon: Landmark },
      { id: 'gallery3d', label: '3D Gallery', icon: Box },
      { id: 'map', label: 'Interactive Map', icon: Map },
    ],
  },
  {
    title: 'Research',
    items: [
      { id: 'chat', label: 'Research Chat', icon: MessageSquare },
      { id: 'library', label: 'Universal Codex', icon: Library },
      { id: 'timeline', label: 'Timeline', icon: Clock },
      { id: 'manuscripts', label: 'Manuscripts', icon: ScrollText },
      { id: 'knowledge-graph', label: 'Knowledge Graph', icon: GitBranch },
      { id: 'compare', label: 'Compare Matrix', icon: Scale },
      { id: 'oral-tradition', label: 'Oral Tradition', icon: Volume2 },
    ],
  },
  {
    title: 'Guardians',
    items: [
      { id: 'vanguard', label: 'Vanguard Validator', icon: ShieldCheck },
    ],
  },
  {
    title: 'Create',
    items: [
      { id: 'studio', label: 'Studio Canvas', icon: PenTool },
    ],
  },
];

export default function Sidebar({ activeView, onNavigate, onClose }) {
  const { activeGuardian, selectGuardian } = useHoloKai();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleSelect = (id) => {
    onNavigate(id);
    if (onClose) onClose();
  };

  return (
    <aside className="w-full lg:w-60 flex-shrink-0 h-full lg:h-screen sticky top-0 flex flex-col border-r border-white/10 bg-zinc-950 text-zinc-100 z-30">
      {/* Logo Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <img
            src="/logos/holokai-logo-horizontal.png"
            alt="HoloKai"
            className="h-6 opacity-90 brightness-125"
            onError={(e) => { e.currentTarget.src = '/logos/holokai-favicon.ico'; }}
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono tracking-widest text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            CORE
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-white lg:hidden rounded-lg border border-white/10 hover:bg-zinc-900"
              aria-label="Close navigation sidebar"
            >
              <X className="w-4 h-4 text-amber-400" />
            </button>
          )}
        </div>
      </div>

      {/* Active Guardian Profile & Selector */}
      <div className="px-4 py-3 border-b border-white/10 bg-zinc-900/50">
        <button
          onClick={() => setShowSwitcher(!showSwitcher)}
          className="w-full flex items-center gap-3 p-2 rounded-xl transition-all bg-zinc-900 border border-white/10 hover:border-amber-500/40 text-left focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Toggle active guardian selector"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10">
              <Image
                src={activeGuardian.image}
                alt={activeGuardian.name}
                fittingType="fill"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950"
              style={{ background: activeGuardian.accentColor }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-mono tracking-wider font-bold truncate text-zinc-100">
              {activeGuardian.name}
            </p>
            <p className="text-[9px] tracking-wide uppercase text-zinc-400 truncate">
              {activeGuardian.role}
            </p>
          </div>
        </button>

        {/* Guardian Switcher Grid */}
        {showSwitcher && (
          <div className="mt-3 grid grid-cols-4 gap-1.5 p-2 bg-zinc-900 rounded-xl border border-white/10 animate-fadeIn">
            {GUARDIANS.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  selectGuardian(g.id);
                  setShowSwitcher(false);
                }}
                className="relative group p-0.5 rounded-lg transition-transform hover:scale-105"
                title={`${g.name} — ${g.role}`}
              >
                <div
                  className="aspect-square rounded-md overflow-hidden border transition-colors"
                  style={{
                    borderColor: g.id === activeGuardian.id ? g.accentColor : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Image src={g.image} alt={g.name} fittingType="fill" className="w-full h-full object-cover" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Categorized Navigation Groups */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin space-y-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="text-[9px] tracking-[0.25em] uppercase text-amber-400/70 font-mono px-3 mb-1 font-semibold">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all relative group focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r"
                        style={{ background: activeGuardian.accentColor }}
                      />
                    )}
                    <Icon
                      className="w-4 h-4 transition-colors shrink-0"
                      style={{
                        color: isActive ? activeGuardian.accentColor : '#9ca3af',
                      }}
                    />
                    <span className="text-xs font-mono tracking-wide truncate">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 bg-zinc-950">
        <a
          href={import.meta.env.VITE_LANDING_URL || '/'}
          className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-zinc-500 hover:text-amber-400 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Return to Alkebulan
        </a>
      </div>
    </aside>
  );
}