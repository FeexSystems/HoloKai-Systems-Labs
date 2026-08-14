'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { holokaiVariants } from '../motion/profiles';

export interface AncientScriptVoiceVisualizerProps {
  isActive?: boolean;
  className?: string;
}

const ANCIENT_SCRIPTS = [
  'ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ', // Ge'ez
  '𓏞', '𓀀', '𓁐', '𓃀', '𓄿', '𓆣', '𓎟', // Hieroglyphs
  '𐦠', '𐦡', '𐦢', '𐦣', '𐦤', '𐦥', '𐦦', // Meroitic
  '⚡', '✦', '✧', '◈', '◇', '⬡', '⊕', // Mathematical / Divination Glyphs
];

export function AncientScriptVoiceVisualizer({
  isActive = false,
  className = '',
}: AncientScriptVoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio || 400;
      canvas.height = canvas.clientHeight * window.devicePixelRatio || 120;
    };
    resize();
    window.addEventListener('resize', resize);

    // Glyph Particle Array
    const particles = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * (canvas.width || 400),
      y: Math.random() * (canvas.height || 120),
      char: ANCIENT_SCRIPTS[Math.floor(Math.random() * ANCIENT_SCRIPTS.length)],
      speedY: 0.2 + Math.random() * 0.6,
      size: 14 + Math.random() * 12,
      opacity: 0.2 + Math.random() * 0.7,
    }));

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= isActive ? p.speedY * 2 : p.speedY * 0.5;
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = isActive ? `rgba(169, 213, 176, ${p.opacity})` : `rgba(200, 200, 220, ${p.opacity * 0.4})`;
        ctx.shadowColor = isActive ? '#79B59F' : '#163A31';
        ctx.shadowBlur = isActive ? 10 : 2;
        ctx.fillText(p.char, p.x, p.y);
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isActive]);

  return (
    <motion.div 
      variants={holokaiVariants.cardEntrance}
      animate={{
        boxShadow: isActive
          ? '0 0 24px rgba(57,130,111,0.4), 0 0 48px rgba(57,130,111,0.15)'
          : '0 0 0px rgba(0,0,0,0)',
        borderColor: isActive ? 'rgba(57,130,111,0.5)' : 'rgba(57,130,111,0.2)',
        scale: isActive ? 1.01 : 1,
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/70 p-3 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-brand)] uppercase">
          EPISTEMIC SCRIPT GLYPH SPECTRUM
        </span>
        <span className="text-[10px] font-mono text-zinc-500">GE'EZ · HIEROGLYPHIC · NSIBIDI</span>
      </div>

      <canvas ref={canvasRef} className="h-16 w-full" />
    </motion.div>
  );
}
