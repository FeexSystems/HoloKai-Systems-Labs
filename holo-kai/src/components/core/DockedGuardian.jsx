import React, { useState } from 'react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { Image } from '@/components/ui/image';
import { Minimize2, Maximize2 } from 'lucide-react';

const STATES = {
  idle: { label: 'STANDBY', pulse: 2 },
  retrieving: { label: 'RETRIEVING', pulse: 0.8 },
  reasoning: { label: 'REASONING', pulse: 0.5 },
  speaking: { label: 'SPEAKING', pulse: 0.3 },
};

export default function DockedGuardian({ aiState: aiStateProp }) {
  const { activeGuardian, aiState: aiStateFromContext } = useHoloKai();
  const [collapsed, setCollapsed] = useState(false);

  // Prefer explicit prop, fall back to global context (ResearchChat drives this)
  const aiState = aiStateProp ?? aiStateFromContext ?? 'idle';
  const state = STATES[aiState] || STATES.idle;

  return (
    <div className="fixed bottom-28 right-6 z-30 pointer-events-none">
      <div className="relative flex flex-col items-end">
        {/* Floating mini panel */}
        <div className="glass-panel rounded-xl p-2 pointer-events-auto shadow-2xl border border-white/10 bg-zinc-950/90 backdrop-blur-md">
          {collapsed ? (
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center gap-2 p-1 text-left group"
              title="Expand Guardian Status"
              aria-label="Expand Guardian Status"
            >
              <div
                className="w-8 h-8 rounded-lg overflow-hidden border"
                style={{ borderColor: `${activeGuardian.accentColor}66` }}
              >
                <Image
                  src={activeGuardian.image}
                  alt={activeGuardian.name}
                  fittingType="fill"
                  className="w-full h-full"
                />
              </div>
              <Maximize2 className="w-3 h-3 text-zinc-400 group-hover:text-white transition" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${activeGuardian.accentColor}44` }}
                >
                  <Image
                    src={activeGuardian.image}
                    alt={activeGuardian.name}
                    fittingType="fill"
                    className="w-full h-full"
                  />
                </div>
                {/* State glow */}
                <div
                  className="absolute -inset-1 rounded-lg pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${activeGuardian.accentGlow || activeGuardian.accentColor} 0%, transparent 70%)`,
                    animation: `pulse ${state.pulse}s infinite`,
                  }}
                />
              </div>
              <div className="pr-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className="text-[9px] font-mono tracking-[0.15em] font-semibold"
                    style={{ color: activeGuardian.accentColor }}
                  >
                    {activeGuardian.name}
                  </p>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="text-zinc-500 hover:text-zinc-300 p-0.5"
                    title="Minimize Guardian widget"
                    aria-label="Minimize Guardian widget"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[8px] tracking-[0.1em] uppercase text-zinc-400 mt-0.5">
                  {state.label}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}