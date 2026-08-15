import React from 'react';
import {
  Sparkles, Search, X, GitPullRequest, ChevronLeft, Menu
} from 'lucide-react';
import ScanlineToggle from '@/components/ui/ScanlineToggle';
import { useHoloKai } from '@/lib/HoloKaiContext';

export default function ShellHeader({
  view,
  onNavigate,
  sidebarCollapsed,
  mobileDrawerOpen,
  onToggleSidebar,
  globalSearchQuery,
  setGlobalSearchQuery,
  onOpenSearchModal,
  scanlineEnabled,
  onToggleScanline,
  onOpenLogUpdate,
  tabNav,
}) {
  const { activeGuardian, session } = useHoloKai();

  return (
    <header className="px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3 shrink-0 backdrop-blur-md z-20 border-b border-white/10 bg-zinc-950/90 text-zinc-100">
      {/* Brand & Active Guardian Info */}
      <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl transition text-xs font-mono flex items-center gap-1.5 border bg-zinc-900 border-white/10 hover:border-amber-500/40 text-amber-400 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-400 shrink-0"
          title="Toggle Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-zinc-200">Menu</span>
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-mono tracking-widest uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20">
              CIVILIZATION CORE
            </span>
            <span className="text-[10px] text-zinc-400 font-mono hidden md:inline">
              Journey: <strong style={{ color: activeGuardian.accentColor }}>{session?.journey || 'Pan-African Heritage'}</strong>
            </span>
          </div>
          <h1 className="text-base md:text-lg font-display font-bold text-zinc-100 flex items-center gap-2 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            HoloKai Oracle & Civilization Workspace
          </h1>
        </div>
      </div>

      {/* TOP GLOBAL SEARCH BAR - INSTANT FILTERING BY NAME OR ERA */}
      <div className="relative flex-1 max-w-xs md:max-w-sm">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-amber-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={globalSearchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setGlobalSearchQuery(val);
              if (view !== 'archive' && val.trim().length > 0) {
                onNavigate('archive');
              }
            }}
            placeholder="Filter empires by name or era (e.g. Mali, 1200 CE)..."
            className="w-full bg-zinc-900 border border-white/10 focus:border-amber-500/50 focus:bg-zinc-950 rounded-xl pl-8 pr-7 py-1.5 text-xs font-mono text-zinc-100 placeholder-zinc-500 outline-none transition"
            aria-label="Filter empires by name or era"
          />
          {globalSearchQuery && (
            <button
              onClick={() => setGlobalSearchQuery('')}
              className="absolute right-2 text-zinc-400 hover:text-white p-0.5 rounded"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Quick View Switcher Bar */}
      <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-white/10 rounded-xl p-1 overflow-x-auto scrollbar-none max-w-full">
        {tabNav.slice(0, 6).map((tab) => {
          const Icon = tab.icon;
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-amber-400 ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
              }`}
              title={tab.label}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}

        {/* Quick dropdown for remaining tools */}
        <select
          value={view}
          onChange={(e) => onNavigate(e.target.value)}
          className="bg-zinc-900 border border-white/10 rounded-lg px-2 py-1 text-[11px] font-mono text-amber-400 outline-none cursor-pointer hover:border-amber-500/40"
          aria-label="More module navigation options"
        >
          <option value="" disabled>More Modules...</option>
          {tabNav.slice(6).map((tab) => (
            <option key={tab.id} value={tab.id} className="bg-zinc-950 text-zinc-100">
              {tab.label}
            </option>
          ))}
        </select>
      </div>

      {/* Controls & Search Trigger */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {/* Global Command Palette Trigger Button */}
        <button
          onClick={onOpenSearchModal}
          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 hover:border-amber-500/40 text-xs font-mono text-zinc-300 hover:text-amber-300 flex items-center gap-2 transition focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Open command palette search"
        >
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-950 border border-white/10 text-zinc-400">
            ⌘K
          </kbd>
        </button>

        {/* CRT Scanline Toggle */}
        <ScanlineToggle
          enabled={scanlineEnabled}
          onToggle={onToggleScanline}
        />

        {/* Log Update Modal Launcher */}
        <button
          onClick={onOpenLogUpdate}
          className="px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-400"
          style={{
            background: `${activeGuardian.accentColor}18`,
            color: activeGuardian.accentColor,
            border: `1px solid ${activeGuardian.accentColor}44`,
          }}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Log Update</span>
        </button>

        {/* Return to Home link */}
        <a
          href="/"
          className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white transition focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Return to Alkebulan Home"
        >
          <ChevronLeft className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}
