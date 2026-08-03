import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/core/Sidebar';
import ShellHeader from '@/components/core/ShellHeader';
import ShellQuickNav from '@/components/core/ShellQuickNav';
import CommandPalette from '@/components/core/CommandPalette';
import DockedGuardian from '@/components/core/DockedGuardian';
import ResearchChat from '@/components/core/ResearchChat';
import Library from '@/components/core/Library';
import TimelineExplorer from '@/components/core/TimelineExplorer';
import InteractiveMap from '@/components/core/InteractiveMap';
import ManuscriptViewer from '@/components/core/ManuscriptViewer';
import KnowledgeGraph from '@/components/core/KnowledgeGraph';
import CompareCivilizations from '@/components/core/CompareCivilizations';
import OralTraditionExplorer from '@/components/core/OralTraditionExplorer';
import VanguardPanel from '@/components/core/VanguardPanel';
import OracleCorePanel from '@/components/core/OracleCorePanel';
import SourceDrawer from '@/components/core/SourceDrawer';
import StudioEditor from '@/components/core/StudioEditor';
import LogUpdateDialog from '@/components/core/LogUpdateDialog';
import CivilizationArchive from '@/components/core/CivilizationArchive';
import Artifact3DGallery from '@/components/core/Artifact3DGallery';
import KnowledgeNavigator from '@/components/core/KnowledgeNavigator';

import SectionSkeleton from '@/components/ui/SectionSkeleton';
import AmbientSoundscapeToggle from '@/components/ui/AmbientSoundscapeToggle';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { retroAudio } from '@/lib/audioFeedback';
import {
  Sparkles, Landmark, MessageSquare, Library as LibraryIcon, Clock, Map,
  ScrollText, GitBranch, Scale, Volume2, ShieldCheck, PenTool, Box, Compass
} from 'lucide-react';

// Panel View Registry
const PANELS = {
  oracle: OracleCorePanel,
  navigator: KnowledgeNavigator,
  archive: CivilizationArchive,
  gallery3d: Artifact3DGallery,
  chat: ResearchChat,
  library: Library,
  timeline: TimelineExplorer,
  map: InteractiveMap,
  manuscripts: ManuscriptViewer,
  'knowledge-graph': KnowledgeGraph,
  compare: CompareCivilizations,
  'oral-tradition': OralTraditionExplorer,
  vanguard: VanguardPanel,
  studio: StudioEditor,
};

const TAB_NAV = [
  { id: 'oracle', label: 'Oracle Portal', icon: Sparkles, badge: 'AI Voice & Telemetry' },
  { id: 'navigator', label: 'Knowledge Navigator', icon: Compass, badge: 'Firestore Historical Records' },
  { id: 'archive', label: 'Civilization Archive', icon: Landmark, badge: '14 Empires' },
  { id: 'gallery3d', label: '3D Gallery Exhibition', icon: Box, badge: 'Spline Virtual Tour' },
  { id: 'chat', label: 'Research AI Chat', icon: MessageSquare, badge: 'Multi-Turn' },
  { id: 'knowledge-graph', label: 'Knowledge Graph', icon: GitBranch, badge: 'D3 Force Network' },
  { id: 'library', label: 'Universal Codex', icon: LibraryIcon, badge: '2,400+ Texts' },
  { id: 'timeline', label: 'Timeline Scrubber', icon: Clock, badge: '3100 BCE – Present' },
  { id: 'map', label: 'Leaflet Map', icon: Map, badge: 'Geographic GIS' },
  { id: 'manuscripts', label: 'Manuscript Reader', icon: ScrollText, badge: 'High-Res Manuscripts' },
  { id: 'compare', label: 'Compare Matrix', icon: Scale, badge: 'Side-by-Side Analysis' },
  { id: 'oral-tradition', label: 'Oral Traditions', icon: Volume2, badge: 'Griot Soundscapes' },
  { id: 'vanguard', label: 'Vanguard Validator', icon: ShieldCheck, badge: 'Peer Verification' },
  { id: 'studio', label: 'Studio Canvas', icon: PenTool, badge: 'Artifact Generator' },
];

export default function CivilizationCore({ initialView = 'oracle' }) {
  const { activeGuardian, aiState } = useHoloKai();

  // Navigation View State
  const [view, setView] = useState(initialView);
  const [isSwitchingSection, setIsSwitchingSection] = useState(false);
  const [, setSourceToOpen] = useState(null);
  const [showLogUpdate, setShowLogUpdate] = useState(false);
  const [sourceDrawerCitation, setSourceDrawerCitation] = useState(null);

  // FX & Customization State
  const [scanlineEnabled, setScanlineEnabled] = useState(true);
  const [soundEffectsEnabled] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Search Palette State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Citation Handlers
  const handleOpenCitation = (citation) => {
    setSourceDrawerCitation(citation);
    if (soundEffectsEnabled) retroAudio.playGlassHoverHum();
  };

  const handleCloseCitation = () => {
    setSourceDrawerCitation(null);
  };

  const handleNavigate = (panelId) => {
    if (soundEffectsEnabled) retroAudio.playClick();
    if (panelId !== view) {
      setIsSwitchingSection(true);
      setView(panelId);
      setTimeout(() => setIsSwitchingSection(false), 250);
    }
    setSourceToOpen(null);
    setMobileDrawerOpen(false);
  };

  const handleSelectSource = (source) => {
    if (soundEffectsEnabled) retroAudio.playOracleChime();
    setIsSwitchingSection(true);
    setSourceToOpen(source);
    setView('manuscripts');
    setTimeout(() => setIsSwitchingSection(false), 250);
    setMobileDrawerOpen(false);
  };

  // Auto close mobile drawer on resize or nav
  const handleToggleSidebar = () => {
    if (soundEffectsEnabled) retroAudio.playClick();
    if (window.innerWidth < 1024) {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  // Keyboard Shortcuts (Cmd+K / Ctrl+K for search, Esc to close search & modals)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        if (soundEffectsEnabled) retroAudio.playOracleChime();
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (showLogUpdate) setShowLogUpdate(false);
        if (sourceDrawerCitation) setSourceDrawerCitation(null);
        if (mobileDrawerOpen) setMobileDrawerOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, showLogUpdate, sourceDrawerCitation, mobileDrawerOpen, soundEffectsEnabled]);

  const ActivePanelComponent = PANELS[view] || OracleCorePanel;

  // Props passed down to child panels
  const panelProps =
    view === 'library'
      ? { onSelectSource: handleSelectSource }
      : view === 'archive'
      ? {
          onNavigateToOracle: () => {
            if (soundEffectsEnabled) retroAudio.playOracleChime();
            setView('oracle');
          },
          onCompareCivilization: () => {
            if (soundEffectsEnabled) retroAudio.playClick();
            setView('compare');
          },
          externalSearchQuery: globalSearchQuery,
        }
      : view === 'oracle'
      ? {
          onSelectSource: handleSelectSource,
        }
      : {};

  return (
    <div className="flex h-screen overflow-hidden relative font-sans transition-colors duration-500 bg-[#06070a] text-zinc-100 selection:bg-amber-500/20 selection:text-amber-400">
      {/* Desktop Main Sidebar Navigation */}
      {!sidebarCollapsed && (
        <div className="hidden lg:block h-screen">
          <Sidebar activeView={view} onNavigate={handleNavigate} />
        </div>
      )}

      {/* Mobile Overlay Navigation Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-zinc-950 border-r border-white/10 flex flex-col shadow-2xl animate-fadeIn">
            <Sidebar
              activeView={view}
              onNavigate={handleNavigate}
              onClose={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Primary Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10 transition-all duration-500 bg-[#090a0f]">
        {/* TOP INTEGRATED HEADER */}
        <ShellHeader
          view={view}
          onNavigate={handleNavigate}
          sidebarCollapsed={sidebarCollapsed}
          mobileDrawerOpen={mobileDrawerOpen}
          onToggleSidebar={handleToggleSidebar}
          globalSearchQuery={globalSearchQuery}
          setGlobalSearchQuery={setGlobalSearchQuery}
          onOpenSearchModal={() => {
            if (soundEffectsEnabled) retroAudio.playOracleChime();
            setIsSearchOpen(true);
          }}
          scanlineEnabled={scanlineEnabled}
          onToggleScanline={(val) => {
            setScanlineEnabled(val);
            if (soundEffectsEnabled) retroAudio.playClick();
          }}
          onOpenLogUpdate={() => {
            if (soundEffectsEnabled) retroAudio.playClick();
            setShowLogUpdate(true);
          }}
          tabNav={TAB_NAV}
        />

        {/* ACTIVE MONOLITHIC PANEL WORKSPACE */}
        <div className="flex-1 overflow-hidden relative">
          {isSwitchingSection ? (
            <SectionSkeleton variant={view} />
          ) : (
            <ActivePanelComponent {...panelProps} />
          )}
        </div>


      </main>

      {/* FLOATING QUICK NAVIGATION CAPSULE MENU */}
      <ShellQuickNav currentView={view} onNavigate={handleNavigate} />

      {/* FLOATING AMBIENT ERA SOUNDSCAPE TOGGLE */}
      <AmbientSoundscapeToggle activeText={globalSearchQuery} />

      {/* Citation Source Drawer */}
      <SourceDrawer open={!!sourceDrawerCitation} onClose={handleCloseCitation} citation={sourceDrawerCitation} />
      
      {/* Floating Guardian Companion */}
      <DockedGuardian aiState={aiState} />

      {/* Log Update Dialog */}
      <LogUpdateDialog open={showLogUpdate} onClose={() => setShowLogUpdate(false)} />

      {/* GLOBAL COMMAND PALETTE SEARCH MODAL (Cmd+K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        query={globalSearchQuery}
        setQuery={setGlobalSearchQuery}
        onSelectRecord={() => handleNavigate('archive')}
      />
    </div>
  );
}
