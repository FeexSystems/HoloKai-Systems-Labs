import React, { useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimation } from 'framer-motion';
import { 
  Home, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Layers, 
  Activity, 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown,
  Monitor,
  Sun,
  Moon,
  Languages
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { retroAudio } from '@/lib/audioFeedback';
import { useHoloKai } from '@/lib/HoloKaiContext';

// Configuration for our Alkebulan HoloKai navigation items
const NAV_ITEMS = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/oracle', icon: Sparkles, label: 'Oracle Portal', accent: 'text-amber-400' },
  { href: '/core', icon: Cpu, label: 'Civilization Core', accent: 'text-amber-500' },
  { href: '/guardian-archive', icon: BookOpen, label: 'Archive' },
  { href: '/global-insights', icon: Layers, label: 'Insights' },
  { href: '/research-journal', icon: Activity, label: 'Journal' },
  { href: '/settings', icon: SettingsIcon, label: 'Settings' },
];

export default function FloatingDock({ 
  className,
  onToggleScanlines,
  scanlinesEnabled
}) {
  const [active, setActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const mouseX = useMotionValue(Infinity);
  
  const { theme, setTheme, language, setLanguage } = useHoloKai();

  // Auto-hide the dock after 5 seconds of inactivity
  const startHideTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, 5000);
  };

  useEffect(() => {
    // Read sound settings if any
    setIsMuted(!retroAudio.soundEffectsEnabled);

    startHideTimeout();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setActive(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    startHideTimeout();
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    retroAudio.setSoundEffectsEnabled(!nextMuted);
    if (!nextMuted) {
      retroAudio.playOracleChime();
    }
  };

  const cycleLanguage = () => {
    retroAudio.playClick();
    if (language === 'en') {
      setLanguage('sw');
    } else if (language === 'sw') {
      setLanguage('am');
    } else {
      setLanguage('en');
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'fixed bottom-0 left-1/2 -translate-x-1/2 z-[90] pb-4 transition-all duration-500 ease-in-out',
        active ? 'translate-y-0 opacity-100' : 'translate-y-11 opacity-40 hover:opacity-100 hover:translate-y-0',
        className
      )}
    >
      {/* Dock Container */}
      <div className="relative">
        {/* Toggle Anchor Tab when hidden */}
        {!active && (
          <button
            onClick={() => setActive(true)}
            className="absolute -top-7 left-1/2 -translate-x-1/2 p-1 rounded-t-xl text-[9px] font-mono tracking-widest flex items-center gap-1 shadow-[0_-8px_20px_rgba(0,0,0,0.05)] animate-bounce border bg-zinc-950 border-amber-500/30 text-amber-400 hover:text-amber-300"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            <span>NAV_DOCK</span>
          </button>
        )}

        <div className="flex items-center gap-1 backdrop-blur-xl px-4 py-2.5 rounded-full shadow-2xl transition-all duration-300 border bg-zinc-950/90 hover:bg-zinc-900/90 border-amber-500/15 text-zinc-100 shadow-black/80">
          
          {/* Main Navigation Items */}
          <div 
            className="flex items-end gap-3 px-1"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
          >
            {NAV_ITEMS.map((item) => {
              const isCurrent = item.href === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.href);

              return (
                <DockIcon
                  key={item.href}
                  title={item.label}
                  mouseX={mouseX}
                  isCurrent={isCurrent}
                >
                  <Link 
                    to={item.href}
                    onClick={() => {
                      retroAudio.playClick();
                    }}
                    className={cn(
                      "flex items-center justify-center w-full h-full transition-colors rounded-full",
                      isCurrent && (item.accent || "text-amber-400"),
                      !isCurrent && "text-zinc-400 hover:text-zinc-200"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </Link>
                </DockIcon>
              );
            })}
          </div>

          {/* Separator */}
          <div className="w-px h-6 mx-2 self-center bg-white/10" />

          {/* Interactive controls */}
          <div className="flex items-center gap-2 px-1">
            {/* Language Switcher Button */}
            <button
              onClick={cycleLanguage}
              className="p-2 rounded-full transition-all text-xs font-mono font-bold flex items-center gap-1 shrink-0 border border-transparent bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white"
              title={`Switch Language (Current: ${language.toUpperCase()})`}
            >
              <Languages className="w-4 h-4" />
              <span className="text-[10px] uppercase font-mono tracking-wider">{language}</span>
            </button>

            {/* Scanline Toggle */}
            {onToggleScanlines && (
              <button
                onClick={() => {
                  retroAudio.playClick();
                  onToggleScanlines();
                }}
                className={cn(
                  "p-2 rounded-full transition-all border border-transparent bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200",
                  scanlinesEnabled && "border-amber-500/30 text-amber-400 bg-amber-500/10"
                )}
                title="Toggle Retro Scanlines Effect"
              >
                <Monitor className="w-4 h-4" />
              </button>
            )}

            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className={cn(
                "p-2 rounded-full transition-all border border-transparent bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200",
                !isMuted && "text-amber-400"
              )}
              title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DockIcon({ mouseX, title, isCurrent, children }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Compute scale based on mouse distance to create the Mac OS Dock magnification effect
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Scale map from 40px to 64px width/height when mouse is closer than 150px
  const sizeTransform = useTransform(distance, [-150, 0, 150], [42, 64, 42]);
  const size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleMouseEnter = () => {
    setHovered(true);
    retroAudio.playGlassHoverHum();
  };

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      aria-label={title}
      className={cn(
        "relative flex items-center justify-center rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 transition-colors shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 min-w-[44px] min-h-[44px]",
        isCurrent ? "border-amber-500/50 bg-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "hover:border-amber-500/30"
      )}
    >
      {/* Floating tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-950 border border-amber-500/30 rounded-lg text-[10px] font-mono text-zinc-100 tracking-wider whitespace-nowrap shadow-xl z-50 pointer-events-none"
          >
            {title}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Link Icon */}
      <div className="flex items-center justify-center w-full h-full rounded-full">
        {children}
      </div>

      {/* Active Dot indicator */}
      {isCurrent && (
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      )}
    </motion.div>
  );
}
