'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Loader2, X } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  onError?: (error: string) => void;
}

export function VoiceInput({ onTranscript, onError }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('mimeType', 'audio/webm');
          formData.append('detectLanguage', 'true');

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          setTranscript(data.text);
          onTranscript(data.text);
        } catch (error) {
          onError?.('Failed to transcribe audio. Please try again.');
          console.error('Transcription error:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      onError?.('Failed to access microphone. Please grant permission.');
      console.error('Voice input error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
  };

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-6 rounded-2xl border border-white/10 bg-[#12121a]">
      <h2 className="text-xl font-bold mb-6">Voice Input</h2>

      <div className="mb-6">
        {isRecording && (
          <div className="flex items-center gap-2 text-red-400 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium">Recording...</span>
          </div>
        )}

        {isProcessing && (
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Processing audio...</span>
          </div>
        )}
      </div>

      <div className="mb-6 min-h-[100px] p-4 rounded-xl border border-white/10 bg-white/5">
        {transcript ? (
          <div className="text-white text-sm leading-relaxed">
            <span className="text-amber-400">"</span>
            {transcript}
            <span className="text-amber-400">"</span>
          </div>
        ) : (
          <div className="text-zinc-500 text-sm italic">
            Your transcript will appear here...
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={isRecording ? stopRecording : startRecording}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isProcessing}
          className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-5 h-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" />
              {transcript ? 'Record Again' : 'Start Recording'}
            </>
          )}
        </motion.button>

        {transcript && (
          <motion.button
            onClick={clearTranscript}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      <div className="mt-4 text-xs text-zinc-500">
        <p>• Requires microphone permission</p>
        <p>• Uses Deepgram API for transcription (Pro+)</p>
        <p>• Supports multiple languages</p>
      </div>
    </div>
  );
}
