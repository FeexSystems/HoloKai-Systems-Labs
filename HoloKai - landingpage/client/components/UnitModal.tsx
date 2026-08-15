import React from "react";

interface UnitModalProps {
  unit: any;
  isOpen: boolean;
  onClose: () => void;
}

export function UnitModal({ unit, isOpen, onClose }: UnitModalProps) {
  if (!isOpen || !unit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg p-6 bg-[#12121a] border border-amber-500/30 rounded-2xl space-y-4 text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>
        <span className="text-xs font-mono text-amber-500 uppercase">{unit.origin}</span>
        <h2 className="text-2xl font-bold">{unit.name}</h2>
        <p className="text-sm text-zinc-300">{unit.description}</p>
      </div>
    </div>
  );
}
