import React, { useEffect, useRef } from 'react';

export default function AncientDustCursor() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -100, y: -100, speedX: 0, speedY: 0 });
  const lastMouseRef = useRef({ x: -100, y: -100, time: Date.now() });
  const particlesRef = useRef([]);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || isReducedMotion) return undefined;

    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        // Float upwards and drift with mouse velocity
        this.vx = vx * 0.15 + (Math.random() - 0.5) * 0.4;
        this.vy = vy * 0.15 - Math.random() * 0.3 - 0.2;
        this.size = Math.random() * 2.5 + 1;
        this.maxLife = Math.random() * 40 + 30;
        this.life = this.maxLife;
        // Warm ancient amber/gold dust colors
        const hue = Math.random() > 0.35 ? 38 : 28; // Amber vs Deep Gold
        const sat = Math.floor(Math.random() * 20) + 75; // 75-95%
        const light = Math.floor(Math.random() * 20) + 55; // 55-75%
        this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.05;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy -= 0.005; // Slow rising drift
        this.life--;
        this.size *= 0.98; // Shrink as they fade
        this.rotation += this.rotSpeed;
      }

      draw(c) {
        const alpha = this.life / this.maxLife;
        c.save();
        c.translate(this.x, this.y);
        c.rotate(this.rotation);
        c.fillStyle = this.color + alpha * 0.7 + ')';
        // Draw slightly diamond/square dust shapes or tiny specs
        c.beginPath();
        if (this.size > 1.8) {
          c.moveTo(0, -this.size);
          c.lineTo(this.size, 0);
          c.lineTo(0, this.size);
          c.lineTo(-this.size, 0);
        } else {
          c.arc(0, 0, this.size, 0, Math.PI * 2);
        }
        c.closePath();
        c.fill();
        c.restore();
      }
    }

    const handleMouseMove = (e) => {
      const now = Date.now();
      const dt = Math.max(1, now - lastMouseRef.current.time);
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      
      const speedX = dx / dt;
      const speedY = dy / dt;

      mouseRef.current = { x: e.clientX, y: e.clientY, speedX, speedY };
      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };

      // Spawn a cluster of particles on move
      const dist = Math.hypot(dx, dy);
      if (dist > 2) {
        const count = Math.min(4, Math.floor(dist / 4) + 1);
        for (let i = 0; i < count; i++) {
          // Interpolate position for gaps
          const ratio = i / count;
          const px = lastMouseRef.current.x - dx * ratio;
          const py = lastMouseRef.current.y - dy * ratio;
          particlesRef.current.push(new Particle(px, py, speedX, speedY));
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly spawn atmospheric ambient dust particles even when mouse is static
      if (Math.random() < 0.15) {
        const rx = Math.random() * canvas.width;
        const ry = Math.random() * canvas.height;
        particlesRef.current.push(new Particle(rx, ry, 0, 0));
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        p.update();
        p.draw(ctx);
        return p.life > 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-75"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
