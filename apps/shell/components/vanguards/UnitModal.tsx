'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit } from '@holokai/contracts';

interface UnitModalProps {
  unit: Unit;
  onClose: () => void;
  onAdd: (name: string) => void;
}

export default function UnitModal({ unit, onClose, onAdd }: UnitModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlayVoice = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      // In a real implementation, this would call our ElevenLabs API route.
      // We will create the API route soon. For now we use the HTML5 audio element.
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: `I am ${unit.name}, ${unit.role}. ${unit.description}`, 
          name: unit.name
        }),
      });

      if (!response.ok) throw new Error('Voice synthesis failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newAudio = new Audio(url);
      
      newAudio.onended = () => setIsPlaying(false);
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error(error);
      setIsPlaying(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl bg-[#0a0a0f] border border-brand/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-brand/20 rounded-full border border-white/10 hover:border-brand transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Left: Image / Model */}
          <div className="w-full md:w-2/5 relative bg-zinc-950 flex items-center justify-center p-8 border-r border-brand/20 min-h-[300px]">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(200,149,42,0.3)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-full h-full min-h-[400px]"
            >
              <Image
                src={unit.fullbodyImage || unit.image}
                alt={unit.name}
                fill
                unoptimized
                className="object-contain drop-shadow-[0_0_20px_rgba(200,149,42,0.2)]"
              />
            </motion.div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div>
                <motion.span 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-block px-3 py-1 bg-brand/10 border border-brand/30 text-brand text-xs font-mono tracking-widest font-bold rounded-full mb-4"
                >
                  {unit.role.toUpperCase()}
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-extrabold text-white"
                >
                  {unit.name}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-zinc-400 mt-4 leading-relaxed font-light text-lg"
                >
                  {unit.detail || unit.description}
                </motion.p>
              </div>

              {/* Voice Interaction */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="pt-4 border-t border-white/10 flex items-center gap-4"
              >
                <button
                  onClick={handlePlayVoice}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold transition-all ${
                    isPlaying 
                      ? 'bg-brand text-black shadow-[0_0_20px_rgba(200,149,42,0.4)]' 
                      : 'bg-white/5 border border-brand/30 text-brand-light hover:bg-brand/20'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <div className="flex gap-1">
                        <span className="w-1 h-3 bg-black animate-pulse"></span>
                        <span className="w-1 h-3 bg-black animate-pulse delay-75"></span>
                        <span className="w-1 h-3 bg-black animate-pulse delay-150"></span>
                      </div>
                      <span>INITIALIZING SYNTHESIS...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-current">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>ACTIVATE VOICE ENGINE</span>
                    </>
                  )}
                </button>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <h4 className="text-sm font-mono text-zinc-500 mb-2 uppercase">Cultural Resonance</h4>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">{unit.culturalResonance}</p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                  <h4 className="text-sm font-mono text-zinc-500 mb-2 uppercase">Civilizational Impact</h4>
                  <p className="text-sm text-zinc-300 font-light leading-relaxed">{unit.civilizationalImpact}</p>
                </motion.div>
                
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="md:col-span-2">
                  <h4 className="text-sm font-mono text-zinc-500 mb-2 uppercase">Hardware & Specs</h4>
                  <div className="flex flex-wrap gap-2">
                    {unit.specs.map(spec => (
                      <span key={spec} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-zinc-400">
                        {spec}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-6 mt-6 border-t border-white/10"
              >
                <button
                  onClick={() => {
                    onAdd(unit.name);
                    onClose();
                  }}
                  className="w-full py-4 rounded-xl bg-brand hover:bg-brand-light text-black font-mono font-extrabold text-sm tracking-widest transition-all shadow-[0_0_20px_rgba(200,149,42,0.2)] hover:shadow-[0_0_30px_rgba(200,149,42,0.4)]"
                >
                  ADD TO REQUISITION
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
