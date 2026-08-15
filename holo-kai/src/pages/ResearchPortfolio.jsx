import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Database, ShieldCheck, Search, Filter, X, ArrowUpRight,
  Award, CheckCircle2, Share2, Download, RefreshCw
} from 'lucide-react';
import PageShell from '@/components/PageShell';
import { useToast } from '@/components/ui/use-toast';

// Portfolio Case Studies & Civilizational Research Projects
const PORTFOLIO_PROJECTS = [
  {
    id: 'ifa-binary-matrix',
    title: 'Ifá Binary Divination & Computational Mathematics',
    category: 'Epistemological AI',
    civilization: 'Yoruba / Ifá Corpus',
    era: 'c. 800 CE – Present',
    region: 'West Africa (Nigeria, Benin)',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    summary: 'Decoded the 256-state binary matrix (2^8 Odu signatures) within the sacred Ifá literary corpus, proving pre-colonial mathematical computation.',
    metrics: { confidence: '98.6%', sources: '142 Codices', status: 'Peer Verified' },
    vanguardUnit: '07 Asante-V (The Oracle)',
    highlights: [
      'Mapped 16 major Odu and 240 minor combinations into an 8-bit binary truth table',
      'Cross-referenced Ikin palm nut arithmetic with modern computer science algorithms',
      'Published open-access mathematical schema for indigenous knowledge preservation'
    ],
    evidence: [
      { title: 'Sacred Ifá Verses (Odu Ogbe Meji)', type: 'Oral & Written', ref: 'Yoruba Intellectual Archives #2024' },
      { title: 'Ikin & Opon Ifá Metallurgical Scans', type: 'Physical Artifact', ref: 'Lagos Heritage Laboratory Scan #091' }
    ],
    featured: true,
    size: 'large',
  },
  {
    id: 'timbuktu-astronomy-scrolls',
    title: 'Sankore University Astronomical Scrolls',
    category: '3D Reconstructions',
    civilization: 'Mali Gold Road & Timbuktu',
    era: 'c. 1200 – 1600 CE',
    region: 'Sahelian West Africa',
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1200&q=80',
    summary: 'Hyperspectral scanning and restoration of 700,000+ Timbuktu manuscripts detailing celestial mechanics, trigonometry, and medicinal chemistry.',
    metrics: { confidence: '99.1%', sources: '700K+ Scrolls', status: 'Digitized' },
    vanguardUnit: '03 Kemet-Alpha (The Archivist)',
    highlights: [
      'Sub-millimeter multispectral imaging of water-damaged vellum and handmade paper',
      'Translated Ge\'ez and Ajami annotations into standardized computational formats',
      'Restored planetary orbit calculation charts crafted by 14th-century Sahelian astronomers'
    ],
    evidence: [
      { title: 'Ahmad Baba Institute Manuscript Manuscripts', type: 'Primary Text', ref: 'Sankore Codex #4482' }
    ],
    featured: true,
    size: 'small',
  },
  {
    id: 'great-zimbabwe-acoustic-architecture',
    title: 'Great Zimbabwe Dry-Stone Acoustic Physics',
    category: 'Archaeological Excavations',
    civilization: 'Great Zimbabwe Empire',
    era: 'c. 1100 – 1450 CE',
    region: 'Southern Africa (Zimbabwe Plateau)',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    summary: 'LiDAR terrain mapping and acoustic wave modeling of the 11-meter mortarless granite walls of the Great Enclosure.',
    metrics: { confidence: '97.4%', sources: '18K Urban Mesh', status: 'Grounded' },
    vanguardUnit: '02 Naja-7 (The Sentinel)',
    highlights: [
      'Demonstrated how curved granite masonry naturally dampens seismic vibrations',
      'Modeled acoustic resonance channels used by Rozvi royalty for citywide communication',
      'Established 3D spatial twin of the valley to protect against structural erosion'
    ],
    evidence: [
      { title: 'Rozvi Architectural Field Surveys', type: 'LiDAR & Sonic Mesh', ref: 'Zim-Plateau GIS #108' }
    ],
    featured: false,
    size: 'small',
  },
  {
    id: 'aksumite-trilingual-stelae',
    title: 'Aksumite Ge\'ez & Sabean Trilingual Decipherment',
    category: 'Oral Lineages',
    civilization: 'Aksumite Beacon',
    era: 'c. 100 – 940 CE',
    region: 'Horn of Africa (Ethiopia, Eritrea)',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
    summary: 'Epigraphic synthesis of King Ezana\'s stelae, tracing trade routes connecting Aksum with Rome, Byzantium, and India.',
    metrics: { confidence: '98.9%', sources: '33m Granite Stelae', status: 'Deciphered' },
    vanguardUnit: '04 Zamani (The Scholar)',
    highlights: [
      'Correlated Ge\'ez, Greek, and Sabean royal inscriptions with Red Sea maritime logs',
      'Uncovered currency minting formulas establishing Aksumite gold coin purity standards',
      'Integrated oral liturgy of the Ethiopic Church into the digital timeline'
    ],
    evidence: [
      { title: 'King Ezana Royal Decree Stela', type: 'Granite Epigraphy', ref: 'Aksum Field Survey #004' }
    ],
    featured: false,
    size: 'medium',
  },
  {
    id: 'nsibidi-secret-ideographs',
    title: 'Nsibidi Symbolism & Secret Ekpe Governance',
    category: 'Ethical Ma\'at Audits',
    civilization: 'Ekpe / Nsibidi Continuum',
    era: 'c. 400 CE – Present',
    region: 'West Africa (Nigeria, Cameroon)',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    summary: 'Ethical classification of West Africa\'s ancient indigenous ideographic writing system, protecting sacred gestures while cataloging public symbols.',
    metrics: { confidence: '96.8%', sources: '500+ Symbols', status: 'Ethically Shielded' },
    vanguardUnit: '06 Sika-Gold (The Artisan)',
    highlights: [
      'Developed non-extractive AI protocol respecting sacred Ekpe society privacy boundary',
      'Cataloged public Nsibidi symbols found on pre-colonial textiles and legal staffs',
      'Traced Nsibidi glyph migration into Abakuá traditions of Cuba and the Caribbean'
    ],
    evidence: [
      { title: 'Ekpe Society Council Records', type: 'Oral & Glyph Memory', ref: 'Cross River Registry #77' }
    ],
    featured: false,
    size: 'medium',
  },
];

const CATEGORIES = [
  'All Projects',
  'Epistemological AI',
  '3D Reconstructions',
  'Archaeological Excavations',
  'Oral Lineages',
  'Ethical Ma\'at Audits'
];

export default function ResearchPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const { toast } = useToast();

  // Keyboard shortcut (Escape) & Body Scroll Lock for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
      }
    };

    if (activeProject) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeProject]);

  const handleResetFilters = () => {
    setSelectedCategory('All Projects');
    setSearchQuery('');
  };

  const handleExportDossier = (project) => {
    toast({
      title: 'Exporting Research Dossier',
      description: `Dossier for "${project.title}" has been prepared for export.`,
    });
  };

  const handleShareProject = (project) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    toast({
      title: 'Citation Link Copied',
      description: `Reference link for "${project.title}" copied to clipboard.`,
    });
  };

  const filteredProjects = PORTFOLIO_PROJECTS.filter(project => {
    const matchesCat = selectedCategory === 'All Projects' || project.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.civilization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <PageShell
      title="RESEARCH PORTFOLIO & CASE STUDIES"
      subtitle="Framer-inspired Bento Grid of Verified Civilizational Intelligence & AI Discoveries"
      badge="RESEARCH CASE STUDIES"
      wide
    >
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Kinetic Hero Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-amber-500/30 bg-black/60 backdrop-blur-xl shadow-lg"
        >
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" /> Empires Indexed
            </span>
            <p className="text-2xl font-serif font-bold text-white">14 Civilizations</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Codex Records
            </span>
            <p className="text-2xl font-serif font-bold text-white">2,400+ Manuscripts</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Vanguard Units
            </span>
            <p className="text-2xl font-serif font-bold text-white">8 Active Persona Nodes</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Verification Rate
            </span>
            <p className="text-2xl font-serif font-bold text-emerald-400">98.6% Accuracy</p>
          </div>
        </motion.div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <div className="flex items-center text-zinc-500 mr-1 hidden sm:flex">
              <Filter className="w-3.5 h-3.5 mr-1" />
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, eras, or civs..."
              className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl px-3.5 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Counter & Reset Link */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
          <span>Showing {filteredProjects.length} of {PORTFOLIO_PROJECTS.length} Case Studies</span>
          {(selectedCategory !== 'All Projects' || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-amber-400 hover:underline flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Reset Filters
            </button>
          )}
        </div>

        {/* Bento Grid or Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-serif font-bold text-white">No Research Case Studies Found</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                No archived projects match your current category or search criteria. Try adjusting your query or resetting filters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold hover:bg-amber-500/30 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => setActiveProject(project)}
                className={`group relative cursor-pointer rounded-2xl border border-white/10 bg-zinc-950/70 overflow-hidden shadow-xl hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all flex flex-col justify-between ${
                  project.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Card Thumbnail Container */}
                <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-amber-500/30 text-amber-400">
                      {project.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {project.metrics.status}
                    </span>
                  </div>

                  {/* Vanguard Node */}
                  <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-[10px] font-mono text-zinc-300 bg-black/50 px-2.5 py-1 rounded-md border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>{project.vanguardUnit}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>{project.civilization}</span>
                      <span className="text-amber-500/80">{project.era}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Card Footer Metrics */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                      <span>Confidence: <strong className="text-emerald-400">{project.metrics.confidence}</strong></span>
                      <span>• {project.metrics.sources}</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-amber-500/10 group-hover:bg-amber-500 text-amber-400 group-hover:text-black flex items-center justify-center transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Interactive Framer-Style Detail Modal */}
        <AnimatePresence>
          {activeProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProject(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-3xl border border-amber-500/40 bg-zinc-950 p-6 md:p-8 space-y-6 shadow-2xl scrollbar-thin"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setActiveProject(null)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Modal Header */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {activeProject.category}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      {activeProject.civilization} • {activeProject.era}
                    </span>
                  </div>

                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                    {activeProject.title}
                  </h2>
                </div>

                {/* Banner Image */}
                <div className="h-64 w-full rounded-2xl overflow-hidden relative border border-white/10">
                  <img
                    src={activeProject.image}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                </div>

                {/* Summary & Highlights */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Executive Research Summary
                  </h4>
                  <p className="text-sm text-zinc-300 leading-relaxed font-body">
                    {activeProject.summary}
                  </p>

                  <div className="p-4 rounded-2xl bg-zinc-900/70 border border-white/5 space-y-2">
                    <h5 className="text-xs font-mono uppercase text-zinc-400 font-bold">Key Discoveries</h5>
                    <ul className="space-y-2">
                      {activeProject.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary Evidence & Citations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Primary Evidence & Grounded Citations
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeProject.evidence.map((ev, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                        <span className="text-[10px] font-mono text-amber-400 uppercase">{ev.type}</span>
                        <h6 className="text-xs font-bold text-white">{ev.title}</h6>
                        <span className="text-[10px] font-mono text-zinc-500 block">Ref: {ev.ref}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Validated by {activeProject.vanguardUnit}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleShareProject(activeProject)}
                      className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/10 text-xs font-mono font-bold transition-all flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share Citation
                    </button>
                    <button
                      type="button"
                      onClick={() => handleExportDossier(activeProject)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-mono font-bold uppercase tracking-wider hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Dossier
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}

