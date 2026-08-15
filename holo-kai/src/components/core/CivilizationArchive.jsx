import React, { useState, useMemo, useRef, useEffect, Suspense, lazy } from 'react';
import {
  Search, Filter, Sparkles, Compass,
  BookOpen, Clock, MapPin, Crown, Landmark, Coins,
  Scale, X, Bookmark, Check,
  ChevronRight, Award, Grid, List, Eye, Image as ImageIcon,
  Volume2, Pause, Play, Square, Loader2,
  PanelLeftClose, PanelLeft, Tag, Layers, Share2,
  Box, Camera
} from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { CIVILIZATION_ARCHIVE, REGIONS, PERIODS } from '@/lib/civilizationArchiveData';
import { getTranslatedSummary } from '@/lib/translations';
import LazyImage from '../common/LazyImage';
import AfrofuturistArtPlaceholder from '../common/AfrofuturistArtPlaceholder';
import Artifact3DGallery from './Artifact3DGallery';

// Lazy load Map component for enhanced performance and bundle splitting
const CivilizationMap = lazy(() => import('./CivilizationMap'));

function MapLoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[550px] bg-zinc-950 border border-white/10 rounded-2xl flex flex-col items-center justify-center p-8 space-y-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-blue-500/5 animate-pulse" />
      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-spin">
        <MapPin className="w-6 h-6" />
      </div>
      <div className="text-center z-10 space-y-1">
        <h4 className="text-sm font-bold font-mono text-zinc-200">Initializing Interactive Leaflet Map...</h4>
        <p className="text-xs text-zinc-500 font-mono">Loading vector tiles & plotting geographic sites</p>
      </div>
    </div>
  );
}

const FEATURE_TAGS = [
  'All Tags',
  'Iron Smelting',
  'Gold Fields',
  'Pyramids',
  'Lost-Wax Bronze',
  'Matrilineal Sovereignty',
  'Manuscripts & Universities',
  'UNESCO World Heritage',
  'Binary Divination'
];

export default function CivilizationArchive({ onNavigateToOracle, onCompareCivilization, externalSearchQuery }) {
  const { activeGuardian, language } = useHoloKai();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedPeriod, setSelectedPeriod] = useState('All Eras');
  const [selectedTag, setSelectedTag] = useState('All Tags');
  const [sortBy, setSortBy] = useState('chronological'); // 'chronological', 'alphabetical', 'achievements', 'confidence'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'map' | 'timeline'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Modal & Selection State
  const [selectedCiv, setSelectedCiv] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // modal tabs
  const [bookmarkedIds, setBookmarkedIds] = useState(['kush', 'mali', 'benin']);
  const [hoveredTimelineId, setHoveredTimelineId] = useState(null);
  const [showTimelineHeader, setShowTimelineHeader] = useState(true);
  const [copiedCivLink, setCopiedCivLink] = useState(false);

  // AR View & Reading Progress State
  const [showARModal, setShowARModal] = useState(false);
  const [ar3dModelScale, setAr3dModelScale] = useState(1.0);
  const [ar3dModelRotation, setAr3dModelRotation] = useState(25);
  const [modalScrollProgress, setModalScrollProgress] = useState(0);

  const handleModalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      setModalScrollProgress(Math.min(100, Math.max(0, (scrollTop / total) * 100)));
    } else {
      setModalScrollProgress(100);
    }
  };

  // Audio Narration State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioSource, setAudioSource] = useState(null); // 'elevenlabs' | 'webspeech'
  const [activeNarrationCivId, setActiveNarrationCivId] = useState(null);

  const audioRef = useRef(null);
  const speechUtteranceRef = useRef(null);

  // Sync external search query from global header
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Deep-link check on initial mount (?civ=id or #id)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const civId = params.get('civ') || window.location.hash.replace('#', '');
      if (civId) {
        const foundCiv = CIVILIZATION_ARCHIVE.find(
          (c) => c.id.toLowerCase() === civId.toLowerCase()
        );
        if (foundCiv) {
          setSelectedCiv(foundCiv);
        }
      }
    }
  }, []);

  // Cleanup audio on unmount or civ modal change
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  // Compute counts per region
  const regionCounts = useMemo(() => {
    const counts = { 'All Regions': CIVILIZATION_ARCHIVE.length };
    REGIONS.forEach((r) => {
      if (r === 'All Regions') return;
      counts[r] = CIVILIZATION_ARCHIVE.filter(
        (c) => c.subRegion === r || c.region.includes(r)
      ).length;
    });
    return counts;
  }, []);

  // Filter & Search Logic
  const filteredCivilizations = useMemo(() => {
    return CIVILIZATION_ARCHIVE.filter((civ) => {
      // Bookmarked filter
      if (onlyBookmarked && !bookmarkedIds.includes(civ.id)) {
        return false;
      }
      // Region filter
      if (
        selectedRegion !== 'All Regions' &&
        civ.subRegion !== selectedRegion &&
        !civ.region.includes(selectedRegion)
      ) {
        return false;
      }
      // Period filter
      if (selectedPeriod !== 'All Eras' && civ.eraPeriod !== selectedPeriod) {
        return false;
      }
      // Tag filter
      if (selectedTag !== 'All Tags') {
        const tag = selectedTag.toLowerCase();
        const matchesTech = civ.scienceTech?.toLowerCase().includes(tag);
        const matchesAchieve = civ.keyAchievements.some((a) => a.toLowerCase().includes(tag));
        const matchesArch = civ.architecture?.toLowerCase().includes(tag);
        const matchesEcon = civ.economyTrade?.toLowerCase().includes(tag);
        const matchesGov = civ.governance?.toLowerCase().includes(tag);
        if (!matchesTech && !matchesAchieve && !matchesArch && !matchesEcon && !matchesGov) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = civ.name.toLowerCase().includes(q);
        const matchesNative = civ.nativeName?.toLowerCase().includes(q);
        const matchesEra = civ.era?.toLowerCase().includes(q) || civ.eraPeriod?.toLowerCase().includes(q);
        const matchesRegion = civ.region.toLowerCase().includes(q) || civ.subRegion?.toLowerCase().includes(q);
        const matchesCapital = civ.capitals.some((c) => c.toLowerCase().includes(q));
        const matchesRulers = civ.keyRulers.some((r) => r.toLowerCase().includes(q));
        const matchesAchievements = civ.keyAchievements.some((a) => a.toLowerCase().includes(q));
        const matchesSummary = civ.summary.toLowerCase().includes(q);
        const matchesArtifacts = civ.artifacts?.some((art) => art.toLowerCase().includes(q));
        const matchesCulture = civ.culturalContext?.toLowerCase().includes(q);

        return (
          matchesName ||
          matchesNative ||
          matchesEra ||
          matchesRegion ||
          matchesCapital ||
          matchesRulers ||
          matchesAchievements ||
          matchesSummary ||
          matchesArtifacts ||
          matchesCulture
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'chronological') {
        return a.startYear - b.startYear;
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'achievements') {
        return b.keyAchievements.length - a.keyAchievements.length;
      }
      if (sortBy === 'confidence') {
        return b.confidence - a.confidence;
      }
      return 0;
    });
  }, [searchQuery, selectedRegion, selectedPeriod, selectedTag, sortBy, onlyBookmarked, bookmarkedIds]);

  // Keyboard navigation for modal & grid accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedCiv) return;

      if (e.key === 'Escape') {
        setSelectedCiv(null);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = filteredCivilizations.findIndex((c) => c.id === selectedCiv.id);
        if (currentIndex !== -1 && currentIndex < filteredCivilizations.length - 1) {
          setSelectedCiv(filteredCivilizations[currentIndex + 1]);
        } else if (filteredCivilizations.length > 0) {
          setSelectedCiv(filteredCivilizations[0]);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = filteredCivilizations.findIndex((c) => c.id === selectedCiv.id);
        if (currentIndex > 0) {
          setSelectedCiv(filteredCivilizations[currentIndex - 1]);
        } else if (filteredCivilizations.length > 0) {
          setSelectedCiv(filteredCivilizations[filteredCivilizations.length - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCiv, filteredCivilizations]);

  // Share deep link to clipboard
  const handleShareCiv = (civ, e) => {
    if (e) e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?civ=${civ.id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedCivLink(true);
        setTimeout(() => setCopiedCivLink(false), 2500);
      }).catch(() => {
        setCopiedCivLink(true);
        setTimeout(() => setCopiedCivLink(false), 2500);
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedCivLink(true);
      setTimeout(() => setCopiedCivLink(false), 2500);
    }
  };

  // Timeline min & max years
  const minTimelineYear = -3200;
  const maxTimelineYear = 2000;
  const totalYearSpan = maxTimelineYear - minTimelineYear;

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAskOracle = (civ, e) => {
    if (e) e.stopPropagation();
    const query = `Provide a deep historical analysis of the ${civ.name} (${civ.era}), focusing on its governance, scientific contributions, and trade networks.`;
    if (onNavigateToOracle) {
      onNavigateToOracle(query);
    } else {
      alert(`Querying Oracle regarding ${civ.name}...`);
    }
  };

  const handleCompare = (civ, e) => {
    if (e) e.stopPropagation();
    if (onCompareCivilization) {
      onCompareCivilization(civ.name);
    } else {
      alert(`Added ${civ.name} to side-by-side comparison matrix.`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All Regions');
    setSelectedPeriod('All Eras');
    setSelectedTag('All Tags');
    setOnlyBookmarked(false);
    setSortBy('chronological');
  };

  // --- AUDIO NARRATION SYSTEM (ElevenLabs API + Web Speech Fallback) ---
  const stopNarration = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsLoadingAudio(false);
    setActiveNarrationCivId(null);
  };

  const fallbackToWebSpeech = (text, civId) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsLoadingAudio(false);
      alert('Audio speech synthesis is not supported in this browser environment.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 0.96;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Daniel') ||
          v.name.includes('Samantha') ||
          v.name.includes('Serena'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setIsLoadingAudio(false);
      setAudioSource('webspeech');
      setActiveNarrationCivId(civId);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoadingAudio(false);
      setActiveNarrationCivId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setIsLoadingAudio(false);
      setActiveNarrationCivId(null);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startNarration = async (civ, e) => {
    if (e) e.stopPropagation();

    // Toggle pause if already speaking the same civ
    if (activeNarrationCivId === civ.id && isSpeaking) {
      togglePauseNarration();
      return;
    }

    stopNarration();
    setActiveNarrationCivId(civ.id);
    setIsLoadingAudio(true);

    const narrationText = `${civ.name}. ${civ.nativeName ? 'Native title: ' + civ.nativeName + '.' : ''} Era: ${civ.era}. Located in ${civ.subRegion || civ.region}. ${getTranslatedSummary(civ.id, language, civ.summary)} Cultural context: ${civ.culturalContext || ''}`;

    // Check for ElevenLabs API Key
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || (typeof process !== 'undefined' ? process.env.VITE_ELEVENLABS_API_KEY : null);

    if (apiKey) {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text: narrationText,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.onplay = () => {
            setIsSpeaking(true);
            setIsPaused(false);
            setIsLoadingAudio(false);
            setAudioSource('elevenlabs');
          };

          audio.onended = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            setIsLoadingAudio(false);
            setActiveNarrationCivId(null);
          };

          audio.onerror = () => {
            fallbackToWebSpeech(narrationText, civ.id);
          };

          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs API call error, falling back to Web Speech API:', err);
      }
    }

    // Fallback if no key or API error
    fallbackToWebSpeech(narrationText, civ.id);
  };

  const togglePauseNarration = () => {
    if (audioSource === 'elevenlabs' && audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
        setIsPaused(false);
      } else {
        audioRef.current.pause();
        setIsPaused(true);
      }
    } else if (audioSource === 'webspeech' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Top Header Banner */}
      <div
        className="px-6 py-5 border-b relative overflow-hidden shrink-0"
        style={{
          borderColor: 'rgba(200, 149, 42, 0.15)',
          background: `linear-gradient(135deg, rgba(10,10,18,0.95) 0%, ${activeGuardian.accentColor}08 100%)`,
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 transition"
              title={sidebarOpen ? 'Collapse Filtering Sidebar' : 'Expand Filtering Sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-semibold"
                  style={{
                    background: `${activeGuardian.accentColor}18`,
                    color: activeGuardian.accentColor,
                    border: `1px solid ${activeGuardian.accentColor}33`,
                  }}
                >
                  Civilization Repository
                </span>
                <span className="text-xs text-zinc-400 font-mono">· 14 Verified Empires</span>
              </div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide flex items-center gap-2">
                <Landmark className="w-6 h-6 text-amber-500" />
                African Civilization Archive
              </h1>
            </div>
          </div>

          {/* View Mode Switcher & Quick Search Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-zinc-900 border border-white/10 rounded-xl p-1 gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
                <span className="text-[11px] font-mono hidden sm:inline">Grid</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'list'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Compact List View"
              >
                <List className="w-4 h-4" />
                <span className="text-[11px] font-mono hidden sm:inline">List</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Interactive Leaflet Map View"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-mono hidden sm:inline">Map View</span>
              </button>

              <button
                onClick={() => setViewMode('timeline')}
                className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'timeline'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Chronological Timeline View"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-[11px] font-mono hidden sm:inline">Timeline</span>
              </button>

              <button
                onClick={() => setViewMode('gallery3d')}
                className={`p-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 ${
                  viewMode === 'gallery3d'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Virtual 3D Gallery Exhibition"
              >
                <Box className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono hidden sm:inline">3D Gallery</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout (Sidebar + Content) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* FILTERING SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? 'w-72 border-r border-white/10' : 'w-0 overflow-hidden'
          } transition-all duration-300 bg-zinc-900/60 backdrop-blur-md flex flex-col shrink-0 z-20`}
        >
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-200">
                Filter Archives
              </h3>
            </div>
            {(selectedRegion !== 'All Regions' ||
              selectedPeriod !== 'All Eras' ||
              selectedTag !== 'All Tags' ||
              searchQuery ||
              onlyBookmarked) && (
              <button
                onClick={clearFilters}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-300 underline"
              >
                Reset
              </button>
            )}
          </div>

          <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs scrollbar-thin">
            {/* Search Input in Sidebar */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Keywords Search
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rulers, write scripts, artifacts..."
                  className="w-full bg-zinc-950 border border-white/10 focus:border-amber-500/60 rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 outline-none transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Region Toggles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" /> Geographic Region
                </label>
              </div>

              <div className="space-y-1">
                {REGIONS.map((region) => {
                  const active = selectedRegion === region;
                  const count = regionCounts[region] || 0;

                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`w-full px-3 py-2 rounded-xl text-left font-mono text-xs flex items-center justify-between transition-all ${
                        active
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-sm'
                          : 'bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 border border-transparent hover:border-white/5'
                      }`}
                    >
                      <span className="truncate">{region}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          active ? 'bg-amber-500/30 text-amber-200' : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Era/Period Filter */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> Historical Era
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {PERIODS.map((period) => {
                  const active = selectedPeriod === period;
                  return (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-2.5 py-1.5 rounded-lg text-left font-mono text-[11px] truncate transition ${
                        active
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-semibold'
                          : 'bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 border border-transparent'
                      }`}
                    >
                      {period}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feature Tag Filters */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-400" /> Achievement Tags
              </label>
              <div className="flex flex-wrap gap-1">
                {FEATURE_TAGS.map((tag) => {
                  const active = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2 py-1 rounded-md text-[10px] font-mono transition ${
                        active
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : 'bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 border border-white/5'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Sort Sequence
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 outline-none cursor-pointer"
              >
                <option value="chronological">Chronological (Oldest First)</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
                <option value="achievements">Most Achievements</option>
                <option value="confidence">Highest Citation Rating</option>
              </select>
            </div>

            {/* Bookmarked Filter Toggle */}
            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => setOnlyBookmarked(!onlyBookmarked)}
                className={`w-full py-2 px-3 rounded-xl border font-mono text-xs flex items-center justify-between transition ${
                  onlyBookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                    : 'bg-zinc-950/60 text-zinc-400 border-white/5 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 fill-current text-amber-400" /> Bookmarked Records
                </span>
                <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded">
                  {bookmarkedIds.length}
                </span>
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto flex flex-col p-6 space-y-6 scrollbar-thin">
          {/* Active Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-zinc-900/40 p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-zinc-400 font-mono">
                Showing <strong className="text-amber-400">{filteredCivilizations.length}</strong> of {CIVILIZATION_ARCHIVE.length} civilizations
              </span>
              {selectedRegion !== 'All Regions' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px]">
                  Region: {selectedRegion}
                </span>
              )}
              {selectedPeriod !== 'All Eras' && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 font-mono text-[10px]">
                  Era: {selectedPeriod}
                </span>
              )}
              {selectedTag !== 'All Tags' && (
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-[10px]">
                  Tag: {selectedTag}
                </span>
              )}
            </div>

            {(selectedRegion !== 'All Regions' ||
              selectedPeriod !== 'All Eras' ||
              selectedTag !== 'All Tags' ||
              searchQuery ||
              onlyBookmarked) && (
              <button
                onClick={clearFilters}
                className="text-amber-400 hover:text-amber-300 font-mono text-[11px] underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear Filters
              </button>
            )}
          </div>

          {/* Interactive Chronological Spectrum Bar */}
          {viewMode !== 'map' && (
            <div className="bg-zinc-900/80 border border-amber-500/20 rounded-2xl p-4 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                    Chronological Spectrum (3100 BCE – 1974 CE)
                  </h3>
                </div>
                <button
                  onClick={() => setShowTimelineHeader(!showTimelineHeader)}
                  className="text-[11px] font-mono text-zinc-400 hover:text-amber-300 transition"
                >
                  {showTimelineHeader ? 'Hide Timeline' : 'Show Timeline'}
                </button>
              </div>

              {showTimelineHeader && (
                <div className="space-y-2">
                  <div className="relative h-5 border-b border-white/10 font-mono text-[9px] text-zinc-500 select-none">
                    <span className="absolute left-0">3000 BCE</span>
                    <span className="absolute left-[23%]">2000 BCE</span>
                    <span className="absolute left-[44%]">1000 BCE</span>
                    <span className="absolute left-[62%]">0 CE</span>
                    <span className="absolute left-[81%]">1000 CE</span>
                    <span className="absolute right-0">2000 CE</span>
                  </div>

                  <div className="relative h-28 overflow-y-auto scrollbar-thin space-y-1.5 py-1">
                    {filteredCivilizations.map((civ) => {
                      const leftPercent = Math.max(0, ((civ.startYear - minTimelineYear) / totalYearSpan) * 100);
                      const rightPercent = Math.min(100, ((civ.endYear - minTimelineYear) / totalYearSpan) * 100);
                      const widthPercent = Math.max(2.5, rightPercent - leftPercent);
                      const isHovered = hoveredTimelineId === civ.id;

                      return (
                        <div
                          key={civ.id}
                          onClick={() => {
                            setSelectedCiv(civ);
                            setActiveTab('overview');
                          }}
                          onMouseEnter={() => setHoveredTimelineId(civ.id)}
                          onMouseLeave={() => setHoveredTimelineId(null)}
                          className="relative h-5 group cursor-pointer flex items-center"
                        >
                          <div
                            className={`absolute h-4 rounded-md border transition-all duration-300 flex items-center px-2 overflow-hidden ${
                              isHovered
                                ? 'ring-2 ring-amber-400 z-10 shadow-[0_0_15px_rgba(217,119,6,0.5)] scale-y-110'
                                : 'hover:brightness-125'
                            }`}
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                              background: `linear-gradient(90deg, ${civ.badgeColor}CC 0%, ${civ.badgeColor}66 100%)`,
                              borderColor: civ.badgeColor,
                            }}
                          >
                            <span className="text-[10px] font-mono text-white font-medium truncate whitespace-nowrap drop-shadow-md">
                              {civ.name} ({civ.era})
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW MODES */}
          {filteredCivilizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-200">No Matching Civilizations</h3>
                <p className="text-xs text-zinc-500 max-w-sm mt-1">
                  No records match your selected criteria. Try resetting region or era filters.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono transition"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'gallery3d' ? (
            /* 3D EXHIBITION GALLERY VIEW MODE */
            <div className="flex-1 min-h-[550px] h-full flex flex-col">
              <Artifact3DGallery initialCivId={selectedCiv ? selectedCiv.id : null} />
            </div>
          ) : viewMode === 'map' ? (
            /* LEAFLET MAP VIEW MODE WITH LAZY SUSPENSE LOADING */
            <div className="flex-1 min-h-[550px] h-full flex flex-col">
              <Suspense fallback={<MapLoadingSkeleton />}>
                <CivilizationMap
                  civilizations={filteredCivilizations}
                  onSelectCiv={(civ) => {
                    setSelectedCiv(civ);
                    setActiveTab('overview');
                  }}
                  accentColor={activeGuardian.accentColor}
                />
              </Suspense>
            </div>
          ) : viewMode === 'grid' ? (
            /* GRID VIEW MODE WITH LAZY LOADED IMAGES */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCivilizations.map((civ) => {
                const isBookmarked = bookmarkedIds.includes(civ.id);
                const isThisSpeaking = activeNarrationCivId === civ.id && isSpeaking;

                return (
                  <div
                    key={civ.id}
                    onClick={() => {
                      setSelectedCiv(civ);
                      setActiveTab('overview');
                    }}
                    className="group relative rounded-2xl bg-zinc-900/70 hover:bg-zinc-900/90 border border-white/10 hover:border-amber-500/60 p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xl hover:shadow-[0_0_30px_rgba(217,119,6,0.25)] hover:scale-[1.02] overflow-hidden"
                  >
                    <div
                      className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-60 transition-all duration-500"
                      style={{ background: civ.badgeColor }}
                    />

                    <div className="relative h-36 w-full rounded-xl overflow-hidden mb-4 border border-white/10 group-hover:border-amber-500/40 transition-colors">
                      {civ.imageUrl ? (
                        <>
                          <LazyImage
                            src={civ.imageUrl}
                            alt={civ.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            wrapperClassName="w-full h-full"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
                        </>
                      ) : (
                        <AfrofuturistArtPlaceholder
                          civId={civ.id}
                          title={civ.name}
                          badgeColor={civ.badgeColor}
                        />
                      )}
                      <span
                        className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-mono tracking-wider uppercase font-semibold backdrop-blur-md z-10"
                        style={{
                          background: `${civ.badgeColor}CC`,
                          color: '#fff',
                        }}
                      >
                        {civ.subRegion || civ.region}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          {!civ.imageUrl && (
                            <span
                              className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded font-semibold inline-block mb-1"
                              style={{
                                background: `${civ.badgeColor}18`,
                                color: civ.badgeColor,
                                border: `1px solid ${civ.badgeColor}33`,
                              }}
                            >
                              {civ.subRegion || civ.region}
                            </span>
                          )}
                          <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                            {civ.name}
                          </h3>
                          {civ.nativeName && (
                            <p className="text-xs font-mono text-amber-400/90 mt-0.5">
                              {civ.nativeName}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Quick Listen Button */}
                          <button
                            onClick={(e) => startNarration(civ, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isThisSpeaking
                                ? 'bg-amber-500 text-zinc-950 border-amber-400 animate-pulse'
                                : 'bg-zinc-950/60 text-zinc-400 border-white/10 hover:text-amber-300'
                            }`}
                            title="Listen to Narration"
                          >
                            {isLoadingAudio && activeNarrationCivId === civ.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={(e) => toggleBookmark(civ.id, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isBookmarked
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                : 'bg-zinc-950/60 text-zinc-500 border-white/10 hover:text-zinc-200'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1 mb-3">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{civ.era}</span>
                      </div>

                      <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed mb-4">
                        {getTranslatedSummary(civ.id, language, civ.summary)}
                      </p>

                      <div className="space-y-2 mb-4 bg-zinc-950/70 p-3 rounded-xl border border-white/5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase font-mono flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-zinc-400" /> Capital
                          </span>
                          <span className="text-zinc-200 font-medium truncate max-w-[170px]">
                            {civ.capitals.join(', ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-500 text-[10px] uppercase font-mono flex items-center gap-1">
                            <Crown className="w-3 h-3 text-zinc-400" /> Governance
                          </span>
                          <span className="text-zinc-300 truncate max-w-[170px] text-[11px]">
                            {civ.governance.split(' ')[0]} {civ.governance.split(' ')[1]}...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={(e) => handleAskOracle(civ, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-[11px] font-mono flex items-center gap-1 transition"
                      >
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>Oracle</span>
                      </button>

                      <button
                        onClick={(e) => handleCompare(civ, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-white/10 text-zinc-300 text-[11px] font-mono flex items-center gap-1 transition"
                      >
                        <Scale className="w-3 h-3 text-blue-400" />
                        <span>Compare</span>
                      </button>

                      <span className="text-amber-400 font-mono text-[11px] font-medium flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        Inspect <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : viewMode === 'list' ? (
            /* COMPACT LIST VIEW MODE WITH LAZY IMAGES */
            <div className="space-y-3">
              {filteredCivilizations.map((civ) => {
                const isBookmarked = bookmarkedIds.includes(civ.id);
                const isThisSpeaking = activeNarrationCivId === civ.id && isSpeaking;

                return (
                  <div
                    key={civ.id}
                    onClick={() => {
                      setSelectedCiv(civ);
                      setActiveTab('overview');
                    }}
                    className="rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/10 hover:border-amber-500/40 p-4 transition-all hover:scale-[1.005] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group shadow-md"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {civ.imageUrl ? (
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10">
                          <LazyImage
                            src={civ.imageUrl}
                            alt={civ.name}
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border mt-0.5"
                          style={{
                            background: `${civ.badgeColor}15`,
                            borderColor: `${civ.badgeColor}44`,
                            color: civ.badgeColor,
                          }}
                        >
                          <Landmark className="w-5 h-5" />
                        </div>
                      )}

                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                            {civ.name}
                          </h3>
                          <span className="text-xs font-mono text-zinc-400">({civ.era})</span>
                          <span
                            className="text-[9px] font-mono px-2 py-0.5 rounded"
                            style={{
                              background: `${civ.badgeColor}18`,
                              color: civ.badgeColor,
                              border: `1px solid ${civ.badgeColor}33`,
                            }}
                          >
                            {civ.subRegion || civ.region}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 line-clamp-1">{getTranslatedSummary(civ.id, language, civ.summary)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => startNarration(civ, e)}
                        className={`p-1.5 rounded-lg border transition ${
                          isThisSpeaking
                            ? 'bg-amber-500 text-zinc-950 border-amber-400 animate-pulse'
                            : 'bg-zinc-950 text-zinc-400 border-white/10 hover:text-amber-300'
                        }`}
                        title="Listen to narration"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleAskOracle(civ, e)}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Oracle</span>
                      </button>

                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TIMELINE VIEW MODE */
            <div className="space-y-4 relative border-l-2 border-amber-500/30 pl-6 ml-4">
              {filteredCivilizations.map((civ, idx) => (
                <div
                  key={civ.id}
                  onClick={() => {
                    setSelectedCiv(civ);
                    setActiveTab('overview');
                  }}
                  className="relative group bg-zinc-900/80 hover:bg-zinc-900 border border-white/10 hover:border-amber-500/50 p-5 rounded-2xl transition-all cursor-pointer shadow-lg hover:scale-[1.01]"
                >
                  <div
                    className="absolute -left-[31px] top-6 w-4 h-4 rounded-full border-2 border-zinc-950"
                    style={{ background: civ.badgeColor }}
                  />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          #{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {civ.name}
                        </h3>
                        <span className="text-xs font-mono text-zinc-400">({civ.era})</span>
                        <span
                          className="text-[9px] font-mono px-2 py-0.5 rounded"
                          style={{
                            background: `${civ.badgeColor}18`,
                            color: civ.badgeColor,
                            border: `1px solid ${civ.badgeColor}33`,
                          }}
                        >
                          {civ.eraPeriod}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300">{getTranslatedSummary(civ.id, language, civ.summary)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => startNarration(civ, e)}
                        className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCiv(civ);
                          setActiveTab('overview');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono shrink-0 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* DETAIL MODAL WITH LAZY IMAGES AND AI VOICE NARATION */}
      {selectedCiv && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-amber-500/40 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative">
            {/* Modal Header */}
            <div className="relative border-b border-white/10 overflow-hidden min-h-[160px] flex flex-col justify-end p-6">
              {selectedCiv.imageUrl ? (
                <>
                  <LazyImage
                    src={selectedCiv.imageUrl}
                    alt={selectedCiv.name}
                    className="w-full h-full object-cover"
                    wrapperClassName="absolute inset-0 w-full h-full"
                  />
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background: `linear-gradient(180deg, rgba(10,10,18,0.4) 0%, rgba(9,9,11,0.95) 100%)`,
                    }}
                  />
                </>
              ) : (
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, rgba(15,15,25,0.98) 0%, ${selectedCiv.badgeColor}25 100%)`,
                  }}
                />
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedCiv(null)}
                className="absolute right-5 top-5 p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/20 transition z-20 backdrop-blur-md"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md"
                      style={{
                        background: `${selectedCiv.badgeColor}33`,
                        color: selectedCiv.badgeColor,
                        border: `1px solid ${selectedCiv.badgeColor}66`,
                      }}
                    >
                      {selectedCiv.subRegion || selectedCiv.region}
                    </span>
                    <span className="text-xs text-zinc-300 font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-md">
                      {selectedCiv.era}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide drop-shadow-md">
                    {selectedCiv.name}
                  </h2>

                  {selectedCiv.nativeName && (
                    <p className="text-sm font-mono text-amber-300 mt-0.5 drop-shadow">
                      Native Title: {selectedCiv.nativeName}
                    </p>
                  )}
                </div>

                {/* ELEVENLABS / AI NARRATION LISTEN CONTROL & AR VIEW */}
                <div className="flex flex-wrap items-center gap-2 bg-zinc-900/90 border border-amber-500/40 p-2 rounded-2xl backdrop-blur-md self-start sm:self-auto">
                  <button
                    onClick={() => setShowARModal(true)}
                    className="px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 hover:brightness-110 transition shadow-lg"
                    title="Overlay 3D architectural models onto camera feed"
                  >
                    <Box className="w-4 h-4" />
                    <span>Simulated AR View</span>
                  </button>

                  <button
                    onClick={(e) => startNarration(selectedCiv, e)}
                    disabled={isLoadingAudio}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition shadow-lg ${
                      activeNarrationCivId === selectedCiv.id && isSpeaking
                        ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                        : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
                    }`}
                  >
                    {isLoadingAudio && activeNarrationCivId === selectedCiv.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>Generating Voice...</span>
                      </>
                    ) : activeNarrationCivId === selectedCiv.id && isSpeaking ? (
                      <>
                        <Volume2 className="w-4 h-4 text-zinc-950 animate-bounce" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span>Listen to AI Summary</span>
                      </>
                    )}
                  </button>

                  {/* Pause / Stop Controls when active */}
                  {activeNarrationCivId === selectedCiv.id && (isSpeaking || isPaused) && (
                    <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                      <button
                        onClick={togglePauseNarration}
                        className="p-1.5 rounded-lg bg-zinc-800 text-amber-300 hover:text-white"
                        title={isPaused ? 'Resume' : 'Pause'}
                      >
                        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={stopNarration}
                        className="p-1.5 rounded-lg bg-zinc-800 text-red-400 hover:text-red-300"
                        title="Stop Narration"
                      >
                        <Square className="w-3.5 h-3.5" />
                      </button>

                      {/* Animated Audio Bars */}
                      <div className="flex items-end gap-0.5 h-4 px-1">
                        <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_100ms] h-full rounded-full" />
                        <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_300ms] h-2/3 rounded-full" />
                        <span className="w-0.5 bg-amber-400 animate-[bounce_1s_infinite_200ms] h-4/5 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/10 bg-zinc-900/70 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Overview & Summary', icon: BookOpen },
                { id: 'exhibition3d', label: '3D Exhibition Room', icon: Box },
                { id: 'culture', label: 'Culture & Society', icon: Layers },
                { id: 'governance', label: 'Governance & Statecraft', icon: Crown },
                { id: 'science', label: 'Science & Tech', icon: Sparkles },
                { id: 'trade', label: 'Trade & Economy', icon: Coins },
                { id: 'religion', label: 'Cosmology & Faith', icon: Compass },
                { id: 'rulers', label: 'Rulers & Artifacts', icon: Landmark },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2.5 rounded-t-xl text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap border-b-2 ${
                      active
                        ? 'bg-zinc-950 text-amber-300 border-amber-500 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Tab Content */}
            <div
              onScroll={handleModalScroll}
              className="p-6 overflow-y-auto space-y-6 flex-1 text-xs leading-relaxed text-zinc-300 scrollbar-thin scrollbar-thumb-amber-500/30"
            >
              {activeTab === 'exhibition3d' && (
                <div className="p-1">
                  <Artifact3DGallery initialCivId={selectedCiv.id} />
                </div>
              )}

              {activeTab === 'overview' && (
                <div className="space-y-5">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white font-display">Historical Summary</h3>
                      {audioSource && activeNarrationCivId === selectedCiv.id && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          Narrated via {audioSource === 'elevenlabs' ? 'HoloKai Voice AI' : 'Speech Synthesizer'}
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-300 text-xs leading-relaxed">{getTranslatedSummary(selectedCiv.id, language, selectedCiv.summary)}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                        Capitals & Centers
                      </h4>
                      <p className="text-zinc-200 font-medium">{selectedCiv.capitals.join(', ')}</p>
                    </div>

                    <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                        Linguistic & Writing Systems
                      </h4>
                      <p className="text-zinc-200 font-medium">{selectedCiv.language}</p>
                    </div>
                  </div>

                  {selectedCiv.galleryImages && selectedCiv.galleryImages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-amber-400" /> Historical Visual Gallery
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedCiv.galleryImages.map((imgUrl, idx) => (
                          <div key={idx} className="h-28 rounded-xl overflow-hidden border border-white/10 group relative">
                            <LazyImage
                              src={imgUrl}
                              alt={`${selectedCiv.name} artifact ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              wrapperClassName="w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-400" /> Major Historical Accomplishments
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedCiv.keyAchievements.map((ach, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-zinc-900/60 p-3 rounded-xl border border-white/5">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-zinc-200 text-xs">{ach}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'culture' && (
                <div className="space-y-5">
                  <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl space-y-2">
                    <h3 className="text-sm font-bold text-amber-300 font-display flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-400" /> Cultural Ethos & Social Heritage
                    </h3>
                    <p className="text-zinc-200 leading-relaxed text-xs">
                      {selectedCiv.culturalContext || 'Rich oral, musical, artistic, and philosophical traditions that sustained communal solidarity across generations.'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'governance' && (
                <div className="space-y-4">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" /> Political Structure & Statecraft
                    </h3>
                    <p className="text-zinc-200 leading-relaxed text-xs">{selectedCiv.governance}</p>
                  </div>
                </div>
              )}

              {activeTab === 'science' && (
                <div className="space-y-4">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" /> Metallurgy, Mathematics & Architecture
                    </h3>
                    <p className="text-zinc-200 leading-relaxed text-xs">{selectedCiv.scienceTech}</p>
                  </div>
                  <div className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                      Architectural Masterworks
                    </h4>
                    <p className="text-zinc-300">{selectedCiv.architecture}</p>
                  </div>
                </div>
              )}

              {activeTab === 'trade' && (
                <div className="space-y-4">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <Coins className="w-4 h-4 text-amber-400" /> Commercial Commerce & Trade Networks
                    </h3>
                    <p className="text-zinc-200 leading-relaxed text-xs">{selectedCiv.economyTrade}</p>
                  </div>
                </div>
              )}

              {activeTab === 'religion' && (
                <div className="space-y-4">
                  <div className="bg-zinc-900/60 p-4 rounded-xl border border-white/10 space-y-2">
                    <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400" /> Spiritual Beliefs & Cosmology
                    </h3>
                    <p className="text-zinc-200 leading-relaxed text-xs">{selectedCiv.religion}</p>
                  </div>
                </div>
              )}

              {activeTab === 'rulers' && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white font-display">Notable Sovereign Rulers & Figures</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCiv.keyRulers.map((r, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-white/10 text-amber-200 font-mono text-xs">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedCiv.artifacts && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-white font-display">Cataloged Masterwork Artifacts</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedCiv.artifacts.map((art, i) => (
                          <div key={i} className="p-3 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-amber-400 shrink-0" />
                            <span className="text-zinc-200 font-mono text-xs">{art}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* SUBTLE GOLD READING PROGRESS BAR */}
            <div className="w-full bg-zinc-950/90 h-1.5 relative overflow-hidden shrink-0 border-t border-amber-500/20" title="Historical Reading Progress">
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.9)] transition-all duration-150 ease-out"
                style={{ width: `${modalScrollProgress}%` }}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-white/10 bg-zinc-900/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleAskOracle(selectedCiv, e)}
                  className="px-4 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-mono flex items-center gap-2 transition shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Deep Query via HoloKai Oracle AI</span>
                </button>

                <button
                  onClick={(e) => handleShareCiv(selectedCiv, e)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition border shadow-md ${
                    copiedCivLink
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                      : 'bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border-amber-500/40'
                  }`}
                  title="Copy deep-link URL for this civilization entry"
                >
                  {copiedCivLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Deep Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-amber-400" />
                      <span>Share Entry</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span className="hidden sm:inline">Use <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-amber-300">←</kbd> <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-amber-300">→</kbd> to navigate, <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-amber-300">ESC</kbd> to close</span>
                <button
                  onClick={() => setSelectedCiv(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition"
                >
                  Close Archive View
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATED AR ARCHITECTURE VIEW MODAL */}
      {showARModal && selectedCiv && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col justify-between p-4 md:p-6 backdrop-blur-2xl animate-fadeIn">
          {/* AR HUD Header */}
          <div className="flex items-center justify-between border border-amber-500/30 p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest block font-bold">
                  SPATIAL AR ARCHITECTURE ENGINE
                </span>
                <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
                  3D Structural Overlay: {selectedCiv.name} Monuments
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                AR Camera Feed Active
              </span>
              <button
                onClick={() => setShowARModal(false)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* AR CAMERA FEED + 3D MODEL VIEWPORT */}
          <div className="relative flex-1 my-4 rounded-3xl overflow-hidden border border-amber-500/30 bg-zinc-950 flex flex-col items-center justify-center p-6 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
            {/* Camera Grid & Scanning Reticle */}
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none animate-pulse" />

            {/* Spatial HUD Frame Corner Elements */}
            <div className="absolute inset-8 border border-dashed border-amber-500/30 rounded-2xl pointer-events-none p-4 flex flex-col justify-between">
              <div className="flex justify-between text-[10px] font-mono text-amber-400/80">
                <span>+ CAMERA FOV: 78.4°</span>
                <span>GEO-ANCHOR: {selectedCiv.subRegion || selectedCiv.region}</span>
                <span>+ YAW: +18.2°</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-amber-400/80">
                <span>+ SCALE MESH: {ar3dModelScale.toFixed(1)}x</span>
                <span>SPLINE 3D MESH LOCKED</span>
                <span>+ PITCH: -3.5°</span>
              </div>
            </div>

            {/* Interactive 3D Model Card */}
            <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center space-y-6">
              <div
                className="w-80 h-80 rounded-3xl border-2 border-amber-400/80 bg-gradient-to-br from-amber-950/80 via-zinc-900/90 to-zinc-950 p-6 flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing shadow-[0_0_60px_rgba(245,158,11,0.35)] transition-transform duration-100"
                style={{
                  transform: `scale(${ar3dModelScale}) rotateY(${ar3dModelRotation}deg)`,
                }}
              >
                <div className="w-40 h-40 border-2 border-amber-400 rotate-45 rounded-2xl flex items-center justify-center animate-[spin_25s_linear_infinite] shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                  <Box className="w-20 h-20 text-amber-300 animate-pulse" />
                </div>

                <span className="text-sm font-mono font-bold text-amber-300 mt-6 tracking-wider uppercase block">
                  {selectedCiv.name} Monumental Architecture
                </span>
                <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                  Real-time Spline 3D Structural Mesh Overlay
                </span>

                {/* Hotspot Annotation Callouts */}
                <div className="absolute -top-3 -right-3 px-3 py-1 rounded-xl bg-amber-500 text-zinc-950 font-mono text-[9px] font-bold shadow-xl animate-bounce">
                  Structural Masonry Hotspot
                </div>
              </div>

              {/* Slider Controls */}
              <div className="w-full bg-zinc-950/90 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-4 z-20 backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                  <span>3D Rotation:</span>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={ar3dModelRotation}
                    onChange={(e) => setAr3dModelRotation(Number(e.target.value))}
                    className="accent-amber-500 cursor-pointer"
                  />
                  <span>{ar3dModelRotation}°</span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                  <span>Zoom Scale:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={ar3dModelScale}
                    onChange={(e) => setAr3dModelScale(Number(e.target.value))}
                    className="accent-amber-500 cursor-pointer"
                  />
                  <span>{ar3dModelScale.toFixed(1)}x</span>
                </div>
              </div>
            </div>
          </div>

          {/* AR HUD Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/90 p-4 rounded-2xl border border-amber-500/30 backdrop-blur-md z-20">
            <p className="text-xs font-mono text-zinc-300">
              <strong className="text-amber-400">Simulated AR View:</strong> Overlaying 3D architecture models onto camera viewport. Adjust rotation & scale to inspect ancient engineering.
            </p>
            <button
              onClick={() => {
                alert(`AR Snapshot of ${selectedCiv.name} 3D model captured to clipboard and session log!`);
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 transition shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span>Capture AR Snapshot</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
