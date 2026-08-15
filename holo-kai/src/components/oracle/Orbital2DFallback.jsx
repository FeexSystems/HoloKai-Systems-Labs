import React, { useState } from 'react';
import { Sparkles, Orbit, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

/**
 * Orbital2DFallback
 * High-density interactive 2D SVG canvas fallback for mobile/low-power GPU mode.
 */
export default function Orbital2DFallback({ nodes = [], onSelectNode }) {
  const [selectedId, setSelectedId] = useState(null);
  const [zoom, setZoom] = useState(1);

  const defaultNodes = nodes.length > 0 ? nodes : [
    { id: 1, title: "Kushite Metallurgy", era: "750 BCE", x: 300, y: 180, category: "Engineering" },
    { id: 2, title: "Timbuktu Astronomy", era: "1324 CE", x: 480, y: 320, category: "Science" },
    { id: 3, title: "Great Zimbabwe Masonry", era: "1100 CE", x: 220, y: 380, category: "Architecture" },
    { id: 4, title: "Akan Ethnomathematics", era: "1700 CE", x: 620, y: 220, category: "Mathematics" },
    { id: 5, title: "Luba Memory Boards (Lukasa)", era: "1900 CE", x: 420, y: 460, category: "Epistemology" },
  ];

  const handleNodeClick = (node) => {
    setSelectedId(node.id);
    if (onSelectNode) onSelectNode(node);
  };

  return (
    <div className="relative w-full h-[500px] bg-slate-950/90 rounded-2xl border border-amber-500/20 shadow-2xl overflow-hidden backdrop-blur-md flex flex-col">
      {/* Top Overlay Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-amber-500/30 text-amber-300 text-xs font-mono backdrop-blur-md pointer-events-auto">
          <Orbit className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>Orbital Stage (2D High-Density SVG Mode)</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800 pointer-events-auto">
          <button 
            onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setZoom(1); setSelectedId(null); }}
            className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-amber-300 rounded"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
        <svg 
          viewBox="0 0 800 600" 
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            <radialGradient id="orbitalGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0b0f19" stopOpacity="0" />
            </radialGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Orbital Rings */}
          <circle cx="400" cy="300" r="260" fill="none" stroke="#f59e0b20" strokeWidth="1.5" strokeDasharray="8 6" />
          <circle cx="400" cy="300" r="180" fill="none" stroke="#38bdf830" strokeWidth="1" />
          <circle cx="400" cy="300" r="100" fill="none" stroke="#f59e0b40" strokeWidth="1.5" />
          <circle cx="400" cy="300" r="320" fill="url(#orbitalGlow)" />

          {/* Central Sun/Oracle Core Node */}
          <g transform="translate(400, 300)">
            <circle r="36" fill="#1e1302" stroke="#f59e0b" strokeWidth="2" filter="url(#glowEffect)" />
            <circle r="24" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 2" />
            <text textAnchor="middle" dy="4" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">HOLOKAI</text>
          </g>

          {/* Connections to central core */}
          {defaultNodes.map(node => (
            <line
              key={`line-${node.id}`}
              x1="400"
              y1="300"
              x2={node.x}
              y2={node.y}
              stroke={selectedId === node.id ? "#f59e0b" : "#334155"}
              strokeWidth={selectedId === node.id ? "2" : "1"}
              strokeDasharray={selectedId === node.id ? "none" : "4 4"}
              className="transition-all duration-300"
            />
          ))}

          {/* Nodes */}
          {defaultNodes.map(node => {
            const isSelected = selectedId === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Node Outer Ring */}
                <circle
                  r={isSelected ? 26 : 20}
                  fill={isSelected ? "#1e1b4b" : "#0f172a"}
                  stroke={isSelected ? "#fbbf24" : "#38bdf8"}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  className="transition-all duration-300 group-hover:scale-110"
                />

                {/* Node Icon/Dot */}
                <circle
                  r={isSelected ? 8 : 5}
                  fill={isSelected ? "#f59e0b" : "#38bdf8"}
                />

                {/* Node Label */}
                <text
                  x="0"
                  y={isSelected ? 42 : 36}
                  textAnchor="middle"
                  fill={isSelected ? "#fbbf24" : "#cbd5e1"}
                  fontSize={isSelected ? "12" : "10"}
                  fontWeight={isSelected ? "bold" : "normal"}
                  fontFamily="sans-serif"
                  className="pointer-events-none drop-shadow"
                >
                  {node.title}
                </text>

                {/* Era Tag */}
                <text
                  x="0"
                  y={isSelected ? 56 : 48}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                  className="pointer-events-none"
                >
                  {node.era}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Bar */}
      {selectedId && (
        <div className="p-3 bg-slate-900/95 border-t border-amber-500/30 flex items-center justify-between text-xs animate-fade-in">
          {(() => {
            const n = defaultNodes.find(item => item.id === selectedId);
            return (
              <>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-amber-200">{n.title}</span>
                  <span className="text-slate-400 font-mono">({n.era})</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 text-[10px] border border-slate-700">{n.category}</span>
                </div>
                <button 
                  onClick={() => setSelectedId(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Close
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
