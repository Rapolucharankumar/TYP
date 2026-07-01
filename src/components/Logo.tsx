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
          <linearGradient id="prism-edges" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--foreground)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        {/* Main Prism Triangle */}
        <polygon 
          points="28,4 52,52 4,52" 
          fill="rgba(255,255,255,0.03)" 
          stroke="url(#prism-edges)" 
          strokeWidth="1.5" 
        />
        
        {/* Interior Refraction Lines (creating a 3D effect) */}
        <path 
          d="M28,4 L28,34 M4,52 L28,34 M52,52 L28,34" 
          stroke="var(--foreground)" 
          strokeWidth="0.75" 
          strokeOpacity="0.4"
        />
        
        {/* Subtle glowing vertex points */}
        <circle cx="28" cy="4" r="1.5" fill="var(--foreground)" opacity="0.9" />
        <circle cx="4" cy="52" r="1.5" fill="var(--foreground)" opacity="0.6" />
        <circle cx="52" cy="52" r="1.5" fill="var(--foreground)" opacity="0.6" />
        <circle cx="28" cy="34" r="1" fill="var(--foreground)" opacity="0.5" />
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

