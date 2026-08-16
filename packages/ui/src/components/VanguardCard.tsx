'use client';

import React, { useRef, useState } from 'react';

export interface VanguardUnit {
  id: string;
  name: string;
  title: string;
  role: string;
  image: string;
  video: string;
  color: string;
  archetype: string;
  description: string;
}

export interface VanguardCardProps {
  unit: VanguardUnit;
  onSelect?: (unit: VanguardUnit) => void;
  className?: string;
}

export function VanguardCard({ unit, onSelect, className = '' }: VanguardCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect && onSelect(unit)}
      className={`group relative overflow-hidden rounded-[28px] border border-border bg-gradient-to-b from-surface via-background to-background p-6 text-white cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-border hover:shadow-2xl hover:shadow-glow-brand ${className}`}
    >
      {/* Visual Container: Video + Image Switch */}
      <div className="relative h-72 w-full overflow-hidden rounded-2xl bg-black flex items-center justify-center border border-white/5">
        {/* Fullbody Artwork Image */}
        <img
          src={unit.image}
          alt={unit.name}
          loading="lazy"
          decoding="async"
          className={`h-full w-auto object-contain transition-all duration-500 group-hover:opacity-0 ${
            isPlaying ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          }`}
        />

        {/* Cinematic MP4 Video Loop */}
        <video
          ref={videoRef}
          src={unit.video}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-100 ${
            isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Live Video Indicator Badge */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/70 border border-brand/40 text-[10px] font-mono font-bold text-brand flex items-center gap-1.5 backdrop-blur-md">
          <span className={`size-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-brand'}`} />
          <span>{isPlaying ? 'LIVE STREAM' : 'HOVER 3D'}</span>
        </div>
      </div>

      {/* Unit Meta Info */}
      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand">
            {unit.archetype}
          </span>
          <span className="text-[10px] font-mono text-zinc-500">{unit.id}</span>
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-brand transition-colors">
          {unit.name}
        </h3>

        <p className={`text-xs font-mono font-semibold ${unit.color}`}>
          {unit.title} · {unit.role}
        </p>

        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-light pt-1">
          {unit.description}
        </p>
      </div>

      {/* Action CTA Indicator */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-bold text-brand group-hover:text-brand">
        <span>Inspect Unit Matrix</span>
        <span className="font-mono text-sm transition-transform group-hover:translate-x-1">→</span>
      </div>
    </div>
  );
}
