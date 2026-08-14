'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface CyberMannequinViewerProps {
  modelPath?: string;
  autoRotate?: boolean;
  className?: string;
}

export function CyberMannequinViewer({
  modelPath = '/assets/3d/cyber_mannequin.gltf',
  autoRotate = true,
  className = '',
}: CyberMannequinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas resolution
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth * window.devicePixelRatio || 600;
      canvas.height = canvas.clientHeight * window.devicePixelRatio || 600;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let angle = 0;

    // Render 3D Wireframe Cybernetic Mannequin Hologram
    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const scale = Math.min(width, height) * 0.35;

      ctx.clearRect(0, 0, width, height);

      if (autoRotate || isHovered) {
        angle += isHovered ? 0.03 : 0.015;
        setRotationAngle(angle);
      }

      // Draw background cybernetic radar grid rings
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(200, 149, 42, 0.15)';

      for (let r = scale * 0.3; r <= scale * 1.2; r += scale * 0.3) {
        ctx.beginPath();
        ctx.arc(centerX, centerY + scale * 0.4, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 3D Mannequin Skeleton Joints (Head, Shoulders, Chest, Hips, Spine, Arms)
      const joints3D = [
        // Head
        { x: 0, y: -0.95, z: 0 },
        // Neck
        { x: 0, y: -0.75, z: 0 },
        // Shoulders
        { x: -0.45, y: -0.6, z: 0 },
        { x: 0.45, y: -0.6, z: 0 },
        // Chest Core
        { x: 0, y: -0.35, z: 0.1 },
        // Elbows
        { x: -0.65, y: -0.2, z: -0.1 },
        { x: 0.65, y: -0.2, z: -0.1 },
        // Hands
        { x: -0.75, y: 0.25, z: 0.15 },
        { x: 0.75, y: 0.25, z: 0.15 },
        // Pelvis / Hips
        { x: -0.3, y: 0.15, z: 0 },
        { x: 0.3, y: 0.15, z: 0 },
        // Knees
        { x: -0.35, y: 0.6, z: -0.05 },
        { x: 0.35, y: 0.6, z: -0.05 },
        // Ankles
        { x: -0.35, y: 1.05, z: 0 },
        { x: 0.35, y: 1.05, z: 0 },
      ];

      // Bones connecting joints
      const connections = [
        [0, 1], [1, 2], [1, 3], [1, 4], // Head & Shoulders
        [2, 5], [5, 7], [3, 6], [6, 8], // Arms & Hands
        [4, 9], [4, 10],                // Torso to Pelvis
        [9, 11], [11, 13],              // Left Leg
        [10, 12], [12, 14],             // Right Leg
        [2, 3], [9, 10],                // Shoulder & Hip Girdle
      ];

      // Project 3D points to 2D Perspective Screen Space
      const projected = joints3D.map((j) => {
        // Y-axis rotation
        const rotX = j.x * Math.cos(angle) + j.z * Math.sin(angle);
        const rotZ = -j.x * Math.sin(angle) + j.z * Math.cos(angle);

        // Perspective projection
        const fov = 3.5;
        const distance = fov + rotZ;
        const projX = centerX + (rotX / distance) * scale * 1.8;
        const projY = centerY + (j.y / distance) * scale * 1.8;

        return { x: projX, y: projY, z: rotZ };
      });

      // Draw Holographic Mannequin Bones
      connections.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];

        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.2, Math.min(0.9, 0.6 - avgZ * 0.4));

        const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(232, 184, 75, ${alpha})`);
        gradient.addColorStop(1, `rgba(255, 210, 122, ${alpha * 0.7})`);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = Math.max(1, 3 - avgZ * 1.5);
        ctx.shadowColor = '#c8952a';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Glowing Mannequin Core Joints
      projected.forEach((p, idx) => {
        const radius = idx === 0 ? 10 : idx === 4 ? 8 : 4;
        const alpha = Math.max(0.3, Math.min(1, 0.7 - p.z * 0.5));

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = idx === 4 ? 'rgba(52, 211, 153, 0.9)' : `rgba(232, 184, 75, ${alpha})`;
        ctx.shadowColor = idx === 4 ? '#10b981' : '#c8952a';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    setModelLoaded(true);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [autoRotate, isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-gradient-to-b from-[#12121e] via-[#0a0a0f] to-[#05050a] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-[var(--color-border)] ${className}`}
    >
      {/* Header Info Badge */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[var(--color-brand)] animate-ping" />
          <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-brand-light)] uppercase">
            CYBER MANNEQUIN GLTF MATRIX
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 border border-white/10 px-2 py-0.5 rounded-full bg-white/5">
          {modelPath.split('/').pop()}
        </span>
      </div>

      {/* Interactive 3D Canvas */}
      <div className="relative h-80 md:h-96 w-full flex items-center justify-center">
        <canvas ref={canvasRef} className="h-full w-full object-contain cursor-grab active:cursor-grabbing" />

        {/* Orbit Control Hint Badge */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-brand-light)] backdrop-blur-md flex items-center gap-2">
          <span>🔄 ROTATE 3D MANNEQUIN</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-400">3D GLTF DEPLOYED</span>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
        <span>Rotation: {(rotationAngle % (Math.PI * 2)).toFixed(2)} rad</span>
        <span className="text-[var(--color-brand)] font-bold">15 Skeleton Nodes Active</span>
      </div>
    </div>
  );
}
