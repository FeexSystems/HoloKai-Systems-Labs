import React, { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * High-quality Abstract Futuristic African Art Component.
 * Dynamically synthesizes high-contrast Afrofuturist vector aesthetics,
 * sacred Pan-African geometry, holographic quantum nodes, and era-specific motifs
 * for the HoloKai project grid cards.
 */

const ART_THEMES = [
  {
    key: 'kemet',
    title: 'Kemet Quantum Pyramids',
    accent: '#F59E0B',
    secondary: '#D97706',
    sub: '#3B82F6',
    glyphs: ['𓋹', '𓆣', '𓇳', '𓅓'],
    bgGradient: 'from-amber-950/80 via-zinc-950 to-amber-900/40',
    pattern: 'pyramids'
  },
  {
    key: 'sahel',
    title: 'Sahel & Timbuktu Scroll Network',
    accent: '#E6B865',
    secondary: '#B45309',
    sub: '#10B981',
    glyphs: ['✺', '𞸀', '✦', '☥'],
    bgGradient: 'from-amber-900/80 via-zinc-950 to-yellow-950/50',
    pattern: 'scrolls'
  },
  {
    key: 'aksum',
    title: 'Aksumite Emerald Obelisk',
    accent: '#10B981',
    secondary: '#059669',
    sub: '#F59E0B',
    glyphs: ['ሀ', 'ⴀ', 'ⴅ', '𞸀'],
    bgGradient: 'from-emerald-950/80 via-zinc-950 to-teal-900/40',
    pattern: 'obelisk'
  },
  {
    key: 'zimbabwe',
    title: 'Granite Citadel Circuit',
    accent: '#8B5CF6',
    secondary: '#7C3AED',
    sub: '#EC4899',
    glyphs: ['✦', '𓋹', '✺', '☥'],
    bgGradient: 'from-purple-950/80 via-zinc-950 to-indigo-950/50',
    pattern: 'citadel'
  },
  {
    key: 'benin',
    title: 'Benin Bronze Binary Lattice',
    accent: '#EC4899',
    secondary: '#DB2777',
    sub: '#F59E0B',
    glyphs: ['✦', '☥', '𓆣', '✺'],
    bgGradient: 'from-pink-950/80 via-zinc-950 to-rose-900/40',
    pattern: 'bronze'
  }
];

export default function AfrofuturistArtPlaceholder({
  civId = 'kush',
  title = 'Pan-African Sovereign Art',
  badgeColor = '#D97706',
  className = ''
}) {
  const theme = useMemo(() => {
    if (civId.includes('kemet') || civId.includes('kush') || civId.includes('nubia')) return ART_THEMES[0];
    if (civId.includes('mali') || civId.includes('songhai') || civId.includes('ghana') || civId.includes('timbuktu')) return ART_THEMES[1];
    if (civId.includes('aksum') || civId.includes('ethiopia') || civId.includes('zagwe')) return ART_THEMES[2];
    if (civId.includes('zimbabwe') || civId.includes('mapungubwe') || civId.includes('mutapa')) return ART_THEMES[3];
    return ART_THEMES[4];
  }, [civId]);

  return (
    <div
      className={`relative w-full h-full min-h-[120px] rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center group ${className}`}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity duration-500 blur-2xl pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 50%, ${theme.accent}, transparent 70%)` }}
      />

      {/* Futuristic Grid Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />

      {/* SVG Sacred Geometry Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 150"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={`grad-${civId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.8" />
            <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Concentric Sacred Geometry Circles */}
        <circle cx="150" cy="75" r="55" fill="none" stroke={`url(#grad-${civId})`} strokeWidth="1" strokeDasharray="4 4" className="animate-spin-slow" />
        <circle cx="150" cy="75" r="40" fill="none" stroke={theme.accent} strokeWidth="1.5" strokeOpacity="0.6" />
        <circle cx="150" cy="75" r="25" fill="none" stroke={theme.sub} strokeWidth="1" strokeDasharray="2 2" />

        {/* Crosshair & Diagonal Telemetry Rays */}
        <line x1="50" y1="75" x2="250" y2="75" stroke={theme.accent} strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="150" y1="10" x2="150" y2="140" stroke={theme.accent} strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="90" y1="20" x2="210" y2="130" stroke={theme.sub} strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Era Specific Polygon Shapes */}
        {theme.pattern === 'pyramids' && (
          <polygon points="150,25 190,105 110,105" fill="none" stroke={theme.accent} strokeWidth="2" style={{ filter: `drop-shadow(0 0 6px ${theme.accent})` }} />
        )}
        {theme.pattern === 'obelisk' && (
          <polygon points="140,15 160,15 165,120 135,120" fill="none" stroke={theme.accent} strokeWidth="2" style={{ filter: `drop-shadow(0 0 6px ${theme.accent})` }} />
        )}
        {theme.pattern === 'citadel' && (
          <path d="M 110,95 Q 150,30 190,95 T 230,95" fill="none" stroke={theme.accent} strokeWidth="2" strokeDasharray="6 3" />
        )}
      </svg>

      {/* Central Floating Holographic Symbol & Glyph Motif */}
      <div className="relative z-10 flex flex-col items-center justify-center p-3 text-center space-y-1">
        <div
          className="w-12 h-12 rounded-2xl border flex items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform duration-500"
          style={{
            borderColor: `${theme.accent}88`,
            background: `rgba(9, 9, 11, 0.85)`,
            boxShadow: `0 0 20px ${theme.accent}44`
          }}
        >
          <span className="text-2xl font-serif font-bold text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]">
            {theme.glyphs[0]}
          </span>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-zinc-300 uppercase font-bold drop-shadow">
            HoloKai Afrofuturist Grid
          </span>
        </div>
      </div>

      {/* Floating Corner Glyphs */}
      <div className="absolute top-2 left-2 text-xs font-serif opacity-50 group-hover:opacity-90 transition-opacity" style={{ color: theme.accent }}>
        {theme.glyphs[1]}
      </div>
      <div className="absolute bottom-2 right-2 text-xs font-serif opacity-50 group-hover:opacity-90 transition-opacity" style={{ color: theme.sub }}>
        {theme.glyphs[2]}
      </div>
    </div>
  );
}
