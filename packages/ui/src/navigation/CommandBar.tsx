'use client';

import React, { useState, useEffect } from 'react';

export interface CommandBarItem {
  id: string;
  title: string;
  category: 'NAVIGATION' | 'CIVILIZATION' | 'ARTIFACT' | 'SYSTEM';
  shortcut?: string;
  action: () => void;
}

export interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export function CommandBar({ isOpen, onClose, onNavigate }: CommandBarProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const defaultItems: CommandBarItem[] = [
    {
      id: 'cmd-oracle',
      title: 'Query Oracle Research Engine',
      category: 'NAVIGATION',
      shortcut: '⌘O',
      action: () => {
        if (onNavigate) onNavigate('/oracle');
        onClose();
      },
    },
    {
      id: 'cmd-archive',
      title: 'Explore 16-Volume Archive & Codex',
      category: 'NAVIGATION',
      shortcut: '⌘A',
      action: () => {
        if (onNavigate) onNavigate('/archive');
        onClose();
      },
    },
    {
      id: 'cmd-vanguards',
      title: 'Meet Vanguard Guardian Units',
      category: 'NAVIGATION',
      shortcut: '⌘V',
      action: () => {
        if (onNavigate) onNavigate('/vanguards');
        onClose();
      },
    },
    {
      id: 'cmd-lab',
      title: 'Open 3D Orbital Laboratory',
      category: 'NAVIGATION',
      shortcut: '⌘L',
      action: () => {
        if (onNavigate) onNavigate('/lab');
        onClose();
      },
    },
    {
      id: 'cmd-system',
      title: 'View Platform Edge Metrics & Runtime',
      category: 'SYSTEM',
      shortcut: '⌘S',
      action: () => {
        if (onNavigate) onNavigate('/system');
        onClose();
      },
    },
  ];

  const filtered = defaultItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-[#0a0a0f] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <span className="text-[var(--color-brand)] font-mono text-sm font-bold">⌘K</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or research query..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 focus:outline-none text-base font-medium"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded bg-white/5"
          >
            ESC
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full p-3 rounded-xl hover:bg-[var(--color-brand)]/10 border border-transparent hover:border-[var(--color-border)] text-left flex items-center justify-between group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-[var(--color-brand)] border border-[var(--color-border)]">
                    {item.category}
                  </span>
                  <span className="text-sm font-semibold text-white group-hover:text-[var(--color-brand-light)]">
                    {item.title}
                  </span>
                </div>
                {item.shortcut && (
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-[var(--color-brand)]">
                    {item.shortcut}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-mono text-zinc-500">
              No matching commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
