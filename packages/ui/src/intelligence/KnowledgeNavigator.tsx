"use client";

import React, { useState, useMemo } from 'react';
import {
  Compass, BookOpen, Search, Plus, Bookmark,
  Calendar, MapPin, Edit3, Trash2,
  ChevronRight, X, RefreshCw, Download, CheckCircle2, Sparkles
} from 'lucide-react';
import { retroAudio } from '../lib/audioFeedback';

export interface HistoricalRecord {
  id: string;
  title: string;
  era: string;
  region: string;
  category: string;
  timeframe: string;
  summary: string;
  keyInsights: string[];
  status: string;
  isBookmarked: boolean;
  tags: string[];
  authorName: string;
}

export interface KnowledgeNavigatorProps {
  records: HistoricalRecord[];
  loading: boolean;
  firestoreError: string | null;
  onClearError: () => void;
  isSeeding: boolean;
  onSeedRecords: () => void;
  onToggleBookmark: (e: React.MouseEvent, record: HistoricalRecord) => void;
  onSaveRecord: (payload: any, editingId: string | null) => Promise<void>;
  onDeleteRecord: (e: React.MouseEvent, recordId: string) => void;
  onAddAnnotation: (record: HistoricalRecord, note: string) => Promise<void>;
}

const ERAS = [
  'All Eras',
  'Kemet & Nubia',
  'Sahel & Timbuktu',
  'Aksumite Highlands',
  'Great Zimbabwe & Mapungubwe',
  'Ifá & Benin Kingdom',
  'Swahili Coast & Kilwa',
];

const REGIONS = [
  'All Regions',
  'North Africa',
  'West Africa',
  'Horn of Africa',
  'Southern Africa',
  'East Africa',
];

const CATEGORIES = [
  'All Categories',
  'Sacred Science & Medicine',
  'Metallurgy & Royal Regalia',
  'Literature & Scholarship',
  'Epigraphy & Diplomacy',
  'Metallurgy & State Archives',
  'Architecture & Maritime Trade',
  'Monolithic Architecture',
  'Oral Epics & Acoustic History',
];

export function KnowledgeNavigator({
  records,
  loading,
  firestoreError,
  onClearError,
  isSeeding,
  onSeedRecords,
  onToggleBookmark,
  onSaveRecord,
  onDeleteRecord,
  onAddAnnotation,
}: KnowledgeNavigatorProps) {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState('All Eras');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Active Selected Detail Modal
  const [activeRecord, setActiveRecord] = useState<HistoricalRecord | null>(null);

  // New/Edit Record Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    era: 'Kemet & Nubia',
    region: 'North Africa',
    category: 'Sacred Science & Medicine',
    timeframe: '',
    summary: '',
    keyInsights: '',
    status: 'Active Field Notes',
    tags: '',
    authorName: '',
  });

  // User research notes modal state on specific record
  const [userNoteInput, setUserNoteInput] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim()) return;

    retroAudio.playClick();
    const insightsArray = formData.keyInsights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const tagsArray = formData.tags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: formData.title.trim(),
      era: formData.era,
      region: formData.region,
      category: formData.category,
      timeframe: formData.timeframe.trim() || 'Undated Era',
      summary: formData.summary.trim(),
      keyInsights: insightsArray.length > 0 ? insightsArray : ['Verified Pan-African codex entry'],
      status: formData.status || 'Active Field Notes',
      tags: tagsArray.length > 0 ? tagsArray : ['HoloKai', 'History'],
      authorName: formData.authorName.trim(),
    };

    try {
      await onSaveRecord(payload, editingId);
      resetForm();
      setIsModalOpen(false);
      retroAudio.playSuccessChime();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (e: React.MouseEvent, record: HistoricalRecord) => {
    e.stopPropagation();
    setEditingId(record.id);
    setFormData({
      title: record.title || '',
      era: record.era || 'Kemet & Nubia',
      region: record.region || 'North Africa',
      category: record.category || 'Sacred Science & Medicine',
      timeframe: record.timeframe || '',
      summary: record.summary || '',
      keyInsights: Array.isArray(record.keyInsights) ? record.keyInsights.join('\n') : '',
      status: record.status || 'Active Field Notes',
      tags: Array.isArray(record.tags) ? record.tags.join(', ') : '',
      authorName: record.authorName || '',
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      era: 'Kemet & Nubia',
      region: 'North Africa',
      category: 'Sacred Science & Medicine',
      timeframe: '',
      summary: '',
      keyInsights: '',
      status: 'Active Field Notes',
      tags: '',
      authorName: '',
    });
  };

  const handleAddAnnotationSubmit = async () => {
    if (!activeRecord || !userNoteInput.trim()) return;
    retroAudio.playClick();
    
    try {
      await onAddAnnotation(activeRecord, userNoteInput.trim());
      // The parent component should eventually update the 'records' prop, which will reflect here.
      // But to update the local modal state immediately:
      const newInsights = [...(activeRecord.keyInsights || []), `User Research Note: ${userNoteInput.trim()}`];
      setActiveRecord({
        ...activeRecord,
        keyInsights: newInsights,
      });
      setUserNoteInput('');
      retroAudio.playSuccessChime();
    } catch (err) {
       console.error(err);
    }
  };

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      // Search
      const textMatch =
        !searchQuery ||
        rec.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (rec.tags && rec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

      // Era
      const eraMatch = selectedEra === 'All Eras' || rec.era === selectedEra;

      // Region
      const regionMatch = selectedRegion === 'All Regions' || rec.region === selectedRegion;

      // Category
      const categoryMatch = selectedCategory === 'All Categories' || rec.category === selectedCategory;

      // Bookmark
      const bookmarkMatch = !onlyBookmarked || rec.isBookmarked;

      return textMatch && eraMatch && regionMatch && categoryMatch && bookmarkMatch;
    });
  }, [records, searchQuery, selectedEra, selectedRegion, selectedCategory, onlyBookmarked]);

  // Download Export Records as JSON
  const handleExportJSON = () => {
    retroAudio.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HoloKai_Historical_Records_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans">
      {/* HEADER HERO BANNER */}
      <div className="relative rounded-3xl border border-brand/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-[var(--pui-forest-deep)]/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/40 bg-brand/10 text-brand text-xs font-mono font-bold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-brand animate-[spin_4s_linear_infinite]" />
              <span>HoloKai Portal Knowledge Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground tracking-tight">
              Organized Pan-African Historical Records
            </h1>
            <p className="text-sm text-muted font-sans leading-relaxed">
              Explore, curate, and archive verified historical records, ancient scientific papyri, royal metallurgical regalia, and oral chronicles synced in real-time to Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Record</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={filteredRecords.length === 0}
              className="px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface/80 hover:bg-surface-elevated text-muted font-mono text-xs flex items-center gap-2 transition-all disabled:opacity-40"
              title="Export filtered records as JSON"
            >
              <Download className="w-4 h-4 text-brand" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {records.length === 0 && !loading && (
              <button
                onClick={onSeedRecords}
                disabled={isSeeding}
                className="px-4 py-2.5 rounded-xl border border-brand/50 bg-brand/20 text-brand font-mono font-bold text-xs flex items-center gap-2 hover:bg-brand/30 transition-all animate-pulse"
              >
                <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Seeding Database...' : 'Seed Curated Records'}</span>
              </button>
            )}
          </div>
        </div>

        {/* METRICS & STATS BAR */}
        <div className="mt-6 pt-6 border-t border-border-subtle grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-surface/60 p-3 rounded-2xl border border-border-subtle">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">Total Codices</span>
            <span className="text-xl font-bold font-mono text-brand">{records.length}</span>
          </div>

          <div className="bg-surface/60 p-3 rounded-2xl border border-border-subtle">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">Filtered Display</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{filteredRecords.length}</span>
          </div>

          <div className="bg-surface/60 p-3 rounded-2xl border border-border-subtle">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">Bookmarked Records</span>
            <span className="text-xl font-bold font-mono text-pink-400">
              {records.filter((r) => r.isBookmarked).length}
            </span>
          </div>

          <div className="bg-surface/60 p-3 rounded-2xl border border-border-subtle">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider block">Database Status</span>
            <span className="text-xs font-bold font-mono text-blue-400 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Firestore Synced
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH AND MULTI-FILTER BAR */}
      <div className="bg-background/90 p-4 rounded-2xl border border-brand/20 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical records, titles, papyri, metallurgy, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border-subtle text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand/60 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-mono font-semibold flex items-center gap-2 transition-all shrink-0 ${
              onlyBookmarked
                ? 'border-brand bg-brand/20 text-brand'
                : 'border-border-subtle bg-surface text-muted hover:text-foreground'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400 text-brand' : ''}`} />
            <span>Bookmarked Only</span>
          </button>
        </div>

        {/* Dropdown Category Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Era Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Historical Era
            </label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-zinc-200 focus:outline-none focus:border-brand"
            >
              {ERAS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Geographic Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-zinc-200 focus:outline-none focus:border-brand"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">
              Domain Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border-subtle text-xs text-zinc-200 focus:outline-none focus:border-brand"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ERROR NOTICE */}
      {firestoreError && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/40 text-red-200 text-xs font-mono flex items-center justify-between">
          <span>Firestore Sync Warning: {firestoreError}</span>
          <button onClick={onClearError} className="text-red-400 font-bold hover:text-foreground">
            ✕
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-brand animate-spin" />
          <p className="text-xs font-mono text-muted">Loading Historical Records from Firestore...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        /* EMPTY STATE */
        <div className="py-16 px-4 rounded-3xl border border-dashed border-border-subtle bg-background/50 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-serif font-semibold text-zinc-200">No Historical Records Found</h3>
            <p className="text-xs text-muted">
              No matching records found for the active filter parameters or Firestore collection is empty.
            </p>
          </div>
          {records.length === 0 && (
            <button
              onClick={onSeedRecords}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>Seed Curated Historical Records</span>
            </button>
          )}
        </div>
      ) : (
        /* HISTORICAL RECORDS GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => {
                retroAudio.playClick();
                setActiveRecord(record);
              }}
              className="group relative rounded-2xl border border-border-subtle bg-background/80 hover:border-brand/50 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Tag Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full border border-brand/30 bg-brand/10 text-brand text-[10px] font-mono font-semibold uppercase tracking-wider truncate">
                    {record.era || 'Pan-African'}
                  </span>

                  <button
                    onClick={(e) => onToggleBookmark(e, record)}
                    className="p-1.5 rounded-lg text-muted hover:text-brand hover:bg-white/5 transition-colors"
                    title={record.isBookmarked ? 'Remove Bookmark' : 'Bookmark Record'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        record.isBookmarked ? 'fill-amber-400 text-brand' : 'text-muted'
                      }`}
                    />
                  </button>
                </div>

                {/* Title & Timeframe */}
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-foreground group-hover:text-brand transition-colors line-clamp-2">
                    {record.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-muted">
                    <Calendar className="w-3 h-3 text-brand shrink-0" />
                    <span>{record.timeframe || 'Ancient Era'}</span>
                    <span>•</span>
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{record.region || 'Africa'}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-muted line-clamp-3 leading-relaxed font-sans">
                  {record.summary}
                </p>

                {/* Tags */}
                {Array.isArray(record.tags) && record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {record.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-surface border border-border-subtle text-[9px] font-mono text-muted"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-muted">
                <span className="text-[10px] text-brand/90 font-medium truncate">
                  {record.status || 'Verified Record'}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => handleOpenEdit(e, record)}
                    className="p-1 hover:text-foreground"
                    title="Edit Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this historical record?')) {
                        onDeleteRecord(e, record.id);
                        if (activeRecord?.id === record.id) setActiveRecord(null);
                      }
                    }}
                    className="p-1 hover:text-red-400"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECORD DETAIL MODAL */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand/40 bg-background p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-brand/20 text-brand text-[10px] font-mono font-bold uppercase border border-brand/40">
                    {activeRecord.era}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface border border-border-subtle text-[10px] font-mono text-muted">
                    {activeRecord.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground leading-tight">
                  {activeRecord.title}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-muted pt-1">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {activeRecord.timeframe}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {activeRecord.region}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveRecord(null)}
                className="p-2 rounded-full bg-surface border border-border-subtle text-muted hover:text-foreground hover:bg-surface-elevated transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6">
              {/* Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-brand uppercase tracking-wider">Historical Summary</h3>
                <p className="text-sm text-muted font-sans leading-relaxed">{activeRecord.summary}</p>
              </div>

              {/* Key Insights */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono font-bold text-brand uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" /> Key Archeological Insights
                </h3>
                <ul className="space-y-2">
                  {activeRecord.keyInsights?.map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-sans">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
              <div className="space-y-2 border-t border-border-subtle pt-4">
                <h3 className="text-xs font-mono font-bold text-muted uppercase tracking-wider">Indexed Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.tags?.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-surface border border-border-subtle text-[10px] font-mono text-muted">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Annotate Section */}
            <div className="mt-6 pt-4 border-t border-border-subtle bg-brand/5 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 py-6 rounded-b-3xl space-y-3">
              <label className="text-xs font-mono font-bold text-brand uppercase tracking-wider block">
                Add Analyst Research Note
              </label>
              <div className="flex items-start gap-2">
                <textarea
                  value={userNoteInput}
                  onChange={(e) => setUserNoteInput(e.target.value)}
                  placeholder="Record your historical interpretations, cross-references, or findings..."
                  className="w-full h-16 bg-surface border border-brand/30 rounded-xl p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand/80 resize-none transition"
                />
                <button
                  onClick={handleAddAnnotationSubmit}
                  disabled={!userNoteInput.trim()}
                  className="shrink-0 h-16 px-4 rounded-xl bg-brand hover:bg-[var(--color-brand)] disabled:bg-surface-elevated disabled:text-muted text-zinc-950 font-mono font-bold text-xs transition"
                >
                  Annotate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW/EDIT RECORD MODAL (Form) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-brand/40 bg-background p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4">
              <h2 className="text-xl font-serif font-bold text-foreground">
                {editingId ? 'Edit Historical Record' : 'Add New Historical Record'}
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setIsModalOpen(false);
                }}
                className="p-2 rounded-full bg-surface border border-border-subtle text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Title / Artifact Name</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. The Edwin Smith Surgical Papyrus"
                  className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Era</label>
                  <select
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                  >
                    {ERAS.filter((e) => e !== 'All Eras').map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                  >
                    {REGIONS.filter((r) => r !== 'All Regions').map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Timeframe</label>
                  <input
                    type="text"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    placeholder="e.g. c. 1600 BCE"
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Historical Summary</label>
                <textarea
                  required
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Provide a concise historical overview..."
                  className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Key Insights (One per line)</label>
                <textarea
                  rows={4}
                  value={formData.keyInsights}
                  onChange={(e) => setFormData({ ...formData, keyInsights: e.target.value })}
                  placeholder="Contains 48 clinical case studies...&#10;Earliest documented description of cranial sutures..."
                  className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Kemet, Medicine, Papyrus"
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-muted uppercase tracking-wider block">Archivist / Author (Optional)</label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="e.g. Imhotep Lineage"
                    className="w-full bg-surface border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-border-subtle text-muted font-mono text-xs hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-[var(--color-brand)] text-zinc-950 font-mono font-bold text-xs shadow-lg"
                >
                  {editingId ? 'Update Record' : 'Save New Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
