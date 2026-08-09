'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  DomainSearch,
  ProcessSection,
  Accordion,
  CivilizationCard,
  ArtifactCard,
  OracleChamber,
  EpistemicBadge,
  SpatialCanvas,
  Button,
  Card,
  Grid,
} from '@holokai/ui';
import { CivilizationEntry } from '@holokai/contracts';

const FEATURED_CIVILIZATIONS: CivilizationEntry[] = [
  {
    id: 'kemet-nile',
    name: 'Ancient Kemet & Nile Valley',
    region: 'North-East Africa',
    era: '3100 BCE – 332 BCE',
    centuryRange: '31st c. BCE – 4th c. BCE',
    description: 'Foundational civilization of hieroglyphic epigraphy, solar calendar astronomy, architectural geometry, and monumental stone masonry along the Nile Bend.',
    achievements: ['Hieroglyphic Epigraphy', 'Solar Astronomy', 'Pyramid Geometry'],
    keyFigures: ['Imhotep', 'Hatshepsut', 'Ramses II'],
  },
  {
    id: 'kush-meroe',
    name: 'Kingdom of Kush & Meroë',
    region: 'Middle Nile / Nubia',
    era: '1070 BCE – 350 CE',
    centuryRange: '11th c. BCE – 4th c. CE',
    description: 'Famed empire of Nubian royal pyramids, bloomery iron metallurgy, Meroitic cursive script, and female sovereign Candaces (Kandakes).',
    achievements: ['Bloomery Metallurgy', 'Meroitic Script', 'Nubian Pyramids'],
    keyFigures: ['Piye', 'Taharqa', 'Amanirenas'],
  },
  {
    id: 'axumite-empire',
    name: 'Axumite Empire',
    region: 'Horn of Africa',
    era: '100 CE – 940 CE',
    centuryRange: '2nd c. CE – 10th c. CE',
    description: 'Global trading empire bridging Rome, Persia, and India. Pioneers of Ge\'ez script epigraphy, monolithic stelae obelisks, and gold coinage.',
    achievements: ['Ge\'ez Manuscript Script', 'Monolithic Stelae', 'International Currency'],
    keyFigures: ['Ezana', 'Kaleb', 'Yared'],
  },
  {
    id: 'mali-songhai',
    name: 'Mali & Songhai Empires',
    region: 'West Africa / Niger Bend',
    era: '1235 CE – 1591 CE',
    centuryRange: '13th c. CE – 16th c. CE',
    description: 'Intellectual capital of medieval West Africa centered at Timbuktu\'s Sankore University. Renowned for manuscript astronomy, trade law, and gold reserves.',
    achievements: ['Sankore Manuscripts', 'Mathematical Astronomy', 'Ajami Epigraphy'],
    keyFigures: ['Mansa Musa', 'Sundiata Keita', 'Askia Muhammad'],
  },
  {
    id: 'great-zimbabwe',
    name: 'Great Zimbabwe & Monomotapa',
    region: 'Southern Africa',
    era: '1100 CE – 1450 CE',
    centuryRange: '12th c. CE – 15th c. CE',
    description: 'Mastery of mortarless granite dry-stone architecture, gold smelting, and Indian Ocean trade networks connecting Kilwa to inland plateaus.',
    achievements: ['Dry-Stone Masonry', 'Gold Smelting', 'Indian Ocean Trade'],
    keyFigures: ['Chigwagu Rusvingo', 'Mutota', 'Matope'],
  },
  {
    id: 'yoruba-benin',
    name: 'Yoruba & Benin Kingdoms',
    region: 'West African Forest Zone',
    era: '1100 CE – 1897 CE',
    centuryRange: '12th c. CE – 19th c. CE',
    description: 'World-renowned lost-wax bronze casting, terracotta sculpture, 256 Odù Ifá binary divination matrices, and the 100-mile Sungbo\'s Eredo earthworks.',
    achievements: ['Lost-Wax Bronze Casting', 'Ifá Binary Code', 'Sungbo\'s Eredo Earthworks'],
    keyFigures: ['Oduduwa', 'Oranmiyan', 'Oba Ewuare the Great'],
  },
];

const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'What is HoloKai Spatial Research Operating System?',
    answer: 'HoloKai is a civilization-scale, edge-native, AI-augmented research OS designed to digitize, verify, and preserve Pan-African epigraphy, astronomy, oral traditions, and historical codices.',
  },
  {
    id: 'faq-2',
    question: 'How does the 6-Tier Epistemic Rigor system work?',
    answer: 'Every claim, manuscript line, or historical event in HoloKai is assigned one of six epistemic classifications: Established, Scholarly Debate, Oral Tradition, Esoteric, Speculative, or Fictional.',
  },
  {
    id: 'faq-3',
    question: 'Can I query the multi-agent Oracle AI engine directly?',
    answer: 'Yes! You can query the Oracle Chamber using natural language to retrieve multi-agent synthesized research dossiers with full primary source citations.',
  },
  {
    id: 'faq-4',
    question: 'How are micro-frontends (MFEs) federated across the platform?',
    answer: 'HoloKai uses strict TypeScript contract boundaries and event bus messaging to orchestrate independently deployed product remotes without origin latency.',
  },
];

export default function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) setSubscribed(true);
  };

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. HERO SECTION (§ 13) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-12 overflow-hidden border-b border-amber-500/20">
        <SpatialCanvas className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(200,149,42,0.16),transparent_75%)]" />
        </SpatialCanvas>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          {/* Hero Eyebrow */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            <span>✨ HoloKai v14.0 Systemic Spatial Operating System</span>
          </div>

          {/* Hero Heading - Massive Display Typography */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-[clamp(4rem,7vw,7rem)] font-extrabold tracking-[-0.045em] leading-[0.95] text-white">
            Where Civilizations <br />
            <span className="bg-gradient-to-r from-[#ffd27a] via-[#e8b84b] to-[#c8952a] bg-clip-text text-transparent">
              Remember.
            </span>
          </h1>

          {/* Hero Description */}
          <p className="text-lg sm:text-2xl text-zinc-300 font-light max-w-3xl mx-auto leading-relaxed">
            An edge-native spatial instrument and AI synthesis platform for Pan-African epigraphy, archaeoastronomy, metallurgy, and oral memory.
          </p>

          {/* Domain Search Component */}
          <div className="pt-4 max-w-3xl mx-auto">
            <DomainSearch />
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/oracle">
              <Button variant="primary">Query Oracle AI Engine →</Button>
            </Link>
            <Link href="/archive">
              <Button variant="secondary">Explore 16-Volume Archive</Button>
            </Link>
            <Link href="/system">
              <Button variant="ghost">View System Telemetry</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT TICKER SECTION */}
      <section className="mx-auto max-w-[1440px] px-6">
        <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono shadow-xl">
          <div className="flex items-center gap-3 text-amber-400 font-bold uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            Live Codex Ingestion Feed
          </div>
          <p className="text-zinc-300 truncate max-w-2xl">
            Ingestion Node 08: "Sankore Trigonometry Folio 418 — Solar declination tables & lunar station matrices."
          </p>
          <EpistemicBadge stance="ESTABLISHED" confidence={0.99} showTooltip={false} />
        </div>
      </section>

      {/* 3. AI BUILDER / SYNTHESIS SECTION */}
      <section className="mx-auto max-w-[1440px] px-6">
        <Card variant="feature" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              AI Synthesis & Research Engine
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Multi-Agent Intelligence for Ancient History
            </h2>
            <p className="text-base text-zinc-300 leading-relaxed font-light">
              Synthesize centuries of epigraphic inscriptions, oral codices, and astronomical charts into peer-reviewed research dossiers with instant vector search.
            </p>
            <div className="pt-2">
              <Link href="/oracle">
                <Button variant="primary">Launch AI Assistant →</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-[#05050a] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-amber-400">
              <span>ORACLE QUERY RUNTIME</span>
              <span>SYNTHESIS COMPLETE (140ms)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              &gt; MATCH: Timbuktu Sankore Manuscripts (14th c.)<br />
              &gt; CONFIDENCE: 98.4% Established Consensus<br />
              &gt; CITATION: Folio 112, Ahmed Baba Collection
            </p>
          </div>
        </Card>
      </section>

      {/* 4. DOMAIN EXPLORER SECTION */}
      <section className="mx-auto max-w-[1440px] px-6 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
              Civilization Memory Explorer
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
              Pan-African Kingdoms & Eras
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Six major epigraphic and intellectual epochs indexed by vector distance and peer-reviewed evidence.
          </p>
        </div>

        <Grid cols={3} gap="lg">
          {FEATURED_CIVILIZATIONS.map((civ) => (
            <CivilizationCard key={civ.id} civilization={civ} />
          ))}
        </Grid>
      </section>

      {/* 5. HOSTING / ARCHIVE KNOWLEDGE SECTION */}
      <section className="mx-auto max-w-[1440px] px-6 space-y-10">
        <div className="border-b border-amber-500/20 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            16-Volume Knowledge Archives
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
            Repositories of Civilization
          </h2>
        </div>

        <Grid cols={4} gap="md">
          <Card variant="standard" className="space-y-4">
            <span className="text-2xl font-mono text-amber-400 font-bold">01</span>
            <h3 className="text-xl font-bold">Nile Epigraphy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hieroglyphic, Hieratic, and Demotic monumental inscriptions from Karnak to Philae.
            </p>
          </Card>
          <Card variant="standard" className="space-y-4">
            <span className="text-2xl font-mono text-amber-400 font-bold">02</span>
            <h3 className="text-xl font-bold">Meroitic Pyramids</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Nubian royal cemetery inscriptions and bloomery iron furnace metallurgy.
            </p>
          </Card>
          <Card variant="standard" className="space-y-4">
            <span className="text-2xl font-mono text-amber-400 font-bold">03</span>
            <h3 className="text-xl font-bold">Timbuktu Astronomy</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Medieval mathematical folios on planetary orbits, geometry, and maritime navigation.
            </p>
          </Card>
          <Card variant="standard" className="space-y-4">
            <span className="text-2xl font-mono text-amber-400 font-bold">04</span>
            <h3 className="text-xl font-bold">Ifa Divination Code</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              256 Odù binary probability matrices and oral literary corpora.
            </p>
          </Card>
        </Grid>
      </section>

      {/* 6. UNBOX / PROCESS WORKFLOW SECTION (§ 18) */}
      <section className="mx-auto max-w-[1440px] px-6">
        <ProcessSection />
      </section>

      {/* 7. ALF / ORACLE AI CHAMBER DEMO SECTION */}
      <section className="mx-auto max-w-[1440px] px-6">
        <OracleChamber />
      </section>

      {/* 8. LAUNCHPAD SECTION */}
      <section className="mx-auto max-w-[1440px] px-6 space-y-8">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Product Launchpad
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            Launch Into the Spatial Research OS
          </h2>
          <p className="text-zinc-400 text-sm">
            Access multi-agent synthesis, 3D orbital labs, and epistemic validation suites from a single interface.
          </p>
        </div>

        <Grid cols={3} gap="md">
          <Card variant="elevated" className="space-y-4 text-center p-8">
            <span className="text-3xl">🔮</span>
            <h3 className="text-xl font-bold">Oracle AI Chamber</h3>
            <p className="text-xs text-zinc-400">Query multi-agent LLM council on primary sources.</p>
            <Link href="/oracle"><Button variant="secondary" className="w-full">Launch App →</Button></Link>
          </Card>
          <Card variant="elevated" className="space-y-4 text-center p-8">
            <span className="text-3xl">📜</span>
            <h3 className="text-xl font-bold">Archive Codex</h3>
            <p className="text-xs text-zinc-400">16-Volume digitized African history & epigraphy.</p>
            <Link href="/archive"><Button variant="secondary" className="w-full">Launch App →</Button></Link>
          </Card>
          <Card variant="elevated" className="space-y-4 text-center p-8">
            <span className="text-3xl">⚡</span>
            <h3 className="text-xl font-bold">System Telemetry</h3>
            <p className="text-xs text-zinc-400">Real-time edge performance & MFE health.</p>
            <Link href="/system"><Button variant="secondary" className="w-full">Launch App →</Button></Link>
          </Card>
        </Grid>
      </section>

      {/* 9. SECURITY & EPISTEMIC RIGOR SECTION */}
      <section className="mx-auto max-w-[1440px] px-6 p-8 md:p-12 rounded-[32px] border border-amber-500/30 bg-[#0a0a0f] space-y-8">
        <div className="border-b border-white/10 pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Security & Truth Standard
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white mt-1">
            6-Tier Knowledge Classification Architecture
          </h2>
        </div>

        <Grid cols={3} gap="md">
          <div className="p-5 rounded-2xl bg-[#12121a] border border-emerald-500/30 space-y-2">
            <EpistemicBadge stance="ESTABLISHED" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Peer-reviewed archaeological, epigraphic, and genetic consensus with multiple primary sources.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12121a] border border-blue-500/30 space-y-2">
            <EpistemicBadge stance="SCHOLARLY_DEBATE" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Active academic discussion with competing hypotheses supported by partial physical evidence.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12121a] border border-amber-500/30 space-y-2">
            <EpistemicBadge stance="TRADITION" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Preserved oral lineage, Griot recitations, and elder memory corpora passed down through generations.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12121a] border border-purple-500/30 space-y-2">
            <EpistemicBadge stance="ESOTERIC" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Symbolic, cosmological, or ritual interpretations preserved in sacred geometric motifs.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12121a] border border-pink-500/30 space-y-2">
            <EpistemicBadge stance="SPECULATIVE" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Unverified structural or historical hypotheses requiring further archaeological ground-truth.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-[#12121a] border border-zinc-500/30 space-y-2">
            <EpistemicBadge stance="FICTIONAL" showTooltip={false} />
            <p className="text-xs text-zinc-300 leading-relaxed">
              Literary or mythological narrative elements demarcated for creative context.
            </p>
          </div>
        </Grid>
      </section>

      {/* 10. MANAGEMENT CENTER SECTION */}
      <section className="mx-auto max-w-[1440px] px-6 space-y-10">
        <div className="border-b border-amber-500/20 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Management & Operations Center
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
            Control Your Research Fabric
          </h2>
        </div>

        <Grid cols={3} gap="md">
          <Card variant="standard" className="space-y-3">
            <h4 className="font-bold text-lg text-amber-300">Domain Manager</h4>
            <p className="text-xs text-zinc-400">Configure research domain routes, epigraphic scripts & spatial bounds.</p>
          </Card>
          <Card variant="standard" className="space-y-3">
            <h4 className="font-bold text-lg text-amber-300">Connection Manager</h4>
            <p className="text-xs text-zinc-400">Manage vector databases, GraphQL BFF endpoints & edge workers.</p>
          </Card>
          <Card variant="standard" className="space-y-3">
            <h4 className="font-bold text-lg text-amber-300">Communication Center</h4>
            <p className="text-xs text-zinc-400">Real-time EventBus messaging between micro-frontend remotes.</p>
          </Card>
          <Card variant="standard" className="space-y-3">
            <h4 className="font-bold text-lg text-amber-300">Library Card Index</h4>
            <p className="text-xs text-zinc-400">Manage 16-volume ancient historical texts & translation dictionaries.</p>
          </Card>
          <Card variant="standard" className="space-y-3">
            <h4 className="font-bold text-lg text-amber-300">Transfer Manager</h4>
            <p className="text-xs text-zinc-400">Export high-fidelity 3D spatial models & research dossiers.</p>
          </Card>
          <Card variant="standard" className="space-y-3">
            <h4 className="font-bold text-lg text-amber-300">Security Center</h4>
            <p className="text-xs text-zinc-400">Configure epistemic thresholds & peer-review audit trails.</p>
          </Card>
        </Grid>
      </section>

      {/* 11. TESTIMONIALS SECTION */}
      <section className="mx-auto max-w-[1440px] px-6 space-y-8">
        <div className="border-b border-amber-500/20 pb-6 text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Scholar & Griot Voices
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
            Endorsed by Researchers Worldwide
          </h2>
        </div>

        <Grid cols={2} gap="lg">
          <Card variant="glass" className="space-y-4 p-8">
            <p className="text-sm text-zinc-200 italic leading-relaxed">
              "HoloKai is the first platform that treats Pan-African epigraphy and astronomy with the computational rigor and visual elegance it deserves."
            </p>
            <div>
              <span className="font-bold text-amber-300 text-sm block">Prof. Cheikh Anta Diop Institute</span>
              <span className="text-xs font-mono text-zinc-500">Dakar, Senegal</span>
            </div>
          </Card>
          <Card variant="glass" className="space-y-4 p-8">
            <p className="text-sm text-zinc-200 italic leading-relaxed">
              "The 6-tier epistemic stance system brings unmatched clarity to distinguishing historical consensus from oral tradition."
            </p>
            <div>
              <span className="font-bold text-amber-300 text-sm block">Dr. Kwesi Appiah</span>
              <span className="text-xs font-mono text-zinc-500">African Epigraphy Project</span>
            </div>
          </Card>
        </Grid>
      </section>

      {/* 12. FAQ SECTION (§ 19) */}
      <section className="mx-auto max-w-[1440px] px-6 space-y-8">
        <div className="border-b border-amber-500/20 pb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-1">
            Understanding HoloKai Architecture
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* 13. NEWSLETTER SECTION */}
      <section className="mx-auto max-w-[1440px] px-6">
        <div className="rounded-[32px] border border-amber-500/30 bg-gradient-to-r from-[#141420] via-[#0d0d14] to-[#05050a] p-10 md:p-16 text-center space-y-6 shadow-2xl">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold">
            Codex Digest
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-2xl mx-auto">
            Subscribe to Civilization Memory Updates
          </h2>
          <p className="text-sm text-zinc-300 max-w-xl mx-auto font-light leading-relaxed">
            Receive monthly research dispatches, newly digitized manuscript folios, and edge telemetry benchmarks.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-sm font-bold max-w-md mx-auto">
              ✓ Subscribed! Welcome to the HoloKai Civilization Research Network.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter scholar email address..."
                className="w-full h-12 px-4 rounded-full bg-white/5 border border-amber-500/30 text-white placeholder-zinc-500 text-sm outline-none focus:border-amber-400"
              />
              <Button type="submit" variant="primary" className="w-full sm:w-auto shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
