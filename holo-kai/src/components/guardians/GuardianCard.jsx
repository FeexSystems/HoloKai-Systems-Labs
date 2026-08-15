import React from 'react';
import { Volume2 } from 'lucide-react';
import { Image } from '@/components/ui/image';

/**
 * Reusable Guardian Card Component
 * States: 'default' | 'hover' | 'selected' | 'speaking' | 'offline' | 'loading' | 'expanded' | 'mobile'
 */
export default function GuardianCard({
  guardian,
  state = 'default', // 'default' | 'selected' | 'speaking' | 'offline' | 'loading' | 'expanded' | 'mobile'
  onSelect,
  className = '',
}) {
  if (!guardian) return null;

  const isSelected = state === 'selected' || state === 'speaking';
  const isSpeaking = state === 'speaking';
  const isOffline = state === 'offline';
  const isLoading = state === 'loading';
  const isMobile = state === 'mobile';
  const isExpanded = state === 'expanded';

  return (
    <div
      onClick={() => !isOffline && onSelect?.(guardian.id)}
      className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden font-sans ${
        isSelected
          ? 'bg-zinc-900 border-amber-500/50 shadow-[0_0_25px_rgba(217,119,6,0.2)]'
          : 'bg-zinc-950/80 border-white/10 hover:border-amber-500/30 hover:bg-zinc-900/60'
      } ${isOffline ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Accent Glow Top Border */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: guardian.accentColor }}
      />

      <div className={`p-4 ${isMobile ? 'p-3 flex items-center gap-3' : 'space-y-3'}`}>
        {/* Avatar / Portrait Image */}
        <div className={`relative overflow-hidden rounded-xl border border-white/10 ${isMobile ? 'w-12 h-12 shrink-0' : 'w-full aspect-[4/3]'}`}>
          <Image
            src={guardian.image}
            alt={guardian.name}
            fittingType="fill"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Speaking Waveform Pulse */}
          {isSpeaking && (
            <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center backdrop-blur-xs">
              <Volume2 className="w-8 h-8 text-amber-300 animate-bounce" />
            </div>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 bg-zinc-950/70 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Live Status Badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-zinc-950/90 px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-mono">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isSpeaking ? 'bg-emerald-400 animate-ping' : isOffline ? 'bg-zinc-600' : 'bg-amber-400'
              }`}
            />
            <span className="text-zinc-300 uppercase font-semibold">
              {isSpeaking ? 'SPEAKING' : isOffline ? 'OFFLINE' : 'ONLINE'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-400/90">
              {guardian.role}
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              {guardian.title}
            </span>
          </div>

          <h3 className="text-sm font-display font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
            {guardian.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-sans">
            {guardian.domain}
          </p>

          {isExpanded && (
            <div className="pt-2 mt-2 border-t border-white/10 space-y-2 text-xs">
              <p className="text-zinc-300 italic">"{guardian.greeting}"</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {guardian.focus.map((f) => (
                  <span key={f} className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 uppercase">
                    #{f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
