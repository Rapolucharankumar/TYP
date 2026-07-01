'use client';

import React, { useEffect, useRef, useState } from 'react';
import ThreeGlobe from './ThreeGlobe';
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ── Brand colors (Demo Homepage values) ── */
const C = {
  midnight: '#05163B',
  midnight2: '#1A2540',
  midnight3: '#1A2540',
  butter: '#FFE9A1',
  teal: '#0B5A47',
  tealText: '#0B5A47',
  tealLight: '#0B5A47',
  lavender: '#E1D6FF',
  cream: '#F5F0E8',
  cherry: '#660D0D',
  sand: '#E9DFC3',
};

/* ── Dot colour by writer type ── */
const dotColour = (type: string) => {
  return C.butter;
};
const haloColour = (type: string) => {
  return 'rgba(255, 233, 161, 0.4)';
};

/* ── Writer pin data ── */
/* ── Writer pin data ── */
interface Pin {
  name: string;
  role: string;
  country: string;
  type: 'writer' | 'research' | 'origin';
  lat: number;
  lng: number;
  sector: 'ai' | 'climate' | 'tech';
}

const DEFAULT_PINS: Pin[] = [
  { name: 'Manan Jindal', role: 'Founder & Editor', country: 'India', type: 'writer', lat: 20.6, lng: 78.9, sector: 'tech' },
  { name: 'Devon Patel', role: 'Policy Analyst', country: 'United States', type: 'writer', lat: 37.1, lng: -95.7, sector: 'climate' },
  { name: 'Aria Sterling', role: 'Technology & Geopolitics', country: 'United Kingdom', type: 'writer', lat: 51.5, lng: -0.1, sector: 'ai' },
  { name: 'Elena Rostova', role: 'Healthcare Policy', country: 'Eastern Europe', type: 'writer', lat: 50.4, lng: 30.5, sector: 'climate' },
  { name: 'Marcus Vance', role: 'Global Affairs', country: 'South Africa', type: 'writer', lat: -29.0, lng: 26.0, sector: 'tech' },
  { name: 'Ishaan Jindal', role: 'Economics Analyst', country: 'India', type: 'writer', lat: 28.6, lng: 77.2, sector: 'ai' },
  { name: 'WHO Geneva', role: 'Patent Negotiations HQ', country: 'Switzerland', type: 'research', lat: 46.2, lng: 6.1, sector: 'climate' },
  { name: 'TSMC Hsinchu', role: 'Chip Supply Brief', country: 'Taiwan', type: 'origin', lat: 24.8, lng: 120.9, sector: 'tech' },
];

/* ── Mercator projection helper ── */
const W = 1000, H = 500;
function project(lat: number, lng: number): [number, number] {
  const x = (lng + 180) * (W / 360);
  const latRad = (lat * Math.PI) / 180;
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = H / 2 - (W * mercN) / (2 * Math.PI);
  return [x, Math.max(0, Math.min(H, y))];
}

/* ── Country path data ── */
const COUNTRY_PATHS: { id: string; d: string; highlight?: boolean }[] = [
  { id: 'USA', d: 'M80,145 L90,130 L120,120 L160,118 L200,115 L230,118 L250,128 L260,140 L255,158 L240,168 L220,175 L195,178 L165,180 L130,178 L100,170 L82,158Z', highlight: true },
  { id: 'Canada', d: 'M75,70 L100,60 L150,52 L210,50 L260,55 L280,70 L270,95 L250,110 L220,115 L180,112 L140,115 L100,118 L82,108 L76,90Z' },
  { id: 'Mexico', d: 'M100,178 L165,180 L185,192 L195,210 L180,222 L155,225 L130,218 L110,205 L98,190Z' },
  { id: 'Brazil', d: 'M185,248 L240,238 L270,248 L285,270 L290,300 L280,330 L265,355 L240,368 L215,365 L195,345 L182,315 L175,290 L178,265Z' },
  { id: 'India', d: 'M635,158 L668,148 L685,160 L690,185 L680,210 L660,228 L640,235 L620,215 L615,190 L620,168Z', highlight: true },
  { id: 'China', d: 'M660,95 L730,80 L790,82 L810,98 L808,125 L790,140 L755,148 L712,148 L680,142 L658,125 L652,108Z' },
  { id: 'UK', d: 'M418,88 L428,84 L432,95 L425,102 L418,98Z' },
  { id: 'Germany', d: 'M448,86 L465,83 L472,94 L468,106 L455,108 L445,100 L446,90Z' },
  { id: 'France', d: 'M430,98 L450,94 L458,108 L452,120 L438,122 L428,114 L428,104Z' },
  { id: 'Russia', d: 'M490,42 L560,32 L640,28 L730,30 L820,36 L850,50 L840,70 L800,78 L740,80 L680,78 L620,76 L570,78 L530,80 L505,76 L490,60Z' },
  { id: 'Japan', d: 'M800,112 L810,105 L820,115 L815,128 L802,128Z' },
  { id: 'SouthKorea', d: 'M785,115 L798,110 L800,122 L790,126 L782,120Z' },
  { id: 'Taiwan', d: 'M782,162 L790,158 L794,168 L786,172Z', highlight: true },
  { id: 'Australia', d: 'M762,300 L825,292 L862,308 L878,335 L875,365 L852,382 L818,390 L785,380 L762,358 L752,328Z' },
  { id: 'SouthAfrica', d: 'M455,308 L495,302 L500,325 L488,345 L465,348 L450,335 L448,315Z', highlight: true },
  { id: 'Morocco', d: 'M418,132 L440,128 L442,145 L430,150 L415,145 L414,136Z' },
  { id: 'Egypt', d: 'M505,136 L535,133 L538,155 L526,165 L506,162 L502,148Z' },
  { id: 'Nigeria', d: 'M445,215 L475,210 L480,232 L462,242 L442,238 L438,224Z' },
  { id: 'Kenya', d: 'M518,235 L538,230 L542,252 L524,260 L510,252 L508,242Z' },
  { id: 'Switzerland', d: 'M447,106 L455,104 L458,110 L452,114 L446,112Z', highlight: true },
];

interface GlobeProps {
  onSelectCountry?: (country: string | null) => void;
}

export default function GlobalIntelligenceGlobe({ onSelectCountry }: GlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pins] = useState<Pin[]>(DEFAULT_PINS);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [pulseAngle, setPulseAngle] = useState(0);
  const [activeSector, setActiveSector] = useState<'all' | 'ai' | 'climate' | 'tech'>('all');

  /* ── Pulse animation ── */
  useEffect(() => {
    let frame: number;
    let angle = 0;
    const loop = () => {
      angle += 0.05;
      setPulseAngle(angle);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleCountryClick = (country: string) => {
    const next = selectedCountry === country ? null : country;
    setSelectedCountry(next);
    onSelectCountry?.(next);
  };

  // Filter writer strip by active sector
  const writerStrip = DEFAULT_PINS.filter(
    p => p.type === 'writer' && (activeSector === 'all' || p.sector === activeSector)
  ).slice(0, 5);

  return (
    <div className="w-full space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-warmgrey/40">
        <div>
          <span className="eyebrow flex items-center gap-3">
            <span style={{ width: 24, height: 3, background: C.tealText, display: 'inline-block', flexShrink: 0, borderRadius: 1 }} />
            A global publication
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-playfair, Georgia, serif)',
              fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 700,
              color: 'var(--foreground)',
              marginTop: 12,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Writers from{' '}
            <em style={{ fontStyle: 'italic', color: C.tealText }}>
              across the world
            </em>
          </h2>
        </div>

        <div style={{ maxWidth: 300 }}>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 16, fontFamily: 'var(--font-inter, sans-serif)' }}>
            The Youth Prism is a genuinely global publication — with contributors from India, the UK, the US, Eastern Europe, Africa, and beyond.
          </p>
          <div style={{ display: 'flex', gap: 32 }}>
            {[['17+', 'Contributors'], ['10+', 'Countries'], ['5', 'Disciplines']].map(([num, label]) => (
              <div key={label}>
                <span style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 24, fontWeight: 700, color: 'var(--foreground)', display: 'block' }}>{num}</span>
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--muted)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3D Three.js Globe ── */}
      <div style={{
        position: 'relative',
        background: C.midnight,
        borderRadius: 8,
        overflow: 'hidden',
        height: 500,
        width: '100%'
      }}>
        {/* Ambient background glow */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, rgba(11, 90, 71, 0.06) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />

        {/* The 3D Globe with active sector filter passed as prop */}
        <ThreeGlobe activeSector={activeSector} />

        {/* Floating Sector Filter Buttons overlay inside the globe container */}
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          zIndex: 10
        }}>
          {[
            { key: 'all', label: 'All Nodes' },
            { key: 'ai', label: 'AI Sector' },
            { key: 'climate', label: 'Climate' },
            { key: 'tech', label: 'Tech' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveSector(key as 'all' | 'ai' | 'climate' | 'tech')}
              style={{
                padding: '7px 18px',
                borderRadius: 32,
                fontSize: 10,
                fontFamily: 'var(--font-inter, sans-serif)',
                fontWeight: 600,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: activeSector === key ? 'none' : '0.5px solid rgba(245, 240, 232, 0.25)',
                background: activeSector === key ? C.butter : 'rgba(15,23,42,0.6)',
                color: activeSector === key ? C.midnight : C.cream,
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── SVG World Map (country index + writer dots) ── */}
      <div className="glass" style={{ position: 'relative', width: '100%', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', background: 'var(--card-bg)' }}>
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedCountry && geo.properties.name.toLowerCase().includes(selectedCountry.toLowerCase());
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? "rgba(255, 233, 161, 0.28)" : "rgba(255,255,255,0.05)"}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { fill: "rgba(255, 233, 161, 0.2)", outline: "none" },
                      pressed: { outline: "none" },
                    }}
                    onClick={() => handleCountryClick(geo.properties.name)}
                  />
                );
              })
            }
          </Geographies>

          {/* Arc connection lines between writer pins, filtered by active sector */}
          {[
            [0, 1], [1, 2], [0, 4], [0, 6],
          ].map(([a, b], i) => {
            const pinA = DEFAULT_PINS[a];
            const pinB = DEFAULT_PINS[b];
            const active = activeSector === 'all' || pinA.sector === activeSector || pinB.sector === activeSector;
            return (
              <Line
                key={i}
                from={[pinA.lng, pinA.lat]}
                to={[pinB.lng, pinB.lat]}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth={1}
                strokeDasharray="4,4"
                style={{
                  opacity: active ? 1.0 : 0.15,
                  transition: 'opacity 0.2s ease',
                }}
              />
            );
          })}

          {/* Writer / Research / Origin dots, filtered/opacity-faded by active sector */}
          {pins.map((pin, i) => {
            const pulse = 1 + Math.sin(pulseAngle + i * 0.8) * 0.35;
            const col = dotColour(pin.type);
            const halo = haloColour(pin.type);
            const active = activeSector === 'all' || pin.sector === activeSector;

            return (
              <Marker
                key={`${pin.name}-${i}`}
                coordinates={[pin.lng, pin.lat]}
                onClick={() => handleCountryClick(pin.country)}
                style={{
                  default: {
                    cursor: 'pointer',
                    opacity: active ? 1.0 : 0.15,
                    transition: 'opacity 0.2s ease',
                  },
                  hover: { cursor: 'pointer', opacity: active ? 1.0 : 0.15 },
                  pressed: { cursor: 'pointer', opacity: active ? 1.0 : 0.15 },
                }}
              >
                <title>{pin.name} — {pin.country}</title>
                <circle r={8 * pulse} fill={halo} />
                <circle r={3.5} fill={col} />
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      {/* ── Writer Strip (midnight cards) ── */}
      <div style={{ display: 'flex', overflowX: 'auto', borderRadius: 4, overflow: 'hidden', border: `0.5px solid rgba(11, 90, 71, 0.08)`, gap: '4px', padding: '4px' }}>
        {writerStrip.map((pin, idx) => (
          <div
            key={pin.name}
            onClick={() => handleCountryClick(pin.country)}
            className="hover-glow-lavender rounded"
            style={{
              flex: '1 0 130px',
              background: selectedCountry === pin.country ? C.midnight : C.midnight2,
              padding: '18px 20px',
              border: `0.5px solid rgba(245, 240, 232, 0.1)`,
              cursor: 'pointer',
              minWidth: 130,
            }}
          >
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.20em', color: C.tealText, marginBottom: 7 }}>
              {pin.country}
            </div>
            <div style={{ fontFamily: 'var(--font-playfair, Georgia, serif)', fontSize: 14, color: C.cream, fontWeight: 500, marginBottom: 4, lineHeight: 1.3 }}>
              {pin.name}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(245, 240, 232, 0.60)', lineHeight: 1.4 }}>
              {pin.role}
            </div>
          </div>
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: 'flex', gap: 20, paddingTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { col: C.butter, label: 'Writer / Contributor' },
          { col: C.tealText, label: 'Research Node' },
          { col: C.lavender, label: 'Origin / Source' },
        ].map(({ col, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-inter, sans-serif)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block', flexShrink: 0 }} />
            {label}
          </div>
        ))}

        {selectedCountry && (
          <button
            onClick={() => handleCountryClick(selectedCountry)}
            style={{
              marginLeft: 'auto',
              fontSize: 11,
              fontWeight: 700,
              color: C.tealText,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'var(--font-inter, sans-serif)',
            }}
          >
            Clear filter ✕
          </button>
        )}
      </div>
    </div>
  );
}