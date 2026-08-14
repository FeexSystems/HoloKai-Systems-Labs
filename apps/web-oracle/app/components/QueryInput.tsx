'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Sparkles, Keyboard } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function QueryInput({ onSubmit, isLoading = false, placeholder = 'Ask about ancient history...' }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (query.trim()) {
          onSubmit(query);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [query, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Future: Integrate with Deepgram for voice-to-text
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center gap-2">
          {/* Voice Input Button */}
          <motion.button
            type="button"
            onClick={handleVoiceInput}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl border transition-colors ${
              isRecording
                ? 'bg-red-500/20 border-red-500/50 text-red-400 animate-pulse'
                : 'bg-white/10 border-white/20 text-zinc-400 hover:bg-white/20'
            }`}
            title={isRecording ? 'Stop Recording' : 'Voice Input (Cmd/Ctrl+M)'}
          >
            <Mic className="w-5 h-5" />
          </motion.button>

          {/* Text Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={!query.trim() || isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl transition-colors ${
              query.trim() && !isLoading
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-white/10 border-white/20 text-zinc-400 cursor-not-allowed'
            }`}
            title="Send (Cmd/Ctrl+Enter)"
          >
            {isLoading ? (
              <Sparkles className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>

        {/* Keyboard Shortcut Hint */}
        <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <Keyboard className="w-3 h-3" />
          <span>Press</span>
          <kbd className="px-2 py-1 rounded bg-white/10 text-zinc-400">Cmd</kbd>
          <span>+</span>
            <kbd className="px-2 py-1 rounded bg-white/10 text-zinc-400">Enter</kbd>
          <span>to submit</span>
        </div>
      </form>
    </div>
  );
}
