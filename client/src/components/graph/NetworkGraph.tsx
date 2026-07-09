import React, { useRef, useState, useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import type { INetworkData, IGraphNode, IGraphEdge } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkGraphProps {
  data: INetworkData;
  onNodeClick?: (nodeId: string) => void;
}

export default function NetworkGraph({ data, onNodeClick }: NetworkGraphProps) {
  const { resolvedTheme } = useTheme();
  const fgRef = useRef<any>();
  const [hoverNode, setHoverNode] = useState<IGraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());

  // Image cache
  const imgCache = useMemo(() => {
    const cache = new Map();
    data.nodes.forEach(node => {
      const img = new Image();
      img.src = node.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${node.label}`;
      cache.set(node.id, img);
    });
    return cache;
  }, [data.nodes]);

  const handleNodeHover = useCallback((node: any) => {
    setHoverNode(node || null);
    setHighlightNodes(new Set());
    setHighlightLinks(new Set());

    if (node) {
      const newHighlightNodes = new Set();
      const newHighlightLinks = new Set();
      newHighlightNodes.add(node.id);

      data.edges.forEach(edge => {
        const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
        const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
        
        if (sourceId === node.id || targetId === node.id) {
          newHighlightLinks.add(edge);
          newHighlightNodes.add(sourceId === node.id ? targetId : sourceId);
        }
      });

      setHighlightNodes(newHighlightNodes);
      setHighlightLinks(newHighlightLinks);
    }
  }, [data.edges]);

  const handleNodeClick = useCallback((node: any) => {
    if (onNodeClick) {
      onNodeClick(node.id);
    }
    // Center view on node
    fgRef.current?.centerAt(node.x, node.y, 1000);
    fgRef.current?.zoom(4, 1000);
  }, [onNodeClick]);

  const isDark = resolvedTheme === 'dark';

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden glass-card border border-border/50">
      
      <ForceGraph2D
        ref={fgRef}
        graphData={{ nodes: data.nodes || [], links: data.edges || [] }}
        nodeLabel=""
        nodeRelSize={6}
        backgroundColor="transparent"
        linkColor={(link: any) => highlightLinks.has(link) ? '#8b5cf6' : (isDark ? '#334155' : '#cbd5e1')}
        linkWidth={(link: any) => highlightLinks.has(link) ? 3 : 1}
        linkDirectionalParticles={(link: any) => highlightLinks.has(link) ? 4 : 0}
        linkDirectionalParticleWidth={4}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.08}
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const isHighlighted = highlightNodes.has(node.id);
          const isDimmed = highlightNodes.size > 0 && !isHighlighted;
          const size = isHighlighted ? 10 : 8;

          ctx.save();
          if (isDimmed) ctx.globalAlpha = 0.2;

          // Draw Border/Ring
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 1.5, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.type === 'self' ? '#06b6d4' : 
                         node.type === 'friend' ? '#10b981' : 
                         node.type === 'mutual' ? '#3b82f6' : '#8b5cf6';
          ctx.fill();

          // Draw Avatar
          const img = imgCache.get(node.id);
          if (img && img.complete) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
            ctx.clip();
            ctx.drawImage(img, node.x - size, node.y - size, size * 2, size * 2);
          } else {
            ctx.fillStyle = '#1e293b';
            ctx.fill();
          }

          ctx.restore();

          // Label
          if (globalScale > 2 && !isDimmed) {
            const fontSize = 12/globalScale;
            ctx.font = `bold ${fontSize}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
            ctx.fillText(node.label, node.x, node.y + size + fontSize + 1);
          }
        }}
      />

      {/* HTML Custom Hover Card */}
      <AnimatePresence>
        {hoverNode && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-50 pointer-events-none p-4 rounded-2xl glass-card border border-border shadow-2xl flex items-center gap-3 w-64"
            style={{
              top: '20px',
              left: '20px'
            }}
          >
            <img src={imgCache.get(hoverNode.id)?.src} alt="" className="w-12 h-12 rounded-full border-2 border-border" />
            <div>
              <p className="font-bold text-sm text-foreground line-clamp-1">{hoverNode.label}</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
                {hoverNode.type === 'self' ? 'You' : hoverNode.type === 'friend' ? 'Direct Connection' : hoverNode.type === 'mutual' ? '2nd Degree' : 'Recommended'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
