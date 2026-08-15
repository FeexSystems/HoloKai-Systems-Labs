import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Clock, Radio } from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { MOCK_ORAL_TRADITIONS } from '@/lib/mockData';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

const TRANSCRIPT_LINES = [
  'In the time before memory, when the rivers ran differently...',
  'The ancestors gathered beneath the great baobab tree.',
  'They spoke of the kingdom that stretched from the mountains to the sea.',
  'The queen mother arose, and she said: I am the keeper of the line.',
  'And the people answered: Your word is the path.',
  'So began the dynasty that would last a hundred seasons.',
  'The griots carry this memory still, from mouth to ear to mouth.',
  'This is how we remember. This is how civilization endures.',
];

export default function OralTraditionExplorer() {
  const { activeGuardian } = useHoloKai();
  const [selected, setSelected] = useState(MOCK_ORAL_TRADITIONS[0]);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const progressRef = useRef(null);
  const speakTimeoutRef = useRef(null);

  // Stop voice + clear timers when selection changes or unmounts
  const stopAll = useCallback(() => {
    oracleVoiceEngine.stopSpeaking();
    setPlaying(false);
    setIsSpeaking(false);
    if (progressRef.current) clearInterval(progressRef.current);
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current);
    setProgress(0);
  }, []);

  useEffect(() => stopAll, [stopAll]); // cleanup on unmount

  const selectTradition = (t) => {
    stopAll();
    setSelected(t);
  };

  const handlePlayPause = async () => {
    if (playing) {
      stopAll();
      return;
    }

    setPlaying(true);
    setProgress(0);

    // Speak the full tradition narrative (title + transcript joined)
    const narrativeText = `${selected.title}. From ${selected.region}. Narrated in ${selected.language}. ${TRANSCRIPT_LINES.join(' ')}`;

    try {
      setIsSpeaking(true);
      await oracleVoiceEngine.speakResponse(narrativeText, {
        rate: 0.88,
        pitch: 0.82,
      });
    } catch {
      // fallback silent — progress bar continues
    } finally {
      setIsSpeaking(false);
      setPlaying(false);
      setProgress(0);
    }

    // Animate progress in sync with estimated speech duration (~30s)
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressRef.current);
          return 100;
        }
        return p + (100 / (30 * 3.33));
      });
    }, 300);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(200,149,42,0.1)' }}>
        <h2 className="text-lg font-display font-semibold tracking-wide text-white">Oral Tradition Explorer</h2>
        <p className="text-xs text-white/40 mt-0.5">Oral histories with synchronized voice narration</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="w-72 flex-shrink-0 border-r overflow-y-auto scrollbar-thin" style={{ borderColor: 'rgba(200,149,42,0.1)' }}>
          {MOCK_ORAL_TRADITIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTradition(t)}
              className="w-full text-left px-4 py-3 border-b transition-all"
              style={{
                borderColor: 'rgba(200,149,42,0.05)',
                background: selected.id === t.id ? `${activeGuardian.accentColor}10` : 'transparent',
                borderLeft: `2px solid ${selected.id === t.id ? activeGuardian.accentColor : 'transparent'}`,
              }}
            >
              <p className="text-sm font-medium text-white/80 line-clamp-2">{t.title}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[9px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded" style={{ background: `${activeGuardian.accentColor}12`, color: activeGuardian.accentColor }}>
                  {t.theme}
                </span>
                <span className="text-[9px] text-white/30 font-mono flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {t.duration}
                </span>
              </div>
              <p className="text-[10px] text-white/30 mt-1">{t.region} · {t.language}</p>
            </button>
          ))}
        </div>

        {/* Player + transcript */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4">
            <h3 className="text-base font-display font-semibold text-white">{selected.title}</h3>
            <p className="text-xs text-white/40 mt-1">
              {selected.region} · {selected.language} · Narrated by {selected.narrator}
            </p>
          </div>

          {/* Player */}
          <div className="mx-6 mb-4 rounded-xl p-4 border" style={{ background: 'rgba(10,10,14,0.88)', borderColor: 'rgba(200,149,42,0.12)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePlayPause}
                aria-label={playing ? 'Pause narration' : 'Play narration'}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: `linear-gradient(135deg, ${activeGuardian.accentColor}, ${activeGuardian.accentColor}88)`,
                  boxShadow: `0 0 20px ${activeGuardian.accentGlow}`,
                }}
              >
                {playing ? (
                  <Pause className="w-5 h-5 text-black" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                )}
              </button>

              <div className="flex-1">
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: `linear-gradient(90deg, ${activeGuardian.accentColor}, ${activeGuardian.accentColor}88)`,
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] font-mono text-white/40">
                    {Math.floor((progress / 100) * 30)}s
                  </span>
                  <span className="text-[10px] font-mono text-white/40">{selected.duration}</span>
                </div>
              </div>

              {playing ? (
                <button onClick={stopAll} title="Stop narration" className="p-1 rounded text-white/30 hover:text-red-400 transition">
                  <VolumeX className="w-5 h-5" />
                </button>
              ) : (
                <Volume2 className="w-5 h-5 text-white/30" />
              )}
            </div>

            {/* Voice status indicator */}
            {isSpeaking && (
              <div className="mt-3 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: activeGuardian.accentColor }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: activeGuardian.accentColor }} />
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase" style={{ color: activeGuardian.accentColor }}>
                  HoloKai Voice · Narrating
                </span>
              </div>
            )}
            {playing && !isSpeaking && (
              <div className="mt-3 flex items-center gap-2 text-white/30">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] font-mono tracking-wider uppercase">Initializing Voice…</span>
              </div>
            )}
          </div>

          {/* Synchronized transcript */}
          <div className="flex-1 overflow-y-auto scrollbar-thin px-6 pb-6">
            <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/30 mb-3">Transcript</p>
            <div className="space-y-3">
              {TRANSCRIPT_LINES.map((line, i) => {
                const isActive = playing && Math.floor((progress / 100) * TRANSCRIPT_LINES.length) === i;
                return (
                  <p
                    key={i}
                    className="text-sm leading-relaxed transition-all duration-300"
                    style={{
                      color: isActive ? activeGuardian.accentColor : 'rgba(255,255,255,0.5)',
                      fontWeight: isActive ? 500 : 400,
                      paddingLeft: isActive ? '12px' : '0',
                      borderLeft: isActive ? `2px solid ${activeGuardian.accentColor}` : '2px solid transparent',
                    }}
                  >
                    {isActive && '[▶] '}
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}