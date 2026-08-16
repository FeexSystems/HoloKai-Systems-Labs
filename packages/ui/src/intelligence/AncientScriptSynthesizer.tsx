import React from 'react';
import {
  Play, Square, Save, Languages,
  Bookmark, RefreshCw, Layers
} from 'lucide-react';

export interface ScriptModel {
  id: string;
  name: string;
  era: string;
  region: string;
  sampleText: string;
  phonetic: string;
  translation: string;
  resonanceFreq: number;
  glyphs: string[];
}

export const ANCIENT_SCRIPTS: ScriptModel[] = [
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

export interface SavedCodex {
  id: string;
  scriptName: string;
  resonanceFreq: number;
  text: string;
  phonetic?: string;
  authorName?: string;
}

export interface AncientScriptSynthesizerProps {
  scripts?: ScriptModel[];
  selectedScript: ScriptModel;
  inputText: string;
  pitch: number;
  speed: number;
  resonance: number;
  isPlaying: boolean;
  savedCodices: SavedCodex[];
  loading: boolean;
  onSelectScript: (script: ScriptModel) => void;
  onInputTextChange: (text: string) => void;
  onPitchChange: (pitch: number) => void;
  onSpeedChange: (speed: number) => void;
  onResonanceChange: (resonance: number) => void;
  onAppendGlyph: (glyph: string) => void;
  onSynthesizeAudio: () => void;
  onStopAudio: () => void;
  onSaveCodex: () => void;
  onDeleteCodex: (id: string) => void;
}

export function AncientScriptSynthesizer({
  scripts = ANCIENT_SCRIPTS,
  selectedScript,
  inputText,
  pitch,
  speed,
  resonance,
  isPlaying,
  savedCodices,
  loading,
  onSelectScript,
  onInputTextChange,
  onPitchChange,
  onSpeedChange,
  onResonanceChange,
  onAppendGlyph,
  onSynthesizeAudio,
  onStopAudio,
  onSaveCodex,
  onDeleteCodex
}: AncientScriptSynthesizerProps) {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-thin pb-28 max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl border border-brand/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[var(--pui-forest-deep)]/40 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/40 bg-brand/10 text-brand text-xs font-mono font-bold tracking-wider uppercase">
              <Languages className="w-3.5 h-3.5 text-brand" />
              <span>Acoustic Phonetic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
              Ancient Script & Voice Synthesizer
            </h1>
            <p className="text-sm text-muted leading-relaxed font-sans">
              Render sacred hieroglyphic glyphs, Ge'ez royal decrees, and Swahili Ajami manuscripts into acoustic vocalizations and harmonic frequency resonances.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSaveCodex}
              className="px-4 py-2.5 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition"
            >
              <Save className="w-4 h-4" />
              <span>Archive Codex</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN SYNTHESIZER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: SCRIPT SELECTOR */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-bold text-brand uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Select Ancient Script Matrix</span>
          </h3>

          <div className="space-y-2">
            {scripts.map((script) => (
              <button
                type="button"
                key={script.id}
                onClick={() => onSelectScript(script)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                  selectedScript.id === script.id
                    ? 'border-brand bg-brand/15 shadow-lg'
                    : 'border-border-subtle bg-background/80 hover:border-brand/40 hover:bg-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-serif font-bold text-brand">{script.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface text-brand/80 border border-brand/20">
                    {script.resonanceFreq} Hz
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span>{script.era}</span>
                  <span>{script.region}</span>
                </div>
                <div className="text-lg font-serif text-brand/90 pt-1 line-clamp-1">
                  {script.sampleText}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: ACOUSTIC CONTROL & GLYPH PAD */}
        <div className="lg:col-span-8 space-y-6">
          {/* CONTROL PANEL */}
          <div className="p-6 rounded-3xl border border-brand/30 bg-background/90 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <div className="space-y-0.5">
                <span className="text-xs font-mono text-brand uppercase tracking-wider">
                  Active Vocalization
                </span>
                <h2 className="text-xl font-serif font-bold text-foreground">{selectedScript.name}</h2>
              </div>

              <div className="flex items-center gap-3">
                {isPlaying ? (
                  <button
                    onClick={onStopAudio}
                    className="px-5 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-foreground font-mono font-bold text-xs flex items-center gap-2 shadow-lg"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Halt Acoustic Loop</span>
                  </button>
                ) : (
                  <button
                    onClick={onSynthesizeAudio}
                    className="px-5 py-2.5 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                  >
                    <Play className="w-4 h-4 fill-zinc-950" />
                    <span>Synthesize Voice & Harmonic</span>
                  </button>
                )}
              </div>
            </div>

            {/* INPUT & DISPLAY CANVAS */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted block">Interactive Glyph Canvas & Text</label>
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => onInputTextChange(e.target.value)}
                className="w-full p-4 rounded-2xl bg-surface border border-border-subtle text-lg font-serif text-brand focus:outline-none focus:border-brand shadow-inner"
              />
            </div>

            {/* GLYPH SHORTCUT PAD */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-muted block">Quick Glyph Inscription Pad</span>
              <div className="flex flex-wrap gap-2">
                {selectedScript.glyphs.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => onAppendGlyph(g)}
                    className="w-10 h-10 rounded-xl bg-surface border border-border-subtle hover:border-brand/60 hover:bg-brand/10 text-xl font-serif text-brand flex items-center justify-center transition"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* SLIDERS & PARAMETERS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border-subtle">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Resonance Frequency</span>
                  <span className="text-brand">{resonance} Hz</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="963"
                  value={resonance}
                  onChange={(e) => onResonanceChange(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Pitch Shift</span>
                  <span className="text-brand">{pitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.8"
                  step="0.05"
                  value={pitch}
                  onChange={(e) => onPitchChange(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-muted">
                  <span>Vocal Speed</span>
                  <span className="text-brand">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="1.5"
                  step="0.05"
                  value={speed}
                  onChange={(e) => onSpeedChange(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SAVED CODICES */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-brand uppercase tracking-wider flex items-center gap-2">
              <Bookmark className="w-4 h-4" />
              <span>Archived Vocal Codices ({savedCodices.length})</span>
            </h3>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-muted flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-brand" />
                <span>Loading Archived Codices...</span>
              </div>
            ) : savedCodices.length === 0 ? (
              <div className="p-6 rounded-2xl border border-dashed border-border-subtle text-center text-xs text-muted font-mono">
                No archived vocal codices saved yet. Archive a codex to see it here!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedCodices.map((codex) => (
                  <div
                    key={codex.id}
                    className="p-4 rounded-2xl border border-border-subtle bg-background/80 hover:border-brand/40 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-serif font-bold text-brand">
                          {codex.scriptName}
                        </span>
                        <span className="text-[10px] font-mono text-brand/80">
                          {codex.resonanceFreq} Hz
                        </span>
                      </div>
                      <p className="text-base font-serif text-zinc-200 line-clamp-2">{codex.text}</p>
                      {codex.phonetic && (
                        <p className="text-xs font-mono text-muted italic">{codex.phonetic}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[10px] font-mono text-muted">
                      <span>By: {codex.authorName || 'Archivist'}</span>
                      <button
                        onClick={() => onDeleteCodex(codex.id)}
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
