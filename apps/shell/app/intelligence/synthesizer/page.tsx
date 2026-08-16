"use client";

import React, { useState, useEffect } from 'react';
import { AncientScriptSynthesizer, ScriptModel, SavedCodex, ANCIENT_SCRIPTS } from '@holokai/ui';

export default function AncientScriptSynthesizerPage() {
  const [selectedScript, setSelectedScript] = useState<ScriptModel>(ANCIENT_SCRIPTS[0]);
  const [inputText, setInputText] = useState(ANCIENT_SCRIPTS[0].sampleText);
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [resonance, setResonance] = useState(ANCIENT_SCRIPTS[0].resonanceFreq);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedCodices, setSavedCodices] = useState<SavedCodex[]>([]);

  useEffect(() => {
    // Load mock codices
    const loadCodices = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setSavedCodices([
        {
          id: 'codex_1',
          scriptName: 'Kemet Hieroglyphic Scribe',
          resonanceFreq: 432,
          text: '𓋹 𓏤 𓆣 𓏤 𓇳 𓏤 𓅓 𓏤 𓄤 𓏤',
          phonetic: 'Ankh Kheperu Ra Nefer',
          authorName: 'HoloKai System',
        }
      ]);
      setLoading(false);
    };
    loadCodices();
  }, []);

  const handleSelectScript = (script: ScriptModel) => {
    setSelectedScript(script);
    setInputText(script.sampleText);
    setResonance(script.resonanceFreq);
    setIsPlaying(false);
  };

  const handleAppendGlyph = (glyph: string) => {
    setInputText(prev => prev + glyph);
  };

  const handleSynthesizeAudio = () => {
    setIsPlaying(true);
    // Simulate playing audio for 3 seconds then stopping
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const handleStopAudio = () => {
    setIsPlaying(false);
  };

  const handleSaveCodex = async () => {
    const newCodex: SavedCodex = {
      id: `codex_${Date.now()}`,
      scriptName: selectedScript.name,
      resonanceFreq: resonance,
      text: inputText,
      authorName: 'Current User',
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    setSavedCodices(prev => [newCodex, ...prev]);
  };

  const handleDeleteCodex = (id: string) => {
    setSavedCodices(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-black">
      <AncientScriptSynthesizer
        scripts={ANCIENT_SCRIPTS}
        selectedScript={selectedScript}
        inputText={inputText}
        pitch={pitch}
        speed={speed}
        resonance={resonance}
        isPlaying={isPlaying}
        savedCodices={savedCodices}
        loading={loading}
        onSelectScript={handleSelectScript}
        onInputTextChange={setInputText}
        onPitchChange={setPitch}
        onSpeedChange={setSpeed}
        onResonanceChange={setResonance}
        onAppendGlyph={handleAppendGlyph}
        onSynthesizeAudio={handleSynthesizeAudio}
        onStopAudio={handleStopAudio}
        onSaveCodex={handleSaveCodex}
        onDeleteCodex={handleDeleteCodex}
      />
    </div>
  );
}
