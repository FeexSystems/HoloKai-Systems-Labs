import React from 'react';
import { Monitor, Check } from 'lucide-react';
import { retroAudio } from '@/lib/audioFeedback';

/**
 * ScanlineToggle component that lets users enable or disable
 * the retro-futuristic full-screen scanline overlay.
 */
export default function ScanlineToggle({ enabled, onToggle, className = '' }) {
  const handleToggle = () => {
    retroAudio.playOracleChime();
    onToggle(!enabled);
  };

  return (
    <div
      onMouseEnter={() => retroAudio.playGlassHoverHum()}
      className={`glass-panel px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-2.5 text-xs font-mono select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 text-zinc-300">
        <Monitor className={`w-3.5 h-3.5 ${enabled ? 'text-amber-400 animate-pulse' : 'text-zinc-500'}`} />
        <span className="hidden sm:inline">SCANLINE EFFECT</span>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={handleToggle}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          enabled ? 'bg-amber-500' : 'bg-zinc-800'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-zinc-950 shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            enabled ? 'translate-x-4' : 'translate-x-0'
          }`}
        >
          {enabled && <Check className="w-2.5 h-2.5 text-amber-400 stroke-[3]" />}
        </span>
      </button>
    </div>
  );
}
