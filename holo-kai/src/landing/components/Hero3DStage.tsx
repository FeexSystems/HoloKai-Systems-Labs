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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [gpuTier, setGpuTier] = useState<'HIGH' | 'LOW'>('HIGH');

  // Hardware detection + manual toggle support
  useEffect(() => {
    const isLowTier = window.navigator.hardwareConcurrency <= 4 || window.innerWidth < 768;
    setGpuTier(isLowTier ? 'LOW' : 'HIGH');
  }, []);

  // WebGL / Canvas Interactive Constellation Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseOver = false;

    const particleCount = gpuTier === 'HIGH' ? 120 : 50;
    const particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
    }[] = [];

    const resize = () => {
      const parent = canvas.parentElement || containerRef.current;
      canvas.width = parent?.clientWidth || window.innerWidth;
      canvas.height = parent?.clientHeight || 520;
    };

    resize();

    const colors = ['#f59e0b', '#fbbf24', '#d97706', '#fef3c7', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.6 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
      mouseX = -1000;
      mouseY = -1000;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('resize', resize);

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space ambient radial gradient
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, canvas.width * 0.7);
      bgGrad.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
      bgGrad.addColorStop(0.5, 'rgba(180, 83, 9, 0.04)');
      bgGrad.addColorStop(1, 'rgba(2, 2, 2, 0)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Rotating orbital ring background
      angle += 0.003;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, canvas.width * 0.35, canvas.height * 0.28, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 16]);
      ctx.stroke();
      ctx.restore();

      // Render Star Nodes & Interactive Gravitational Pull
      const maxConnectDist = gpuTier === 'HIGH' ? 130 : 90;

      particles.forEach((p, idx) => {
        // Gravitational attraction toward mouse cursor
        if (isMouseOver) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 180 && dist > 1) {
            const force = (180 - dist) / 180;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw star node with glowing halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = p.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw constellation lines between nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < maxConnectDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / maxConnectDist) * 0.25;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Mouse cursor constellation tether lines
        if (isMouseOver) {
          const mDist = Math.hypot(p.x - mouseX, p.y - mouseY);
          if (mDist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = `rgba(251, 191, 36, ${(1 - mDist / 140) * 0.4})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
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

  const toggleGpuTier = () => {
    setGpuTier(prev => (prev === 'HIGH' ? 'LOW' : 'HIGH'));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] rounded-none bg-zinc-950/90 border border-amber-500/30 overflow-hidden shadow-[0_0_40px_rgba(245,158,11,0.14)] backdrop-blur-xl flex flex-col justify-between p-8 group cursor-crosshair"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Top Banner Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 pointer-events-auto">
        <button
          type="button"
          onClick={toggleGpuTier}
          title="Click to toggle High/Low GPU mode"
          className="flex items-center gap-2 bg-zinc-950/90 hover:bg-amber-500/20 px-3 py-1.5 rounded-none border border-amber-500/40 text-amber-300 text-[10px] sm:text-xs font-mono tracking-wider backdrop-blur-md transition duration-300 appearance-none"
        >
          <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin-slow shrink-0" />
          <span className="truncate">3D CONSTELLATION STAGE ({gpuTier} GPU MODE)</span>
        </button>

        {/* Hero Audio Greeting Button */}
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
        <span className="text-[10px] text-amber-400/80 font-mono tracking-[0.2em] uppercase">
          ✦ Move cursor over stage to interact with particle orbits & orbital rings ✦
        </span>
      </div>
    </div>
  );
}
