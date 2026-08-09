'use client';

import React, { useEffect, useState } from 'react';

export interface SpatialCanvasProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  enableMotion?: boolean;
  className?: string;
}

export function SpatialCanvas({
  children,
  fallback,
  enableMotion = true,
  className = '',
}: SpatialCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  if (reducedMotion || !enableMotion || !hasWebGL) {
    return (
      <div className={`relative w-full h-full bg-gradient-to-b from-[#05050a] via-[#0a0a0f] to-[#05050a] ${className}`}>
        {fallback || (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,149,42,0.1),transparent_70%)]" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
