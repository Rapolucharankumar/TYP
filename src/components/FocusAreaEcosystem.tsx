'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldAlert, Globe, Coins, HeartPulse, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: React.ComponentType<any>;
  desc: string;
  slug: string;
}

interface Connection {
  from: string;
  to: string;
  impact: string;
}

const NODES: Node[] = [
  { id: 'tech', name: 'Technology', x: 250, y: 70, icon: Cpu, desc: 'Algorithmic computing, AI risk profiles, and semiconductor production.', slug: 'technology' },
  { id: 'policy', name: 'Policy', x: 430, y: 170, icon: ShieldAlert, desc: 'Legislative acts, antitrust codes, and digital sovereignty frameworks.', slug: 'policy' },
  { id: 'geopolitics', name: 'Geopolitics', x: 360, y: 350, icon: Globe, desc: 'Maritime security, border sovereign conflicts, and mineral supply wars.', slug: 'global-affairs' },
  { id: 'economics', name: 'Economics', x: 140, y: 350, icon: Coins, desc: 'Trade embargoes, intellectual asset rents, and international pricing models.', slug: 'policy' },
  { id: 'healthcare', name: 'Healthcare', x: 70, y: 170, icon: HeartPulse, desc: 'Global access consortia, pandemic security, and vaccine patent waivers.', slug: 'healthcare' }
];

const CONNECTIONS: Connection[] = [
  { from: 'tech', to: 'policy', impact: 'Technology forces Policy via algorithmic safety, auditing rules, and data rules.' },
  { from: 'policy', to: 'geopolitics', impact: 'Policy shapes Geopolitics through microchips export bans and silicon controls.' },
  { from: 'geopolitics', to: 'economics', impact: 'Geopolitics influences Economics via trade lane blockades and tariff embargoes.' },
  { from: 'economics', to: 'healthcare', impact: 'Economics dictates Healthcare through patent pricing rules and supply control.' },
  { from: 'healthcare', to: 'tech', impact: 'Healthcare drives Tech via clinical computing demands and genomic architectures.' }
];

export default function FocusAreaEcosystem() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);

  // Find connections related to active node
  const isConnected = (from: string, to: string) => {
    if (selectedConnection) {
      return selectedConnection.from === from && selectedConnection.to === to;
    }
    if (!activeNode) return true;
    return activeNode === from || activeNode === to;
  };

  return (
    <div className="bg-card-bg/30 border border-border/40 glass p-6 sm:p-8 rounded-[32px] shadow-lg relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Graph Display (7 cols) */}
        <div className="lg:col-span-7 flex justify-center relative overflow-visible h-[420px]">
          
          <svg 
            viewBox="0 0 500 420" 
            className="w-full max-w-[460px] h-full overflow-visible select-none"
          >
            {/* Defs for gradients & markers */}
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(11, 90, 71, 0.45)" />
              </marker>
              <marker
                id="arrow-active"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#0B5A47" />
              </marker>
              <linearGradient id="grad-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0B5A47" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#E1D6FF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#660D0D" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Connection Lines */}
            {CONNECTIONS.map((conn, idx) => {
              const fromNode = NODES.find(n => n.id === conn.from);
              const toNode = NODES.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const active = isConnected(conn.from, conn.to);
              
              return (
                <g 
                  key={idx} 
                  className="cursor-pointer"
                  onClick={() => setSelectedConnection(conn)}
                >
                  {/* Invisible thicker path for easier hover */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="transparent"
                    strokeWidth="15"
                  />
                  {/* Glowing background flow */}
                  {active && (
                    <motion.line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="url(#grad-line)"
                      strokeWidth="2.5"
                      strokeDasharray="6 6"
                      animate={{ strokeDashoffset: [-20, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                  {/* Primary solid link line */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={active ? '#0B5A47' : 'rgba(11, 90, 71, 0.15)'}
                    strokeWidth={active ? 2.5 : 1.2}
                    markerEnd={active ? 'url(#arrow-active)' : 'url(#arrow)'}
                    className="transition-colors duration-300"
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => {
              const Icon = node.icon;
              const isHighlighted = activeNode === node.id || (selectedConnection && (selectedConnection.from === node.id || selectedConnection.to === node.id));
              const isDimmed = activeNode && activeNode !== node.id && !(selectedConnection && (selectedConnection.from === node.id || selectedConnection.to === node.id));

              return (
                <g 
                  key={node.id}
                  className="cursor-pointer"
                  onMouseEnter={() => { setActiveNode(node.id); setSelectedConnection(null); }}
                  onMouseLeave={() => setActiveNode(null)}
                >
                  {/* Outer breathing ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHighlighted ? 28 : 24}
                    fill="var(--card-bg)"
                    stroke={isHighlighted ? '#0B5A47' : 'var(--card-border)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    className="transition-all duration-300"
                  />
                  {/* Inner glow circle */}
                  {isHighlighted && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={24}
                      fill="rgba(11, 90, 71, 0.08)"
                      className="animate-pulse"
                    />
                  )}
                  {/* Icon representation */}
                  <g transform={`translate(${node.x - 10}, ${node.y - 10})`}>
                    <Icon 
                      className={`w-5 h-5 ${isHighlighted ? 'text-brand-teal' : 'text-foreground/90'} transition-colors duration-300`} 
                    />
                  </g>
                  {/* Label background card */}
                  <rect
                    x={node.x - 45}
                    y={node.y + 28}
                    width="90"
                    height="18"
                    rx="4"
                    fill="var(--background)"
                    stroke="var(--border)"
                    strokeWidth="0.5"
                    className="opacity-90"
                  />
                  {/* Label Text */}
                  <text
                    x={node.x}
                    y={node.y + 40}
                    textAnchor="middle"
                    className="text-[9px] font-sans font-black uppercase tracking-wider fill-foreground"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          <span className="absolute bottom-1.5 text-[9px] text-foreground/90 font-sans tracking-wider">
            Hover nodes or click connections to map intersections
          </span>
        </div>

        {/* Information Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between h-full">
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-black text-foreground">
              Focus Ecosystem
            </h3>
            <p className="text-xs text-foreground/90 leading-relaxed font-sans font-medium">
              Geopolitical intelligence does not live in isolated silos. Algorithmic networks shape legislative policy, policy restricts hardware manufacturing, and economic parameters govern clinical and healthcare outcomes.
            </p>
          </div>

          {/* Dynamic Intersection Brief Card */}
          <div className="min-h-[180px] border border-border/40 bg-card-bg/40 glass p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Editorial Red Accent strip */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-brand-teal" />

            <AnimatePresence mode="wait">
              {selectedConnection ? (
                <motion.div
                  key={`conn-${selectedConnection.from}-${selectedConnection.to}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="space-y-3 h-full flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-widest font-black text-brand-teal">
                      Link Impact: {NODES.find(n => n.id === selectedConnection.from)?.name} &rarr; {NODES.find(n => n.id === selectedConnection.to)?.name}
                    </span>
                    <p className="text-xs text-foreground leading-relaxed font-sans font-medium">
                      {selectedConnection.impact}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link 
                      href={`/categories/${NODES.find(n => n.id === selectedConnection.to)?.slug}`}
                      className="text-[10px] font-black text-brand-teal hover:underline uppercase tracking-widest flex items-center gap-1"
                    >
                      Research Desk Briefs <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ) : activeNode ? (
                <motion.div
                  key={`node-${activeNode}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="space-y-3 h-full flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase tracking-widest font-black text-brand-teal">
                      Focus Node: {NODES.find(n => n.id === activeNode)?.name}
                    </span>
                    <h4 className="font-serif text-base font-bold text-foreground">
                      {NODES.find(n => n.id === activeNode)?.name} Desk
                    </h4>
                    <p className="text-xs text-foreground/90 leading-relaxed font-sans font-medium">
                      {NODES.find(n => n.id === activeNode)?.desc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link 
                      href={`/categories/${NODES.find(n => n.id === activeNode)?.slug}`}
                      className="text-[10px] font-black text-brand-teal hover:underline uppercase tracking-widest flex items-center gap-1"
                    >
                      Explore Essays <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="flex flex-col justify-center items-center h-full text-center py-6 space-y-2"
                >
                  <Cpu className="w-6 h-6 text-brand-teal/40 animate-pulse" />
                  <h4 className="text-xs font-bold text-foreground/85">Node Connector Active</h4>
                  <p className="text-[10px] text-foreground/85 max-w-[200px] leading-snug">Hover cursor over any core node or link to examine mutual feedback structures.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
}
