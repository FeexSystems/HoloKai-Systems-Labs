'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, Settings } from 'lucide-react';

interface VoiceOutputProps {
  text: string;
  onPlay?: () => void;
  onPause?: () => void;
  onSpeedChange?: (speed: number) => void;
  onVoiceChange?: (voice: string) => void;
}

const voices = [
  { id: 'default', name: 'Default Voice', language: 'English' },
  { id: 'ancient-latin', name: 'Ancient Latin', language: 'Latin' },
  { id: 'ancient-egyptian', name: 'Ancient Egyptian', language: 'Coptic' },
  { id: 'ancient-greek', name: 'Ancient Greek', language: 'Ancient Greek' },
  { id: 'ancient-sanskrit', name: 'Sanskrit', language: 'Sanskrit' },
];

export function VoiceOutput({
  text,
  onPlay,
  onPause,
  onSpeedChange,
  onVoiceChange,
}: VoiceOutputProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentVoice, setCurrentVoice] = useState(voices[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const volumes = [0, 0.25, 0.5, 0.75, 1];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      onPlay?.();
    } else {
      onPause?.();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onSpeedChange?.(newSpeed);
  };

  const handleVoiceChange = (voiceId: string) => {
    const voice = voices.find((v) => v.id === voiceId);
    if (voice) {
      setCurrentVoice(voice);
      onVoiceChange?.(voice.id);
    }
  };

  const handleSkip = (direction: 'forward' | 'back') => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 0;
      const skipAmount = 10; // skip 10 seconds

      if (direction === 'forward') {
        audioRef.current.currentTime = Math.min(currentTime + skipAmount, duration);
      } else {
        audioRef.current.currentTime = Math.max(currentTime - skipAmount, 0);
      }
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Voice Output</h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-4 mb-6">
        {/* Play/Pause */}
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </motion.button>

        {/* Skip Back */}
        <motion.button
          onClick={() => handleSkip('back')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
        >
          <SkipBack className="w-5 h-5" />
        </motion.button>

        {/* Skip Forward */}
        <motion.button
          onClick={() => handleSkip('forward')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>

        {/* Speed Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSpeedChange(Math.max(0.5, speed - 0.25))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-bold">-</span>
          </button>
          <span className="text-xs text-zinc-400 font-mono w-12 text-center">
            {speed}x
          </span>
          <button
            onClick={() => handleSpeedChange(Math.min(2, speed + 0.25))}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zin-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-bold">+</span>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-500"
              initial={{ width: '75%' }}
              animate={{ width: isMuted ? '0%' : '75%' }}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Voice
              </label>
              <select
                value={currentVoice.id}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                {voices.map((voice) => (
                  <option key={voice.id} value={voice.id}>
                    {voice.name} ({voice.language})
                  </option>
                ))}
              </select>
            </div>

            {/* Transcript Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Show Transcript</label>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  showTranscript ? 'bg-amber-500' : 'bg-white/10'
                }`}
              >
                <motion.div
                  className="w-6 h-6 rounded-full bg-white transition-transform"
                  animate={{ x: showTranscript ? 20 : 0 }}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transcript Display */}
      <AnimatePresence>
        {showTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-xl border border-white/10 bg-white/5"
          >
            <div className="text-sm text-zinc-400 mb-2">Transcript</div>
            <p className="text-white text-sm leading-relaxed">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className="mt-4 text-xs text-zinc-500">
        <p>• Uses ElevenLabs API for synthesis (Pro+)</p>
        <p>• Supports multiple ancient languages</p>
        <p>• Adjustable playback speed and volume</p>
      </div>
    </div>
  );
}
