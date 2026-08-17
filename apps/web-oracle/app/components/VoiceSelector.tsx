'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Play, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface VoicePreset {
  id: string;
  name: string;
  description: string;
  voiceId: string;
  modelId: string;
  stability: number;
  similarityBoost: number;
}

interface VoiceSelectorProps {
  onVoiceSelect?: (preset: VoicePreset) => void;
  onPlayPreview?: (preset: VoicePreset) => void;
  disabled?: boolean;
}

export function VoiceSelector({ onVoiceSelect, onPlayPreview, disabled = false }: VoiceSelectorProps) {
  const [presets, setPresets] = useState<VoicePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<VoicePreset | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  useEffect(() => {
    loadVoicePresets();
  }, []);

  const loadVoicePresets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/voice/presets');
      const data = await response.json();
      setPresets(data.presets || []);
      
      // Select first preset by default
      if (data.presets && data.presets.length > 0) {
        setSelectedPreset(data.presets[0]);
        onVoiceSelect?.(data.presets[0]);
      }
    } catch (error) {
      console.error('Failed to load voice presets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetSelect = (preset: VoicePreset) => {
    setSelectedPreset(preset);
    onVoiceSelect?.(preset);
    setIsExpanded(false);
  };

  const handlePlayPreview = async (preset: VoicePreset, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isPlaying === preset.id) {
      setIsPlaying(null);
      return;
    }

    setIsPlaying(preset.id);
    onPlayPreview?.(preset);

    // Simulate playback duration
    setTimeout(() => {
      setIsPlaying(null);
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-zinc-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading voices...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Volume2 className="w-4 h-4" />
        <span className="text-sm font-medium">
          {selectedPreset ? selectedPreset.name : 'Select Voice'}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-[#1a1a24] border border-white/10 shadow-xl z-50"
          >
            {presets.map((preset) => (
              <motion.button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedPreset?.id === preset.id
                    ? 'bg-amber-500/20 border border-amber-500/50'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm mb-1">
                      {preset.name}
                    </div>
                    <div className="text-xs text-zinc-400 line-clamp-2">
                      {preset.description}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handlePlayPreview(preset, e)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                  >
                    {isPlaying === preset.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
