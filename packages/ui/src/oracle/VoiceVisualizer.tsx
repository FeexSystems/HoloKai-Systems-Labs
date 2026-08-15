'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { holokaiVariants } from '../motion/profiles';

export interface VoiceVisualizerProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  audioStream?: MediaStream | null;
  className?: string;
}

export function VoiceVisualizer({
  isListening = false,
  isSpeaking = false,
  audioStream = null,
  className = '',
}: VoiceVisualizerProps) {
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

    let phase = 0;
    const numBars = 48;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      phase += 0.08;
      const barWidth = (width / numBars) * 0.65;
      const gap = (width / numBars) * 0.35;

      for (let i = 0; i < numBars; i++) {
        let amplitude = 0.1;

        if (isListening) {
          // Dynamic microphone audio wave sim
          amplitude = 0.2 + Math.sin(phase + i * 0.2) * 0.4 + Math.cos(phase * 1.5 + i * 0.1) * 0.3;
        } else if (isSpeaking) {
          // Dynamic ElevenLabs / Deepgram TTS speech synthesis sim
          amplitude = 0.3 + Math.abs(Math.sin(phase * 2 + i * 0.15)) * 0.6;
        } else {
          // Idle breathing pulse
          amplitude = 0.08 + Math.sin(phase * 0.5 + i * 0.1) * 0.05;
        }

        const barHeight = Math.max(4, amplitude * (height * 0.75));
        const x = i * (barWidth + gap) + gap / 2;
        const y = centerY - barHeight / 2;

        // Moss & Teal Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isListening) {
          gradient.addColorStop(0, '#A9D5B0');
          gradient.addColorStop(1, '#39826F');
        } else if (isSpeaking) {
          gradient.addColorStop(0, '#79B59F');
          gradient.addColorStop(1, '#A9D5B0');
        } else {
          gradient.addColorStop(0, 'rgba(143,175,145,0.4)');
          gradient.addColorStop(1, 'rgba(143,175,145,0.2)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 4);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [isListening, isSpeaking, audioStream]);

  return (
    <motion.div 
      variants={holokaiVariants.cardEntrance}
      animate={{
        boxShadow: isListening
          ? '0 0 30px rgba(16,185,129,0.35), 0 0 60px rgba(16,185,129,0.15)'
          : isSpeaking
          ? '0 0 30px rgba(57,130,111,0.40), 0 0 60px rgba(57,130,111,0.15)'
          : '0 0 0px rgba(0,0,0,0)',
        borderColor: isListening
          ? 'rgba(16,185,129,0.5)'
          : isSpeaking
          ? 'rgba(57,130,111,0.5)'
          : 'rgba(57,130,111,0.2)',
        scale: isListening || isSpeaking ? 1.01 : 1,
      }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-black/60 p-4 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${isListening ? 'bg-emerald-400 animate-ping' : isSpeaking ? 'bg-[var(--color-brand)] animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-brand)] uppercase">
            {isListening ? 'LIVE STT MICROPHONE' : isSpeaking ? 'VOCAL SYNTHESIS (ELEVENLABS / DEEPGRAM)' : 'VOCAL ENGINE IDLE'}
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">48-BAND SPECTRUM</span>
      </div>

      <canvas ref={canvasRef} className="h-20 w-full" />
    </motion.div>
  );
}
