'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

const PARTICLE_COUNT = 60;
const COLORS = ['#163A31', '#39826F', '#79B59F'];
const PARTICLE_SIZE = 1.5;
const PARTICLE_LIFETIME = 4000; // ms
const FLOAT_SPEED = 0.3; // pixels per frame
const DRIFT_RANGE = 0.15; // random horizontal drift
const FADE_START = 0.2; // start fading at 20% of lifetime

export function KnowledgeParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initializeParticles = () => {
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * (canvas.width / window.devicePixelRatio),
        y: canvas.height / window.devicePixelRatio + 20,
        vx: (Math.random() - 0.5) * DRIFT_RANGE,
        vy: -FLOAT_SPEED,
        life: PARTICLE_LIFETIME,
        maxLife: PARTICLE_LIFETIME,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: PARTICLE_SIZE,
      }));
    };

    initializeParticles();

    // Animation loop
    const animate = () => {
      const canvasWidth = canvas.width / window.devicePixelRatio;
      const canvasHeight = canvas.height / window.devicePixelRatio;

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 16; // Approximate frame time

        // Wrap around if exits top
        if (particle.y < -10) {
          particle.y = canvasHeight + 10;
          particle.x = Math.random() * canvasWidth;
          particle.life = PARTICLE_LIFETIME;
        }

        // Remove if lifetime expired
        if (particle.life <= 0) {
          return false;
        }

        // Calculate opacity based on life
        let opacity = 0.8;
        const lifeRatio = particle.life / particle.maxLife;
        
        // Fade at end
        if (lifeRatio < FADE_START) {
          opacity = 0.8 * (lifeRatio / FADE_START);
        }

        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });

      ctx.globalAlpha = 1;

      // Spawn new particles to maintain count
      while (particlesRef.current.length < PARTICLE_COUNT) {
        particlesRef.current.push({
          x: Math.random() * canvasWidth,
          y: canvasHeight + 20,
          vx: (Math.random() - 0.5) * DRIFT_RANGE,
          vy: -FLOAT_SPEED,
          life: PARTICLE_LIFETIME,
          maxLife: PARTICLE_LIFETIME,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: PARTICLE_SIZE,
        });
      }

      timeRef.current += 1;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
