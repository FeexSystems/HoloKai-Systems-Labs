import React, { useState } from 'react';
import { Volume2, Languages } from 'lucide-react';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';

interface LangItem {
  code: string;
  name: string;
  script: string;
  greeting: string;
  sampleAudioText: string;
}

const HERITAGE_LANGUAGES: LangItem[] = [
  { code: 'sw', name: 'Swahili (Kiswahili)', script: 'Latin / Ge\'ez', greeting: 'Jambo na Karibu', sampleAudioText: 'Karibu HoloKai Oracle, chemchemi ya hekima na historia.' },
  { code: 'yo', name: 'Yoruba (Èdè Yorùbá)', script: 'Latin / Odù', greeting: 'Ẹ kàábọ̀ sí HoloKai', sampleAudioText: 'Ẹ kàábọ̀ sí HoloKai Oracle, ibi ààbò ọgbọ́n àti ìtàn àtijọ́.' },
  { code: 'am', name: 'Amharic (አማርኛ)', script: 'Ge\'ez (ፊደል)', greeting: 'እንኳን ወደ ሆሎካይ መጡ', sampleAudioText: 'እንኳን ወደ ሆሎካይ ኦራክል በደህና መጡ፣ የታሪክ እና የጥበብ መዝገብ።' },
  { code: 'ak', name: 'Akan / Twi', script: 'Latin / Adinkra', greeting: 'Akwaaba ba HoloKai', sampleAudioText: 'Akwaaba ba HoloKai Oracle, nyansa ne abakɔssem fie.' }
];

export function LanguageScriptSelector() {
  const [selectedLang, setSelectedLang] = useState<LangItem>(HERITAGE_LANGUAGES[0]);

  const playAudioSample = (lang: LangItem) => {
    oracleVoiceEngine.speakResponse(lang.sampleAudioText, { rate: 0.9 });
  };

  return (
    <div className="w-full my-8 p-6 rounded-none bg-zinc-950/80 border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-none bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Languages className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-light text-zinc-100 flex items-center gap-3 tracking-wide">
              Heritage Language & Script Selector
              <span className="text-[9px] px-2.5 py-0.5 rounded-none bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono tracking-[0.2em]">
                MULTILINGUAL AI
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-0.5">Explore African indigenous languages and script systems</p>
          </div>
        </div>
      </div>

      {/* Language Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {HERITAGE_LANGUAGES.map((lang) => {
          const isSelected = selectedLang.code === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => {
                setSelectedLang(lang);
                playAudioSample(lang);
              }}
              className={`p-3.5 rounded-none border text-left transition-all duration-300 ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/70 text-amber-200 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-[#020202]/80 border-amber-900/40 text-zinc-400 hover:text-zinc-200 hover:border-amber-500/30'
              }`}
            >
              <span className="text-xs font-display font-bold text-zinc-200 block mb-0.5 tracking-wide">{lang.name}</span>
              <span className="text-[10px] font-mono text-amber-400 block tracking-wider">{lang.script}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Audio Greeting Box */}
      <div className="p-4 rounded-none bg-[#020202]/90 border border-amber-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-zinc-500 text-[10px] uppercase font-mono block mb-1 tracking-wider">INDIGENOUS GREETING:</span>
          <p className="text-amber-300 font-display font-bold text-sm tracking-wide">{selectedLang.greeting}</p>
        </div>

        <button
          onClick={() => playAudioSample(selectedLang)}
          className="flex items-center gap-2 px-4 py-2 rounded-none bg-amber-500/10 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 font-mono text-xs tracking-wider transition duration-300"
        >
          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          LISTEN AUDIO SAMPLE
        </button>
      </div>
    </div>
  );
}
