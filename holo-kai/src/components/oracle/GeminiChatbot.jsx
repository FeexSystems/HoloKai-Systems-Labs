import React, { useState, useEffect, useRef } from 'react';
import {
  Send, Sparkles, Brain, Search, MapPin, Zap, RefreshCw, User, Volume2, ExternalLink, Headphones, Mic, MicOff, Activity
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { oracleVoiceEngine } from '@/lib/oracleVoiceEngine';
import VoiceVisualizer from '@/components/oracle/VoiceVisualizer';
import AncientScriptVoiceVisualizer from '@/components/oracle/AncientScriptVoiceVisualizer';
import { callGeminiApi } from '@/lib/geminiApi';

const ROLES = [
  {
    id: 'griota',
    name: 'Griota (Oral Historian)',
    icon: '📜',
    instruction: 'You are Griota, a master West African oral historian and civilization oracle. Speak with deep cultural reverence, rich historical precision, and epic storytelling prose.'
  },
  {
    id: 'archivist',
    name: 'Archivist (Epigraphic Specialist)',
    icon: '🏛️',
    instruction: 'You are the Chief Epigraphist of HoloKai. Focus on deciphering ancient scripts (Ge\'ez, Nsibidi, Hieroglyphs, Tifinagh, Meroitic) and manuscript analysis.'
  },
  {
    id: 'navigator',
    name: 'Geospatial Navigator',
    icon: '🌍',
    instruction: 'You are the Geospatial Navigator. Provide detailed geographical, cartographic, and trade-route insights across historical African empires with spatial accuracy.'
  },
  {
    id: 'engineer',
    name: 'Civilization Structural Engineer',
    icon: '⚡',
    instruction: 'You are the Master Architect & Structural Engineer. Explain dry-stone masonry (Great Zimbabwe), hydraulic engineering (Aksum/Nile), and ancient metallurgy.'
  }
];

export default function GeminiChatbot() {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('holokai_oracle_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Jambo! I am the HoloKai Civilization Oracle powered by Gemini. Select a guardian persona, enable Live Grounding (Search/Maps), or toggle High Thinking Mode to begin.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('holokai_oracle_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  
  // Toggles for user request
  const [enableSearch, setEnableSearch] = useState(false);
  const [enableMaps, setEnableMaps] = useState(false);
  const [highThinking, setHighThinking] = useState(false);
  const [lowLatency, setLowLatency] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [micError, setMicError] = useState(null);
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setMicError(null);
      };

      recognition.onresult = (event) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        if (currentText.trim()) {
          setInput(currentText);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition notice:', err.error);
        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          setMicError('Microphone permission denied.');
        }
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const toggleMic = async () => {
    setMicError(null);

    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      setIsListening(false);
      return;
    }

    setInput('');
    let started = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        started = true;
      } catch (e) {
        console.warn('Recognition start warning:', e);
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

          if (audioBlob.size > 0) {
            setIsTranscribing(true);
            try {
              const res = await fetch('/api/deepgram/stt', {
                method: 'POST',
                headers: { 'Content-Type': 'audio/webm' },
                body: audioBlob
              });

              if (res.ok) {
                const data = await res.json();
                if (data.transcript && data.transcript.trim()) {
                  setInput(data.transcript.trim());
                }
              }
            } catch (err) {
              console.warn('STT error:', err);
            } finally {
              setIsTranscribing(false);
            }
          }
        };

        mediaRecorder.start();
        started = true;
        setIsListening(true);
      } catch (err) {
        console.warn('Mic access error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setMicError('Microphone permission denied.');
        }
      }
    }

    if (!started && !micError) {
      setMicError('Speech recognition is not supported in this browser.');
    }
  };
  const [activeConvId, setActiveConvId] = useState(null);
  const [groundingInfo, setGroundingInfo] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(oracleVoiceEngine.isSpeaking());
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Firestore sync for conversation history when logged in
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    try {
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConversations(convs);
      }, (err) => {
        console.warn('Firestore conversation listener warning:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore query error:', e);
    }
  }, [isAuthenticated, user]);

  const selectModel = () => {
    if (highThinking) return 'gemini-3.1-pro-preview';
    if (lowLatency) return 'gemini-3.1-flash-lite';
    return 'gemini-3.5-flash';
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    const queryText = input.trim();
    if (!queryText || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setGroundingInfo(null);

    const targetModel = selectModel();

    try {
      const chatPayload = {
        messages: messages.concat(userMsg).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          content: m.content
        })),
        model: targetModel,
        system_instruction: selectedRole.instruction,
        enable_search: enableSearch,
        enable_maps: enableMaps,
        thinking_level: highThinking ? 'HIGH' : undefined
      };

      const data = await callGeminiApi('/api/gemini/chat', chatPayload);
      
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || 'No response returned.',
        grounding: data.grounding,
        modelUsed: data.model || targetModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      if (data.grounding) {
        setGroundingInfo(data.grounding);
      }

      // Persist to Firestore if authenticated
      if (isAuthenticated && user?.uid) {
        try {
          if (!activeConvId) {
            const docRef = await addDoc(collection(db, 'conversations'), {
              userId: user.uid,
              title: queryText.slice(0, 40) + '...',
              role: selectedRole.id,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            setActiveConvId(docRef.id);
          }
        } catch (dbErr) {
          console.warn('Firestore save message warning:', dbErr);
        }
      }

    } catch (err) {
      console.error('Gemini Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `⚠️ Oracle Communication Error: ${err.message}. Please verify your network connection or try again.`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[750px] bg-slate-950/80 border border-amber-500/20 rounded-xl shadow-2xl overflow-hidden text-slate-100 backdrop-blur-md">
      {/* Header bar */}
      <div className="px-5 py-4 bg-slate-900/90 border-b border-amber-500/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow-inner">
            {selectedRole.icon}
          </div>
          <div>
            <h3 className="font-semibold text-amber-100 text-base flex items-center gap-2">
              Gemini Civilization Oracle
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {selectModel()}
              </span>
            </h3>
            <p className="text-xs text-slate-400">Multi-turn historical intelligence & grounded research</p>
          </div>
        </div>

        {/* Firebase Auth indicator */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="truncate max-w-[120px] font-medium">{user.displayName || user.email}</span>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md transition"
            >
              <User className="w-3.5 h-3.5" />
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* Role Selection & Mode Toggles */}
      <div className="px-5 py-3 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Role Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-400 font-medium whitespace-nowrap mr-1">Role:</span>
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition whitespace-nowrap ${
                selectedRole.id === role.id
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-medium shadow-sm'
                  : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span>{role.icon}</span>
              <span>{role.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Feature Switches */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setEnableSearch(!enableSearch)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
              enableSearch
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title="Search Grounding using Google Search API"
          >
            <Search className="w-3 h-3" />
            Google Search
          </button>

          <button
            onClick={() => {
              setEnableMaps(!enableMaps);
              if (!enableMaps) setEnableSearch(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
              enableMaps
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title="Maps Grounding using Google Maps API"
          >
            <MapPin className="w-3 h-3" />
            Google Maps
          </button>

          <button
            onClick={() => {
              setHighThinking(!highThinking);
              if (!highThinking) setLowLatency(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
              highThinking
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title="Enable High Thinking Reasoning (gemini-3.1-pro-preview)"
          >
            <Brain className="w-3 h-3" />
            High Thinking
          </button>

          <button
            onClick={() => {
              setLowLatency(!lowLatency);
              if (!lowLatency) setHighThinking(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium transition ${
              lowLatency
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:text-slate-200'
            }`}
            title="Low-Latency Responses (gemini-3.1-flash-lite)"
          >
            <Zap className="w-3 h-3" />
            Low-Latency
          </button>

          <a
            href="https://elevenlabs.io/app/talk-to?agent_id=agent_7101kyeb9c3fesjrwbjy2ttk5fdh&branch_id=agtbrch_5401kyeb9dpaedhsh7kvfqx4s4hw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-medium bg-purple-950/60 hover:bg-purple-900/80 border-purple-500/40 text-purple-300 transition shadow-sm"
            title="Talk with HoloKai Oracle Voice AI"
          >
            <Headphones className="w-3 h-3 text-purple-400" />
            HoloKai Voice AI
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-amber-600/90 text-slate-950 font-medium rounded-br-none shadow-md'
                  : msg.isError
                  ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200 rounded-bl-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                <span className="font-semibold">
                  {msg.role === 'user' ? 'You' : selectedRole.name}
                </span>
                <div className="flex items-center gap-2">
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => oracleVoiceEngine.speakResponse(msg.content)}
                      className="p-1 hover:text-amber-400 transition"
                      title="Speak response with HoloKai Oracle Voice"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <span className="text-[10px] font-mono">{msg.timestamp}</span>
                </div>
              </div>

              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.grounding && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-blue-400 flex items-center gap-1">
                    <Search className="w-3 h-3" /> Grounded Citations & Sources:
                  </div>
                  {msg.grounding.webSearchQueries?.map((q, idx) => (
                    <div key={idx} className="text-[11px] italic text-slate-400">
                      Query: "{q}"
                    </div>
                  ))}
                  {msg.grounding.groundingChunks?.slice(0, 3).map((chunk, idx) => (
                    <a
                      key={idx}
                      href={chunk.web?.uri || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-[11px] text-blue-400 hover:underline truncate"
                    >
                      • {chunk.web?.title || chunk.web?.uri || 'Source detail'}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-slate-400 text-xs italic">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 animate-spin">
              <RefreshCw className="w-4 h-4" />
            </div>
            <span>Consulting Gemini historical archives ({selectModel()})...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {(isSpeaking || loading) && (
        <div className="px-4 pt-2">
          <VoiceVisualizer
            isSpeaking={isSpeaking}
            isThinking={loading}
            voiceName={selectedRole.name.split(' ')[0]}
          />
        </div>
      )}

      {/* Voice feedback & errors */}
      {micError && (
        <div className="mx-4 mt-2 p-2.5 rounded-lg border border-red-500/30 bg-red-950/40 text-red-200 text-xs flex items-center justify-between">
          <span>{micError}</span>
          <button type="button" onClick={() => setMicError(null)} className="text-red-400 font-bold hover:text-white">✕</button>
        </div>
      )}

      {isListening && (
        <div className="mx-4 mt-2 p-3 rounded-2xl border border-amber-500/30 bg-zinc-950/80 flex flex-col items-center">
          <AncientScriptVoiceVisualizer
            isListening={isListening}
            activeTranscript={input}
            accentColor="#F59E0B"
          />
          <div className="px-3 py-1 rounded-lg border border-red-500/30 bg-red-950/20 text-red-300 text-xs flex items-center gap-2 animate-pulse mt-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Listening... Speak your question now.</span>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-slate-900/95 border-t border-slate-800/80 flex items-center gap-3">
        <input
          type="text"
          id="oracle_chat_input"
          name="oracle_chat_input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${selectedRole.name.split(' ')[0]} about African history, manuscripts, monuments...`}
          disabled={loading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
        />
        <button
          type="button"
          onClick={toggleMic}
          disabled={isTranscribing}
          title={isListening ? 'Stop listening' : 'Click to ask using microphone'}
          className={`p-2.5 rounded-lg border transition shrink-0 ${
            isTranscribing
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : isListening
              ? 'bg-red-500/20 border-red-500 text-red-300 animate-pulse'
              : 'bg-slate-950 border-slate-800 text-amber-400 hover:border-amber-500/50 hover:bg-slate-800'
          }`}
        >
          {isTranscribing ? <Activity className="w-4 h-4 animate-spin" /> : isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition shrink-0"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
