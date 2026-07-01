'use client';

import React, { useEffect, useState } from 'react';

export default function CinematicOverlay() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* 1. Luxury Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: 'overlay',
        }}
      />

      {/* 2. Interactive Light Tracking (Spotlight) */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9998] transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.03), transparent 40%)`,
        }}
      />

      {/* 3. Floating Editorial Shapes */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* Abstract Prism Line */}
        <div className="absolute top-[10%] left-[15%] w-[1px] h-[30vh] bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.05)] to-transparent animate-float-1" />
        
        {/* Abstract Circle Frame */}
        <div className="absolute bottom-[20%] right-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full border border-[rgba(255,255,255,0.02)] animate-float-2" />
        
        {/* Subtle Diagonal Cut */}
        <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.03)] to-transparent transform -rotate-45 animate-float-1" />
      </div>
    </>
  );
}
