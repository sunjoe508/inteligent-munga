
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className={`${dimensions[size]} relative flex items-center justify-center`}>
      <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f3ff" />
            <stop offset="100%" stopColor="#bc13fe" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Outer Frame */}
        <path d="M10,20 L20,10 L80,10 L90,20 L90,80 L80,90 L20,90 L10,80 Z" 
          className="stroke-[2] fill-slate-950/80 stroke-cyan-500/50" />
        
        {/* Fused JM Symbol */}
        <g filter="url(#glow)">
          {/* J Part */}
          <path d="M35,30 V65 C35,75 45,75 50,70" 
            className="stroke-[6] stroke-cyan-400 fill-none" 
            strokeLinecap="round" />
          {/* M Part */}
          <path d="M50,70 V30 L65,55 L80,30 V70" 
            className="stroke-[6] stroke-purple-500 fill-none" 
            strokeLinecap="round" strokeLinejoin="round" />
        </g>
        
        {/* Tech Accents */}
        <circle cx="20" cy="20" r="2" fill="#00f3ff" />
        <circle cx="80" cy="80" r="2" fill="#bc13fe" />
      </svg>
    </div>
  );
};

export default Logo;
