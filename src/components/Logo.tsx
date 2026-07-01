'use client';

import React from 'react';

interface LogoProps {
  variant?: 'mark' | 'horizontal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Logo({ variant = 'mark', size = 'md', className = '' }: LogoProps) {
  // Handle dimensions for the logo
  const sizeClasses = {
    sm: variant === 'horizontal' ? 'h-8 text-sm' : 'w-8 h-8',
    md: variant === 'horizontal' ? 'h-12 text-lg' : 'w-14 h-14',
    lg: variant === 'horizontal' ? 'h-16 text-2xl' : 'w-24 h-24',
    xl: variant === 'horizontal' ? 'h-24 text-4xl' : 'w-36 h-36',
  };

  const svgDimensions = {
    sm: 32,
    md: 56,
    lg: 72,
    xl: 96,
  };

  const strokeColor = 'currentColor'; // automatically respects dark/light theme text colors

  const renderSVG = (dSize: 'sm' | 'md' | 'lg' | 'xl') => {
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Soft glow filter */}
          <filter id="prism-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Glass body gradient */}
          <linearGradient id="prism-glass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--foreground)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.5" />
          </linearGradient>

          {/* Light emission core using Brand Colors */}
          <linearGradient id="light-refract" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--butter)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--lavender)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        
        {/* Ambient Glow behind the prism */}
        <polygon 
          points="28,4 52,52 4,52" 
          fill="none" 
          stroke="url(#light-refract)" 
          strokeWidth="2.5" 
          filter="url(#prism-glow)"
          opacity="0.6"
        />

        {/* Main Glass Prism Triangle */}
        <polygon 
          points="28,4 52,52 4,52" 
          fill="rgba(255,255,255,0.01)" 
          stroke="url(#prism-glass)" 
          strokeWidth="1.5" 
        />
        
        {/* Glowing Core / Light Ray splitting in 3D */}
        <path 
          d="M28,4 L28,34 M4,52 L28,34 M52,52 L28,34" 
          stroke="url(#light-refract)" 
          strokeWidth="1.5" 
          strokeOpacity="0.85"
          filter="url(#prism-glow)"
        />

        {/* Sharp inner structure lines */}
        <path 
          d="M28,4 L28,34 M4,52 L28,34 M52,52 L28,34" 
          stroke="var(--foreground)" 
          strokeWidth="0.5" 
          strokeOpacity="0.9"
        />
        
        {/* Glass highlight facet */}
        <polygon 
          points="28,4 4,52 28,34" 
          fill="url(#light-refract)" 
          opacity="0.12"
        />
        <polygon 
          points="28,4 28,34 52,52" 
          fill="var(--foreground)" 
          opacity="0.04"
        />

        {/* Glowing vertex light points */}
        <circle cx="28" cy="4" r="1.8" fill="var(--butter)" filter="url(#prism-glow)" />
        <circle cx="4" cy="52" r="1.8" fill="var(--lavender)" filter="url(#prism-glow)" />
        <circle cx="52" cy="52" r="1.8" fill="var(--teal)" filter="url(#prism-glow)" />
        <circle cx="28" cy="34" r="2.5" fill="var(--foreground)" opacity="0.9" filter="url(#prism-glow)" />
      </svg>
    );
  };

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 text-foreground ${className}`}>
        <div className={size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-11 h-11' : size === 'lg' ? 'w-16 h-16' : 'w-24 h-24'}>
          {renderSVG(size)}
        </div>
        <div className="flex flex-col text-left font-serif select-none">
          <span className="text-[10px] sm:text-[11px] italic leading-none text-foreground/80 mb-0.5">The</span>
          <span className="text-sm sm:text-base md:text-lg font-black tracking-widest leading-none">YOUTH PRISM</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {renderSVG(size)}
    </div>
  );
}

