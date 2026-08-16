import React from 'react';
import { ZoomIn, ZoomOut, MessageSquare, FileText, Languages } from 'lucide-react';

export interface Manuscript {
  id: string;
  title: string;
  civilization: string;
  pages: number;
  date: string;
  language: string;
  hasTranslation: boolean;
  hasTranscription: boolean;
}

export interface ManuscriptViewerProps {
  manuscripts: Manuscript[];
  selected: Manuscript;
  zoom: number;
  activeTab: 'transcription' | 'translation';
  accentColor?: string;
  
  onSelectManuscript: (manuscript: Manuscript) => void;
  onZoomChange: (zoom: number) => void;
  onTabChange: (tab: 'transcription' | 'translation') => void;
  onSendToChat: (manuscript: Manuscript) => void;
}

export function ManuscriptViewer({
  manuscripts,
  selected,
  zoom,
  activeTab,
  accentColor = '#A9D5B0', // fallback amber-500
  onSelectManuscript,
  onZoomChange,
  onTabChange,
  onSendToChat,
}: ManuscriptViewerProps) {
  return (
    <div className="flex flex-col h-full font-sans text-zinc-100 bg-background">
      <div className="px-6 py-4 border-b" style={{ borderColor: `${accentColor}33` }}>
        <h2 className="text-lg font-serif font-semibold tracking-wide text-foreground">Manuscript Viewer</h2>
        <p className="text-xs text-foreground/40 mt-0.5">Digitized manuscripts with transcription and translation</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Manuscript list */}
        <div className="w-64 flex-shrink-0 border-r overflow-y-auto scrollbar-thin" style={{ borderColor: `${accentColor}33` }}>
          {manuscripts.map((m) => (
            <button
              key={m.id}
              onClick={() => onSelectManuscript(m)}
              className="w-full text-left px-4 py-3 border-b transition-all focus:outline-none"
              style={{
                borderColor: `${accentColor}1A`,
                background: selected.id === m.id ? `${accentColor}1A` : 'transparent',
                borderLeft: `3px solid ${selected.id === m.id ? accentColor : 'transparent'}`,
              }}
            >
              <p className="text-xs font-medium text-foreground/80 line-clamp-2">{m.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[9px] text-foreground/30 font-mono uppercase">{m.civilization}</span>
                <span className="text-[9px] text-foreground/20">·</span>
                <span className="text-[9px] text-foreground/30 font-mono">{m.pages}pp</span>
              </div>
            </button>
          ))}
        </div>

        {/* Viewer */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Viewer header */}
          <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: `${accentColor}33` }}>
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-foreground/90 truncate font-serif">{selected.title}</h3>
              <p className="text-[10px] text-foreground/30 font-mono mt-0.5">
                {selected.date} · {selected.language}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onZoomChange(Math.max(0.5, zoom - 0.25))} 
                className="p-1.5 rounded-lg border border-border-subtle hover:border-white/30 transition-colors bg-white/5"
              >
                <ZoomOut className="w-4 h-4 text-foreground/50" />
              </button>
              <span className="text-[10px] font-mono text-foreground/40 w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button 
                onClick={() => onZoomChange(Math.min(3, zoom + 0.25))} 
                className="p-1.5 rounded-lg border border-border-subtle hover:border-white/30 transition-colors bg-white/5"
              >
                <ZoomIn className="w-4 h-4 text-foreground/50" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Page view */}
            <div className="flex-1 overflow-auto scrollbar-thin p-6 flex items-center justify-center bg-background">
              <div
                className="aspect-[3/4] w-full max-w-md rounded-lg p-8 shadow-2xl transition-all duration-300 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, #1a1810 0%, #252015 100%)`,
                  transform: `scale(${zoom})`,
                  border: `1px solid ${accentColor}22`,
                }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--pui-forest-active)]/40 via-transparent to-transparent pointer-events-none" />
                
                <div className="h-full flex flex-col relative z-10">
                  <div className="text-center pb-4 border-b" style={{ borderColor: `${accentColor}33` }}>
                    <p className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: accentColor }}>
                      {selected.civilization}
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="space-y-3 opacity-70 w-full max-w-[80%] mx-auto">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-px mx-auto"
                          style={{
                            width: `${60 + Math.random() * 30}%`,
                            background: `${accentColor}40`,
                          }}
                        />
                      ))}
                      <div className="my-5 flex justify-center">
                        <div
                          className="w-16 h-16 rounded opacity-30 border-2"
                          style={{ borderColor: accentColor }}
                        />
                      </div>
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-px mx-auto"
                          style={{
                            width: `${50 + Math.random() * 35}%`,
                            background: `${accentColor}40`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center pt-4 border-t" style={{ borderColor: `${accentColor}22` }}>
                    <p className="text-[9px] font-mono text-foreground/30">Page 1 of {selected.pages}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side panel */}
            <div className="w-72 flex-shrink-0 border-l bg-surface/50 flex flex-col" style={{ borderColor: `${accentColor}33` }}>
              <div className="flex border-b border-border-subtle">
                <button
                  onClick={() => onTabChange('transcription')}
                  className="flex-1 py-3 text-[10px] tracking-wider uppercase font-mono transition-colors flex items-center justify-center gap-1.5 hover:bg-white/5"
                  style={{
                    color: activeTab === 'transcription' ? accentColor : 'rgba(255,255,255,0.4)',
                    borderBottom: `2px solid ${activeTab === 'transcription' ? accentColor : 'transparent'}`,
                  }}
                >
                  <FileText className="w-3 h-3" /> Transcription
                </button>
                <button
                  onClick={() => onTabChange('translation')}
                  disabled={!selected.hasTranslation}
                  className="flex-1 py-3 text-[10px] tracking-wider uppercase font-mono transition-colors flex items-center justify-center gap-1.5 disabled:opacity-30 hover:bg-white/5 disabled:hover:bg-transparent"
                  style={{
                    color: activeTab === 'translation' ? accentColor : 'rgba(255,255,255,0.4)',
                    borderBottom: `2px solid ${activeTab === 'translation' ? accentColor : 'transparent'}`,
                  }}
                >
                  <Languages className="w-3 h-3" /> Translation
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
                {activeTab === 'transcription' ? (
                  <p className="text-xs text-muted leading-relaxed font-mono">
                    {selected.hasTranscription
                      ? `[Fragment 1] The kingdom was founded in the time of the ancestors, when the river flowed north and the stars marked the seasons of planting. The queen mother sat at the right hand of the king, and her word was law in matters of succession...`
                      : 'Transcription not yet available. Contribute to help transcribe this manuscript.'}
                  </p>
                ) : (
                  <p className="text-xs text-muted leading-relaxed font-sans">
                    {selected.hasTranslation
                      ? 'The kingdom was established during the era of the ancestors, when celestial movements guided agricultural cycles. The queen mother held a position of authority alongside the king, with decisive influence over succession matters.'
                      : 'Translation not yet available for undeciphered scripts.'}
                  </p>
                )}
              </div>

              <div className="p-4 border-t" style={{ borderColor: `${accentColor}33` }}>
                <button
                  onClick={() => onSendToChat(selected)}
                  className="w-full py-2.5 rounded-lg text-[10px] tracking-wider uppercase font-mono transition-all flex items-center justify-center gap-2 hover:brightness-125"
                  style={{
                    background: `${accentColor}1A`,
                    border: `1px solid ${accentColor}4D`,
                    color: accentColor,
                  }}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Send to Research Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
