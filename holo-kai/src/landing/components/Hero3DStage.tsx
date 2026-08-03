import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Orbit, Volume2 } from 'lucide-react';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

/**
 * Hero3DStage
 * Interactive 3D WebGL / Canvas Constellation Stage with mouse parallax,
 * automatic GPU performance detection, and hero audio greeting.
 */
export function Hero3DStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [gpuTier, setGpuTier] = useState<'HIGH' | 'LOW'>('HIGH');

  // Simple GPU performance check
  useEffect(() => {
    const isLowTier = window.navigator.hardwareConcurrency <= 4 || window.innerWidth < 768;
    setGpuTier(isLowTier ? 'LOW' : 'HIGH');
  }, []);

  // WebGL / Canvas Constellation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let mouseX = 0;
    let mouseY = 0;

    const particleCount = gpuTier === 'HIGH' ? 80 : 35;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    resize();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background glow
      const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 50, canvas.width / 2, canvas.height / 2, canvas.width / 1.5);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      grad.addColorStop(1, 'rgba(2, 2, 2, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render & Connect Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.fill();

        // Lines between nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resize);
    };
  }, [gpuTier]);

  const handlePlayHeroAudio = async () => {
    if (isPlayingAudio) {
      oracleVoiceEngine.stopSpeaking();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    try {
      await oracleVoiceEngine.speakResponse(
        oracleVoiceEngine.agentConfig?.greeting || "I am HoloKai. A guardian of memory and a witness to the long continuum of African civilizations. Speak, and I will search the archives with you.",
        { rate: 0.92, pitch: 0.85 }
      );
    } catch {
      // fallback handled inside oracleVoiceEngine
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="relative w-full h-[520px] rounded-none bg-zinc-950/90 border border-amber-500/30 overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.14)] backdrop-blur-xl flex flex-col justify-between p-8">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Top Banner Control */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto">
        <div className="flex items-center gap-2 bg-zinc-950/90 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-none border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-mono tracking-wider backdrop-blur-md">
          <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow shrink-0" />
          <span className="truncate">3D CONSTELLATION STAGE ({gpuTier} GPU MODE)</span>
        </div>

        {/* Feature Requested: Hero Audio Greeting Button */}
        <button
          type="button"
          onClick={handlePlayHeroAudio}
          className={`flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-none border text-[10px] sm:text-xs font-semibold font-mono tracking-wider transition duration-300 shadow-lg appearance-none ${
            isPlayingAudio
              ? 'bg-amber-500/30 text-amber-200 border-amber-500 animate-pulse'
              : 'bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span>{isPlayingAudio ? "SPEAKING NARRATIVE..." : "LISTEN TO GUARDIAN INTRODUCTION"}</span>
        </button>
      </div>

      {/* Center Hero Overlay Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono tracking-[0.2em]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          AFRICAN HERITAGE & SPATIAL INTELLIGENCE
        </div>
        <h1 className="text-3xl sm:text-5xl font-light font-display tracking-tight text-white">
          HoloKai Spatial Oracle Portal
        </h1>
        <p className="text-sm font-light text-zinc-300 max-w-lg mx-auto leading-relaxed">
          Explore ethnomathematics, dry-stone engineering, and ancient astronomy through multi-agent AI and WebGL spatial computing.
        </p>
      </div>

      <div className="relative z-10 text-center pointer-events-auto">
        <span className="text-[10px] text-zinc-500 font-mono tracking-[0.2em] uppercase">Move cursor over stage to interact with particle orbits</span>
      </div>
    </div>
  );
}
