import React from 'react';

/**
 * FullScreenScanline component adds an optional or continuous
 * retro-futuristic scanline overlay across the viewport.
 */
export default function FullScreenScanline({ opacity = 'opacity-30', enabled = true }) {
  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-[999] scanline ${opacity} transition-opacity duration-500`}
      style={{
        backgroundImage: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
      }}
    />
  );
}
