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
          <linearGradient id="prism-gradient" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="var(--butter)" />
            <stop offset="50%" stopColor="var(--lavender)" />
            <stop offset="100%" stopColor="var(--teal)" />
          </linearGradient>
        </defs>
        <polygon points="28,3 53,53 3,53" fill="none" stroke="url(#prism-gradient)" strokeWidth="1.2" />
        <line
          x1="28"
          y1="3"
          x2="28"
          y2="53"
          stroke="var(--lavender)"
          strokeWidth="0.6"
          strokeDasharray="3,4"
        />
        {/* Top vertex: Gold */}
        <circle cx="28" cy="3" r="2.5" fill="var(--butter)" />
        {/* Left vertex: Lavender */}
        <circle cx="3" cy="53" r="1.6" fill="var(--lavender)" />
        {/* Right vertex: Growth Teal */}
        <circle cx="53" cy="53" r="1.6" fill="var(--teal)" />
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

