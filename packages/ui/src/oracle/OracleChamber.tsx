'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OracleQueryResponse, EpistemicStance } from '@holokai/contracts';
import { EpistemicBadge } from '../epistemology/EpistemicBadge';
import { EvidenceMatrix } from '../epistemology/EvidenceMatrix';
import { ancientEpistemicTransition, holokaiVariants } from '../motion/profiles';
import { KnowledgeParticleField } from './KnowledgeParticleField';

export interface OracleChamberProps {
  onQuerySubmit?: (prompt: string) => Promise<void>;
  initialResponse?: OracleQueryResponse | null;
  loading?: boolean;
  className?: string;
}

function FormattedMarkdown({ content }: { content: string }) {
  const paragraphs = content.split('\n\n');

  return (
    <div className="space-y-4 text-base md:text-lg text-zinc-100 font-light leading-relaxed">
      {paragraphs.map((p, idx) => {
        if (p.startsWith('### ')) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, ...ancientEpistemicTransition }}
            >
              <h3 className="text-xl font-extrabold text-[var(--color-brand)] font-mono pt-2">
                {p.replace('### ', '')}
              </h3>
            </motion.div>
          );
        }
        if (p.startsWith('## ')) {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, ...ancientEpistemicTransition }}
            >
              <h2 className="text-2xl font-extrabold text-[var(--color-brand)] font-mono pt-2">
                {p.replace('## ', '')}
              </h2>
            </motion.div>
          );
        }
        if (p.startsWith('- ') || p.startsWith('* ')) {
          const items = p.split('\n');
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, ...ancientEpistemicTransition }}
            >
              <ul className="list-disc list-inside space-y-1 text-zinc-200 font-sans">
                {items.map((item, itemIdx) => (
                  <li key={itemIdx}>{item.replace(/^[-*]\s+/, '')}</li>
                ))}
              </ul>
            </motion.div>
          );
        }

        const parts = p.split(/(\*\*.*?\*\*)/g);
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, ...ancientEpistemicTransition }}
          >
            <p>
              {parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={partIdx} className="font-bold text-[var(--color-brand)]">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              })}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

function StreamingMarkdown({ content }: { content: string }) {
  const [displayedContent, setDisplayedContent] = useState('');
  
  React.useEffect(() => {
    setDisplayedContent('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i += 3;
      if (i > content.length + 3) clearInterval(interval);
    }, 10);
    return () => clearInterval(interval);
  }, [content]);

  return <FormattedMarkdown content={displayedContent} />;
}

export function OracleChamber({
  onQuerySubmit,
  initialResponse,
  loading = false,
  className = '',
}: OracleChamberProps) {
  const [prompt, setPrompt] = useState('Analyze the astronomical alignment of Nabta Playa and the Sankore manuscripts.');
  const [isListening, setIsListening] = useState(false);
  const [audioBars, setAudioBars] = useState<number[]>(Array(15).fill(10));

  React.useEffect(() => {
    if (!isListening) return;
    const interval = setInterval(() => {
      setAudioBars(Array(15).fill(0).map(() => Math.random() * 100));
    }, 100);
    
    // Auto-stop listening after 3 seconds for demo purposes
    const timeout = setTimeout(() => {
      setIsListening(false);
      setPrompt("What is the significance of the Golden Stool of the Asante Empire?");
    }, 3000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isListening]);

  const [response, setResponse] = useState<OracleQueryResponse | null>(
    initialResponse || {
      queryId: 'oracle-demo-1',
      text: 'The megalithic alignment at Nabta Playa (circa 5000 BCE) demonstrates early Nile Valley pastoralist astronomy calibrated to the summer solstice. Concurrently, the 16th-century Sankore University manuscripts of Timbuktu synthesize these celestial observations into formal mathematical treatises.',
      epistemicStance: 'ESTABLISHED',
      confidenceScore: 0.96,
      evidence: [
        {
          id: 'ev-nabta-1',
          sourceTitle: 'Holocene Megalithic Astronomy of Nabta Playa',
          author: 'Wendorf & Schild',
          year: 2001,
          textSnippet: 'Archaeoastronomical alignment of megalithic stone circles marking the summer solstice monsoon arrival.',
          pageOrFolio: 'Nature Vol. 392',
          epistemicStance: 'ESTABLISHED',
          confidenceScore: 0.98,
        },
        {
          id: 'ev-timbuktu-1',
          sourceTitle: 'Sankore Mathematical Astronomy Treatise',
          author: 'Ahmed Baba Institute',
          year: 1590,
          textSnippet: 'Trigonometric tables calculating lunar stations and planetary longitude.',
          pageOrFolio: 'Manuscript 418',
          epistemicStance: 'ESTABLISHED',
          confidenceScore: 0.95,
        },
      ],
      citations: ['Wendorf et al. (2001) Nature', 'UNESCO Timbuktu Corpus Folio 418'],
      modelUsed: 'HoloKai-Oracle-CivilizationCore-v11',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !onQuerySubmit) return;
    await onQuerySubmit(prompt);
  };

  return (
    <div className={`rounded-3xl border border-[var(--color-border)] bg-gradient-to-b from-[#12121a] via-[#0a0a0f] to-[#05050a] p-6 md:p-10 space-y-8 backdrop-blur-2xl shadow-2xl ${className}`}>
      <KnowledgeParticleField />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand)] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-brand)] animate-ping" />
            Oracle Intelligence Response Chamber
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1">
            Civilization Epistemic Synthesis
          </h2>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)] text-xs font-mono">
          Model: HoloKai Genkit AI Synthesis
        </div>
      </div>

      {/* Query Form Input */}
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <label htmlFor="oracle-query-input" className="sr-only">
          Query Oracle AI Intelligence
        </label>

        <div className="flex-1 relative flex items-center">
          {isListening ? (
            <div className="flex-1 bg-black/90 border border-[var(--color-border-strong)] rounded-2xl px-5 py-4 flex items-center justify-center gap-1.5 h-[54px] shadow-glow-active">
              {audioBars.map((height, i) => (
                <div 
                  key={i} 
                  className="w-1.5 bg-[var(--color-brand)] rounded-full transition-all duration-100"
                  style={{ height: `${Math.max(10, height)}%` }}
                />
              ))}
              <span className="ml-4 text-xs font-mono text-[var(--color-brand)] font-bold animate-pulse">LISTENING...</span>
            </div>
          ) : (
            <input
              id="oracle-query-input"
              name="oracleQuery"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Oracle about Sungbo's Eredo, Kemet geometry, or Aksumite epigraphy..."
              className="flex-1 w-full bg-black/70 border border-[var(--color-border)] rounded-2xl px-5 py-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--color-border-strong)] transition-colors"
            />
          )}
          
          <button 
            type="button"
            onClick={() => setIsListening(!isListening)}
            className={`absolute right-3 p-2 rounded-xl transition-colors ${isListening ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/5 text-zinc-400 hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-brand)]'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || isListening}
          className="px-8 py-4 bg-[var(--color-surface)] border border-[var(--color-brand)] text-[var(--color-brand)] font-extrabold text-sm rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-glow-brand disabled:opacity-50"
        >
          {loading ? 'Synthesizing Dossier...' : 'Query Oracle →'}
        </button>
      </form>

      {/* Synthesis Report Dossier Surface */}
      {response && (
        <div className="space-y-6 p-6 md:p-8 rounded-2xl bg-[#0a0a0f] border border-[var(--color-border)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono uppercase text-[var(--color-brand)] font-bold">
              Research Dossier #{response.queryId}
            </span>
            <motion.div
              variants={holokaiVariants.cardEntrance}
              initial="hidden"
              whileInView="visible"
            >
              <EpistemicBadge stance={response.epistemicStance} confidence={response.confidenceScore} />
            </motion.div>
          </div>

          <StreamingMarkdown content={response.text} />

          <EvidenceMatrix
            claim={response.text}
            epistemicStance={response.epistemicStance}
            confidenceScore={response.confidenceScore}
            evidence={response.evidence}
            citations={response.citations}
          />
        </div>
      )}
    </div>
  );
}
