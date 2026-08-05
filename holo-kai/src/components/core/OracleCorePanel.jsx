import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HoloKaiVoiceOracle from '@/components/oracle/HoloKaiVoiceOracle';
import GeminiChatbot from '@/components/oracle/GeminiChatbot';
import GeminiVisualStudio from '@/components/oracle/GeminiVisualStudio';
import OracleDataPanel from '@/components/oracle/OracleDataPanel';
import OracleKnowledgeGraph from '@/components/oracle/OracleKnowledgeGraph';
import FullScreenScanline from '@/components/ui/FullScreenScanline';
import EvidenceMatrix from '@/components/oracle/EvidenceMatrix';
import { queryWolframComputation, evaluateEvidenceMatrix } from '@/lib/wolframService';
import { Sparkles, MessageSquare, Box, Activity, GitBranch, Cpu, Search } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function OracleCorePanel({ onSelectSource, activePeriod }) {
  const [activeTab, setActiveTab] = useState('chatbot'); // 'chatbot' | 'voice-synthesis' | 'computation' | 'studio' | 'telemetry' | 'graph'
  const [compQuery, setCompQuery] = useState('How far was Timbuktu from Cairo?');
  const [compResult, setCompResult] = useState(null);
  const [evidenceEval, setEvidenceEval] = useState(null);
  const [isComputing, setIsComputing] = useState(false);

  const handleRunComputation = async (e) => {
    e?.preventDefault();
    if (!compQuery.trim()) return;
    setIsComputing(true);
    try {
      const res = await queryWolframComputation(compQuery);
      const ev = evaluateEvidenceMatrix(compQuery);
      setCompResult(res);
      setEvidenceEval(ev);
    } finally {
      setIsComputing(false);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="h-full flex flex-col overflow-y-auto scrollbar-thin pb-28 p-3 sm:p-6 space-y-4 sm:space-y-6 bg-zinc-950 text-zinc-100"
    >
      <FullScreenScanline opacity="opacity-20" />

      {/* Internal Navigation Bar - Responsive Horizontal Scroll */}
      <motion.div 
        variants={itemVariants}
        className="border-b border-white/10 pb-3 overflow-x-auto scrollbar-none"
      >
        <div className="flex items-center gap-1.5 flex-nowrap min-w-max">
          <button
            onClick={() => setActiveTab('voice-synthesis')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'voice-synthesis'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Voice Synthesis</span>
          </button>

          <button
            onClick={() => setActiveTab('computation')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'computation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            <span>Wolfram Compute Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'chatbot'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Gemini Chatbot</span>
          </button>

          <button
            onClick={() => setActiveTab('studio')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'studio'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Visual Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'graph'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span>Knowledge Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-amber-400 ${
              activeTab === 'telemetry'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Telemetry</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-widest hidden lg:block">
          WOLFRAM QUANTITATIVE LAYER // ACTIVE
        </span>
      </motion.div>

      {/* Active Tab Panel Rendering */}
      {activeTab === 'voice-synthesis' && (
        <motion.div 
          key="voice-synthesis"
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <HoloKaiVoiceOracle onSelectSource={onSelectSource} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <OracleDataPanel activePeriod={activePeriod} />
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'computation' && (
        <motion.div
          key="computation"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 max-w-4xl mx-auto w-full"
        >
          <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <Cpu className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h2 className="text-base font-display font-bold text-zinc-100">
                  Wolfram Computational Knowledge Layer
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Quantitative verification: Chronology, Geography, Astronomical Skies, Pyramid Math & Genetics
                </p>
              </div>
            </div>

            <form onSubmit={handleRunComputation} className="flex gap-2">
              <input
                type="text"
                value={compQuery}
                onChange={(e) => setCompQuery(e.target.value)}
                placeholder="Ask a quantitative query (e.g. How far was Timbuktu from Cairo? What night sky over Kemet?)"
                className="flex-1 bg-zinc-950 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-500 outline-none"
              />
              <button
                type="submit"
                disabled={isComputing}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono text-xs font-bold rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isComputing ? 'Computing...' : 'Compute'}</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {[
                'How far was Timbuktu from Cairo?',
                'Night sky over Kemet around 2500 BCE',
                'Pyramid geometry volume height load estimates',
                'Overlap between Kush and Roman Empire',
              ].map((sample) => (
                <button
                  key={sample}
                  onClick={() => {
                    setCompQuery(sample);
                    queryWolframComputation(sample).then((res) => {
                      setCompResult(res);
                      setEvidenceEval(evaluateEvidenceMatrix(sample));
                    });
                  }}
                  className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-zinc-950 border border-white/10 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 transition"
                >
                  {sample}
                </button>
              ))}
            </div>
          </motion.div>

          {compResult && (
            <motion.div variants={itemVariants}>
              <EvidenceMatrix
                claim={compQuery}
                evidenceData={evidenceEval}
                computationData={compResult}
              />
            </motion.div>
          )}
        </motion.div>
      )}

      {activeTab === 'chatbot' && (
        <motion.div 
          key="chatbot"
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <GeminiChatbot />
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'studio' && (
        <motion.div 
          key="studio"
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <GeminiVisualStudio />
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'graph' && (
        <motion.div 
          key="graph"
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <OracleKnowledgeGraph />
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'telemetry' && (
        <motion.div 
          key="telemetry"
          variants={containerVariants} 
          initial="hidden" 
          animate="visible" 
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <OracleDataPanel activePeriod={activePeriod} />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
