import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RotateCw,
  Info,
  Cpu,
  Layers,
  X
} from 'lucide-react';

/** Core Civilization Memory Data Points */
export const CIVILIZATION_MEMORY_NODES = [
  {
    id: 'kemet-geom',
    name: 'Kemet Geometric papyri',
    era: '1850 BCE',
    region: 'Nile Valley (Egypt)',
    category: 'Mathematics',
    color: '#E8B84B', // Gold
    orbitRadius: 180,
    orbitSpeed: 0.008,
    orbitTilt: 0.35,
    initialAngle: 0,
    description: 'Rhind and Moscow mathematical papyri detailing golden ratio, volume of frustums, and solar alignment geometry.',
    artifacts: ['Rhind Mathematical Papyrus', 'Karnak Temple Alignment'],
    confidence: '99.4%'
  },
  {
    id: 'aksum-epigraphy',
    name: "Aksumite Ge'ez Royal Stelae",
    era: '350 CE',
    region: 'Horn of Africa (Ethiopia)',
    category: 'Epigraphy',
    color: '#F59E0B', // Amber
    orbitRadius: 220,
    orbitSpeed: -0.006,
    orbitTilt: -0.45,
    initialAngle: 1.2,
    description: 'Trilingual Inscriptions of King Ezana recording diplomatic trade, theology, and monumental stone masonry.',
    artifacts: ['Ezana Stone', 'Obelisk of Aksum'],
    confidence: '98.8%'
  },
  {
    id: 'timbuktu-vaults',
    name: 'Sankore Astronomical Manuscripts',
    era: '1324 - 1591 CE',
    region: 'Mali Empire (Timbuktu)',
    category: 'Manuscripts',
    color: '#D97706', // Deep Gold
    orbitRadius: 260,
    orbitSpeed: 0.005,
    orbitTilt: 0.25,
    initialAngle: 2.4,
    description: 'Hundreds of thousands of parchment codices covering celestial mechanics, optics, jurisprudence, and trade algebra.',
    artifacts: ['Ahmed Baba Collection', 'Mansa Musa Gold Ledger'],
    confidence: '99.1%'
  },
  {
    id: 'zimbabwe-masonry',
    name: 'Great Zimbabwe Conical Masonry',
    era: '1100 - 1450 CE',
    region: 'Monomotapa (Zimbabwe Plateau)',
    category: 'Architecture',
    color: '#3B82F6', // Lapis Blue
    orbitRadius: 300,
    orbitSpeed: -0.004,
    orbitTilt: -0.3,
    initialAngle: 3.6,
    description: 'Dry-stone mortarless granite walls engineered with internal acoustic chambers and astronomical alignments.',
    artifacts: ['Great Enclosure', 'Soapstone Zimbabwe Birds'],
    confidence: '97.9%'
  },
  {
    id: 'nsibidi-code',
    name: 'Nsibidi Ideographic Matrix',
    era: '400 CE - Present',
    region: 'Cross River (Nigeria/Cameroon)',
    category: 'Mathematics',
    color: '#EC4899', // Crimson Pink
    orbitRadius: 210,
    orbitSpeed: 0.009,
    orbitTilt: 0.55,
    initialAngle: 4.8,
    description: 'Ancient indigenous script system mapping court decisions, spatial geography, and spiritual cosmology.',
    artifacts: ['Ekpe Society Manuscripts', 'Cross River Monoliths'],
    confidence: '96.5%'
  },
  {
    id: 'ifa-binary',
    name: 'Ifá Binary Divination Engine',
    era: '1000 BCE - Present',
    region: 'Yorubaland (West Africa)',
    category: 'Mathematics',
    color: '#10B981', // Emerald
    orbitRadius: 250,
    orbitSpeed: -0.007,
    orbitTilt: -0.2,
    initialAngle: 0.8,
    description: '256 Odu mathematical permutations used for probabilistic decision logic and ancestral memory storage.',
    artifacts: ['Opon Ifá Tray', 'Ikin Yoruba Palm Nuts'],
    confidence: '99.7%'
  },
  {
    id: 'swahili-dhow',
    name: 'Swahili Monsoon Cartography',
    era: '800 - 1500 CE',
    region: 'Swahili Coast (Kilwa / Zanzibar)',
    category: 'Navigation',
    color: '#06B6D4', // Cyan
    orbitRadius: 290,
    orbitSpeed: 0.006,
    orbitTilt: 0.4,
    initialAngle: 2.0,
    description: 'Indian Ocean maritime navigational charts and coral-rag palace architecture connected to China and Arabia.',
    artifacts: ['Husuni Kubwa Palace', 'Kilwa Gold Coinage'],
    confidence: '98.2%'
  },
  {
    id: 'igboukwu-metallurgy',
    name: 'Igbo-Ukwu Bronze Metallurgy',
    era: '850 CE',
    region: 'Lower Niger (Nigeria)',
    category: 'Metallurgy',
    color: '#8B5CF6', // Amethyst Violet
    orbitRadius: 330,
    orbitSpeed: -0.003,
    orbitTilt: -0.5,
    initialAngle: 5.2,
    description: 'Lost-wax bronze casting technique displaying microscopic filigree detail unmatched in contemporary Europe.',
    artifacts: ['Roped Bronze Vessel', 'Eze Nri Ceremonial Bowl'],
    confidence: '99.0%'
  }
];

export default function CivilizationMemory3DOrbital({
  interactive = true,
  height = '500px',
  showDetailsModal = true
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(() => {
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');
  const [renderMode, setRenderMode] = useState('rings'); // 'rings' | 'constellation'
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 500 });

  // Store angles & 3D projections in ref to avoid re-renders during 60fps animation
  const anglesRef = useRef(CIVILIZATION_MEMORY_NODES.map(n => n.initialAngle));
  const projectionRef = useRef([]);

  // Filter categories
  const categories = useMemo(() => {
    return ['All', 'Mathematics', 'Epigraphy', 'Manuscripts', 'Architecture', 'Navigation', 'Metallurgy'];
  }, []);

  const filteredNodes = useMemo(() => {
    if (activeCategory === 'All') return CIVILIZATION_MEMORY_NODES;
    return CIVILIZATION_MEMORY_NODES.filter(n => n.category === activeCategory);
  }, [activeCategory]);

  // Canvas Resize Observer
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setCanvasDimensions({ width: rect.width, height: rect.height });
      if (canvasRef.current) {
        canvasRef.current.width = rect.width * (window.devicePixelRatio || 1);
        canvasRef.current.height = rect.height * (window.devicePixelRatio || 1);
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Mouse Parallax listener
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  // Main 3D Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const perspective = 600;

      // Parallax rotation adjustments
      const rotationX = mousePos.y * 0.2;
      const rotationY = mousePos.x * 0.3;

      // 1. Draw Central Core — "Alkebulan Memory Nucleus"
      const corePulse = Math.sin(Date.now() * 0.003) * 3;
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 40 + corePulse
      );
      coreGradient.addColorStop(0, '#E8B84B');
      coreGradient.addColorStop(0.4, 'rgba(232, 184, 75, 0.4)');
      coreGradient.addColorStop(1, 'rgba(232, 184, 75, 0)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 45 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#E8B84B';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Core label
      ctx.fillStyle = 'rgba(232, 184, 75, 0.7)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('ALK BULAN NUCLEUS', centerX, centerY + 22);

      // 2. Project Nodes into 3D Space
      const projectedList = [];

      CIVILIZATION_MEMORY_NODES.forEach((node, idx) => {
        const isFilteredOut = activeCategory !== 'All' && node.category !== activeCategory;

        // Update angle if playing
        if (isPlaying) {
          anglesRef.current[idx] += node.orbitSpeed * speedMultiplier;
        }

        const angle = anglesRef.current[idx];

        // Scale radius down on smaller screens
        const radiusScale = width < 600 ? 0.65 : width < 900 ? 0.85 : 1.0;
        const radius = node.orbitRadius * radiusScale;

        // 3D Orbital Parametric Equations
        let rawX = Math.cos(angle) * radius;
        let rawY = Math.sin(angle) * radius * Math.sin(node.orbitTilt);
        let rawZ = Math.sin(angle) * radius * Math.cos(node.orbitTilt);

        // Apply mouse tilt
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);
        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);

        // Rotate Y
        let x1 = rawX * cosY - rawZ * sinY;
        let z1 = rawX * sinY + rawZ * cosY;

        // Rotate X
        let y2 = rawY * cosX - z1 * sinX;
        let z2 = rawY * sinX + z1 * cosX;

        // Perspective Projection
        const scale = perspective / (perspective + z2 + 200);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        projectedList.push({
          node,
          index: idx,
          x: projX,
          y: projY,
          z: z2,
          scale,
          radius,
          isFilteredOut
        });
      });

      // Sort by Z (depth sorting) so distant nodes are drawn behind closer ones
      projectedList.sort((a, b) => a.z - b.z);
      projectionRef.current = projectedList;

      // 3. Draw Orbit Rings
      projectedList.forEach(({ node, radius, scale, isFilteredOut }) => {
        if (renderMode === 'rings' && !isFilteredOut) {
          ctx.beginPath();
          ctx.ellipse(
            centerX,
            centerY,
            radius * scale,
            (radius * Math.abs(Math.sin(node.orbitTilt))) * scale,
            node.orbitTilt * 0.2,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = `${node.color}22`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // 4. Draw Constellation Connections (if in constellation mode or hovered)
      if (renderMode === 'constellation') {
        ctx.beginPath();
        for (let i = 0; i < projectedList.length; i++) {
          for (let j = i + 1; j < projectedList.length; j++) {
            const p1 = projectedList[i];
            const p2 = projectedList[j];
            if (!p1.isFilteredOut && !p2.isFilteredOut) {
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < 180) {
                const alpha = (1 - dist / 180) * 0.25;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(232, 184, 75, ${alpha})`;
                ctx.lineWidth = 0.8;
              }
            }
          }
        }
        ctx.stroke();
      }

      // 5. Draw Memory Nodes
      projectedList.forEach(({ node, x, y, scale, isFilteredOut }) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        const baseSize = isHovered || isSelected ? 10 : 6;
        const nodeSize = Math.max(3, baseSize * scale);
        const opacity = isFilteredOut ? 0.15 : Math.min(1, Math.max(0.3, (scale - 0.4) * 1.8));

        ctx.globalAlpha = opacity;

        // Outer Glow Aura
        const glow = ctx.createRadialGradient(x, y, 0, x, y, nodeSize * 3);
        glow.addColorStop(0, `${node.color}88`);
        glow.addColorStop(1, `${node.color}00`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, nodeSize * 3, 0, Math.PI * 2);
        ctx.fill();

        // Line connecting to central nucleus
        if (isHovered || isSelected) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `${node.color}88`;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Core Circle
        ctx.fillStyle = isHovered ? '#FFFFFF' : node.color;
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fill();

        // Node Label in 3D Space
        ctx.fillStyle = isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)';
        ctx.font = `${Math.max(9, Math.round(11 * scale))}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, x, y + nodeSize + 14);

        // Category Tag
        if (scale > 0.8 && !isFilteredOut) {
          ctx.fillStyle = `${node.color}CC`;
          ctx.font = '8px monospace';
          ctx.fillText(node.era, x, y + nodeSize + 25);
        }

        ctx.globalAlpha = 1.0;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos, isPlaying, speedMultiplier, activeCategory, renderMode, hoveredNode, selectedNode]);

  // Canvas Mouse Click / Hover detection
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || !projectionRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let found = null;
    for (const proj of projectionRef.current) {
      if (proj.isFilteredOut) continue;
      const dx = clickX - proj.x;
      const dy = clickY - proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 24) {
        found = proj.node;
        break;
      }
    }

    if (found) {
      setSelectedNode(found);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current || !projectionRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let found = null;
    for (const proj of projectionRef.current) {
      if (proj.isFilteredOut) continue;
      const dx = mouseX - proj.x;
      const dy = mouseY - proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 20) {
        found = proj.node;
        break;
      }
    }

    setHoveredNode(found);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={(e) => {
        handleMouseMove(e);
        handleCanvasMouseMove(e);
      }}
      className="relative w-full rounded-2xl border border-amber-500/20 bg-slate-950/80 backdrop-blur-md overflow-hidden shadow-2xl select-none"
      style={{ height }}
    >
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(232,184,75,0.08),transparent_70%)] pointer-events-none" />

      {/* Header Bar Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wider text-amber-100 uppercase font-mono">
            Civilization Memory 3D Matrix
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            8 GUARDIAN NODES
          </span>
        </div>

        {/* Categories */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                activeCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Orbital Speed & View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 p-2 rounded-xl text-xs flex items-center gap-1.5 transition"
            title={isPlaying ? 'Pause Orbit' : 'Play Orbit'}
          >
            <RotateCw className={`w-3.5 h-3.5 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
            <span className="font-mono text-[11px]">{isPlaying ? '1x' : 'Paused'}</span>
          </button>

          <button
            onClick={() => setRenderMode(renderMode === 'rings' ? 'constellation' : 'rings')}
            className={`border px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
              renderMode === 'constellation'
                ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="capitalize">{renderMode}</span>
          </button>
        </div>
      </div>

      {/* Main 3D WebGL / Canvas Stage */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-pointer relative z-10"
      />

      {/* Floating Hover Card */}
      <AnimatePresence>
        {hoveredNode && !selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute bottom-6 left-6 z-30 max-w-sm bg-slate-900/95 border border-amber-500/40 rounded-xl p-4 shadow-2xl backdrop-blur-md pointer-events-none"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
                {hoveredNode.category} • {hoveredNode.era}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Grounded: {hoveredNode.confidence}
              </span>
            </div>
            <h4 className="font-semibold text-amber-100 text-sm mb-1">{hoveredNode.name}</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">{hoveredNode.description}</p>
            <div className="flex flex-wrap gap-1">
              {hoveredNode.artifacts.map((art, i) => (
                <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {art}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Detail Dialog on Click */}
      <AnimatePresence>
        {selectedNode && showDetailsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative text-slate-100 space-y-4"
            >
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg"
                  style={{ backgroundColor: selectedNode.color }}
                >
                  <Cpu className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-amber-400">{selectedNode.category}</span>
                    <span className="text-xs text-slate-400">• {selectedNode.region}</span>
                  </div>
                  <h3 className="text-lg font-bold text-amber-100">{selectedNode.name}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed border-y border-slate-800 py-3">
                {selectedNode.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Historical Era:</span>
                  <span className="font-mono text-amber-300 font-semibold">{selectedNode.era}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Evidence Score:</span>
                  <span className="font-mono text-emerald-400 font-semibold">{selectedNode.confidence} Grounded</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1.5">Key Primary Artifacts & Records:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.artifacts.map((art, idx) => (
                    <span key={idx} className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-medium">
                      📜 {art}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-xl text-xs transition"
                >
                  Return to Orbital View
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Helper text */}
      <div className="absolute bottom-3 right-4 z-20 text-[10px] font-mono text-slate-500 flex items-center gap-2 pointer-events-none">
        <Info className="w-3 h-3 text-amber-500/60" />
        <span>Click node to expand details • Drag/Hover to rotate perspective</span>
      </div>
    </div>
  );
}
