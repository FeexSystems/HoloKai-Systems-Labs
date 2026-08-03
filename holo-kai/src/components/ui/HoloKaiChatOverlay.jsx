import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, Loader2, RefreshCw, BookOpen, Crown, GraduationCap, Users } from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { retroAudio } from '@/lib/audioFeedback';

const PERSONAS = [
  {
    id: 'scholar',
    name: 'The Ancient Scholar',
    title: 'Archival Codices',
    icon: BookOpen,
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    greeting: 'Greetings, seeker. I am the Ancient Scholar of the Royal Scriptorium. Ask, and I shall illuminate the classical papyri and royal stelae.',
    systemInstruction: "You are 'The Ancient Scholar', an ancient scribe and archivist of the royal courts of Alkebulan (Kush, Kemet, Aksum, Mali). Respond with eloquent, reverent, classical prose referencing ancient codices, royal stelae, and sacred manuscripts. Speak with grand academic authority and high literary grace. Keep responses structured and concise (1-2 paragraphs)."
  },
  {
    id: 'elder',
    name: 'The Tribal Elder',
    title: 'Ancestral Griot',
    icon: Crown,
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    greeting: 'Welcome to the council fire, child. I am the Griot, voice of the ancestors. Listen closely as I share the oral epics of our people.',
    systemInstruction: "You are 'The Tribal Elder' (a revered Jali/Griot). Speak with ancestral wisdom, warm poetic oral storytelling, traditional proverbs, and deep reverence for the spirits of the ancestors and epic oral traditions (such as the Sundiata epic or Benin brass chronicles). Keep responses engaging and concise (1-2 paragraphs)."
  },
  {
    id: 'historian',
    name: 'The Modern Historian',
    title: 'Empirical Archaeology',
    icon: GraduationCap,
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    greeting: 'Welcome. I am the Modern Historian. I analyze African civilizational history through carbon-dating, trade economics, and archaeological evidence.',
    systemInstruction: "You are 'The Modern Historian', a contemporary archaeologist and historian specializing in pre-colonial African civilizations. Speak with analytical clarity, precise historical timelines/dates, carbon-dating evidence, trade route economics, and empirical historiographical rigor. Keep responses clear and concise (1-2 paragraphs)."
  }
];

const SUGGESTED_PROMPTS = [
  "Who were the warrior queens (Kandakes) of Kush?",
  "Tell me about the granite enclosures of Great Zimbabwe.",
  "How did the Kingdom of Aksum design its stelae?",
  "What made Mansa Musa's Mali Empire so wealthy?"
];

export default function HoloKaiChatOverlay() {
  const { theme, soundEffectsEnabled } = useHoloKai();
  const [isOpen, setIsOpen] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState('scholar');
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [input, setInput] = useState('');

  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: activePersona.greeting
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSelectPersona = (persona) => {
    if (soundEffectsEnabled) {
      retroAudio.playClick();
    }
    setActivePersonaId(persona.id);
    setShowPersonaMenu(false);
    setMessages([
      {
        role: 'assistant',
        content: persona.greeting
      }
    ]);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (soundEffectsEnabled) {
      retroAudio.playClick();
    }
  };

  const handleSend = async (textToSend) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || isLoading) return;

    if (!textToSend) {
      setInput('');
    }

    if (soundEffectsEnabled) {
      retroAudio.playClick();
    }

    const newUserMessage = { role: 'user', content: promptText };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const chatHistory = [...messages, newUserMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-3.6-flash',
          messages: chatHistory,
          system_instruction: activePersona.systemInstruction
        })
      });

      if (!response.ok) {
        throw new Error('Could not fetch oracle response');
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.text || 'The signals from the ancient grid are fading. Please ask again.' }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection to the historical matrix interrupted. Please retry in a moment.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    if (soundEffectsEnabled) {
      retroAudio.playOracleChime();
    }
    setMessages([
      {
        role: 'assistant',
        content: activePersona.greeting
      }
    ]);
  };

  const ActiveIcon = activePersona.icon;

  return (
    <div className="fixed bottom-6 right-6 z-[80] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleOpen}
            className="flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-all border bg-zinc-950 hover:bg-zinc-900 text-amber-400 border-amber-500/30 shadow-amber-500/10"
            title="Open Oracle Chat"
          >
            <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping opacity-25 pointer-events-none" />
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-[360px] md:w-[400px] h-[540px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden relative bg-zinc-950/95 border-amber-500/20 text-zinc-100 shadow-black/80 backdrop-blur-md"
          >
            {/* Holographic header scanline */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500/40 z-20 pointer-events-none" />

            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b relative z-20 border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
                  <ActiveIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono tracking-wider uppercase flex items-center gap-1.5">
                    {activePersona.name}
                  </h3>
                  <p className="text-[9px] font-mono opacity-60 uppercase">{activePersona.title}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Persona Switcher Trigger */}
                <button
                  onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold border transition-colors flex items-center gap-1 ${
                    showPersonaMenu
                      ? 'bg-amber-500 text-zinc-950 border-amber-400'
                      : 'bg-zinc-900 border-white/10 text-amber-400 hover:border-amber-500/40'
                  }`}
                  title="Select AI Persona Tone"
                >
                  <Users className="w-3 h-3" />
                  <span>Persona</span>
                </button>

                <button
                  onClick={resetChat}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-zinc-400 hover:text-white"
                  title="Reset Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={toggleOpen}
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/5 text-zinc-400 hover:text-white"
                  title="Minimize"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Persona Selection Dropdown Overlay */}
            <AnimatePresence>
              {showPersonaMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 border-b space-y-2 z-30 shadow-lg bg-zinc-900 border-amber-500/30"
                >
                  <p className="text-[10px] font-mono uppercase tracking-wider font-bold opacity-60">
                    Select Historical Persona Tone:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {PERSONAS.map((p) => {
                      const Icon = p.icon;
                      const isSelected = p.id === activePersonaId;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleSelectPersona(p)}
                          className={`p-2 rounded-xl text-left transition-all border flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                              : 'bg-zinc-950/80 hover:bg-zinc-800 border-white/5 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                            <div>
                              <div className="text-xs font-mono">{p.name}</div>
                              <div className="text-[9px] font-mono opacity-60">{p.title}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-400 border border-amber-500/40">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((m, index) => {
                const isAssistant = m.role === 'assistant';
                return (
                  <div key={index} className={`flex items-start gap-2.5 ${isAssistant ? '' : 'justify-end'}`}>
                    {isAssistant && (
                      <div className="p-1.5 rounded-full shrink-0 bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-zinc-900/80 border border-white/5 text-zinc-300'
                        : 'bg-amber-500/25 border border-amber-500/30 text-amber-100'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-full shrink-0 bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  </div>
                  <div className="rounded-2xl px-3.5 py-2.5 text-xs flex items-center gap-1.5 bg-zinc-900/80 border border-white/5 text-zinc-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>{activePersona.name} is speaking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions (Shown when only initial message exists) */}
            {messages.length === 1 && !isLoading && (
              <div className="px-4 pb-2 pt-1 border-t border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider mb-2 opacity-50 font-bold">Suggested Enquiries:</p>
                <div className="flex flex-col gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-xs px-3 py-1.5 rounded-xl border transition-all text-ellipsis overflow-hidden whitespace-nowrap bg-zinc-900/60 hover:bg-amber-500/10 border-white/5 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Footer */}
            <div className="p-3 border-t flex gap-2 border-white/10 bg-white/5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Ask ${activePersona.name}...`}
                className="flex-1 px-3 py-2 rounded-xl text-xs outline-none transition-all bg-zinc-900 border border-white/10 focus:border-amber-500/50 text-white placeholder-zinc-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-xl flex items-center justify-center transition-all ${
                  !input.trim() || isLoading
                    ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500'
                    : 'bg-amber-500 text-zinc-950 hover:bg-amber-400 font-bold'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

