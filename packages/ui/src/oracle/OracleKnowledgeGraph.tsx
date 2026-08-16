'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  Layers, Volume2, ZoomIn, ZoomOut,
  RotateCcw, GitBranch
} from 'lucide-react';
import { oracleVoiceEngine } from '../lib/oracleVoiceEngine';
import { retroAudio } from '../lib/audioFeedback';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  category: string;
  era: string;
  color: string;
  desc: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
}

const GRAPH_NODES: GraphNode[] = [
  { id: 'kemet', label: 'Kemet (Nile Valley)', category: 'Civilization', era: '3000 BCE', color: '#39826F', desc: 'Archaic Nilotic solar calendars, papyrus medicine, and pyramid geometry.' },
  { id: 'aksum', label: 'Aksumite Empire', category: 'Civilization', era: '300 BCE', color: '#A9D5B0', desc: 'Trilingual granite stelae, Red Sea maritime coinage, and Ge\'ez epigraphy.' },
  { id: 'mali', label: 'Mali & Timbuktu', category: 'Civilization', era: '1200 CE', color: '#D97706', desc: 'Shankore university scholastic scrolls, astronomy, and Sahelian trade hubs.' },
  { id: 'ifa', label: 'Ifá Oyo Corpus', category: 'Divination Matrix', era: '1000 CE', color: '#EC4899', desc: '256-state binary odu matrix for cosmological modeling and oral transmission.' },
  { id: 'zimbabwe', label: 'Great Zimbabwe', category: 'Architecture', era: '1100 CE', color: '#10B981', desc: 'Mortarless curved granite walls engineered for acoustic resonance and thermal isolation.' },
  { id: 'nok', label: 'Nok Terracotta', category: 'Metallurgy', era: '500 BCE', color: '#6366F1', desc: 'Sub-Saharan iron smelting furnaces and anthropomorphic ceramic art.' },
  { id: 'swahili', label: 'Swahili Coast', category: 'Maritime Trade', era: '800 CE', color: '#06B6D4', desc: 'Coral stone architecture, monsoon navigation, and Indian Ocean commerce.' },
  { id: 'nsibidi', label: 'Nsibidi Script', category: 'Epigraphy', era: '400 CE', color: '#A855F7', desc: 'Ideographic and pictographic secret script of the Cross River & Ekpe societies.' },
  { id: 'timbuktu_scrolls', label: 'Shankore Scrolls', category: 'Artifact', era: '1400 CE', color: '#FCD34D', desc: 'Manuscripts on celestial motion, optics, and Sahelian jurisprudence.' },
  { id: 'ezana_stone', label: 'Ezana Inscriptions', category: 'Artifact', era: '330 CE', color: '#FBBF24', desc: 'Trilingual monument establishing Aksumite state religious shift and trade alliances.' },
  { id: 'opon_ifa', label: 'Opon Ifá Tray', category: 'Artifact', era: '1200 CE', color: '#F472B6', desc: 'Sacred carved wooden trays used for binary palm nut arithmetic.' },
];

const GRAPH_LINKS: GraphLink[] = [
  { source: 'kemet', target: 'aksum', label: 'Nile-Red Sea Route' },
  { source: 'kemet', target: 'mali', label: 'Trans-Saharan Solar Science' },
  { source: 'aksum', target: 'swahili', label: 'Indian Ocean Maritime Network' },
  { source: 'aksum', target: 'ezana_stone', label: 'Epigraphic Record' },
  { source: 'mali', target: 'timbuktu_scrolls', label: 'Scholastic Preservation' },
  { source: 'mali', target: 'ifa', label: 'Sahel-Yoruba Knowledge Exchange' },
  { source: 'ifa', target: 'opon_ifa', label: 'Binary Arithmetic Tool' },
  { source: 'ifa', target: 'nsibidi', label: 'Ideographic Symbol Lineage' },
  { source: 'nok', target: 'zimbabwe', label: 'Metallurgical & Masonry Lineage' },
  { source: 'zimbabwe', target: 'swahili', label: 'Gold & Ivory Trade Corridor' },
  { source: 'nok', target: 'ifa', label: 'West African Cultural Core' },
];

interface OracleKnowledgeGraphProps {
  onSelectNode?: (node: GraphNode) => void;
}

export function OracleKnowledgeGraph({ onSelectNode }: OracleKnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [dimensions, setDimensions] = useState({ width: 700, height: 460 });

  // Handle responsive resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth } = containerRef.current;
        setDimensions({
          width: clientWidth || 700,
          height: 460,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(GRAPH_NODES.map((n) => n.category));
    return ['ALL', ...Array.from(cats)];
  }, []);

  // Filter nodes based on selected category
  const filteredData = useMemo(() => {
    if (activeCategoryFilter === 'ALL') {
      return { nodes: GRAPH_NODES, links: GRAPH_LINKS };
    }
    const filteredNodes = GRAPH_NODES.filter((n) => n.category === activeCategoryFilter);
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const filteredLinks = GRAPH_LINKS.filter(
      (l) => nodeIds.has(typeof l.source === 'object' ? (l.source as GraphNode).id : (l.source as string)) &&
             nodeIds.has(typeof l.target === 'object' ? (l.target as GraphNode).id : (l.target as string))
    );
    return { nodes: filteredNodes, links: filteredLinks };
  }, [activeCategoryFilter]);

  // Render d3 Force Simulation
  useEffect(() => {
    if (!svgRef.current) return;

    const { width, height } = dimensions;

    // Clear previous SVG contents
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    svg.selectAll('*').remove();

    // Setup zoom behavior
    const g = svg.append('g').attr('class', 'graph-container');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoomBehavior);

    // Deep clone data to avoid d3 mutation side-effects
    const nodesData = filteredData.nodes.map((d) => ({ ...d }));
    const linksData = filteredData.links.map((d) => ({ ...d }));

    // Create D3 Force Simulation
    const simulation = d3.forceSimulation<GraphNode, GraphLink>(nodesData)
      .force('link', d3.forceLink<GraphNode, GraphLink>(linksData).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Render Links
    const link = g.append('g')
      .attr('stroke', '#39826F')
      .attr('stroke-opacity', 0.3)
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(linksData)
      .join('line')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 2');

    // Link Labels
    const linkText = g.append('g')
      .selectAll<SVGTextElement, GraphLink>('text')
      .data(linksData)
      .join('text')
      .text((d) => d.label)
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .attr('fill', '#A1A1AA')
      .attr('text-anchor', 'middle');

    // Drag helper
    const drag = (sim: any) => {
      function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
        if (!event.active) sim.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }
      function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
        d.fx = event.x;
        d.fy = event.y;
      }
      function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
        if (!event.active) sim.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }
      return d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    // Render Node Groups
    const node = g.append('g')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodesData)
      .join('g')
      .attr('class', 'node-group')
      .style('cursor', 'pointer')
      .call(drag(simulation) as any);

    // Outer Glow Circle
    node.append('circle')
      .attr('r', 16)
      .attr('fill', (d) => d.color)
      .attr('fill-opacity', 0.2)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.5)
      .attr('class', 'transition-all duration-200');

    // Core Node Circle
    node.append('circle')
      .attr('r', 8)
      .attr('fill', (d) => d.color)
      .attr('stroke', '#18181B')
      .attr('stroke-width', 2);

    // Node Text Label
    node.append('text')
      .text((d) => d.label)
      .attr('x', 20)
      .attr('y', 4)
      .attr('font-size', '11px')
      .attr('font-family', 'var(--font-mono, monospace)')
      .attr('font-weight', '600')
      .attr('fill', '#F4F4F5')
      .style('pointer-events', 'none');

    // Hover & Click Interactions
    node
      .on('mouseenter', (event: any, d: GraphNode) => {
        retroAudio.playGlassHoverHum();
        setHoveredNode(d);

        // Highlight connected links
        link
          .attr('stroke-opacity', (l: any) => (l.source.id === d.id || l.target.id === d.id ? 0.9 : 0.1))
          .attr('stroke-width', (l: any) => (l.source.id === d.id || l.target.id === d.id ? 2.5 : 1))
          .attr('stroke', (l: any) => (l.source.id === d.id || l.target.id === d.id ? '#A9D5B0' : '#52525B'));
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        link
          .attr('stroke-opacity', 0.3)
          .attr('stroke-width', 1.5)
          .attr('stroke', '#39826F');
      })
      .on('click', (event: any, d: GraphNode) => {
        retroAudio.playOracleChime();
        setSelectedNode(d);
        if (onSelectNode) onSelectNode(d);
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      linkText
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2 - 4);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredData, dimensions, onSelectNode]);

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!svgRef.current) return;
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>();
    if (direction === 'in') {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3);
    } else if (direction === 'out') {
      svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
    } else {
      svg.transition().duration(400).call(zoomBehavior.transform, d3.zoomIdentity);
    }
  };

  const handleSpeakNode = (node: GraphNode) => {
    if (!node) return;
    oracleVoiceEngine.speakResponse(
      `${node.label}, ${node.era}. ${node.desc}`
    );
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-[var(--color-border)] space-y-4 relative" ref={containerRef}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--color-brand)] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-brand)] font-semibold">
              INTERACTIVE D3 FORCE GRAPH
            </span>
          </div>
          <h2 className="text-lg font-display font-bold text-white mt-0.5">
            PAN-AFRICAN CIVILIZATION KNOWLEDGE GRAPH
          </h2>
        </div>

        {/* Zoom & Control Bar */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleZoom('in')}
            className="p-1.5 rounded-lg bg-zinc-900 border border-[var(--color-border)] text-[var(--color-brand)] hover:bg-[var(--color-surface-hover)] text-xs transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1.5 rounded-lg bg-zinc-900 border border-[var(--color-border)] text-[var(--color-brand)] hover:bg-[var(--color-surface-hover)] text-xs transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom('reset')}
            className="p-1.5 rounded-lg bg-zinc-900 border border-[var(--color-border)] text-[var(--color-brand)] hover:bg-[var(--color-surface-hover)] text-xs transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[var(--color-brand)]" /> Category:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              retroAudio.playGlassHoverHum();
              setActiveCategoryFilter(cat);
            }}
            className={`text-[11px] font-mono px-2.5 py-1 rounded-lg shrink-0 border transition-all ${
              activeCategoryFilter === cat
                ? 'bg-[var(--color-surface-hover)] border-[var(--color-border)] text-[var(--color-brand)] font-bold shadow-[0_0_10px_rgba(232,184,75,0.2)]'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-[var(--color-border)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* D3 Graph SVG Container */}
      <div className="relative w-full h-[460px] bg-zinc-950/80 rounded-xl border border-[var(--color-border)] overflow-hidden shadow-inner">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f23_1px,transparent_1px),linear-gradient(to_bottom,#1f1f23_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />

        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full relative z-10"
        />

        {/* Hovered Node Quick Tooltip */}
        {hoveredNode && !selectedNode && (
          <div className="absolute top-4 left-4 pointer-events-none glass-panel p-3 rounded-xl border border-[var(--color-border)] text-xs text-white z-20 max-w-xs shadow-[0_0_15px_rgba(232,184,75,0.2)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }} />
              <span className="font-mono font-bold text-[var(--color-brand)]">{hoveredNode.label}</span>
              <span className="text-[10px] font-mono text-zinc-400">({hoveredNode.era})</span>
            </div>
            <p className="text-zinc-300 text-[11px] font-body">{hoveredNode.desc}</p>
          </div>
        )}

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-xl border border-[var(--color-border)] z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                <h4 className="text-sm font-display font-bold text-white">{selectedNode.label}</h4>
                <span className="text-xs font-mono text-[var(--color-brand)] bg-[var(--color-surface-hover)] px-2 py-0.5 rounded border border-[var(--color-border)]">
                  {selectedNode.category} • {selectedNode.era}
                </span>
              </div>
              <p className="text-xs text-zinc-200 font-body">{selectedNode.desc}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSpeakNode(selectedNode)}
                className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-[var(--color-brand)] hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Narrate Node
              </button>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
