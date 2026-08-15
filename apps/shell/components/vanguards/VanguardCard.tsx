'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Unit } from '@holokai/contracts';

interface VanguardCardProps {
  vanguard: Unit;
  onAdd: (name: string) => void;
  onClick?: () => void;
}

export default function VanguardCard({ vanguard, onAdd, onClick }: VanguardCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), { damping: 20, stiffness: 150 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), { damping: 20, stiffness: 150 });

  // Spring for the glare/glow effect tracking mouse
  const glareX = useSpring(useTransform(mouseX, [-0.5, 0.5], [0, 100]), { damping: 20, stiffness: 150 });
  const glareY = useSpring(useTransform(mouseY, [-0.5, 0.5], [0, 100]), { damping: 20, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate relative mouse position (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPlaying(false);
    mouseX.set(0);
    mouseY.set(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative rounded-2xl bg-[#0a0a0f] border border-brand/20 overflow-hidden flex flex-col cursor-pointer group h-full shadow-2xl"
    >
      {/* Glare Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(200,149,42,0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Cinematic Top Section (3D container) */}
      <div 
        className="relative h-72 w-full bg-zinc-950 flex items-center justify-center p-4 overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Animated Background Grid / Particles */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-1000 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />

        {/* Cinematic MP4 Video Loop */}
        {vanguard.video && (
          <video
            ref={videoRef}
            src={vanguard.video}
            muted
            loop
            playsInline
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 z-0 ${
              isPlaying ? 'opacity-40' : 'opacity-0 pointer-events-none'
            }`}
          />
        )}

        {/* Live Video Indicator Badge */}
        {vanguard.video && (
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/75 border border-brand/40 text-[9px] font-mono font-bold text-brand-light flex items-center gap-1.5 backdrop-blur-md transition-opacity duration-300">
            <span className={`size-1.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-brand'}`} />
            <span>{isPlaying ? 'ORBIT ACTIVE' : 'HOVER 3D'}</span>
          </div>
        )}

        {/* 3D Floating Image */}
        <motion.div 
          className="relative w-full h-full"
          style={{
            translateZ: isHovered ? 60 : 0, // Parallax popping out
            transition: 'translateZ 0.3s ease-out'
          }}
        >
          <Image
            src={vanguard.fullbodyImage || vanguard.image}
            alt={vanguard.name}
            fill
            unoptimized
            className="object-contain p-2 drop-shadow-[0_0_15px_rgba(200,149,42,0.2)]"
          />
        </motion.div>

        {/* 3D Floating Badge */}
        <motion.span 
          style={{
            translateZ: isHovered ? 90 : 0, // Popping out further than image
            transition: 'translateZ 0.3s ease-out'
          }}
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-brand/20 border border-brand/40 text-brand-light text-[10px] font-mono tracking-wider font-semibold backdrop-blur-md shadow-[0_0_10px_rgba(200,149,42,0.3)]"
        >
          {vanguard.role.toUpperCase()}
        </motion.span>
      </div>

      {/* Content Section */}
      <motion.div 
        className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-[#0a0a0f] to-[#12121a] relative z-20"
        style={{
          translateZ: isHovered ? 30 : 0, // Content pops out slightly
          transition: 'translateZ 0.3s ease-out'
        }}
      >
        <div>
          <h3 className="text-xl font-extrabold text-white group-hover:text-brand-light transition-colors drop-shadow-md">
            {vanguard.name}
          </h3>
          <span className="text-xs text-brand-light/90 font-medium block mt-0.5 uppercase tracking-wide">{vanguard.role}</span>
          <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed font-light line-clamp-3">{vanguard.description}</p>
        </div>

        <div className="border-t border-white/5 pt-3 space-y-2">
          <div className="text-[11px] font-mono text-zinc-400">
            <span className="text-zinc-500">Specs:</span> {vanguard.specs.join(' • ')}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(vanguard.name);
            }}
            className="w-full mt-2 py-2 rounded-xl bg-white/5 hover:bg-brand hover:text-black border border-brand/30 text-brand-light text-xs font-mono font-extrabold transition-all duration-300 relative overflow-hidden group/btn"
          >
            <span className="relative z-10">+ ADD TO REQUISITION</span>
            <div className="absolute inset-0 bg-brand-light transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 ease-out" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
