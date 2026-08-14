'use client';

import React, { useEffect, useRef, useState } from 'react';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [mousePixels, setMousePixels] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }>>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
      setMousePixels({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleCanvasClick = (e: MouseEvent) => {
      setRipples((prev) => [
        ...prev,
        {
          x: e.clientX,
          y: e.clientY,
          radius: 0,
          maxRadius: 180,
          alpha: 1.0,
        },
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleCanvasClick);

    // Canvas particle constellation animation
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      glow: string;
    }> = Array.from({ length: 60 }, () => {
      const colors = ['#c8952a', '#f43f5e', '#3b82f6'];
      const chosenColor = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.6 + 0.3,
        color: chosenColor,
        glow: chosenColor,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Process click ripples and push particles away
      setRipples((prevRipples) => {
        const active: typeof prevRipples = [];
        prevRipples.forEach((ripple) => {
          const nextRipple = {
            ...ripple,
            radius: ripple.radius + 4,
            alpha: Math.max(0, ripple.alpha - 0.02),
          };

          // Render ripple wave ring
          ctx.beginPath();
          ctx.arc(nextRipple.x, nextRipple.y, nextRipple.radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(200, 149, 42, ${nextRipple.alpha * 0.25})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Push particles
          particles.forEach((p) => {
            const dx = p.x - nextRipple.x;
            const dy = p.y - nextRipple.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (Math.abs(dist - nextRipple.radius) < 20) {
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * 0.8;
              p.vy += Math.sin(angle) * 0.8;
            }
          });

          if (nextRipple.radius < nextRipple.maxRadius && nextRipple.alpha > 0) {
            active.push(nextRipple);
          }
        });
        return active;
      });

      // 2. Draw faint constellation connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(200, 149, 42, ${0.18 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // 3. Update and draw particles with mouse gravity force
      particles.forEach((p) => {
        // Calculate vector distance to mouse
        const mdx = mousePixels.x - p.x;
        const mdy = mousePixels.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 250) {
          // Soft attraction pull
          const force = (250 - mdist) * 0.00015;
          p.vx += (mdx / mdist) * force;
          p.vy += (mdy / mdist) * force;
        }

        // Apply friction drag so speeds don't grow infinitely
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce borders
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Render particle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.glow;
        ctx.shadowBlur = 10;
        ctx.fill();
      });

      // Reset shadow blur
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion, mousePixels]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Background Interactive WebGL Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />

      {/* Mouse Spotlight Follow Gradient */}
      <div
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${
            mousePos.y * 100
          }%, rgba(200, 149, 42, 0.14), transparent 80%)`,
        }}
      />

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
