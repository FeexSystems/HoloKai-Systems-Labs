import React, { useEffect, useRef, useState } from 'react';
import { Volume2, Mic, Activity, Radio, BarChart2, Waves } from 'lucide-react';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

export default function VoiceVisualizer({
  isSpeaking = false,
  isListening = false,
  isThinking = false,
  voiceName = 'HoloKai Oracle',
  className = '',
}) {
  const canvasRef = useRef(null);
  const [vizMode, setVizMode] = useState('bars'); // 'bars' | 'wave'
  const [peakDb, setPeakDb] = useState(-60);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const BAR_COUNT = 32;

    let phase = 0;

    const render = () => {
      // Ensure canvas pixel ratio scaling
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Get real frequency data or generate simulated voice wave
      const freqData = oracleVoiceEngine.getFrequencyData(BAR_COUNT);
      const activeSpeaking = isSpeaking || oracleVoiceEngine.isSpeaking();
      const activeListening = isListening;

      phase += 0.08;

      let maxVal = 0;

      if (vizMode === 'bars') {
        const barWidth = (width / BAR_COUNT) - 2;

        for (let i = 0; i < BAR_COUNT; i++) {
          let val = 0;

          if (activeSpeaking) {
            // Combine real analyser byte data + organic harmonic pulse
            const realVal = freqData[i] || 0;
            const sinePulse = Math.sin(phase + i * 0.3) * 30 + Math.cos(phase * 1.5 + i * 0.2) * 20;
            val = Math.min(255, Math.max(15, realVal + sinePulse + Math.random() * 20));
          } else if (activeListening) {
            // Reactive mic wave
            const micPulse = Math.sin(phase * 2 + i * 0.4) * 45 + Math.cos(phase * 3 + i * 0.1) * 30;
            val = Math.min(255, Math.max(20, Math.abs(micPulse) + Math.random() * 25));
          } else if (isThinking) {
            // Smooth cybernetic pulse during reasoning
            val = Math.sin(phase * 1.2 + i * 0.25) * 35 + 40;
          } else {
            // Idle gentle floor
            val = Math.sin(phase * 0.5 + i * 0.2) * 6 + 10;
          }

          if (val > maxVal) maxVal = val;

          const barHeight = (val / 255) * (height - 8);
          const x = i * (barWidth + 2) + 1;
          const y = height - barHeight;

          // Create gradient according to state
          const grad = ctx.createLinearGradient(0, height, 0, 0);
          if (activeSpeaking) {
            grad.addColorStop(0, '#7e22ce'); // Deep purple
            grad.addColorStop(0.5, '#f59e0b'); // Warm amber
            grad.addColorStop(1, '#fde047'); // Bright yellow peak
          } else if (activeListening) {
            grad.addColorStop(0, '#1e3a8a'); // Deep blue
            grad.addColorStop(0.5, '#06b6d4'); // Cyan
            grad.addColorStop(1, '#38bdf8'); // Bright sky blue
          } else if (isThinking) {
            grad.addColorStop(0, '#4c1d95');
            grad.addColorStop(1, '#a855f7');
          } else {
            grad.addColorStop(0, 'rgba(113, 113, 122, 0.2)');
            grad.addColorStop(1, 'rgba(245, 158, 11, 0.4)');
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
          } else {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.fill();

          // Cap highlight on active
          if ((activeSpeaking || activeListening) && val > 40) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, Math.max(0, y - 2), barWidth, 2);
          }
        }
      } else {
        // Waveform mode (Oscilloscope)
        ctx.beginPath();
        ctx.lineWidth = activeSpeaking || activeListening ? 2.5 : 1.5;

        const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
        if (activeSpeaking) {
          strokeGrad.addColorStop(0, '#f59e0b');
          strokeGrad.addColorStop(0.5, '#a855f7');
          strokeGrad.addColorStop(1, '#ec4899');
        } else if (activeListening) {
          strokeGrad.addColorStop(0, '#06b6d4');
          strokeGrad.addColorStop(0.5, '#3b82f6');
          strokeGrad.addColorStop(1, '#6366f1');
        } else {
          strokeGrad.addColorStop(0, 'rgba(161, 161, 170, 0.3)');
          strokeGrad.addColorStop(1, 'rgba(245, 158, 11, 0.3)');
        }

        ctx.strokeStyle = strokeGrad;

        const sliceWidth = width / BAR_COUNT;
        let x = 0;

        for (let i = 0; i < BAR_COUNT; i++) {
          let v = 128;
          if (activeSpeaking) {
            v = 128 + Math.sin(phase * 2 + i * 0.3) * (freqData[i] || 40) * 0.4;
          } else if (activeListening) {
            v = 128 + Math.cos(phase * 3 + i * 0.4) * 45;
          } else if (isThinking) {
            v = 128 + Math.sin(phase + i * 0.2) * 15;
          } else {
            v = 128 + Math.sin(phase * 0.5 + i * 0.1) * 4;
          }

          if (v > maxVal) maxVal = v;

          const y = (v / 256) * height;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.stroke();
      }

      // Update calculated peak dB estimate
      const db = activeSpeaking || activeListening
        ? Math.round(-60 + (maxVal / 255) * 54)
        : -60;
      setPeakDb(db);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpeaking, isListening, isThinking, vizMode]);

  const activeSpeaking = isSpeaking || oracleVoiceEngine.isSpeaking();
  const activeListening = isListening;

  return (
    <div className={`p-4 rounded-xl bg-zinc-950/90 border border-amber-500/20 backdrop-blur-md shadow-xl ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          {activeSpeaking ? (
            <div className="flex items-center gap-1.5 text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span className="font-semibold tracking-wider uppercase">
                {voiceName} Speaking
              </span>
            </div>
          ) : isListening ? (
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <Mic className="w-4 h-4" />
              <span className="font-semibold tracking-wider uppercase">HoloKai Mic Active</span>
            </div>
          ) : isThinking ? (
            <div className="flex items-center gap-1.5 text-purple-400">
              <Activity className="w-4 h-4 animate-spin" />
              <span className="font-semibold tracking-wider uppercase">Synthesizing Response</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Radio className="w-3.5 h-3.5" />
              <span className="tracking-wider uppercase">Voice Stream Standby</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] ${
            activeSpeaking
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : activeListening
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-zinc-900 text-zinc-500'
          }`}>
            {peakDb > -60 ? `${peakDb} dB` : 'MUTED'}
          </span>

          <div className="flex items-center gap-1 border border-zinc-800 rounded bg-zinc-900/80 p-0.5">
            <button
              onClick={() => setVizMode('bars')}
              className={`p-1 rounded transition ${
                vizMode === 'bars' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Bar Spectrum Visualizer"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setVizMode('wave')}
              className={`p-1 rounded transition ${
                vizMode === 'wave' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Oscilloscope Wave Visualizer"
            >
              <Waves className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative w-full h-20 bg-zinc-900/60 rounded-lg overflow-hidden border border-zinc-800/80 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={360}
          height={80}
          className="w-full h-full block"
        />

        {/* Ambient Overlay Grid Lines */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px]" />
      </div>

      {/* Engine Specs */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span>TTS: HoloKai Voice Engine</span>
        <span>STT: HoloKai Voice Transcription</span>
      </div>
    </div>
  );
}
