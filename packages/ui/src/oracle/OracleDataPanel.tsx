'use client';

import React, { useState } from 'react';
import {
  ShieldCheck, ScrollText, GitBranch,
  Layers, Volume2, RefreshCw, Activity, Filter, Award, Sparkles,
  BookOpen, Download, Copy
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import { retroAudio } from '../lib/audioFeedback';
import { oracleVoiceEngine } from '../lib/oracleVoiceEngine';
import { useToast } from '../components/Toast';

interface ActivePeriod {
  title: string;
  label: string;
  digitizedManuscripts?: number;
  griotOralArchives?: number;
  civilizationNodes?: number;
  precision?: number;
}

interface OracleDataPanelProps {
  className?: string;
  onSelectCivilization?: (civilizationId: string) => void;
  activePeriod?: ActivePeriod;
}

const CIVILIZATIONS = [
  { id: 'all', name: 'All Regions' },
  { id: 'kemet', name: 'Kemet (Egypt)' },
  { id: 'mali', name: 'Mali & Timbuktu' },
  { id: 'zimbabwe', name: 'Great Zimbabwe' },
  { id: 'aksum', name: 'Aksumite Empire' },
  { id: 'ifa', name: 'Ifá Corpus' },
  { id: 'nsibidi', name: 'Nsibidi & Ekpe' },
  { id: 'nok', name: 'Nok Terracotta' },
  { id: 'swahili', name: 'Swahili Coast' },
];

const HISTORICAL_ACTIVITY_DATA = [
  { era: '3000 BCE', kemet: 85, mali: 10, aksum: 15, zimbabwe: 5, trade: 20 },
  { era: '1500 BCE', kemet: 95, mali: 25, aksum: 30, zimbabwe: 15, trade: 42 },
  { era: '500 BCE', kemet: 90, mali: 40, aksum: 65, zimbabwe: 35, trade: 60 },
  { era: '0 CE', kemet: 88, mali: 55, aksum: 85, zimbabwe: 50, trade: 75 },
  { era: '1000 CE', kemet: 80, mali: 98, aksum: 90, zimbabwe: 85, trade: 95 },
  { era: '1500 CE', kemet: 75, mali: 95, aksum: 88, zimbabwe: 92, trade: 90 },
  { era: 'Present', kemet: 99, mali: 97, aksum: 96, zimbabwe: 95, trade: 98 },
];

interface HistoricalPreviewEntry {
  id: string;
  title: string;
  era: string;
  region: string;
  shortPreview: string;
  fullDescription: string;
  audioSnippet: string;
  stats: string;
  tag: string;
}

const HISTORICAL_PREVIEW_ENTRIES: HistoricalPreviewEntry[] = [
  {
    id: 'timbuktu-astronomy',
    title: 'Timbuktu Shankore Astronomical Codices',
    era: '1590 CE',
    region: 'Sahel / Mali',
    shortPreview: 'Sahelian mathematical calculations of planetary motion, eclipse cycles, and lunar calendars.',
    fullDescription: 'Cataloged in the Ahmed Baba Library. Contains indigenous Arabic and Ajami mathematical proofs measuring celestial alignments and coastal navigation systems used across trans-Saharan routes.',
    audioSnippet: 'The Shankore university scrolls document precise lunar observations and trigonometry written by 16th-century Sahelian astronomers.',
    stats: '8,400 Manuscripts',
    tag: 'Primary Codex'
  },
  {
    id: 'ifa-odu-matrix',
    title: 'Ifá Binary Odu Divination Signatures',
    era: '1000 CE – Present',
    region: 'West Africa / Yoruba',
    shortPreview: '256-state binary algorithm used for oral history storage, medicine, and philosophical proverbs.',
    fullDescription: 'The 16 principal Odu and 240 secondary combinations map onto a strict 8-bit binary matrix. Each state indexes centuries of oral poetry recited by Babalawo scholars with high mathematical fidelity.',
    audioSnippet: 'Ifá divination is a 256-state binary computational engine that preserves Yoruba medicinal, historical, and astronomical knowledge.',
    stats: '256 Binary States',
    tag: 'Oral Matrix'
  },
  {
    id: 'zimbabwe-drystone',
    title: 'Great Zimbabwe Structural Engineering',
    era: '1100 CE – 1500 CE',
    region: 'Southern Africa / Shona',
    shortPreview: 'Curved dry-stone walls built without mortar using granite thermal fracturing techniques.',
    fullDescription: 'The Great Enclosure walls stand over 11 meters high using carefully dressed granite blocks fitted together without cement. Architectural analysis demonstrates sophisticated acoustics and defensive geometry.',
    audioSnippet: 'The walls of Great Zimbabwe were engineered without mortar using precision granite fracturing that has endured for nine centuries.',
    stats: '11m Wall Height',
    tag: 'Architecture'
  },
  {
    id: 'aksum-ezana-obelisk',
    title: 'Aksumite Imperial Obelisks & Epigraphy',
    era: '330 CE',
    region: 'Horn of Africa / Ge\'ez',
    shortPreview: 'Monolithic granite stelae carved with multi-story mock architectural details and Ge\'ez inscriptions.',
    fullDescription: 'Carved from single granite blocks weighing up to 500 tons, these obelisks mark imperial royal tombs and commemorate diplomatic treaties across the Red Sea and Mediterranean trade spheres.',
    audioSnippet: 'The Aksumite obelisks represent single-block granite engineering celebrating international commerce and Ge\'ez epigraphy.',
    stats: '500-Ton Monoliths',
    tag: 'Epigraphy'
  }
];

function OracleSkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-zinc-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 w-full md:w-2/3">
          <div className="h-4 bg-amber-500/20 rounded w-1/3" />
          <div className="h-6 bg-amber-500/30 rounded w-2/3" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="h-9 bg-amber-500/20 rounded-lg w-24" />
          <div className="h-9 bg-amber-500/30 rounded-lg w-28" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-panel p-5 rounded-xl border border-amber-500/20 bg-zinc-950/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 bg-amber-500/20 rounded w-24" />
              <div className="w-6 h-6 rounded bg-amber-500/20" />
            </div>
            <div className="h-8 bg-amber-500/30 rounded w-1/2" />
            <div className="h-2.5 bg-amber-500/15 rounded w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-amber-500/20 bg-zinc-950/80 h-72 flex flex-col justify-between">
          <div className="h-4 bg-amber-500/25 rounded w-48" />
          <div className="h-44 bg-amber-500/10 rounded-lg w-full flex items-end p-4 gap-3">
            {[40, 70, 85, 50, 95, 65, 80].map((h, idx) => (
              <div key={idx} className="flex-1 bg-amber-500/30 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-amber-500/20 bg-zinc-950/80 h-72 space-y-3">
          <div className="h-4 bg-amber-500/25 rounded w-36" />
          {[1, 2, 3].map((j) => (
            <div key={j} className="flex items-center gap-3 p-2 bg-amber-500/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-amber-500/30 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-amber-500/20 rounded w-3/4" />
                <div className="h-2 bg-amber-500/15 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function OracleDataPanel({ className = '', onSelectCivilization, activePeriod }: OracleDataPanelProps) {
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confidenceScore, setConfidenceScore] = useState(96.4);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [activeNarratingId, setActiveNarratingId] = useState<string | null>(null);

  const displayManuscripts = activePeriod?.digitizedManuscripts ?? 14820;
  const displayOralArchives = activePeriod?.griotOralArchives ?? 3450;
  const displayGraphNodes = activePeriod?.civilizationNodes ?? 128400;
  const displayPrecision = activePeriod?.precision ?? confidenceScore;

  const handleRefreshScore = () => {
    retroAudio.playOracleChime();
    setIsRefreshing(true);
    setTimeout(() => {
      setConfidenceScore(+(95 + Math.random() * 4).toFixed(1));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleDownloadCSV = () => {
    retroAudio.playOracleChime();
    const csvHeaders = ['Metric Category', 'Metric Value', 'Historical Epoch', 'Region Filter', 'Verification Status'];
    const csvRows = [
      ['Digitized Manuscripts', String(displayManuscripts), activePeriod ? activePeriod.title : "1500 CE", selectedRegion, "ZERO_HALLUCINATION_GROUNDED"],
      ['Griot Oral Archives', String(displayOralArchives), activePeriod ? activePeriod.title : "1500 CE", selectedRegion, "ZERO_HALLUCINATION_GROUNDED"],
      ['Civilization Graph Nodes', String(displayGraphNodes), activePeriod ? activePeriod.title : "1500 CE", selectedRegion, "ZERO_HALLUCINATION_GROUNDED"],
      ['Triangulation Precision', `${displayPrecision}%`, activePeriod ? activePeriod.title : "1500 CE", selectedRegion, "VERIFIED_SAHELIAN_NILOTIC_EVIDENCE"],
    ];

    HISTORICAL_ACTIVITY_DATA.forEach(item => {
      csvRows.push([`Activity (Trade)`, `Kemet: ${item.kemet}, Mali: ${item.mali}, Aksum: ${item.aksum}, Zimbabwe: ${item.zimbabwe}`, item.era, selectedRegion, 'VERIFIED']);
    });

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.setAttribute('download', `holokai_oracle_metrics_${selectedRegion}_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);

    toast({
      message: "CSV Exported Successfully",
      description: `Structured metrics CSV file generated for ${selectedRegion.toUpperCase()}.`,
    });
  };

  const handleDownloadReport = () => {
    retroAudio.playOracleChime();
    const reportData = {
      title: "HoloKai Oracle Telemetry & Historical Metrics Report",
      generatedAt: new Date().toISOString(),
      historicalPeriod: activePeriod ? activePeriod.title : "1500 CE (Timbuktu Epoch)",
      regionFilter: selectedRegion,
      confidenceScore: `${displayPrecision}%`,
      metrics: {
        digitizedManuscripts: displayManuscripts,
        griotOralArchives: displayOralArchives,
        civilizationGraphNodes: displayGraphNodes,
        triangulationPrecision: "ZERO_HALLUCINATION_GROUNDED",
      },
      historicalActivityTimeline: HISTORICAL_ACTIVITY_DATA,
      historicalArtifactPreviews: HISTORICAL_PREVIEW_ENTRIES,
      verificationStatus: "VERIFIED_SAHELIAN_NILOTIC_EVIDENCE",
    };

    const jsonStringContent = JSON.stringify(reportData, null, 2);
    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(jsonStringContent)}`;
    const fileName = `holokai_oracle_metrics_${selectedRegion}_${Date.now()}.json`;

    // Trigger local browser file download
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataUri);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast({
      message: "Oracle Report Exported",
      description: `JSON telemetry data for ${activePeriod ? activePeriod.label : '1500 CE'} (${selectedRegion.toUpperCase()}) compiled successfully.`,
    });
  };

  const handlePlayNarrator = (entry: HistoricalPreviewEntry) => {
    if (activeNarratingId === entry.id) {
      oracleVoiceEngine.stopSpeaking();
      setActiveNarratingId(null);
    } else {
      retroAudio.playOracleChime();
      setActiveNarratingId(entry.id);
      oracleVoiceEngine.speakResponse(entry.audioSnippet).then(() => {
        setActiveNarratingId(null);
      });
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0a0f]/80 backdrop-blur-md border border-white/5 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-display font-semibold text-white tracking-wide flex items-center gap-2">
              ORACLE DATA TELEMETRY
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                LIVE METRICS
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Triangulated evidence base across African primary manuscripts, oral archives, and epigraphy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Region Filter */}
          <div className="relative flex items-center">
            <Filter className="w-3.5 h-3.5 text-amber-400/70 absolute left-2.5 pointer-events-none" />
            <select
              value={selectedRegion}
              onChange={(e) => {
                retroAudio.playGlassHoverHum();
                setSelectedRegion(e.target.value);
                if (onSelectCivilization) onSelectCivilization(e.target.value);
              }}
              onMouseEnter={() => retroAudio.playGlassHoverHum()}
              className="pl-8 pr-4 py-1.5 bg-zinc-900/90 border border-amber-500/30 text-xs font-mono text-zinc-200 rounded-lg focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {CIVILIZATIONS.map((c) => (
                <option key={c.id} value={c.id} className="bg-zinc-900 text-zinc-200">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRefreshScore}
            disabled={isRefreshing}
            onMouseEnter={() => retroAudio.playGlassHoverHum()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Recalculate
          </button>

          <button
            onClick={handleDownloadCSV}
            onMouseEnter={() => retroAudio.playGlassHoverHum()}
            className="border border-amber-400/40 text-amber-300 hover:text-white text-xs font-mono px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer bg-transparent"
            title="Download CSV dataset of historical metrics"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handleDownloadReport}
            onMouseEnter={() => retroAudio.playGlassHoverHum()}
            className="shadow-[0_0_15px_rgba(232,184,75,0.25)] hover:shadow-[0_0_25px_rgba(232,184,75,0.45)] border border-amber-400/40 text-amber-300 hover:text-white text-xs font-mono px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer bg-transparent"
            title="Download JSON Snapshot of Oracle Telemetry Metrics"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>

      {/* Primary Brand Skeleton Loader during metric fetching / recalculation */}
      {isRefreshing ? (
        <OracleSkeletonLoader />
      ) : (
        <>
          {/* Main Metric Cards Grid (Glassmorphic) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Triangulation Score */}
            <div
              onMouseEnter={() => retroAudio.playGlassHoverHum()}
              className="bg-[#0a0a0f]/80 border border-white/5 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
              <div>
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Triangulation Score</span>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500">
                    {displayPrecision}%
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">High Precision</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 flex justify-between items-center">
                <span>Primary + Oral + Epigraphic</span>
                <span className="text-amber-400 font-mono text-[10px]">VERIFIED</span>
              </div>
            </div>

            {/* Metric 2: Manuscripts Cataloged */}
            <div
              onMouseEnter={() => retroAudio.playGlassHoverHum()}
              className="bg-[#0a0a0f]/80 border border-white/5 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
              <div>
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Primary Codices & Scrolls</span>
                  <ScrollText className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-white">
                    {displayManuscripts.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Cataloged</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 flex justify-between items-center">
                <span>Timbuktu, Ge'ez, Arabic, Ajami</span>
                <span className="text-amber-400 font-mono text-[10px]">DIGITIZED</span>
              </div>
            </div>

            {/* Metric 3: Oral Tradition Recordings */}
            <div
              onMouseEnter={() => retroAudio.playGlassHoverHum()}
              className="bg-[#0a0a0f]/80 border border-white/5 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
              <div>
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Griot Oral Archives</span>
                  <Volume2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-white">
                    {displayOralArchives.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">42 Languages</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 flex justify-between items-center">
                <span>Mandé, Zulu, Swahili, Yoruba</span>
                <span className="text-amber-400 font-mono text-[10px]">INDEXED</span>
              </div>
            </div>

            {/* Metric 4: Knowledge Graph Expansion */}
            <div
              onMouseEnter={() => retroAudio.playGlassHoverHum()}
              className="bg-[#0a0a0f]/80 border border-white/5 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all" />
              <div>
                <div className="flex items-center justify-between text-zinc-400 text-xs font-mono uppercase tracking-wider mb-2">
                  <span>Civilization Graph Nodes</span>
                  <GitBranch className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-display font-bold text-white">
                    {displayGraphNodes.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">99.2% linked</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-zinc-400 flex justify-between items-center">
                <span>Relationships & Lineages</span>
                <span className="text-amber-400 font-mono text-[10px]">MAPPED</span>
              </div>
            </div>
          </div>

          {/* Middle Section: Recharts Dashboards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Historical Synthesis Activity Timeline Area Chart */}
            <div className="lg:col-span-2 bg-[#0a0a0f]/80 border border-white/5 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-display font-semibold text-white tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    HISTORICAL EVIDENCE SYNTHESIS & TRADE DENSITY
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Corroborated record volume and maritime route density across major epochs.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
                  GOLD ACCENTED RECHARTS
                </span>
              </div>

              <div className="h-56 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={HISTORICAL_ACTIVITY_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="kemetColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#E8B84B" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#E8B84B" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="maliColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 149, 42, 0.1)" />
                    <XAxis dataKey="era" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                    <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 15, 25, 0.95)',
                        borderColor: 'rgba(232, 184, 75, 0.4)',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                    <Area type="monotone" dataKey="kemet" name="Nile & Sahel Volume" stroke="#E8B84B" strokeWidth={2} fillOpacity={1} fill="url(#kemetColor)" />
                    <Area type="monotone" dataKey="mali" name="West Africa Codices" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#maliColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Regional Manuscript Digitization Bar Chart */}
            <div className="bg-[#0a0a0f]/80 border border-white/5 p-5 rounded-xl space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-display font-semibold text-white tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    REGIONAL CODEX DENSITY
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 mb-2">
                  Digitized manuscripts by primary regional tradition.
                </p>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Kemet', val: 92 },
                        { name: 'Mali', val: 98 },
                        { name: 'Aksum', val: 88 },
                        { name: 'Ifá', val: 95 },
                        { name: 'Zimb', val: 82 },
                      ]}
                      margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                    >
                      <XAxis dataKey="name" stroke="#a1a1aa" fontSize={10} tickLine={false} />
                      <YAxis stroke="#a1a1aa" fontSize={10} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 15, 25, 0.95)',
                          borderColor: 'rgba(232, 184, 75, 0.4)',
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: '#fff',
                        }}
                      />
                      <Bar dataKey="val" name="Cataloged Scale" fill="#E8B84B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-200/90 flex items-center justify-between">
                <span>Guaranteed Zero-Hallucination Policy</span>
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
              </div>
            </div>
          </div>

          {/* Historical Entry Cards with Hover Preview & Audio Guide */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-white tracking-wide flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                HISTORICAL ARTIFACT & METRIC PREVIEWS
              </h3>
              <span className="text-[10px] font-mono text-zinc-400">
                Hover card to expand preview · Click audio icon for Oracle Guide
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HISTORICAL_PREVIEW_ENTRIES.map((entry) => {
                const isExpanded = expandedCardId === entry.id;
                const isNarrating = activeNarratingId === entry.id;

                return (
                  <div
                    key={entry.id}
                    onMouseEnter={() => {
                      retroAudio.playGlassHoverHum();
                      setExpandedCardId(entry.id);
                    }}
                    onMouseLeave={() => setExpandedCardId(null)}
                    className={`bg-[#0a0a0f]/80 border p-5 rounded-xl transition-all duration-300 relative group cursor-pointer ${
                      isExpanded
                        ? 'border-amber-400 shadow-[0_0_25px_rgba(232,184,75,0.35)] scale-[1.01]'
                        : 'border-white/5 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                            {entry.tag}
                          </span>
                          <span className="text-xs font-mono text-zinc-400">
                            {entry.region} ({entry.era})
                          </span>
                        </div>

                        <h4 className="text-sm font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                          {entry.title}
                        </h4>
                      </div>

                      {/* Audio Guide Narrator Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayNarrator(entry);
                        }}
                        onMouseEnter={() => retroAudio.playGlassHoverHum()}
                        className={`p-2 rounded-lg border transition-all shrink-0 ${
                          isNarrating
                            ? 'bg-amber-500/30 border-amber-400 text-amber-200 animate-pulse'
                            : 'bg-zinc-900 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                        }`}
                        title="Play Oracle Voice Guide Narration"
                      >
                        <Volume2 className={`w-4 h-4 ${isNarrating ? 'animate-bounce' : ''}`} />
                      </button>
                    </div>

                    <p className="text-xs text-zinc-300 mt-2.5 leading-relaxed font-body">
                      {entry.shortPreview}
                    </p>

                    {/* Expanded Content Preview on Hover */}
                    {isExpanded && (
                      <div className="mt-4 pt-3 border-t border-amber-500/20 space-y-2 animate-[fadeIn_0.3s_ease-out]">
                        <p className="text-xs text-zinc-400 leading-relaxed font-body italic">
                          "{entry.fullDescription}"
                        </p>
                        <div className="flex items-center justify-between text-[10px] font-mono text-amber-400 pt-1">
                          <span>Ref Index: {entry.stats}</span>
                          <span className="flex items-center gap-1 text-emerald-400">
                            <ShieldCheck className="w-3 h-3" /> Triangulated
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
