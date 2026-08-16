'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles, ChevronUp, Sliders } from 'lucide-react';
import { ambientEngine, ERA_SOUNDSCAPES } from '../lib/ambientSoundscape';

export interface Guardian {
  name: string;
  domain: string;
  focus?: string[];
}

interface AmbientSoundscapeToggleProps {
  activeText?: string;
  activeGuardian?: Guardian;
}

/**
 * Floating Ambient Soundscape Toggle Button & Era Selection Menu.
 * Synthesizes dynamic, era-tuned ambient audio pads based on historical Oracle discussion.
 */
export function AmbientSoundscapeToggle({ activeText = '', activeGuardian }: AmbientSoundscapeToggleProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEraId, setActiveEraId] = useState('afrofuturist');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [autoDetect, setAutoDetect] = useState(true);

  // Auto-detect era from active Guardian domain or Oracle conversation text
  useEffect(() => {
    if (!autoDetect || !isPlaying) return;

    let candidateEra = 'afrofuturist';

    // 1. Check text context (query or response)
    if (activeText) {
      candidateEra = ambientEngine.inferEraFromText(activeText);
    } else if (activeGuardian) {
      // 2. Check active Guardian focus & domain
      const guardianContext = `${activeGuardian.name} ${activeGuardian.domain} ${(activeGuardian.focus || []).join(' ')}`;
      candidateEra = ambientEngine.inferEraFromText(guardianContext);
    }

    if (candidateEra !== activeEraId) {
      setActiveEraId(candidateEra);
      ambientEngine.playEra(candidateEra);
    }
  }, [activeText, activeGuardian, autoDetect, isPlaying, activeEraId]);

  const handleToggleSoundscape = () => {
    if (isPlaying) {
      ambientEngine.stop();
      setIsPlaying(false);
    } else {
      ambientEngine.playEra(activeEraId);
      setIsPlaying(true);
    }
  };

  const handleSelectEra = (eraId: string) => {
    setActiveEraId(eraId);
    if (isPlaying) {
      ambientEngine.playEra(eraId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    ambientEngine.setVolume(newVol);
  };

  const currentEra = ERA_SOUNDSCAPES.find(e => e.id === activeEraId) || ERA_SOUNDSCAPES[5];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Soundscape Controls Panel */}
      {isMenuOpen && (
        <div className="mb-3 w-72 sm:w-80 rounded-2xl border border-[var(--color-border)] bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-4 text-zinc-100">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[var(--color-brand)] animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-brand)]">
                Era Soundscape Matrix
              </h3>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-xs text-zinc-400 hover:text-white font-mono"
            >
              ✕
            </button>
          </div>

          {/* Master Toggle & Volume */}
          <div className="space-y-3 bg-zinc-900/60 p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-300">Ambient Synthesis</span>
              <button
                onClick={handleToggleSoundscape}
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold transition-all ${
                  isPlaying
                    ? 'bg-[var(--color-brand)] text-zinc-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {isPlaying ? 'ACTIVE' : 'MUTED'}
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <Volume2 className="w-3.5 h-3.5 text-[var(--color-brand)]" />
            </div>
          </div>

          {/* Auto-detect toggle */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[var(--color-brand)]" />
              Auto-adapt to Oracle Topic
            </span>
            <button
              onClick={() => setAutoDetect(!autoDetect)}
              className={`w-8 h-4 rounded-full transition-colors relative ${
                autoDetect ? 'bg-[var(--color-brand)]' : 'bg-zinc-800'
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full bg-zinc-950 transition-transform ${
                  autoDetect ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Era Selection Grid */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-thin pr-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
              Select Era Resonance
            </span>
            {ERA_SOUNDSCAPES.map((era) => {
              const isSelected = activeEraId === era.id;
              return (
                <button
                  key={era.id}
                  onClick={() => handleSelectEra(era.id)}
                  className={`w-full text-left p-2 rounded-xl border transition-all text-xs font-sans flex items-center justify-between ${
                    isSelected
                      ? 'border-[var(--color-border)] bg-[var(--color-surface-hover)] text-white font-medium'
                      : 'border-white/5 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: era.accent }}
                      />
                      <span className="font-semibold">{era.name}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{era.subtitle}</p>
                  </div>
                  {isSelected && isPlaying && (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-3 bg-[var(--color-brand)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-3 bg-[var(--color-brand)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-3 bg-[var(--color-brand)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <div className="flex items-center gap-2">
        {/* Quick Menu expander */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2.5 rounded-full border border-white/10 bg-zinc-950/90 text-zinc-300 hover:text-white hover:border-[var(--color-border)] shadow-xl backdrop-blur-md transition-all"
          title="Configure Ambient Era Soundscape"
          aria-label="Configure Ambient Soundscape"
        >
          <Sliders className="w-4 h-4 text-[var(--color-brand)]" />
        </button>

        {/* Floating Soundscape Toggle */}
        <button
          onClick={handleToggleSoundscape}
          className={`group px-3.5 py-2.5 rounded-full border transition-all shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-2.5 font-mono text-xs ${
            isPlaying
              ? 'border-[var(--color-border)] bg-zinc-950/95 text-[var(--color-brand)] shadow-[0_0_20px_rgba(245,158,11,0.3)]'
              : 'border-white/10 bg-zinc-950/80 text-zinc-400 hover:text-zinc-200 hover:border-[var(--color-border)]'
          }`}
          title={isPlaying ? `Soundscape Active: ${currentEra.name}. Click to pause.` : 'Click to enable Ambient Era Soundscape'}
          aria-label="Toggle Era Ambient Soundscape"
        >
          {isPlaying ? (
            <>
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand)] animate-ping absolute" />
                <Volume2 className="w-4 h-4 text-[var(--color-brand)] relative z-10" />
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-[var(--color-brand)] block leading-tight">
                  Era Soundscape
                </span>
                <span className="text-[11px] text-zinc-200 block truncate max-w-[120px]">
                  {currentEra.name}
                </span>
              </div>
              {/* Animated Sound Waves */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-full bg-[var(--color-brand)] rounded-full animate-pulse" />
                <span className="w-0.5 h-2/3 bg-[var(--color-brand)] rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <span className="w-0.5 h-4/5 bg-[var(--color-brand)] rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-zinc-500 group-hover:text-[var(--color-brand)] transition-colors" />
              <span className="font-semibold hidden sm:inline text-zinc-300 group-hover:text-white">
                Era Audio
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
