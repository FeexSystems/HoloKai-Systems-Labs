import React, { useMemo } from 'react';

/**
 * ParticleBackground component that emits slow-drifting, gold-colored particles
 * across the interface using the existing 'particle-drift' keyframes.
 */
export default function ParticleBackground({ particleCount = 28, className = '' }) {
  const particles = useMemo(() => {
    return Array.from({ length: particleCount }).map((_, i) => {
      const size = Math.floor(2 + (i % 5)); // 2px to 6px
      const left = ((i * 17) % 97) + 1.5; // Spread evenly 0-100%
      const top = ((i * 23) % 90) + 5;
      const duration = 14 + (i % 12); // 14s to 25s
      const delay = (i * 0.7) % 12; // stagger delays
      const opacity = 0.2 + ((i % 6) * 0.1);

      return {
        id: i,
        size,
        left: `${left}%`,
        top: `${top}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
      };
    });
  }, [particleCount]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-amber-400 animate-particle shadow-[0_0_8px_rgba(232,184,75,0.6)]"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: p.left,
            top: p.top,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}
