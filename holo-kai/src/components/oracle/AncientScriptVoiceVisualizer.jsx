import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { Mic, Activity, Zap } from 'lucide-react';

/**
 * Ancient Script Pan-African Voice-to-Text Visualizer.
 * Connects to Web Audio API AnalyserNode to capture real-time voice pitch and intensity.
 * Uses D3.js and Framer Motion to render dynamic radial frequency rings and floating
 * ancient Pan-African script glyphs (Ge'ez, Hieroglyphs, Tifinagh, Adinkra motifs).
 */

const ANCIENT_GLYPHS = [
  { symbol: '𓋹', name: 'Ankh', era: 'Kemet', meaning: 'Eternal Life' },
  { symbol: '𓆣', name: 'Kheper', era: 'Kemet', meaning: 'Transformation' },
  { symbol: '𓇳', name: 'Ra', era: 'Kemet', meaning: 'Solar Light' },
  { symbol: 'ሀ', name: 'Hä', era: 'Aksum', meaning: 'Ge\'ez Creation' },
  { symbol: '𞸀', name: 'Alef', era: 'Musnad', meaning: 'Ancient Origin' },
  { symbol: 'ⴀ', name: 'Ya', era: 'Tifinagh', meaning: 'Amazigh Freedom' },
  { symbol: 'ⴅ', name: 'Yakh', era: 'Tifinagh', meaning: 'Highland Sanctuary' },
  { symbol: '𓅓', name: 'Owl', era: 'Kemet', meaning: 'Wisdom & Knowledge' },
  { symbol: '𓈖', name: 'Water', era: 'Kemet', meaning: 'Primeval Waters' },
  { symbol: '☥', name: 'Sacred Loop', era: 'Sahel', meaning: 'Cosmic Unity' },
  { symbol: '✺', name: 'Sankofa', era: 'Sahel', meaning: 'Learn From Past' },
  { symbol: '✦', name: 'Gye Nyame', era: 'Ashanti', meaning: 'Supreme Sovereignty' }
];

export default function AncientScriptVoiceVisualizer({
  audioStream = null,
  isListening = false,
  activeTranscript = '',
  accentColor = '#E6B865',
  className = ''
}) {
  const svgRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  const [intensity, setIntensity] = useState(0); // 0 to 1
  const [pitchHz, setPitchHz] = useState(0); // Hz estimate
  const [pitchRegister, setPitchRegister] = useState('Silent');
  const [floatingParticles, setFloatingParticles] = useState([]);

  // Setup Web Audio API AnalyserNode when stream changes
  useEffect(() => {
    if (!isListening || !audioStream) {
      setIntensity(0);
      setPitchHz(0);
      setPitchRegister('Silent');
      return;
    }

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaStreamSource(audioStream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAudioMetrics = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // 1. Calculate RMS Intensity (0 to 1)
        let sum = 0;
        let maxVal = 0;
        let maxBin = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const val = dataArray[i];
          sum += val * val;
          if (val > maxVal) {
            maxVal = val;
            maxBin = i;
          }
        }

        const rms = Math.sqrt(sum / dataArray.length);
        const normIntensity = Math.min(1, Math.max(0, (rms - 5) / 120));
        setIntensity(normIntensity);

        // 2. Dominant Frequency (Pitch estimate in Hz)
        const nyquist = ctx.sampleRate / 2;
        const binHz = nyquist / dataArray.length;
        const estHz = Math.round(maxBin * binHz);

        if (normIntensity > 0.05) {
          setPitchHz(estHz);
          if (estHz < 180) setPitchRegister('Deep Resonance');
          else if (estHz < 400) setPitchRegister('Harmonic Mid');
          else setPitchRegister('High Frequency');

          // Trigger floating glyph particle on voice surge
          if (normIntensity > 0.35 && Math.random() < 0.25) {
            spawnGlyphParticle(normIntensity, estHz);
          }
        } else {
          setPitchRegister('Quiet');
        }

        // 3. Render D3 Radial Frequency Ring
        renderD3RadialRing(dataArray, normIntensity, estHz);

        animFrameRef.current = requestAnimationFrame(updateAudioMetrics);
      };

      updateAudioMetrics();
    } catch (err) {
      console.warn('Audio analyzer init notice:', err);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, [audioStream, isListening]);

  // Fallback synthetic animation if browser doesn't expose audioStream directly
  useEffect(() => {
    if (isListening && !audioStream) {
      const interval = setInterval(() => {
        const synthIntensity = 0.2 + Math.random() * 0.6;
        const synthPitch = 150 + Math.floor(Math.random() * 300);
        setIntensity(synthIntensity);
        setPitchHz(synthPitch);
        setPitchRegister(synthPitch < 250 ? 'Deep Resonance' : 'Harmonic Mid');

        // Generate synthetic D3 radial data
        const synthData = new Uint8Array(64).map(() => Math.floor(Math.random() * synthIntensity * 200));
        renderD3RadialRing(synthData, synthIntensity, synthPitch);

        if (Math.random() < 0.3) {
          spawnGlyphParticle(synthIntensity, synthPitch);
        }
      }, 120);

      return () => clearInterval(interval);
    }
  }, [isListening, audioStream]);

  const spawnGlyphParticle = (vol, pitch) => {
    const glyphObj = ANCIENT_GLYPHS[Math.floor(Math.random() * ANCIENT_GLYPHS.length)];
    const id = Date.now() + Math.random();
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + vol * 70;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    setFloatingParticles(prev => [
      ...prev.slice(-12),
      {
        id,
        glyph: glyphObj.symbol,
        name: glyphObj.name,
        meaning: glyphObj.meaning,
        x,
        y,
        scale: 0.8 + vol * 0.8,
        color: pitch < 200 ? '#F59E0B' : pitch < 400 ? '#10B981' : '#E6B865'
      }
    ]);
  };

  // D3 Radial Ring Renderer
  const renderD3RadialRing = (freqData, vol, pitch) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const width = 280;
    const height = 280;
    const radius = 80;

    svg.selectAll('*').remove();

    const g = svg.append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const pointsCount = Math.min(64, freqData.length);
    const angleScale = d3.scaleLinear()
      .domain([0, pointsCount])
      .range([0, Math.PI * 2]);

    const radialData = Array.from({ length: pointsCount }).map((_, i) => {
      const val = freqData[i] || 0;
      const rOffset = (val / 255) * (30 + vol * 50);
      return {
        angle: angleScale(i),
        r: radius + rOffset
      };
    });
    // Close radial loop
    radialData.push(radialData[0]);

    const lineRadial = d3.lineRadial()
      .angle(d => d.angle)
      .radius(d => d.r)
      .curve(d3.curveCardinalClosed.tension(0.7));

    // Outer Glowing Frequency Wave Path
    g.append('path')
      .datum(radialData)
      .attr('d', lineRadial)
      .attr('fill', 'none')
      .attr('stroke', accentColor)
      .attr('stroke-width', 2 + vol * 3)
      .attr('stroke-opacity', 0.8)
      .style('filter', `drop-shadow(0 0 ${8 + vol * 12}px ${accentColor})`);

    // Inner Concentric D3 Ring Nodes
    g.selectAll('.node')
      .data(radialData.filter((_, idx) => idx % 4 === 0))
      .enter()
      .append('circle')
      .attr('cx', d => Math.cos(d.angle - Math.PI / 2) * d.r)
      .attr('cy', d => Math.sin(d.angle - Math.PI / 2) * d.r)
      .attr('r', 2 + vol * 3)
      .attr('fill', accentColor)
      .attr('opacity', 0.9);
  };

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 ${className}`}>
      {/* Central D3 Radial Visualizer Canvas Container */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Background Ambient Glow */}
        <div
          className="absolute inset-0 rounded-full blur-3xl transition-all duration-300 pointer-events-none"
          style={{
            backgroundColor: accentColor,
            opacity: 0.15 + intensity * 0.35,
            transform: `scale(${0.9 + intensity * 0.4})`
          }}
        />

        {/* D3 SVG Canvas */}
        <svg
          ref={svgRef}
          width={280}
          height={280}
          className="absolute inset-0 z-10 pointer-events-none"
        />

        {/* Central Core Artifact Orb */}
        <motion.div
          animate={{
            scale: 1 + intensity * 0.25,
            rotate: isListening ? [0, 90, 180, 360] : 0
          }}
          transition={{
            rotate: { duration: 12, repeat: Infinity, ease: 'linear' },
            scale: { duration: 0.1 }
          }}
          className="relative z-20 w-32 h-32 rounded-full border border-amber-500/40 bg-zinc-950/90 shadow-2xl backdrop-blur-md flex flex-col items-center justify-center text-center p-2 border-dashed"
          style={{
            borderColor: accentColor,
            boxShadow: `0 0 ${20 + intensity * 40}px ${accentColor}66`
          }}
        >
          {isListening ? (
            <div className="space-y-1">
              <Activity className="w-6 h-6 mx-auto animate-pulse text-amber-400" />
              <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-widest block">
                VOICE RESONANCE
              </span>
              <span className="text-xs font-mono text-zinc-300 font-semibold block">
                {pitchHz > 0 ? `${pitchHz} Hz` : 'Listening...'}
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <Mic className="w-6 h-6 mx-auto text-zinc-500" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                STANDBY
              </span>
            </div>
          )}
        </motion.div>

        {/* Floating Ancient Pan-African Script Glyphs */}
        <AnimatePresence>
          {floatingParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0.8, 0],
                scale: [0.5, p.scale, p.scale * 1.2],
                x: p.x,
                y: p.y - 30
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: 'easeOut' }}
              className="absolute z-30 pointer-events-none font-serif flex flex-col items-center"
              style={{ color: p.color }}
            >
              <span className="text-2xl sm:text-3xl font-bold drop-shadow-[0_0_10px_rgba(230,184,101,0.8)]">
                {p.glyph}
              </span>
              <span className="text-[9px] font-mono bg-zinc-950/80 px-1.5 py-0.5 rounded border border-white/10 text-amber-200 mt-0.5 whitespace-nowrap">
                {p.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Voice Metrics & Pitch Indicator Bar */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 w-full max-w-xs bg-zinc-950/80 border border-amber-500/30 rounded-xl p-2.5 backdrop-blur-md space-y-2 text-xs font-mono"
        >
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Pitch Register
            </span>
            <span className="text-amber-300 font-bold uppercase">{pitchRegister}</span>
          </div>

          {/* Intensity Meter Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>Voice Intensity</span>
              <span>{Math.round(intensity * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-400 transition-all duration-75 rounded-full"
                style={{ width: `${Math.max(5, intensity * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
