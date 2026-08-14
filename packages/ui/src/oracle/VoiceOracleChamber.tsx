'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Spline from '@splinetool/react-spline';
import { Mic, MicOff, Brain, ShieldCheck, Cpu, HeartPulse, Database, Loader2, Volume2, Activity } from 'lucide-react';
import { HoloKaiEntranceVariants, holokaiVariants } from '../motion/profiles';

export interface VoiceOracleChamberProps {
  className?: string;
  motionProfile?: 'visible' | 'visibleHumanoid' | 'visibleClassical' | 'visibleQuantum';
}

const SPLINE_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

const GUARDIAN_PERSONAS = [
  { id: '01', name: 'Kemet-Alpha', role: 'Archivist & Epigrapher', voiceId: '21m00Tcm4TlvDq8ikWAM', engine: 'elevenlabs' },
  { id: '02', name: 'Kush-Prime', role: 'Nexus Synchronizer', voiceId: 't0jbNlBVZ17f02VDIeMI', engine: 'elevenlabs' },
  { id: '03', name: 'Asante-V', role: 'The Oracle Visionary', voiceId: 'MF3mGyEYCl7XYWbV9V6O', engine: 'elevenlabs' },
  { id: '04', name: 'Bantu-Node', role: 'Great Zimbabwe Navigator', engine: 'deepgram' },
  { id: '05', name: 'Sika-Gold', role: 'Artisan & Metallurgist', engine: 'deepgram' },
  { id: '06', name: 'Zamani', role: 'Scholar & Dialectician', voiceId: 'ErXwobaYiN019PkySvjV', engine: 'elevenlabs' },
  { id: '07', name: 'Naja-7', role: 'Dahomey Vanguard Guard', engine: 'deepgram' },
  { id: '08', name: 'Oluwa-Core', role: 'Ifá Binary Oracle', voiceId: 'EXAVITQu4vr4xnSDxMaL', engine: 'elevenlabs' },
];

const DEFAULT_EMOTIONS = {
  empathy: 0.75,
  curiosity: 0.70,
  analytical: 0.85,
  culturalResonance: 0.80,
};

const ALL_AGENTS = [
  'Historian AI',
  'Archaeologist AI',
  'Linguist AI',
  'Anthropologist AI',
  'Ethicist AI',
];

type SystemState = 'idle' | 'listening' | 'thinking' | 'speaking';

export function VoiceOracleChamber({ className = '', motionProfile = 'visibleHumanoid' }: VoiceOracleChamberProps) {
  const [systemState, setSystemState] = useState<SystemState>('idle');
  const [query, setQuery] = useState('');
  const [activeGuardian, setActiveGuardian] = useState(GUARDIAN_PERSONAS[0]);
  const [vocalEngineChoice, setVocalEngineChoice] = useState<'elevenlabs' | 'deepgram' | 'webspeech'>('elevenlabs');
  
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; confidence?: number; citations?: string[] }>>([
    {
      sender: 'Kemet-Alpha (Oracle)',
      text: 'Greetings, Scholar. I am the HoloKai Civilization Oracle. Ask me any question on Pan-African epigraphy, manuscript astronomy, Great Zimbabwe masonry, or binary divination matrices.',
      confidence: 0.99,
      citations: ['Nile Valley Folio 418', 'Timbuktu Shankore Codex Vol. II'],
    },
  ]);
  const [emotions, setEmotions] = useState(DEFAULT_EMOTIONS);
  const [activeAgents, setActiveAgents] = useState<string[]>([]);
  
  const [micError, setMicError] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const splineRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);

  // ---------- Audio Analyser Logic ----------
  const startAudioAnalysis = useCallback((stream: MediaStream | HTMLAudioElement) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const analyser = audioContextRef.current.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    
    // Disconnect old source if exists
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
    }
    
    if (stream instanceof MediaStream) {
      sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
    } else {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(stream);
      analyser.connect(audioContextRef.current.destination);
    }
    
    sourceNodeRef.current.connect(analyser);
    analyserRef.current = analyser;

    const updateLevel = () => {
      if (!analyserRef.current) return;
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      // Normalize to 0-1 (rough estimation)
      setAudioLevel(Math.min(1, average / 64));
      
      animationFrameRef.current = requestAnimationFrame(updateLevel);
    };
    
    updateLevel();
  }, []);

  const stopAudioAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // ---------- Speech Recognition ----------
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setSystemState('listening');
        setMicError('');
      };
      
      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        if (text.trim()) setQuery(text);
      };
      
      recognition.onend = () => {
        if (systemState === 'listening') {
          // Only trigger if we haven't already transitioned to thinking
          setSystemState('idle');
          stopAudioAnalysis();
          if (micStreamRef.current) {
            micStreamRef.current.getTracks().forEach(t => t.stop());
            micStreamRef.current = null;
          }
        }
      };
      
      recognition.onerror = (e: any) => {
        if (e.error !== 'no-speech') {
          setMicError(`Voice error: ${e.error}. Check mic permissions.`);
        }
        setSystemState('idle');
        stopAudioAnalysis();
      };

      recognitionRef.current = recognition;
    }
    
    return () => stopAudioAnalysis();
  }, [stopAudioAnalysis, systemState]);

  // ---------- Toggle Mic ----------
  const handleMicToggle = async () => {
    if (systemState === 'listening') {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
      stopAudioAnalysis();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(t => t.stop());
        micStreamRef.current = null;
      }
      setSystemState('idle');
    } else {
      setMicError('');
      setQuery('');
      
      try {
        // Request actual mic stream for the visualizer
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        startAudioAnalysis(stream);
        
        if (recognitionRef.current) {
          recognitionRef.current.start();
        } else {
          setSystemState('listening');
        }
      } catch (err) {
        setMicError('Microphone permission denied. Please allow access.');
        console.error(err);
      }
    }
  };

  // ---------- Process Query ----------
  const handleSynthesizeQuery = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    
    // Stop listening if we were listening
    if (recognitionRef.current && systemState === 'listening') {
      try { recognitionRef.current.stop(); } catch {}
    }
    stopAudioAnalysis();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }

    const newMessages = [...messages, { sender: 'You (Scholar)', text: userQuery }];
    setMessages(newMessages);
    setQuery('');
    setSystemState('thinking');
    setActiveAgents(['Historian AI', 'Archaeologist AI']); // Simulated agent activation

    try {
      const res = await fetch('/api/oracle/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userQuery, civilizationFocus: activeGuardian.name })
      });
      
      const data = await res.json();
      const replyText = data.text || 'The Oracle is silent.';

      setMessages((prev) => [
        ...prev,
        {
          sender: `${activeGuardian.name} (${vocalEngineChoice.toUpperCase()})`,
          text: replyText,
          confidence: data.confidenceScore,
          citations: data.citations || [],
        },
      ]);
      
      // Update emotions slightly based on data or simulate
      setEmotions({
        empathy: Math.random() * 0.3 + 0.6,
        curiosity: Math.random() * 0.4 + 0.5,
        analytical: Math.random() * 0.2 + 0.8,
        culturalResonance: 0.95,
      });

      setSystemState('speaking');

      // 2. Play TTS Audio
      if (vocalEngineChoice === 'webspeech') {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(replyText);
          utterance.onend = () => setSystemState('idle');
          utterance.onerror = () => setSystemState('idle');
          window.speechSynthesis.speak(utterance);
        } else {
          setSystemState('idle');
        }
      } else {
        const ttsRes = await fetch('/api/oracle/speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: replyText, 
            engine: vocalEngineChoice, 
            voiceId: activeGuardian.voiceId 
          })
        });

        if (ttsRes.ok) {
          const blob = await ttsRes.blob();
          const url = URL.createObjectURL(blob);
          if (audioRef.current) {
            audioRef.current.src = url;
            // Cross-origin audio context trick: we need to setup analysis before play
            startAudioAnalysis(audioRef.current);
            await audioRef.current.play();
            audioRef.current.onended = () => {
              setSystemState('idle');
              stopAudioAnalysis();
            };
          }
        } else {
          setSystemState('idle');
        }
      }

    } catch (err) {
      console.error(err);
      setSystemState('idle');
      stopAudioAnalysis();
      setMessages((prev) => [
        ...prev,
        {
          sender: 'System Error',
          text: 'Unable to connect to the HoloKai backend engine.',
        },
      ]);
    }
  };

  // ---------- Spline Control ----------
  const onSplineLoad = (splineApp: any) => {
    splineRef.current = splineApp;
    setSplineLoaded(true);
  };

  useEffect(() => {
    const app = splineRef.current;
    if (!app) return;

    // Drive robot state
    app.setVariable?.('systemState', systemState);

    // Calculate intensity based on state and real audioLevel
    let intensity = 1.1;
    if (systemState === 'listening') intensity = 1.6 + audioLevel * 1.5;
    if (systemState === 'thinking') intensity = 2.2;
    if (systemState === 'speaking') intensity = 2.8 + audioLevel * 2.0;

    app.setVariable?.('coreIntensity', intensity);
  }, [systemState, audioLevel]);

  return (
    <motion.div 
      initial="hidden"
      animate={motionProfile}
      variants={HoloKaiEntranceVariants}
      className={`min-h-[85vh] rounded-[32px] border border-[var(--color-border-strong)] bg-[var(--color-bg-subtle)] text-[var(--color-text)] overflow-hidden relative shadow-2xl ${className}`}
    >
      <audio ref={audioRef} crossOrigin="anonymous" className="hidden" />
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-surface-subtle)_0%,_transparent_100%)] opacity-50 pointer-events-none" />

      <div className="relative z-10 w-full h-full flex flex-col p-6 lg:p-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-brand)] flex items-center justify-center shadow-lg shadow-[var(--color-brand)]/10">
              <Brain className="w-6 h-6 text-[var(--color-brand)]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-[var(--color-text)]">
                Oracle Chamber
              </h1>
              <p className="text-[10px] text-[var(--color-brand)] tracking-[0.18em] uppercase font-bold">
                Voice Interface · {activeGuardian.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-1.5 rounded-2xl shadow-sm">
            {['elevenlabs', 'deepgram', 'webspeech'].map(engine => (
              <button
                key={engine}
                onClick={() => setVocalEngineChoice(engine as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                  vocalEngineChoice === engine
                    ? 'bg-[var(--color-brand)] text-[var(--color-brand-contrast)] shadow-md'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {engine.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        {/* Main 3-Column Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative min-h-[500px]">
          
          {/* LEFT PANEL: Emotion & Agents */}
          <div className="lg:col-span-3 flex flex-col gap-6" style={{ "--motion-index": 1 } as React.CSSProperties}>
            <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)] shadow-sm animate-pui-fade">
              <div className="flex items-center gap-3 mb-6">
                <HeartPulse className="text-[var(--color-brand)] w-4 h-4" />
                <span className="uppercase text-xs font-mono tracking-widest text-[var(--color-text-secondary)]">Emotion Engine</span>
              </div>
              <div className="space-y-5">
                <EmotionBar label="Empathy" value={emotions.empathy} color="bg-rose-400" />
                <EmotionBar label="Curiosity" value={emotions.curiosity} color="bg-sky-400" />
                <EmotionBar label="Analytical" value={emotions.analytical} color="bg-emerald-400" />
                <EmotionBar label="Resonance" value={emotions.culturalResonance} color="bg-[var(--color-brand)]" />
              </div>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-3xl border border-[var(--color-border)] shadow-sm flex-1 animate-pui-fade" style={{ "--motion-index": 2 } as React.CSSProperties}>
              <div className="flex items-center gap-3 mb-6">
                <Cpu className="text-[var(--color-brand)] w-4 h-4" />
                <span className="uppercase text-xs font-mono tracking-widest text-[var(--color-text-secondary)]">Active Agents</span>
              </div>
              <div className="space-y-2">
                {ALL_AGENTS.map(agent => (
                  <div
                    key={agent}
                    className={`px-4 py-3 rounded-2xl text-sm transition-all border font-mono ${
                      activeAgents.includes(agent)
                        ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/10 text-[var(--color-brand)]'
                        : 'border-[var(--color-border-subtle)] bg-transparent text-[var(--color-text-disabled)]'
                    }`}
                  >
                    {agent}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Spline & Voice Control */}
          <div className="lg:col-span-6 relative flex flex-col animate-pui-scale" style={{ "--motion-index": 3 } as React.CSSProperties}>
            <div className="flex-1 relative rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl bg-[var(--color-surface-subtle)]">
              
              {/* Spline Loading State */}
              <AnimatePresence>
                {!splineLoaded && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-surface)] z-10"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-brand)] animate-spin" />
                      <Brain className="w-6 h-6 text-[var(--color-brand)] animate-pulse" />
                    </div>
                    <p className="mt-4 text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase">Initializing Canvas...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <Spline
                scene={SPLINE_SCENE}
                onLoad={onSplineLoad}
                className="w-full h-full min-h-[400px]"
              />

              {/* Status Overlay */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                <div className="px-4 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md text-xs font-mono flex items-center gap-2 shadow-lg">
                  <div className={`w-2 h-2 rounded-full ${systemState === 'idle' ? 'bg-emerald-400' : 'bg-[var(--color-brand)] animate-pulse'}`} />
                  {systemState.toUpperCase()}
                </div>
              </div>

              {/* Live Transcript / Feedback */}
              {(query || micError) && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 max-w-[85%] w-full">
                  <div className={`backdrop-blur-xl border px-6 py-4 rounded-2xl text-sm text-center shadow-xl font-mono ${
                    micError ? 'bg-[var(--color-danger)]/20 border-[var(--color-danger)] text-[var(--color-danger)]' : 'bg-[var(--color-surface)]/90 border-[var(--color-border)] text-[var(--color-text)]'
                  }`}>
                    {micError || query}
                  </div>
                </div>
              )}
            </div>
            
            {/* Control Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 bg-[var(--color-surface)] p-4 rounded-3xl border border-[var(--color-border)] shadow-sm">
              <button
                onClick={handleMicToggle}
                disabled={systemState === 'thinking' || systemState === 'speaking'}
                className={`
                  relative w-16 h-16 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 shadow-md
                  ${systemState === 'listening'
                    ? 'bg-[var(--color-brand)] text-[var(--color-brand-contrast)] scale-105'
                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text)] border border-[var(--color-border)] hover:border-[var(--color-brand)]'
                  }
                  disabled:opacity-40 disabled:cursor-not-allowed
                `}
              >
                {systemState === 'listening' ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
                {systemState === 'listening' && (
                  <span className="absolute inset-0 rounded-full border-2 border-[var(--color-brand)] animate-ping opacity-40" />
                )}
              </button>

              <div className="flex-1 w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSynthesizeQuery(query)}
                  placeholder="Ask the Oracle..."
                  className="w-full h-14 px-5 rounded-2xl bg-[var(--color-surface-subtle)] border border-[var(--color-border)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] text-sm outline-none focus:border-[var(--color-brand)] transition-colors font-sans"
                />
              </div>

              <button
                onClick={() => handleSynthesizeQuery(query)}
                disabled={!query.trim() || systemState === 'thinking'}
                className="h-14 px-8 rounded-2xl bg-[var(--color-brand)] text-[var(--color-brand-contrast)] font-extrabold text-sm hover:brightness-110 shadow-lg disabled:opacity-50 transition-all shrink-0 flex items-center gap-2 uppercase tracking-wider"
              >
                {systemState === 'thinking' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Synthesize'}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Synthesis Report (Chat History) */}
          <div className="lg:col-span-3 flex flex-col" style={{ "--motion-index": 4 } as React.CSSProperties}>
            <div className="bg-[var(--color-surface)] h-full min-h-[400px] rounded-3xl border border-[var(--color-border)] shadow-sm p-6 flex flex-col animate-pui-fade">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Database className="text-[var(--color-brand)] w-4 h-4" />
                  <span className="uppercase text-xs font-mono tracking-widest text-[var(--color-text-secondary)]">Synthesis Log</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {messages.map((m, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={idx} 
                    className="p-4 bg-[var(--color-surface-subtle)] border border-[var(--color-border-subtle)] rounded-2xl space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-mono font-bold ${m.sender.includes('You') ? 'text-emerald-400' : 'text-[var(--color-brand)]'}`}>
                        {m.sender}
                      </span>
                      {m.confidence && (
                        <span className="text-[10px] text-emerald-400/80 font-mono">
                          {(m.confidence * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {m.text}
                    </p>
                    {m.citations && m.citations.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {m.citations.map((c, i) => (
                          <span key={i} className="text-[9px] font-mono bg-[var(--color-surface)] border border-[var(--color-border)] px-2 py-1 rounded text-[var(--color-text-muted)]">
                            📜 {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {systemState === 'thinking' && (
                  <div className="p-4 border border-dashed border-[var(--color-border-strong)] rounded-2xl flex items-center justify-center gap-3">
                    <Activity className="w-4 h-4 text-[var(--color-brand)] animate-spin" />
                    <span className="text-xs font-mono text-[var(--color-text-muted)]">Synchronizing Archives...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}

// ---------- Small Components ----------
function EmotionBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-[var(--color-text-muted)]">{label}</span>
        <span className="text-[var(--color-text-secondary)]">{Math.round((value || 0) * 100)}</span>
      </div>
      <div className="h-1.5 w-full bg-[var(--color-surface-subtle)] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-700 rounded-full`}
          style={{ width: `${Math.max(4, (value || 0) * 100)}%` }}
        />
      </div>
    </div>
  );
}
