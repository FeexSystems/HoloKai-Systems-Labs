import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Sparkles, Activity, BookOpen,
  Volume2, VolumeX, Search, ShieldCheck, Compass, Terminal, GitBranch,
  MessageSquare, Image as ImageIcon
} from 'lucide-react';
import { retroAudio } from '@/lib/audioFeedback';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';

export default function OracleSidebar({
  activeTab,
  onTabChange,
  audioGuideEnabled,
  onToggleAudioGuide,
  soundEffectsEnabled,
  onToggleSoundEffects,
  searchQuery,
  onSearchChange,
  className = ''
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'oracle', label: 'Voice Oracle & Synthesis', icon: Sparkles, badge: 'LIVE API' },
    { id: 'chatbot', label: 'Gemini Multi-Turn Chat', icon: MessageSquare, badge: 'GEMINI AI' },
    { id: 'studio', label: '3D Visual Studio (1K-4K)', icon: ImageIcon, badge: 'IMAGES' },
    { id: 'graph', label: 'Oracle Knowledge Graph', icon: GitBranch, badge: 'D3 FORCE', hotkey: 'G' },
    { id: 'data', label: 'Telemetry & Trends', icon: Activity, badge: 'RECHARTS', hotkey: 'O' },
    { id: 'codex', label: 'Civilization Codex', icon: BookOpen, badge: 'INDEX' },
    { id: 'search', label: 'Historical Query Search', icon: Search, badge: 'LIVE', hotkey: 'K' },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <aside
        className={`glass-panel rounded-2xl transition-all duration-300 relative flex flex-col justify-between p-3 border border-amber-500/30 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${className}`}
      >
        {/* Top Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="text-xs font-display font-bold text-white tracking-wider">
                    ORACLE NAV
                  </h3>
                  <span className="text-[9px] font-mono text-amber-400/80 uppercase">
                    v2.6 TRIANGULATED
                  </span>
                </div>
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => {
                    retroAudio.playGlassHoverHum();
                    setIsCollapsed(!isCollapsed);
                  }}
                  onMouseEnter={() => retroAudio.playGlassHoverHum()}
                  className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all mx-auto"
                >
                  {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="glass-panel border border-amber-500/40 text-amber-300 bg-zinc-950/95 font-mono text-xs shadow-[0_0_15px_rgba(232,184,75,0.25)]"
              >
                {isCollapsed ? 'Expand Oracle Sidebar' : 'Collapse Oracle Sidebar'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Quick Search Input (if expanded) */}
          {!isCollapsed && (
            <div className="relative">
              <input
                type="text"
                id="oracle_sidebar_filter"
                name="oracle_sidebar_filter"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Filter archives... [K]"
                onMouseEnter={() => retroAudio.playGlassHoverHum()}
                className="w-full bg-zinc-950/80 border border-amber-500/20 rounded-xl px-3 py-1.5 pl-8 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-amber-400/70 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
          )}

          {/* Navigation Tools List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => {
                        retroAudio.playOracleChime();
                        onTabChange(item.id);
                      }}
                      onMouseEnter={() => retroAudio.playGlassHoverHum()}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-mono transition-all group ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_15px_rgba(232,184,75,0.2)] font-semibold'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60 border border-transparent hover:border-amber-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400 animate-pulse' : 'text-zinc-400 group-hover:text-amber-400'}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center gap-1">
                          {item.hotkey && (
                            <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-700 px-1 rounded">
                              [{item.hotkey}]
                            </span>
                          )}
                          <span className="text-[9px] font-mono uppercase bg-amber-500/10 text-amber-400/90 border border-amber-500/20 px-1.5 py-0.5 rounded">
                            {item.badge}
                          </span>
                        </div>
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="glass-panel border border-amber-500/40 text-amber-300 bg-zinc-950/95 font-mono text-xs shadow-[0_0_15px_rgba(232,184,75,0.25)]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{item.label}</span>
                      {item.hotkey && (
                        <span className="text-[10px] text-amber-400 bg-amber-500/20 border border-amber-400/40 px-1 rounded">
                          [{item.hotkey}]
                        </span>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>
        </div>

      {/* Bottom Audio Settings & Telemetry Status */}
      <div className="pt-4 border-t border-amber-500/20 space-y-2">
        {/* Toggle Audio Guide Narrator */}
        <button
          onClick={() => {
            retroAudio.playGlassHoverHum();
            onToggleAudioGuide(!audioGuideEnabled);
          }}
          onMouseEnter={() => retroAudio.playGlassHoverHum()}
          className={`w-full flex items-center justify-between p-2 rounded-xl text-[11px] font-mono transition-all border ${
            audioGuideEnabled
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
          }`}
          title={isCollapsed ? 'Toggle Oracle Voice Guide' : undefined}
        >
          <div className="flex items-center gap-2">
            {audioGuideEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
            {!isCollapsed && <span>Oracle Audio Guide</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] uppercase font-bold text-amber-400">
              {audioGuideEnabled ? 'ON' : 'OFF'}
            </span>
          )}
        </button>

        {/* Toggle Mechanical Sound Effects */}
        <button
          onClick={() => {
            const next = !soundEffectsEnabled;
            retroAudio.setSoundEffectsEnabled(next);
            onToggleSoundEffects(next);
          }}
          onMouseEnter={() => retroAudio.playGlassHoverHum()}
          className={`w-full flex items-center justify-between p-2 rounded-xl text-[11px] font-mono transition-all border ${
            soundEffectsEnabled
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-zinc-900/60 border-zinc-800 text-zinc-500'
          }`}
          title={isCollapsed ? 'Toggle Terminal Sound Effects' : undefined}
        >
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            {!isCollapsed && <span>Terminal Sound FX</span>}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] uppercase font-bold text-amber-400">
              {soundEffectsEnabled ? 'ON' : 'OFF'}
            </span>
          )}
        </button>

        {!isCollapsed && (
          <div className="p-2.5 bg-zinc-950/80 border border-amber-500/10 rounded-xl text-[10px] font-mono text-zinc-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> Grounded
            </span>
            <span className="text-amber-400 font-bold">99.8% ACC</span>
          </div>
        )}
      </div>
    </aside>
  </TooltipProvider>
  );
}
