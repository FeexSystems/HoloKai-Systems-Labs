import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';

/**
 * Shared chrome for secondary HoloKai pages (outside Orbital Lab / Core).
 */
export default function PageShell({
  title,
  subtitle,
  badge,
  children,
  backTo = '/',
  backLabel = 'Orbital Lab',
  wide = false,
}) {
  const { activeGuardian } = useHoloKai();
  const accent = activeGuardian?.accentColor || '#E8B84B';

  return (
    <div
      className="min-h-screen bg-holokai-obsidian text-white relative scanline overflow-x-hidden"
      style={{
        background: `radial-gradient(ellipse 70% 40% at 20% 0%, ${accent}0D 0%, transparent 55%), #0A0A0A`,
      }}
    >
      {/* Retro-futuristic film-grain background overlay */}
      <div className="fixed inset-0 pointer-events-none film-grain z-[1]" aria-hidden="true" />
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-xl"
        style={{
          borderColor: 'rgba(200,149,42,0.1)',
          background: 'rgba(10,10,16,0.75)',
        }}
      >
        <div className={`mx-auto flex flex-row items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link to={backTo} className="flex items-center gap-1 text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors font-mono shrink-0">
              <ChevronLeft className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{backLabel}</span>
            </Link>
            <div className="w-px h-4 bg-white/10 hidden sm:block shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-sm sm:text-base md:text-lg font-display font-semibold tracking-wide truncate">
                  {title}
                </h1>
                {badge && (
                  <span
                    className="text-[9px] font-mono tracking-[0.12em] uppercase px-1.5 py-0.5 rounded shrink-0 hidden sm:inline-block"
                    style={{
                      color: accent,
                      background: `${accent}18`,
                      border: `1px solid ${accent}33`,
                    }}
                  >
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[10px] sm:text-[11px] text-white/40 mt-0.5 truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <Link to="/" className="shrink-0 opacity-80 hover:opacity-100 transition-opacity">
            <img
              src="/logos/holokai-logo-horizontal.png"
              alt="HoloKai"
              className="max-h-5 sm:max-h-6 shrink-0 object-contain"
              onError={(e) => { e.currentTarget.src = '/logos/holokai-favicon.ico'; }}
            />
          </Link>
        </div>
      </header>

      <main className={`mx-auto px-6 py-8 ${wide ? 'max-w-7xl' : 'max-w-5xl'}`}>
        {children}
      </main>
    </div>
  );
}
