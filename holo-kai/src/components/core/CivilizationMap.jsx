import React, { useState, useEffect, useCallback, memo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Landmark, Clock, MapPin, Eye } from 'lucide-react';
import LazyImage from '../common/LazyImage';
import { useHoloKai } from '@/lib/HoloKaiContext';
import { getTranslatedSummary } from '@/lib/translations';

/** Helper to auto-fit map bounds when filtered civilizations change */
function MapBoundsController({ civilizations }) {
  const map = useMap();

  useEffect(() => {
    if (!civilizations || civilizations.length === 0) return;
    const validCoords = civilizations
      .filter((c) => c.lat != null && c.lng != null)
      .map((c) => [c.lat, c.lng]);

    if (validCoords.length === 1) {
      map.setView(validCoords[0], 6, { animate: true });
    } else if (validCoords.length > 1) {
      map.fitBounds(validCoords, { padding: [40, 40], maxZoom: 6, animate: true });
    }
  }, [civilizations, map]);

  return null;
}

/**
 * Controller component that tracks map viewport bounds and only notifies parent
 * of visible markers within padded viewport for lazy marker rendering.
 */
function ViewportMarkerController({ civilizations, onBoundsChange }) {
  const map = useMapEvents({
    moveend: () => updateVisibleBounds(),
    zoomend: () => updateVisibleBounds(),
  });

  const updateVisibleBounds = useCallback(() => {
    if (!map) return;
    try {
      // Add a 25% padding buffer around viewport to preload upcoming markers
      const bounds = map.getBounds().pad(0.25);
      onBoundsChange(bounds);
    } catch {
      // Fallback
    }
  }, [map, onBoundsChange]);

  useEffect(() => {
    updateVisibleBounds();
  }, [updateVisibleBounds]);

  return null;
}

/** Memoized individual marker to minimize DOM re-renders */
const LazyMarker = memo(function LazyMarker({ civ, accentColor, onSelectCiv }) {
  const { language } = useHoloKai();
  if (civ.lat == null || civ.lng == null) return null;
  const markerColor = civ.badgeColor || accentColor;

  return (
    <CircleMarker
      center={[civ.lat, civ.lng]}
      radius={9}
      pathOptions={{
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.75,
        weight: 2,
      }}
    >
      <Popup className="oracle-leaflet-popup">
        <div className="p-3 bg-zinc-950 text-zinc-100 rounded-xl border border-amber-500/40 shadow-2xl max-w-xs font-sans">
          {civ.imageUrl && (
            <div className="h-24 w-full rounded-lg overflow-hidden mb-2 border border-white/10 relative">
              <LazyImage
                src={civ.imageUrl}
                alt={civ.name}
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-1">
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider"
              style={{
                background: `${markerColor}22`,
                color: markerColor,
                border: `1px solid ${markerColor}44`,
              }}
            >
              {civ.subRegion || civ.region}
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {civ.eraPeriod}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white font-display mb-0.5 flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5" style={{ color: markerColor }} />
            {civ.name}
          </h4>

          {civ.nativeName && (
            <p className="text-[10px] font-mono text-amber-400/90 mb-1">
              {civ.nativeName}
            </p>
          )}

          <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400 mb-2">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{civ.era}</span>
          </div>

          <p className="text-[11px] text-zinc-300 line-clamp-2 leading-relaxed mb-3">
            {getTranslatedSummary(civ.id, language, civ.summary)}
          </p>

          <button
            onClick={() => onSelectCiv(civ)}
            className="w-full py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md hover:brightness-125"
            style={{
              background: `linear-gradient(135deg, ${markerColor}33 0%, ${markerColor}15 100%)`,
              border: `1px solid ${markerColor}66`,
              color: '#ffffff',
            }}
          >
            <Eye className="w-3.5 h-3.5" style={{ color: markerColor }} />
            Inspect Record
          </button>
        </div>
      </Popup>
    </CircleMarker>
  );
});

export default function CivilizationMap({ civilizations, onSelectCiv, accentColor = '#D97706' }) {
  const defaultCenter = [5.0, 20.0]; // Centered on Africa
  const [visibleBounds, setVisibleBounds] = useState(null);

  const handleBoundsChange = useCallback((bounds) => {
    setVisibleBounds(bounds);
  }, []);

  // Filter markers lazily based on visible map viewport bounds
  const visibleCivilizations = civilizations.filter((civ) => {
    if (civ.lat == null || civ.lng == null) return false;
    if (!visibleBounds) return true; // Initial fallback before bounds ready
    return visibleBounds.contains([civ.lat, civ.lng]);
  });

  return (
    <div className="w-full h-full min-h-[500px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
      <MapContainer
        center={defaultCenter}
        zoom={3}
        minZoom={2}
        maxZoom={10}
        style={{ width: '100%', height: '100%', background: '#09090b' }}
        className="z-0 dark-oracle-map"
      >
        {/* CartoDB Dark Matter Styled Map Tiles matching Oracle aesthetic */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          maxZoom={19}
        />

        <MapBoundsController civilizations={civilizations} />
        <ViewportMarkerController
          civilizations={civilizations}
          onBoundsChange={handleBoundsChange}
        />

        {visibleCivilizations.map((civ) => (
          <LazyMarker
            key={civ.id}
            civ={civ}
            accentColor={accentColor}
            onSelectCiv={onSelectCiv}
          />
        ))}
      </MapContainer>

      {/* Map Overlay Badge */}
      <div className="absolute top-4 right-4 z-[400] bg-zinc-950/90 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono backdrop-blur-md text-zinc-300 flex items-center gap-2 shadow-xl pointer-events-auto">
        <MapPin className="w-4 h-4 text-amber-400" />
        <span>
          Showing <strong>{visibleCivilizations.length}</strong> of {civilizations.length} Sites (Viewport Filtered)
        </span>
      </div>
    </div>
  );
}
