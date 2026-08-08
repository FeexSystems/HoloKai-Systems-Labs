import React from "react";

interface LabCanvasProps {
  unit?: any;
  autoRotate?: boolean;
  muted?: boolean;
  mode?: string;
}

export function LabCanvas({ unit, autoRotate = true }: LabCanvasProps) {
  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-black/60 rounded-xl border border-amber-500/20">
      <div className="text-center p-6 space-y-3">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 font-mono text-lg animate-pulse">
          3D
        </div>
        <h3 className="text-sm font-semibold text-white">
          {unit?.name || "VANGUARD LAB VIEWPORT"}
        </h3>
        <p className="text-xs text-zinc-400 max-w-xs mx-auto">
          React Three Fiber & WebGL Canvas Fallback Active
        </p>
      </div>
    </div>
  );
}
