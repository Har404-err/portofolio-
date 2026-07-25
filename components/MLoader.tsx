import React from 'react';

interface MLoaderProps {
  progress?: number;
}

// Geometric M monogram path — wide, bold, perfectly balanced.
// Designed to read clearly at any size with thick strokes and sharp angles.
const M_PATH = 'M 15 78 L 15 22 L 50 52 L 85 22 L 85 78';
const M_LENGTH = 220;

const MLoader: React.FC<MLoaderProps> = ({ progress }) => {
  const offset = progress !== undefined ? M_LENGTH - (progress / 100) * M_LENGTH : 0;

  return (
    <div className="relative flex flex-col items-center justify-center gap-8">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,242,254,0.25), rgba(139,92,246,0.12), transparent 65%)',
          filter: 'blur(30px)',
          animation: 'mGlowPulse 2.5s ease-in-out infinite'
        }}
      />

      {/* M Monogram */}
      <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
        <svg
          viewBox="0 0 100 100"
          width="140"
          height="140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 18px rgba(0,242,254,0.45))' }}
        >
          <defs>
            <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>

          {/* Soft glow layer */}
          <path
            d={M_PATH}
            stroke="url(#mGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
            style={{ filter: 'blur(4px)' }}
          />

          {/* Main animated stroke */}
          <path
            d={M_PATH}
            stroke="url(#mGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: M_LENGTH,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
        </svg>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes mGlowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
};

export default MLoader;
