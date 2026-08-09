'use client';

import React, { useState } from 'react';
import { CommandBar } from './CommandBar';

export interface GlobalHeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function GlobalHeader({ currentPath = '/', onNavigate }: GlobalHeaderProps) {
  const [commandBarOpen, setCommandBarOpen] = useState(false);

  const navItems = [
    { label: 'Civilization OS', path: '/' },
    { label: 'Oracle AI', path: '/oracle' },
    { label: 'Archive Codex', path: '/archive' },
    { label: 'Vanguards', path: '/vanguards' },
    { label: '3D Orbital Lab', path: '/lab' },
    { label: 'System Edge', path: '/system' },
  ];

  const handleLinkClick = (path: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#05050a]/90 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <a
            href="/"
            onClick={(e) => handleLinkClick('/', e)}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#05050a] rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-lg">
                H
              </div>
            </div>
            <div>
              <span className="font-extrabold text-white text-lg tracking-tight block leading-none group-hover:text-amber-300 transition-colors">
                HoloKai
              </span>
              <span className="text-[9px] font-mono text-amber-400/90 tracking-widest uppercase block mt-1">
                Civilization OS
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#12121a]/80 p-1.5 rounded-full border border-amber-500/20">
            {navItems.map((item) => {
              const active = currentPath === item.path;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(item.path, e)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md font-extrabold'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Action Trigger / Command Bar */}
          <button
            onClick={() => setCommandBarOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold flex items-center gap-2 transition-all hover:border-amber-500/50"
          >
            <span>Search / Command</span>
            <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-black/60 border border-amber-500/30">
              ⌘K
            </kbd>
          </button>
        </div>
      </header>

      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
