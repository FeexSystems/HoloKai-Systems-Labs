import React, { useState } from 'react';
import {
  Calendar, Globe2, Star
} from 'lucide-react';
import { retroAudio } from '@/lib/audioFeedback';

const ASTRONOMICAL_ALIGNMENTS = [
  {
    id: 'nabta-playa',
    site: 'Nabta Playa Archaeoastronomical Megaliths',
    era: 'c. 5000 BCE',
    location: 'Nubian Desert',
    description: 'Oldest known astronomical stone circle in world history, aligned precisely with the summer solstice sunrise to mark the annual arrival of life-giving monsoon rain cycles.',
    starSystem: 'Sirius (Sothis) & Orion\'s Belt',
    calendarType: 'Monsoon Seasonal Solar Calendar',
    significance: 'Preceded Kemetian pyramid star alignments by over two millennia, proving early Pan-African mastery of cosmic timekeeping.'
  },
  {
    id: 'dogon-sirius',
    site: 'Dogon Sirius B Binary Star System',
    era: 'Ancient Ancestral Tradition',
    location: 'Bandiagara Escarpment (Mali)',
    description: 'Sacred oral and visual records detailing Digitaria (Po Tolo / Sirius B), a white dwarf star invisible to the naked eye with a 50-year elliptical orbit around Sirius A.',
    starSystem: 'Sirius A & Sirius B (Po Tolo)',
    calendarType: 'Sigui 60-Year Celestial Jubilee',
    significance: 'Unmatched indigenous astronomical knowledge verified by modern astrophysics only in the 20th century.'
  },
  {
    id: 'giza-sothic',
    site: 'Kemet Sothic Rising & Pyramid Alignments',
    era: 'c. 2500 BCE',
    location: 'Giza & Karnak',
    description: 'True-north cardinal orientation of the Great Pyramids within 1/15th of a degree, tracking the heliacal rising of Sothis (Sirius) to inaugurate the Nile inundation (Akhet).',
    starSystem: 'Sothis (Sirius) & Sah (Orion)',
    calendarType: '365-Day Solar & Sothic Cycle Calendar',
    significance: 'Funded state agriculture, taxation schedules, and divine royal ceremonies aligned with cosmic cycles.'
  },
  {
    id: 'ethiopian-geez-cal',
    site: 'Aksumite Ge\'ez 13-Month Solar Calendar',
    era: '1000 BCE – Present',
    location: 'Ethiopian Highlands',
    description: 'Sovereign calendar consisting of 12 months of 30 days plus a 13th month (Pagumēn) of 5 or 6 leap-year days, keeping ancient seasonal alignment uninterrupted.',
    starSystem: 'Solar Solstice & Equinox Transit',
    calendarType: '13-Month Ge\'ez Calendar System',
    significance: 'Remains in active official state and liturgical use today, maintaining ancient Axumite chronometry.'
  }
];

export default function CelestialObservatory() {
  const [selectedSite, setSelectedSite] = useState(ASTRONOMICAL_ALIGNMENTS[0]);
  const [timeRotation, setTimeRotation] = useState(45);
  const [activeSeason, setActiveSeason] = useState('Akhet');
  const [conversionYear, setConversionYear] = useState(2026);

  const handleSelectSite = (site) => {
    retroAudio.playClick();
    setSelectedSite(site);
  };

  const geezYear = conversionYear - 7; // Approximate Ge'ez calendar offset

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6 text-zinc-100 font-sans">
      {/* HERO BANNER */}
      <div className="relative rounded-3xl border border-amber-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/40 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-mono font-bold tracking-wider uppercase">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Pan-African Archaeoastronomy Observatory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Celestial Observatory & Calendar Matrix
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed font-sans">
              Explore ancient African stone megaliths, Dogon Sirius binary star geometry, Sothic rising inundation cycles, and the 13-month Ge'ez solar calendar.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-zinc-900 border border-amber-500/30 text-xs font-mono text-amber-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Gregorian: {conversionYear} | Ge'ez Year: {geezYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ARCHAEOASTRONOMY SITES */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <Globe2 className="w-4 h-4" />
            <span>Sacred Archaeoastronomy Sites</span>
          </h3>

          <div className="space-y-3">
            {ASTRONOMICAL_ALIGNMENTS.map((site) => (
              <div
                key={site.id}
                onClick={() => handleSelectSite(site)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedSite.id === site.id
                    ? 'border-amber-500 bg-amber-500/15 shadow-lg'
                    : 'border-white/10 bg-zinc-950/80 hover:border-amber-500/40 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                    {site.era}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">{site.location}</span>
                </div>
                <h4 className="text-sm font-serif font-bold text-white">{site.site}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{site.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE STAR MAP CANVAS & CONVERTER */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl border border-amber-500/30 bg-zinc-950/90 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Active Star System Alignment
                </span>
                <h2 className="text-xl font-serif font-bold text-white">{selectedSite.site}</h2>
              </div>

              <div className="flex items-center gap-2">
                {['Akhet (Inundation)', 'Peret (Emergence)', 'Shemu (Harvest)'].map((season) => (
                  <button
                    key={season}
                    onClick={() => {
                      retroAudio.playClick();
                      setActiveSeason(season);
                    }}
                    className={`px-3 py-1 rounded-lg text-[10px] font-mono transition ${
                      activeSeason === season
                        ? 'bg-amber-500 text-zinc-950 font-bold'
                        : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {season.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* STAR MAP CANVAS VISUALIZER */}
            <div className="relative w-full h-64 rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-950 via-zinc-900 to-amber-950/30 overflow-hidden flex items-center justify-center p-4">
              {/* Radial Starlight Glow */}
              <div
                className="absolute inset-0 opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.4), transparent 70%)`,
                  transform: `rotate(${timeRotation}deg)`,
                }}
              />

              {/* SVG Star Constellation Orbit */}
              <svg
                className="w-full h-full max-w-md transition-transform duration-700"
                style={{ transform: `rotate(${timeRotation}deg)` }}
                viewBox="0 0 300 200"
              >
                <circle cx="150" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="150" cy="100" r="45" fill="none" stroke="#10B981" strokeWidth="1" strokeDasharray="2 2" />

                {/* Stars */}
                <circle cx="150" cy="30" r="4" fill="#F59E0B" className="animate-pulse" />
                <circle cx="215" cy="100" r="3" fill="#3B82F6" />
                <circle cx="105" cy="145" r="3" fill="#EC4899" />
                <circle cx="150" cy="100" r="6" fill="#FCD34D" />

                <line x1="150" y1="30" x2="215" y2="100" stroke="#F59E0B" strokeWidth="0.5" strokeOpacity="0.5" />
                <line x1="215" y1="100" x2="105" y2="145" stroke="#F59E0B" strokeWidth="0.5" strokeOpacity="0.5" />
              </svg>

              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-zinc-950/80 border border-white/10 backdrop-blur-md text-xs font-mono text-amber-300">
                Tracked System: {selectedSite.starSystem}
              </div>
            </div>

            {/* TIME ROTATION SLIDER */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-zinc-300">
                <span>Diurnal Star Rotation Angle</span>
                <span className="text-amber-400">{timeRotation}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={timeRotation}
                onChange={(e) => setTimeRotation(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* DETAILS & SIGNIFICANCE */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-400">
                Historical Significance
              </span>
              <p className="text-xs text-zinc-200 leading-relaxed font-sans">
                {selectedSite.significance}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
