import React, { useState, useEffect } from 'react';
import {
  Play, Square, Save, Languages,
  Bookmark, RefreshCw, Layers
} from 'lucide-react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { retroAudio } from '@/lib/audioFeedback';

const ANCIENT_SCRIPTS = [
  {
    id: 'kemet-hieroglyph',
    name: 'Kemet Hieroglyphic Scribe',
    era: '3100 BCE – 400 CE',
    region: 'Nile Valley',
    sampleText: '𓋹 𓏤 𓆣 𓏤 𓇳 𓏤 𓅓 𓏤 𓄤 𓏤',
    phonetic: 'Ankh Kheperu Ra Nefer',
    translation: 'Ever-Living Manifestation of Ra, the Sublime Sovereign',
    resonanceFreq: 432,
    glyphs: ['𓋹', '𓆣', '𓇳', '𓅓', '𓄤', '𓎛', '𓏠', '𓄿'],
  },
  {
    id: 'geez-ethiopia',
    name: 'Ge\'ez Royal Axumite Script',
    era: '1000 BCE – Present',
    region: 'Ethiopian Highlands',
    sampleText: 'ኢትዮጵያ ፡ ታበጽሕ ፡ እደዊሃ ፡ ኀበ ፡ እግዚአብሔር ፡',
    phonetic: 'Ityoppya Tabetzeh Edewiha Habe Egziabhér',
    translation: 'Ethiopia shall stretch forth her hands unto the Divine Presence',
    resonanceFreq: 528,
    glyphs: ['ሀ', 'ሁ', 'ሂ', 'ሃ', 'ሄ', 'ህ', 'ሆ', 'ለ'],
  },
  {
    id: 'tifinagh-amazigh',
    name: 'Neo-Tifinagh Saharan Matrix',
    era: '500 BCE – Present',
    region: 'Sahara & Maghreb',
    sampleText: 'ⴰⵣⵓⵍ ⴼⵍⵍⴰⵡⵏ ⴳ ⵜⴰⴳⵍⴷⵉⵜ  any ',
    phonetic: 'Azul Fellawen g Tageldit n HoloKai',
    translation: 'Peace and honor upon you in the Sovereign Realm of HoloKai',
    resonanceFreq: 639,
    glyphs: ['ⴰ', 'ⴱ', 'ⴳ', 'ⴷ', 'ⴹ', 'ⴻ', 'ⴼ', 'ⴽ'],
  },
  {
    id: 'swahili-ajami',
    name: 'Swahili Coastal Ajami Script',
    era: '10th Century CE – Present',
    region: 'Swahili Coast & Zanzibar',
    sampleText: 'Utu na Haki ni Nguzo ya Ustaarabu wa HoloKai',
    phonetic: 'Utu na Haki ni Nguzo ya Ustaarabu',
    translation: 'Humanity and Justice are the Pillars of Civilization',
    resonanceFreq: 741,
    glyphs: ['ؠ', 'ء', 'آ', 'أ', 'ڡ', 'ڢ', 'ڣ', 'ڤ'],
  },
  {
    id: 'meroitic-nubia',
    name: 'Meroitic Hieroglyphic & Cursive',
    era: '300 BCE – 400 CE',
    region: 'Kingdom of Kush (Meroë)',
    sampleText: '𐦠 𐦡 𐦢 𐦣 𐦤 𐦥 𐦦 𐦧',
    phonetic: 'Kandake Meroë Amanirenas Resonat',
    translation: 'The Warrior Queen Kandake of Meroë Reigns Eternal',
    resonanceFreq: 852,
    glyphs: ['𐦠', '𐦡', '𐦢', '𐦣', '𐦤', '𐦥', '𐦦', '𐦧'],
  }
];

export default function AncientScriptSynthesizer() {
  const [selectedScript, setSelectedScript] = useState(ANCIENT_SCRIPTS[0]);
  const [inputText, setInputText] = useState(ANCIENT_SCRIPTS[0].sampleText);
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(0.85);
  const [resonance, setResonance] = useState(432);
  const [isPlaying, setIsPlaying] = useState(false);
  const [savedCodices, setSavedCodices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore savedCodices
  useEffect(() => {
    const colRef = collection(db, 'synthesizedCodices');
    const q = query(colRef, orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setSavedCodices(fetched);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  const handleSelectScript = (script) => {
    retroAudio.playClick();
    setSelectedScript(script);
    setInputText(script.sampleText);
    setResonance(script.resonanceFreq);
  };

  const handleAppendGlyph = (glyph) => {
    retroAudio.playClick();
    setInputText((prev) => prev + ' ' + glyph);
  };

  const handleSynthesizeAudio = () => {
    retroAudio.playClick();
    setIsPlaying(true);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedScript.phonetic || inputText);
      utterance.pitch = pitch;
      utterance.rate = speed;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  const handleStopAudio = () => {
    retroAudio.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleSaveToFirestore = async () => {
    if (!inputText.trim()) return;
    retroAudio.playClick();

    try {
      await addDoc(collection(db, 'synthesizedCodices'), {
        scriptId: selectedScript.id,
        scriptName: selectedScript.name,
        text: inputText,
        phonetic: selectedScript.phonetic,
        translation: selectedScript.translation,
        resonanceFreq: resonance,
        pitch,
        speed,
        userId: auth.currentUser?.uid || 'guest_vocalist',
        authorName: auth.currentUser?.displayName || 'Master Vocal Archivist',
        createdAt: serverTimestamp(),
      });
      retroAudio.playSuccessChime();
    } catch (err) {
      console.error('Error saving codex:', err);
    }
  };

  const handleDeleteCodex = async (id) => {
    retroAudio.playClick();
    try {
      await deleteDoc(doc(db, 'synthesizedCodices', id));
    } catch (err) {
      console.error('Error deleting codex:', err);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              <span>Acoustic Phonetic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Ancient Script & Voice Synthesizer
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Render sacred hieroglyphic glyphs, Ge'ez royal decrees, and Swahili Ajami manuscripts into acoustic vocalizations and harmonic frequency resonances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveToFirestore}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition"
            >
              <Save className="w-4 h-4" />
              <span>Archive Codex to Firestore</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SYNTHESIZER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCRIPT SELECTOR */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Select Ancient Script Matrix</span>
          </h3>

          <div className="space-y-2">
            {ANCIENT_SCRIPTS.map((script) => (
              <div
                key={script.id}
                onClick={() => handleSelectScript(script)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                  selectedScript.id === script.id
                    ? 'border-amber-500 bg-amber-500/15 shadow-lg'
                    : 'border-white/10 bg-zinc-950/80 hover:border-amber-500/40 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-serif font-bold text-amber-200">{script.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-amber-400/80 border border-amber-500/20">
                    {script.resonanceFreq} Hz
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{script.era}</span>
                  <span>{script.region}</span>
                </div>
                <div className="text-lg font-serif text-amber-400/90 pt-1 line-clamp-1">
                  {script.sampleText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ACOUSTIC CONTROL & GLYPH PAD */}
        <div className="lg:col-span-8 space-y-6">
          {/* CONTROL PANEL */}
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-zinc-950/90 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Active Vocalization
                </span>
                <h2 className="text-xl font-serif font-bold text-white">{selectedScript.name}</h2>
              </div>

              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <button
                    onClick={handleStopAudio}
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Halt Acoustic Loop</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSynthesizeAudio}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  >
                    <Play className="w-4 h-4 fill-zinc-950" />
                    <span>Synthesize Voice & Harmonic</span>
                  </button>
                )}
              </div>
            </div>

            {/* INPUT & DISPLAY CANVAS */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 block">Interactive Glyph Canvas & Text</label>
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-zinc-900 border border-white/10 text-lg font-serif text-amber-300 focus:outline-none focus:border-amber-500 shadow-inner"
              />
            </div>

            {/* GLYPH SHORTCUT PAD */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 block">Quick Glyph Inscription Pad</span>
              <div className="flex flex-wrap gap-2">
                {selectedScript.glyphs.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAppendGlyph(g)}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-500/60 hover:bg-amber-500/10 text-xl font-serif text-amber-300 flex items-center justify-center transition"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* SLIDERS & PARAMETERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Resonance Frequency</span>
                  <span className="text-amber-400">{resonance} Hz</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="963"
                  value={resonance}
                  onChange={(e) => setResonance(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Pitch Shift</span>
                  <span className="text-amber-400">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => setPitch(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Vocal Speed</span>
                  <span className="text-amber-400">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.5"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* FIRESTORE SAVED CODICES */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Archived Vocal Codices ({savedCodices.length})</span>
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>Loading Archived Codices...</span>
              </div>
            ) : savedCodices.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs text-zinc-400 font-mono">
                No archived vocal codices saved yet. Click "Archive Codex to Firestore" above to save entries!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedCodices.map((codex) => (
                  <div
                    key={codex.id}
                    className="p-4 rounded-2xl border border-white/10 bg-zinc-950/80 hover:border-amber-500/40 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-amber-300">
                          {codex.scriptName}
                        </span>
                        <span className="text-[10px] font-mono text-amber-400/80">
                          {codex.resonanceFreq} Hz
                        </span>
                      </div>
                      <p className="text-base font-serif text-zinc-200 line-clamp-2">{codex.text}</p>
                      {codex.phonetic && (
                        <p className="text-xs font-mono text-zinc-400 italic">{codex.phonetic}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>By: {codex.authorName || 'Archivist'}</span>
                      <button
                        onClick={() => handleDeleteCodex(codex.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
