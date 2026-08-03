import React, { useState, useEffect } from 'react';
import PageShell from '@/components/PageShell';
import ParticleBackground from '@/components/ui/ParticleBackground';
import { useAuth } from '@/lib/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import {
  Search,
  Globe,
  Sparkles,
  ExternalLink,
  Bookmark,
  Brain,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const PRESET_TOPICS = [
  {
    title: 'Aksumite Obelisks & Royal Inscriptions',
    query: 'Recent archaeological excavations and stelae findings in Aksum Ethiopia 2025 2026',
    category: 'Horn of Africa',
    icon: '🗼'
  },
  {
    title: 'Timbuktu Scroll Digitization & Physics',
    query: 'Timbuktu manuscripts scientific analysis optics astronomy discoveries',
    category: 'Sahelian Manuscripts',
    icon: '📜'
  },
  {
    title: 'Great Zimbabwe Conical Masonry',
    query: 'Great Zimbabwe archaeological trade finds Indian Ocean metallurgy carbon dating',
    category: 'Southern Africa',
    icon: '🏰'
  },
  {
    title: 'Nile Delta Maritime Archaeology',
    query: 'Ancient Egyptian sunken cities underwater archaeology Nile delta discoveries',
    category: 'Kemet / Egypt',
    icon: '⚓'
  },
  {
    title: 'Nsibidi & Cross River Monoliths',
    query: 'Ikom monoliths Cross River Nsibidi ideogram archaeological conservation',
    category: 'West Africa',
    icon: '✍️'
  },
  {
    title: 'Ancient Swahili Coast Gold Trade',
    query: 'Kilwa Kisiwani Swahili coast palace excavations Chinese porcelain coin finds',
    category: 'Swahili Coast',
    icon: '⛵'
  }
];

export default function ResearchJournal() {
  const { user, isAuthenticated, loginWithGoogle } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [useHighReasoning, setUseHighReasoning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeResult, setActiveResult] = useState(null);
  const [savedArticles, setSavedArticles] = useState([]);
  const [savingArticle, setSavingArticle] = useState(false);

  // Firestore sync for saved research articles
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    try {
      const q = query(
        collection(db, 'research_journal'),
        where('userId', '==', user.uid),
        orderBy('savedAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavedArticles(docs);
      }, (err) => {
        console.warn('Firestore research journal listener warning:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore query error:', err);
    }
  }, [isAuthenticated, user]);

  const handleGroundingSearch = async (queryToRun) => {
    const targetQuery = queryToRun || searchQuery;
    if (!targetQuery.trim() || loading) return;

    setLoading(true);
    setActiveResult(null);

    const modelToUse = useHighReasoning ? 'gemini-3.1-pro-preview' : 'gemini-3.5-flash';

    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: targetQuery,
          model: modelToUse,
          system_instruction: `You are the HoloKai Senior Archaeological Intelligence Researcher.
Your mission is to analyze real-time archaeological, epigraphic, and historical evidence gathered via Google Search Grounding.
Synthesize the latest findings into a clear, academic report with:
1. EXECUTIVE SUMMARY & NEW DISCOVERIES
2. PRIMARY EVIDENCE & GROUNDED DATA
3. HISTORICAL CONTINUITY & IMPLICATIONS
Provide thorough citations and academic rigor.`,
          enable_search: true,
          thinking_level: useHighReasoning ? 'HIGH' : undefined
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.detail || 'Failed to retrieve grounded archaeological findings');
      }

      const data = await response.json();

      setActiveResult({
        query: targetQuery,
        text: data.text || 'No findings retrieved.',
        grounding: data.grounding,
        model: data.model || modelToUse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });

      toast({
        title: 'Real-Time Findings Retrieved',
        description: `Grounded synthesis generated using Google Search Grounding & ${modelToUse}.`
      });

    } catch (err) {
      console.error('Real-Time Grounding Error:', err);
      toast({
        title: 'Research Retrieval Error',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToJournal = async () => {
    if (!activeResult) return;
    if (!isAuthenticated || !user?.uid) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save research articles to your personal journal.'
      });
      return;
    }

    setSavingArticle(true);
    try {
      await addDoc(collection(db, 'research_journal'), {
        userId: user.uid,
        query: activeResult.query,
        text: activeResult.text,
        grounding: activeResult.grounding || null,
        model: activeResult.model,
        savedAt: new Date().toISOString(),
        formattedDate: activeResult.date
      });

      toast({
        title: 'Saved to Journal',
        description: 'Article successfully synced to your HoloKai research portfolio.'
      });
    } catch (err) {
      console.error('Firestore save error:', err);
      toast({
        title: 'Save Failed',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setSavingArticle(false);
    }
  };

  const handleDeleteJournalArticle = async (articleId) => {
    try {
      await deleteDoc(doc(db, 'research_journal', articleId));
      toast({
        title: 'Article Removed',
        description: 'Article deleted from your journal archive.'
      });
    } catch (err) {
      console.error('Firestore delete error:', err);
    }
  };

  return (
    <PageShell
      title="Civilization Research Journal"
      subtitle="Real-Time Archaeological & Historical Intelligence with Live Google Search Grounding"
      badge="LIVE SEARCH GROUNDING"
      backTo="/core"
      backLabel="Civilization Core"
      wide
    >
      <ParticleBackground particleCount={25} />

      <div className="space-y-8 relative z-10">
        {/* Top Feature Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-amber-950/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-blue-300 font-semibold">
                  REAL-TIME GOOGLE SEARCH GROUNDING ACTIVE
                </span>
              </div>
              <h1 className="text-2xl font-display font-bold text-white">
                Live Pan-African Archaeological & Historical Intelligence
              </h1>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Connect the HoloKai Civilization Intelligence Platform directly to live web databases, university publications, carbon-dating registries, and global archaeological news using Google Search Grounding.
              </p>
            </div>

            {/* Model & Reasoning Toggle */}
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => setUseHighReasoning(!useHighReasoning)}
                className={`px-3 py-2 rounded-xl text-xs font-mono border flex items-center gap-2 transition ${
                  useHighReasoning
                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-lg'
                    : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
                title="Toggle High Reasoning model (gemini-3.1-pro-preview)"
              >
                <Brain className="w-4 h-4 text-purple-400" />
                <span>{useHighReasoning ? 'Reasoning: High Pro' : 'Reasoning: Flash'}</span>
              </button>

              {!isAuthenticated && (
                <button
                  onClick={loginWithGoogle}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Sign In to Save
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                id="journal_grounding_search"
                name="journal_grounding_search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGroundingSearch()}
                placeholder="Query real-time archaeological findings (e.g. 'Sub-Saharan iron smelting carbon-dating discoveries 2026')..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500/60 rounded-xl px-4 py-3 pl-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition font-body"
              />
              <Search className="w-5 h-5 text-blue-400 absolute left-3.5 top-3.5 pointer-events-none" />
            </div>

            <button
              onClick={() => handleGroundingSearch()}
              disabled={loading || !searchQuery.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Searching Live Web...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Search Grounded Web
                </>
              )}
            </button>
          </div>

          {/* Presets */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Explore Real-Time Archaeological Hotspots:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {PRESET_TOPICS.map((topic, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setSearchQuery(topic.query);
                    handleGroundingSearch(topic.query);
                  }}
                  className="bg-slate-900/80 hover:bg-blue-950/40 border border-slate-800 hover:border-blue-500/40 p-3 rounded-xl cursor-pointer transition group flex items-start gap-3"
                >
                  <span className="text-xl">{topic.icon}</span>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold block">
                      {topic.category}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-blue-300 transition-colors truncate">
                      {topic.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-t-blue-400 animate-spin" />
              <Globe className="w-8 h-8 text-blue-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-blue-200">
                Executing Live Google Search Grounding...
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Gemini is executing live web queries to compile the latest verified peer-reviewed articles, excavation logs, and news reports.
              </p>
            </div>
          </div>
        )}

        {/* Active Grounded Research Result */}
        {activeResult && !loading && (
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/40 space-y-6 shadow-2xl animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 rounded-full uppercase">
                    Grounded Research Report
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Model: {activeResult.model}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  "{activeResult.query}"
                </h2>
              </div>

              <button
                onClick={handleSaveToJournal}
                disabled={savingArticle}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition shrink-0"
              >
                <Bookmark className="w-4 h-4" />
                {savingArticle ? 'Saving...' : 'Save to Journal'}
              </button>
            </div>

            {/* Grounding Web Citations & Queries */}
            {activeResult.grounding && (
              <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-blue-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>Real-Time Google Search Grounding Sources ({activeResult.grounding.groundingChunks?.length || 0})</span>
                  </div>
                  <span>Verified Web Data</span>
                </div>

                {activeResult.grounding.webSearchQueries && (
                  <div className="flex flex-wrap gap-1.5">
                    {activeResult.grounding.webSearchQueries.map((q, idx) => (
                      <span key={idx} className="text-[11px] font-mono bg-blue-900/60 border border-blue-700/50 text-blue-200 px-2.5 py-1 rounded-md">
                        🔍 "{q}"
                      </span>
                    ))}
                  </div>
                )}

                {activeResult.grounding.groundingChunks && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {activeResult.grounding.groundingChunks.map((chunk, idx) => (
                      chunk.web?.uri ? (
                        <a
                          key={idx}
                          href={chunk.web.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-slate-900/90 border border-blue-500/20 hover:border-blue-400/60 rounded-xl text-xs text-blue-300 hover:text-white flex items-center justify-between transition group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold block truncate">{chunk.web.title || chunk.web.uri}</span>
                            <span className="text-[10px] font-mono text-slate-400 truncate block">{chunk.web.uri}</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </a>
                      ) : null
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Generated Research Body */}
            <div className="p-6 bg-slate-950/60 border border-slate-800/80 rounded-xl text-slate-200 text-sm leading-relaxed space-y-4 font-body whitespace-pre-wrap">
              {activeResult.text}
            </div>
          </div>
        )}

        {/* Saved Research Journal Entries */}
        {savedArticles.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                Saved Journal Portfolio ({savedArticles.length})
              </h3>
              <span className="text-xs font-mono text-slate-400">Synced to Firebase</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticles.map((art) => (
                <div key={art.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 relative group">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {art.formattedDate || 'Saved Article'}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{art.query}</h4>
                    </div>

                    <button
                      onClick={() => handleDeleteJournalArticle(art.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg transition"
                      title="Delete from journal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {art.text}
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                    <span>Model: {art.model}</span>
                    <span>{art.grounding?.groundingChunks?.length || 0} Grounded Sources</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
