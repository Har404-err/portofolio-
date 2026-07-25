import React from 'react';

interface MLoaderProps {
  progress?: number;
}

const MLoader: React.FC<MLoaderProps> = ({ progress }) => {
  return (
    <div className="relative flex flex-col items-center justify-center gap-6">
      {/* Background Soft Radial Glow */}
      <div
        aria-hidden
        className="absolute w-48 h-48 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.4), rgba(139,92,246,0.2), transparent 70%)' }}
      />

      {/* Ultra Smooth Monogram "M" SVG */}
      <div className="relative w-32 h-32 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(0,242,254,0.5)]">
        <svg viewBox="0 0 100 100" width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Blurred Glow Background Path */}
          <path 
            d="M 22 76 V 26 L 50 56 L 78 26 V 76" 
            stroke="url(#mLoaderGradient)" 
            strokeWidth="7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            opacity="0.3"
            className="blur-[2px]"
          />

          {/* Primary Animated Monogram Stroke */}
          <path 
            d="M 22 76 V 26 L 50 56 L 78 26 V 76" 
            stroke="url(#mLoaderGradient)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{
              strokeDasharray: 210,
              strokeDashoffset: progress !== undefined ? 210 - (progress / 100) * 210 : 0,
              transition: 'stroke-dashoffset 0.15s ease-out'
            }}
          />
        </svg>
      </div>

      {/* Brand Title */}
      <div className="flex flex-col items-center gap-1.5 z-10">
        <span className="font-space text-lg font-extrabold text-white tracking-[0.25em] uppercase">
          MUH4RHQ<span className="text-accent">_</span>
        </span>
      </div>
    </div>
  );
};

export default MLoader;
