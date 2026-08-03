import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass, BookOpen, Search, Plus, Bookmark, Sparkles,
  Calendar, MapPin, CheckCircle2, Edit3, Trash2,
  ChevronRight, X, RefreshCw, Download
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { retroAudio } from '@/lib/audioFeedback';

// Operation Types & Error handling for Firestore
const OperationType = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  GET: 'get',
  WRITE: 'write',
};

function handleFirestoreError(error, operationType, path) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path
  };
  console.error('Firestore KnowledgeNavigator Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Initial Curated Seed Historical Records
const CURATED_SEED_RECORDS = [
  {
    title: 'The Edwin Smith Surgical Papyrus',
    era: 'Kemet & Nubia',
    region: 'North Africa',
    category: 'Sacred Science & Medicine',
    timeframe: 'c. 1600 BCE',
    summary: 'World\'s earliest known surgical treatise describing cranial sutures, brain anatomy, and systematic trauma medicine without supernatural attributions.',
    keyInsights: [
      'Contains 48 detailed clinical case studies with rigorous physical examinations',
      'Earliest documented medical descriptions of meninges and cerebrospinal fluid',
      'Includes diagnostic triage methodology: treatable, contestable, untreatable'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: true,
    tags: ['Kemet', 'Medicine', 'Anatomy', 'Papyrus', 'Scientific Method'],
    authorName: 'High Priest Imhotep Lineage',
  },
  {
    title: 'The Golden Mapungubwe Rhino & Royal Regalia',
    era: 'Great Zimbabwe & Mapungubwe',
    region: 'Southern Africa',
    category: 'Metallurgy & Royal Regalia',
    timeframe: 'c. 1220–1290 CE',
    summary: 'Exquisite gold leaf foil figurine hammered over carved wood, symbolizing sacred leadership, sovereign authority, and advanced goldsmithing in the Limpopo valley.',
    keyInsights: [
      'Demonstrates complex gold hammering & gold rivet techniques',
      'Discovered at the sacred royal hill burial site of Mapungubwe',
      'Proof of flourishing Indian Ocean trade connections prior to European arrival'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: true,
    tags: ['Mapungubwe', 'Gold', 'Metallurgy', 'Regalia', 'Trade'],
    authorName: 'Shona Citadel Master Goldsmiths',
  },
  {
    title: 'Sankore University Scholars & Timbuktu Scrolls',
    era: 'Sahel & Timbuktu',
    region: 'West Africa',
    category: 'Literature & Scholarship',
    timeframe: '12th – 16th Century CE',
    summary: 'Millions of manuscript scrolls written in Arabic and Ajami script covering astronomy, mathematics, Islamic jurisprudence, ethics, optics, and poetry.',
    keyInsights: [
      'Housed over 25,000 international scholars at its academic zenith',
      'Contains sophisticated mathematical algorithms & celestial transit tables',
      'Preserved through indigenous parchment formulation & organic ink conservation'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: false,
    tags: ['Timbuktu', 'Sankore', 'Manuscripts', 'Mathematics', 'Astronomy'],
    authorName: 'Ahmed Baba Library Archives',
  },
  {
    title: 'The Ezana Inscription Stone of Aksum',
    era: 'Aksumite Highlands',
    region: 'Horn of Africa',
    category: 'Epigraphy & Diplomacy',
    timeframe: 'c. 330–350 CE',
    summary: 'Trilingual royal stele carved in Ge\'ez, Sabaean, and Ancient Greek celebrating King Ezana\'s reign, international alliances, and transition to Christian statehood.',
    keyInsights: [
      'Primary artifact proving official Ge\'ez script vocalization development',
      'Documents maritime trade dominion across the Red Sea into Southern Arabia',
      'Commemorates military expeditions protecting Red Sea trade corridors'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: false,
    tags: ['Aksum', 'Ezana', 'Ge\'ez', 'Epigraphy', 'Trade Corridors'],
    authorName: 'Aksumite Imperial Royal Chroniclers',
  },
  {
    title: 'Benin Court Bronzes & Lost-Wax Casting Archive',
    era: 'Ifá & Benin Kingdom',
    region: 'West Africa',
    category: 'Metallurgy & State Archives',
    timeframe: '13th – 19th Century CE',
    summary: 'Precision brass and bronze relief plaques created via complex lost-wax (cire perdue) casting, detailing royal lineage, ritual protocol, and ambassadorial delegations.',
    keyInsights: [
      'Mastery of high-copper metallurgy & precision alloy proportioning',
      'Functioned as a visual historiographical archive of Oba royal succession',
      'Regarded among the finest sculptural achievements in world art history'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: true,
    tags: ['Benin', 'Bronze', 'Lost-Wax', 'History', 'Statecraft'],
    authorName: 'Igun Eronmwon Guild of Bronze Casters',
  },
  {
    title: 'Kilwa Kisiwani Coral Palace & Great Mosque',
    era: 'Swahili Coast & Kilwa',
    region: 'East Africa',
    category: 'Architecture & Maritime Trade',
    timeframe: '10th – 15th Century CE',
    summary: 'Monumental coral stone architecture including Husuni Kubwa palace and domed mosques controlling the gold trade from Great Zimbabwe across the Indian Ocean.',
    keyInsights: [
      'Largest Islamic dome construction in East Africa prior to 19th century',
      'Minted indigenous copper and silver coinage recognized from China to Arabia',
      'Ibn Battuta described Kilwa as "one of the most beautiful and well-constructed towns"'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: false,
    tags: ['Swahili Coast', 'Kilwa', 'Coral Architecture', 'Indian Ocean', 'Coinage'],
    authorName: 'Shirazi Sultanate Architects',
  },
  {
    title: 'Lalibela Rock-Hewn Monolithic Sanctuary',
    era: 'Aksumite Highlands',
    region: 'Horn of Africa',
    category: 'Monolithic Architecture',
    timeframe: '12th – 13th Century CE',
    summary: 'Eleven monolithic churches carved top-down from solid basalt volcanic tuff bedrock without mortar, bricks, or external blocks.',
    keyInsights: [
      'Features sophisticated subterranean hydraulic engineering and drainage channels',
      'Bete Giyorgis (Church of St. George) carved as a perfect Greek cross monolith',
      'Active pilgrimage site continuously functioning for over 800 years'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: true,
    tags: ['Lalibela', 'Monolithic', 'Bedrock', 'Architecture', 'Ethiopia'],
    authorName: 'Zagwe Imperial Stone Masons',
  },
  {
    title: 'Kora Harp & Jali Griot Lineage Oral Archives',
    era: 'Sahel & Timbuktu',
    region: 'West Africa',
    category: 'Oral Epics & Acoustic History',
    timeframe: '13th Century CE – Present',
    summary: 'Oral historical archiving system maintained by hereditary Jali genealogist historians using the 21-string calabash harp (Kora) to memorize royal charters, family trees, and legal codes.',
    keyInsights: [
      'Preserved the Epic of Sundiata through 800 years of verbatim oral transmission',
      'Complex polyrhythmic tuning systems mapping historical eras',
      'Functioned as supreme diplomatic mediators & constitutional advisors'
    ],
    status: 'Verified Sovereign Record',
    isBookmarked: false,
    tags: ['Griot', 'Kora', 'Oral History', 'Mali', 'Sundiata'],
    authorName: 'Kouyaté & Diabaté Jali Guilds',
  }
];

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

export default function KnowledgeNavigator() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEra, setSelectedEra] = useState('All Eras');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);

  // Active Selected Detail Modal
  const [activeRecord, setActiveRecord] = useState(null);

  // New/Edit Record Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
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

  // 1. Subscribe to Firestore historicalRecords collection
  useEffect(() => {
    setLoading(true);
    const recordsCol = collection(db, 'historicalRecords');
    const q = query(recordsCol, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRecords(fetched);
        setLoading(false);
      },
      (error) => {
        const err = handleFirestoreError(error, OperationType.LIST, 'historicalRecords');
        setFirestoreError(err.error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Seed default records if Firestore collection is empty
  const handleSeedRecords = async () => {
    try {
      setIsSeeding(true);
      retroAudio.playClick();
      const recordsCol = collection(db, 'historicalRecords');

      for (const rec of CURATED_SEED_RECORDS) {
        await addDoc(recordsCol, {
          ...rec,
          userId: auth.currentUser?.uid || 'guest_archivist',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setIsSeeding(false);
      retroAudio.playSuccessChime();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'historicalRecords');
      setIsSeeding(false);
    }
  };

  // 3. Toggle Bookmark in Firestore
  const handleToggleBookmark = async (e, record) => {
    e.stopPropagation();
    retroAudio.playClick();
    try {
      const recordRef = doc(db, 'historicalRecords', record.id);
      await updateDoc(recordRef, {
        isBookmarked: !record.isBookmarked,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `historicalRecords/${record.id}`);
    }
  };

  // 4. Save/Create or Update Record
  const handleFormSubmit = async (e) => {
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
      authorName: formData.authorName.trim() || auth.currentUser?.displayName || 'Oracle Portal Archivist',
      userId: auth.currentUser?.uid || 'guest_user',
      updatedAt: serverTimestamp(),
    };

    try {
      if (editingId) {
        const recordRef = doc(db, 'historicalRecords', editingId);
        await updateDoc(recordRef, payload);
      } else {
        await addDoc(collection(db, 'historicalRecords'), {
          ...payload,
          isBookmarked: false,
          createdAt: serverTimestamp(),
        });
      }
      resetForm();
      setIsModalOpen(false);
      retroAudio.playSuccessChime();
    } catch (err) {
      handleFirestoreError(
        err,
        editingId ? OperationType.UPDATE : OperationType.CREATE,
        `historicalRecords/${editingId || ''}`
      );
    }
  };

  const handleOpenEdit = (e, record) => {
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

  const handleDeleteRecord = async (e, recordId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this historical record from Firestore?')) return;
    retroAudio.playClick();
    try {
      await deleteDoc(doc(db, 'historicalRecords', recordId));
      if (activeRecord?.id === recordId) setActiveRecord(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `historicalRecords/${recordId}`);
    }
  };

  // Add User Research Annotation to Record
  const handleAddAnnotation = async () => {
    if (!activeRecord || !userNoteInput.trim()) return;
    retroAudio.playClick();
    const newInsights = [...(activeRecord.keyInsights || []), `User Research Note: ${userNoteInput.trim()}`];

    try {
      const recordRef = doc(db, 'historicalRecords', activeRecord.id);
      await updateDoc(recordRef, {
        keyInsights: newInsights,
        updatedAt: serverTimestamp(),
      });
      setActiveRecord({
        ...activeRecord,
        keyInsights: newInsights,
      });
      setUserNoteInput('');
      retroAudio.playSuccessChime();
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `historicalRecords/${activeRecord.id}`);
    }
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
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>HoloKai Portal Knowledge Navigator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Organized Pan-African Historical Records
            </h1>
            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              Explore, curate, and archive verified historical records, ancient scientific papyri, royal metallurgical regalia, and oral chronicles synced in real-time to Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Record</span>
            </button>

            <button
              onClick={handleExportJSON}
              disabled={filteredRecords.length === 0}
              className="px-3.5 py-2.5 rounded-xl border border-white/10 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 font-mono text-xs flex items-center gap-2 transition-all disabled:opacity-40"
              title="Export filtered records as JSON"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {records.length === 0 && !loading && (
              <button
                onClick={handleSeedRecords}
                disabled={isSeeding}
                className="px-4 py-2.5 rounded-xl border border-amber-500/50 bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center gap-2 hover:bg-amber-500/30 transition-all animate-pulse"
              >
                <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                <span>{isSeeding ? 'Seeding Database...' : 'Seed Curated Records'}</span>
              </button>
            )}
          </div>
        </div>

        {/* METRICS & STATS BAR */}
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Total Codices</span>
            <span className="text-xl font-bold font-mono text-amber-400">{records.length}</span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Filtered Display</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{filteredRecords.length}</span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Bookmarked Records</span>
            <span className="text-xl font-bold font-mono text-pink-400">
              {records.filter((r) => r.isBookmarked).length}
            </span>
          </div>

          <div className="bg-zinc-900/60 p-3 rounded-2xl border border-white/5">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Database Status</span>
            <span className="text-xs font-bold font-mono text-blue-400 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Firestore Synced
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH AND MULTI-FILTER BAR */}
      <div className="bg-zinc-950/90 p-4 rounded-2xl border border-amber-500/20 space-y-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical records, titles, papyri, metallurgy, or keywords..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
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
                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                : 'border-white/10 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Bookmarked Only</span>
          </button>
        </div>

        {/* Dropdown Category Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Era Filter */}
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Historical Era
            </label>
            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
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
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Geographic Region
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
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
            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              Domain Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
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
          <button onClick={() => setFirestoreError(null)} className="text-red-400 font-bold hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-xs font-mono text-zinc-400">Loading Historical Records from Firestore...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        /* EMPTY STATE */
        <div className="py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-zinc-950/50 text-center space-y-4">
          <BookOpen className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-serif font-semibold text-zinc-200">No Historical Records Found</h3>
            <p className="text-xs text-zinc-400">
              No matching records found for the active filter parameters or Firestore collection is empty.
            </p>
          </div>
          {records.length === 0 && (
            <button
              onClick={handleSeedRecords}
              disabled={isSeeding}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs inline-flex items-center gap-2"
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
              className="group relative rounded-2xl border border-white/10 bg-zinc-950/80 hover:border-amber-500/50 p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Tag Badges */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] font-mono font-semibold uppercase tracking-wider truncate">
                    {record.era || 'Pan-African'}
                  </span>

                  <button
                    onClick={(e) => handleToggleBookmark(e, record)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
                    title={record.isBookmarked ? 'Remove Bookmark' : 'Bookmark Record'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        record.isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-zinc-500'
                      }`}
                    />
                  </button>
                </div>

                {/* Title & Timeframe */}
                <div className="space-y-1">
                  <h3 className="text-base font-serif font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {record.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{record.timeframe || 'Ancient Era'}</span>
                    <span>•</span>
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{record.region || 'Africa'}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-zinc-300 line-clamp-3 leading-relaxed font-sans">
                  {record.summary}
                </p>

                {/* Tags */}
                {Array.isArray(record.tags) && record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {record.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-900 border border-white/5 text-[9px] font-mono text-zinc-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="text-[10px] text-amber-400/90 font-medium truncate">
                  {record.status || 'Verified Record'}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => handleOpenEdit(e, record)}
                    className="p-1 hover:text-white"
                    title="Edit Record"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteRecord(e, record.id)}
                    className="p-1 hover:text-red-400"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECORD DETAIL MODAL */}
      {activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold uppercase border border-amber-500/40">
                    {activeRecord.era}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-white/10 text-[10px] font-mono text-zinc-300">
                    {activeRecord.category}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-200">
                  {activeRecord.title}
                </h2>
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                  <span>{activeRecord.timeframe}</span>
                  <span>•</span>
                  <span>{activeRecord.region}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveRecord(null)}
                className="p-2 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Historical Overview
              </h4>
              <p className="text-sm text-zinc-200 font-sans leading-relaxed bg-zinc-900/60 p-4 rounded-2xl border border-white/5">
                {activeRecord.summary}
              </p>
            </div>

            {/* Key Insights List */}
            {Array.isArray(activeRecord.keyInsights) && activeRecord.keyInsights.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Key Research Insights
                </h4>
                <ul className="space-y-2">
                  {activeRecord.keyInsights.map((insight, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-zinc-300 font-sans flex items-start gap-2.5 bg-zinc-900/40 p-3 rounded-xl border border-white/5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Add Research Annotation */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Add Research Annotation
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userNoteInput}
                  onChange={(e) => setUserNoteInput(e.target.value)}
                  placeholder="Type personal research note to append to Firestore record..."
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleAddAnnotation}
                  disabled={!userNoteInput.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-mono font-bold text-xs shrink-0"
                >
                  Append Note
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-4 border-t border-white/10">
              <span>Author: {activeRecord.authorName || 'Archivist'}</span>
              <span>Status: {activeRecord.status}</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT RECORD MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-5 text-zinc-100">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-lg font-serif font-bold text-amber-300">
                {editingId ? 'Edit Historical Record' : 'Create New Historical Record'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 block">Record Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., The Golden Rhinoceros of Mapungubwe"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 block">Era / Civilization</label>
                  <select
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {ERAS.filter((e) => e !== 'All Eras').map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 block">Geographic Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {REGIONS.filter((r) => r !== 'All Regions').map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 block">Timeframe / Date</label>
                  <input
                    type="text"
                    value={formData.timeframe}
                    onChange={(e) => setFormData({ ...formData, timeframe: e.target.value })}
                    placeholder="e.g., c. 1220–1290 CE"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 block">Summary / Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Provide detailed historical overview of the artifact, manuscript, or codex..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-zinc-300 block">Key Insights (One per line)</label>
                <textarea
                  rows={3}
                  value={formData.keyInsights}
                  onChange={(e) => setFormData({ ...formData, keyInsights: e.target.value })}
                  placeholder="Insight 1&#10;Insight 2&#10;Insight 3"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 block">Tags (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Gold, Metallurgy, Regalia"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-zinc-300 block">Author / Contributor</label>
                  <input
                    type="text"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    placeholder="Archivist Name"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-mono font-bold text-xs shadow-lg"
                >
                  {editingId ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
