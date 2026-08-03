import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polygon, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, X, Loader2, Clock, Play, Pause, RotateCcw, Shield } from 'lucide-react';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { searchLibrary } from '@/lib/holokaiApi';
import { MOCK_MAP_LOCATIONS } from '@/lib/mockData';

/** Historical century epochs for Time Travel Mode */
const CENTURY_EPOCHS = [
  { year: -3000, label: '3000 BCE', title: 'Early Dynastic Nile & Kerma', activeEmpires: ['kemet'] },
  { year: -1500, label: '1500 BCE', title: 'New Kingdom Kemet & Kerma Zenith', activeEmpires: ['kemet', 'kush'] },
  { year: -500, label: '500 BCE', title: 'Meroë Kingdom & Nok Iron Smelting', activeEmpires: ['kush', 'nok'] },
  { year: 300, label: '300 CE', title: 'Aksumite Empire & Early Cross River', activeEmpires: ['aksum', 'nok', 'nsibidi'] },
  { year: 800, label: '800 CE', title: 'Ghana Empire & Swahili Ports', activeEmpires: ['ghana', 'swahili', 'aksum'] },
  { year: 1200, label: '1200 CE', title: 'Mali Empire & Great Zimbabwe Masonry', activeEmpires: ['mali', 'zimbabwe', 'swahili', 'yoruba'] },
  { year: 1400, label: '1400 CE', title: 'Timbuktu Scholastic Age & Kilwa Sultanate', activeEmpires: ['mali', 'zimbabwe', 'swahili', 'benin'] },
  { year: 1500, label: '1500 CE', title: 'Songhai Empire & Benin Golden Age', activeEmpires: ['songhai', 'benin', 'swahili', 'ethiopia'] },
  { year: 1800, label: '1800 CE', title: 'Ashanti Confederation & Sokoto Era', activeEmpires: ['ashanti', 'ethiopia', 'benin'] },
];

/** Empire Territory Boundary Polygons for Time Travel */
const EMPIRE_TERRITORIES = {
  kemet: {
    name: 'Kingdom of Kemet (Ancient Egypt)',
    color: '#E8B84B',
    coords: [
      [31.2, 29.8], [31.5, 33.5], [24.0, 34.0], [22.0, 31.5], [24.0, 29.0]
    ],
    summary: 'Nile Valley agrarian surplus, solar calendars, monumental masonry, and papyrus trade.'
  },
  kush: {
    name: 'Kingdom of Kush (Kerma & Meroë)',
    color: '#F59E0B',
    coords: [
      [22.0, 31.5], [20.0, 35.0], [15.0, 36.0], [14.0, 32.0], [18.0, 30.0]
    ],
    summary: 'Nubian gold mines, iron furnaces of Meroë, and stepped pyramid necropolises.'
  },
  aksum: {
    name: 'Aksumite Empire',
    color: '#D97706',
    coords: [
      [18.0, 37.0], [16.0, 41.5], [11.0, 43.0], [10.0, 38.0], [14.0, 36.0]
    ],
    summary: 'Red Sea trade hegemon coining gold, erecting granite stelae, and linking Rome to India.'
  },
  nok: {
    name: 'Nok Metallurgical Culture',
    color: '#6366F1',
    coords: [
      [11.0, 6.0], [11.0, 9.5], [7.5, 9.5], [7.5, 6.0]
    ],
    summary: 'Pioneering sub-Saharan bloomery iron smelting and stylized terracotta sculpture.'
  },
  ghana: {
    name: 'Ghana Empire (Wagadou)',
    color: '#10B981',
    coords: [
      [17.0, -12.0], [17.0, -6.0], [12.0, -6.0], [12.0, -12.0]
    ],
    summary: 'The Land of Gold controlling trans-Saharan salt trade routes with capital at Koumbi Saleh.'
  },
  mali: {
    name: 'Mali Empire',
    color: '#EC4899',
    coords: [
      [18.5, -15.0], [18.5, -1.0], [11.0, -1.0], [10.0, -12.0]
    ],
    summary: 'Vast Sahelian empire of Sundiata Keita & Mansa Musa; Timbuktu university and gold reserves.'
  },
  songhai: {
    name: 'Songhai Empire',
    color: '#A855F7',
    coords: [
      [20.0, -8.0], [20.0, 4.0], [12.0, 5.0], [11.0, -7.0]
    ],
    summary: 'Largest empire in West African history under Askia Mohammad I with professional military.'
  },
  swahili: {
    name: 'Swahili Coast Corridor',
    color: '#06B6D4',
    coords: [
      [2.0, 41.0], [-2.0, 41.0], [-16.0, 40.0], [-16.0, 38.0], [1.0, 39.0]
    ],
    summary: 'Monsoon-navigated coral stone city-states (Kilwa, Mombasa, Zanzibar) trading gold & silk.'
  },
  zimbabwe: {
    name: 'Great Zimbabwe & Mutapa',
    color: '#F43F5E',
    coords: [
      [-17.0, 28.0], [-17.0, 33.0], [-22.0, 32.0], [-22.0, 27.0]
    ],
    summary: 'Dry-stone granite masonry city trading gold and ivory to the Indian Ocean coast.'
  },
  benin: {
    name: 'Kingdom of Benin',
    color: '#8B5CF6',
    coords: [
      [7.5, 4.5], [7.5, 7.0], [5.0, 7.0], [5.0, 4.5]
    ],
    summary: 'Master bronze casters, earthwork defensive ramparts, and sophisticated urban planning.'
  },
  ashanti: {
    name: 'Ashanti Empire',
    color: '#EAB308',
    coords: [
      [8.5, -3.0], [8.5, -0.2], [5.5, -0.2], [5.5, -3.0]
    ],
    summary: 'Golden Stool spiritual democracy, gold mining, and trade network across the Akan forest.'
  },
  ethiopia: {
    name: 'Solomonic Ethiopian Empire',
    color: '#0284C7',
    coords: [
      [15.0, 36.0], [14.0, 42.0], [8.0, 42.0], [8.0, 35.0]
    ],
    summary: 'Highland rock-cut churches of Lalibela, Ge\'ez manuscripts, and anti-colonial resistance.'
  },
};

/** Historical Trade Routes */
const TRADE_ROUTES = [
  {
    name: 'Trans-Saharan Gold & Salt Route',
    color: '#F59E0B',
    path: [[12.6, -8.0], [16.7, -3.0], [22.5, 5.5], [31.2, 29.8]]
  },
  {
    name: 'Nile River Corridor',
    color: '#3B82F6',
    path: [[15.6, 32.5], [18.5, 31.8], [24.0, 32.8], [30.0, 31.2]]
  },
  {
    name: 'Swahili Indian Ocean Monsoon Network',
    color: '#06B6D4',
    path: [[-15.0, 40.5], [-6.8, 39.3], [-4.0, 39.6], [2.0, 45.3], [12.8, 45.0]]
  }
];

/** Fallback coordinates for sources that lack lat/lng — keyed by civilization then region */
const GEOCODE_BY_CIVILIZATION = {
  Kush: { lat: 18.5, lng: 31.8 },
  Kemet: { lat: 26.0, lng: 32.0 },
  Aksum: { lat: 14.1, lng: 38.7 },
  Mali: { lat: 15.0, lng: -8.0 },
  Benin: { lat: 6.5, lng: 5.6 },
  Zimbabwe: { lat: -20.3, lng: 30.9 },
  'Ghana Empire': { lat: 15.0, lng: -10.0 },
  'Swahili Coast': { lat: -6.8, lng: 39.3 },
  Nok: { lat: 9.5, lng: 7.5 },
  Yoruba: { lat: 7.0, lng: 4.0 },
  Ashanti: { lat: 6.7, lng: -1.6 },
  Dogon: { lat: 14.5, lng: -3.5 },
  Ejagham: { lat: 5.5, lng: 8.5 },
  'Ejagham / Igbo': { lat: 5.5, lng: 8.5 },
  Songhai: { lat: 16.3, lng: 0.0 },
  Ethiopia: { lat: 9.0, lng: 40.0 },
  'Bantu peoples': { lat: -5.0, lng: 23.0 },
};

const GEOCODE_BY_REGION = {
  'Nile Valley': { lat: 26.0, lng: 32.0 },
  Nubia: { lat: 18.5, lng: 31.8 },
  'West Africa': { lat: 12.0, lng: -5.0 },
  'East Africa': { lat: -6.0, lng: 36.0 },
  'Southern Africa': { lat: -20.0, lng: 28.0 },
  'Horn of Africa': { lat: 10.0, lng: 42.0 },
  'Central Africa': { lat: 0.0, lng: 20.0 },
  'Cross River': { lat: 5.5, lng: 8.5 },
  Mali: { lat: 14.5, lng: -3.5 },
  Ghana: { lat: 6.7, lng: -1.6 },
  Ethiopia: { lat: 9.0, lng: 40.0 },
  'Sub-Saharan Africa': { lat: 5.0, lng: 20.0 },
};

function resolveCoords(source) {
  if (source.lat != null && source.lng != null) return { lat: source.lat, lng: source.lng };
  return GEOCODE_BY_CIVILIZATION[source.civilization] || GEOCODE_BY_REGION[source.region] || null;
}

const REGION_LAYERS = [
  { id: 'all', label: 'All Sites' },
  { id: 'Nile Valley', label: 'Nile Valley' },
  { id: 'Nubia', label: 'Nubia' },
  { id: 'West Africa', label: 'West Africa' },
  { id: 'East Africa', label: 'East Africa' },
  { id: 'Southern Africa', label: 'Southern Africa' },
  { id: 'Horn of Africa', label: 'Horn of Africa' },
];

export default function InteractiveMap() {
  const { activeGuardian } = useHoloKai();
  const [selected, setSelected] = useState(null);
  const [activeLayer, setActiveLayer] = useState('all');
  const [apiLocations, setApiLocations] = useState(null);
  const [loading, setLoading] = useState(false);

  // Time Travel Mode State
  const [timeTravelEnabled, setTimeTravelEnabled] = useState(false);
  const [selectedEpochIndex, setSelectedEpochIndex] = useState(5); // Default to 1200 CE
  const [isPlayingTimeLapse, setIsPlayingTimeLapse] = useState(false);

  const currentEpoch = CENTURY_EPOCHS[selectedEpochIndex];

  // Auto time lapse effect
  useEffect(() => {
    let timer;
    if (isPlayingTimeLapse && timeTravelEnabled) {
      timer = setInterval(() => {
        setSelectedEpochIndex((prev) => (prev + 1) % CENTURY_EPOCHS.length);
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isPlayingTimeLapse, timeTravelEnabled]);

  const loadFromApi = useCallback(async () => {
    setLoading(true);
    try {
      const region = activeLayer !== 'all' ? activeLayer : undefined;
      const data = await searchLibrary({ region, limit: 100 });
      if (data?.items?.length) {
        const mapped = data.items
          .map((s, i) => {
            const coords = resolveCoords(s);
            if (!coords) return null;
            return {
              id: `api-${s.slug || i}`,
              name: s.title,
              lat: coords.lat,
              lng: coords.lng,
              civilization: s.civilization || '',
              era: s.era || 'Unknown',
              description: s.summary || '',
              region: s.region || '',
            };
          })
          .filter(Boolean);
        setApiLocations(mapped.length > 0 ? mapped : null);
      } else {
        setApiLocations(null);
      }
    } catch {
      setApiLocations(null);
    } finally {
      setLoading(false);
    }
  }, [activeLayer]);

  useEffect(() => {
    loadFromApi();
  }, [loadFromApi]);

  const locations = useMemo(() => {
    if (apiLocations) return apiLocations;
    if (activeLayer === 'all') return MOCK_MAP_LOCATIONS;
    return MOCK_MAP_LOCATIONS.filter((loc) => loc.region === activeLayer);
  }, [apiLocations, activeLayer]);

  return (
    <div className="flex flex-col h-full">
      {/* MAP HUD HEADER */}
      <div className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 bg-zinc-950/80 backdrop-blur-md" style={{ borderColor: 'rgba(200,149,42,0.15)' }}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-display font-semibold tracking-wide text-white">Interactive Leaflet Map</h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30">
              GIS GEOSPATIAL
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">African civilizations, trade corridors, and territorial shift boundaries</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* TIME TRAVEL MODE TOGGLE */}
          <button
            onClick={() => setTimeTravelEnabled(!timeTravelEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-md ${
              timeTravelEnabled
                ? 'bg-amber-500 text-zinc-950 border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                : 'bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30'
            }`}
          >
            <Clock className={`w-4 h-4 ${timeTravelEnabled ? 'animate-spin text-zinc-950' : 'text-amber-400'}`} />
            <span>{timeTravelEnabled ? 'Time Travel Mode Active' : 'Enable Time Travel Mode'}</span>
          </button>

          {loading && <Loader2 className="w-4 h-4 animate-spin" style={{ color: activeGuardian.accentColor }} />}
          <Layers className="w-4 h-4 text-zinc-400" />
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {REGION_LAYERS.map((l) => (
              <button
                key={l.id}
                onClick={() => setActiveLayer(l.id)}
                className="px-2.5 py-1.5 rounded-lg text-[9px] tracking-wider uppercase font-mono transition-all whitespace-nowrap"
                style={{
                  background: activeLayer === l.id ? `${activeGuardian.accentColor}25` : 'transparent',
                  border: `1px solid ${activeLayer === l.id ? activeGuardian.accentColor + '66' : 'rgba(255,255,255,0.08)'}`,
                  color: activeLayer === l.id ? activeGuardian.accentColor : 'rgba(255,255,255,0.4)',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TIME TRAVEL CENTURY SCRUBBER BAR */}
      {timeTravelEnabled && (
        <div className="px-6 py-3 bg-zinc-950 border-b border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20 animate-fadeIn">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingTimeLapse(!isPlayingTimeLapse)}
              className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono flex items-center gap-1.5 transition"
              title={isPlayingTimeLapse ? 'Pause Time Lapse' : 'Play Time Lapse'}
            >
              {isPlayingTimeLapse ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{isPlayingTimeLapse ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => setSelectedEpochIndex(0)}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10 text-xs font-mono transition"
              title="Reset to 3000 BCE"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-widest block">
                ACTIVE CENTURY EPOCH: {currentEpoch.label}
              </span>
              <h3 className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                {currentEpoch.title}
              </h3>
            </div>
          </div>

          {/* Century Range Slider */}
          <div className="flex-1 max-w-xl flex flex-col gap-1">
            <input
              type="range"
              min={0}
              max={CENTURY_EPOCHS.length - 1}
              value={selectedEpochIndex}
              onChange={(e) => setSelectedEpochIndex(Number(e.target.value))}
              className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] font-mono text-zinc-400 px-1">
              {CENTURY_EPOCHS.map((epoch, idx) => (
                <span
                  key={epoch.year}
                  onClick={() => setSelectedEpochIndex(idx)}
                  className={`cursor-pointer transition ${selectedEpochIndex === idx ? 'text-amber-300 font-bold underline' : 'hover:text-zinc-200'}`}
                >
                  {epoch.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MAP CONTAINER */}
      <div className="flex-1 relative">
        <div className="absolute inset-0" style={{ background: '#0A0A0A' }}>
          <MapContainer
            center={[5, 20]}
            zoom={3}
            minZoom={2}
            style={{ width: '100%', height: '100%', background: '#0A0A0A' }}
            className="holokai-map"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution=""
            />

            {/* TRADE ROUTES POLYLINES */}
            {TRADE_ROUTES.map((route, i) => (
              <Polyline
                key={`route-${i}`}
                positions={route.path}
                pathOptions={{
                  color: route.color,
                  weight: timeTravelEnabled ? 3 : 2,
                  dashArray: '6, 8',
                  opacity: 0.7,
                }}
              >
                <Popup className="holokai-popup">
                  <div className="text-xs font-mono text-white">
                    <strong style={{ color: route.color }}>{route.name}</strong>
                    <br />
                    <span>Historical Trade Network</span>
                  </div>
                </Popup>
              </Polyline>
            ))}

            {/* TIME TRAVEL TERRITORY POLYGONS */}
            {timeTravelEnabled &&
              currentEpoch.activeEmpires.map((empKey) => {
                const territory = EMPIRE_TERRITORIES[empKey];
                if (!territory) return null;
                return (
                  <Polygon
                    key={`territory-${empKey}-${currentEpoch.year}`}
                    positions={territory.coords}
                    pathOptions={{
                      color: territory.color,
                      fillColor: territory.color,
                      fillOpacity: 0.25,
                      weight: 2,
                      dashArray: '4, 4',
                    }}
                  >
                    <Popup className="holokai-popup">
                      <div className="text-xs text-white p-1 max-w-xs space-y-1">
                        <strong className="font-display font-bold text-amber-300 block">{territory.name}</strong>
                        <p className="text-[11px] font-body text-zinc-300">{territory.summary}</p>
                        <span className="text-[9px] font-mono text-amber-400/90 block">
                          Active during {currentEpoch.label}
                        </span>
                      </div>
                    </Popup>
                  </Polygon>
                );
              })}

            {/* LOCATION MARKERS */}
            {locations.map((loc) => {
              const isGuardianRelevant = activeGuardian.focus.some((f) =>
                (loc.civilization || '').toLowerCase().includes(f.toLowerCase())
              );
              return (
                <CircleMarker
                  key={loc.id}
                  center={[loc.lat, loc.lng]}
                  radius={isGuardianRelevant ? 8 : 5}
                  pathOptions={{
                    color: activeGuardian.accentColor,
                    fillColor: activeGuardian.accentColor,
                    fillOpacity: isGuardianRelevant ? 0.7 : 0.3,
                    weight: 1,
                  }}
                  eventHandlers={{ click: () => setSelected(loc) }}
                >
                  <Popup className="holokai-popup">
                    <div style={{ color: 'white' }}>
                      <strong>{loc.name}</strong>
                      <br />
                      <small>{loc.era}</small>
                      <br />
                      <small>{loc.description}</small>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {selected && (
          <div className="absolute top-4 left-4 z-[1000] glass-panel rounded-xl p-4 w-72 pointer-events-auto">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-display font-semibold text-white">{selected.name}</h3>
              <button onClick={() => setSelected(null)}>
                <X className="w-4 h-4 text-white/40 hover:text-white/80" />
              </button>
            </div>
            <p className="text-xs text-white/50 mb-3">{selected.description}</p>
            <div className="flex justify-between text-[10px] font-mono mb-3">
              <span className="text-white/30">ERA</span>
              <span style={{ color: activeGuardian.accentColor }}>{selected.era}</span>
            </div>
            <button
              className="w-full py-2 rounded-lg text-[10px] tracking-wider uppercase font-mono transition-all"
              style={{
                background: `${activeGuardian.accentColor}15`,
                border: `1px solid ${activeGuardian.accentColor}44`,
                color: activeGuardian.accentColor,
              }}
            >
              Open in Research Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

