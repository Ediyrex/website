'use client'

export function HeroVisual() {
  return (
    <div
      className="relative w-full aspect-square max-w-[420px] lg:max-w-[480px] xl:max-w-[520px] mx-auto select-none pointer-events-none flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Ambient background soft depth */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-[90px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 55% 45%, rgba(44, 52, 128, 0.25) 0%, rgba(20, 24, 60, 0.15) 40%, transparent 70%)',
        }}
      />

      {/* Generative Architectural Sculpture (SVG & Vector) */}
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          {/* Subtle linear gradients for metallic/graphite line structures */}
          <linearGradient id="metal-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#777777" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#222222" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="metal-accent" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#EAEAEA" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#3B4499" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#080808" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="center-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E234D" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#0E1020" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#080808" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Central Ambient Core */}
        <circle cx="250" cy="250" r="140" fill="url(#center-core)" />

        {/* Primary Elliptical Orbital Architecture (Interlaced geometric rings) */}
        <ellipse
          cx="250"
          cy="250"
          rx="210"
          ry="110"
          transform="rotate(-24 250 250)"
          stroke="url(#metal-primary)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        <ellipse
          cx="250"
          cy="250"
          rx="180"
          ry="90"
          transform="rotate(32 250 250)"
          stroke="url(#metal-accent)"
          strokeWidth="1.2"
        />

        <ellipse
          cx="250"
          cy="250"
          rx="140"
          ry="140"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="0.75"
        />

        <ellipse
          cx="250"
          cy="250"
          rx="95"
          ry="55"
          transform="rotate(-60 250 250)"
          stroke="rgba(255, 255, 255, 0.22)"
          strokeWidth="1"
        />

        {/* Dynamic Architectural Tangent Lines */}
        <line
          x1="60"
          y1="250"
          x2="440"
          y2="250"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="0.75"
        />
        <line
          x1="250"
          y1="60"
          x2="250"
          y2="440"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="0.75"
        />

        {/* Subtle Diagonal Ray */}
        <line
          x1="120"
          y1="380"
          x2="380"
          y2="120"
          stroke="url(#metal-accent)"
          strokeWidth="0.75"
          strokeDasharray="2 8"
        />

        {/* Focal Geometric Node Points */}
        <circle cx="250" cy="250" r="3" fill="#EAEAEA" />
        <circle cx="380" cy="210" r="2" fill="#999999" />
        <circle cx="140" cy="310" r="2" fill="#999999" />
        <circle cx="310" cy="140" r="1.5" fill="rgba(255, 255, 255, 0.6)" />

        {/* Technical Coordinate Indicators */}
        <text
          x="70"
          y="242"
          fill="#666666"
          fontFamily="monospace"
          fontSize="8"
          letterSpacing="1.5"
        >
          SEC.01 // ORIGIN
        </text>
        <text
          x="350"
          y="410"
          fill="#666666"
          fontFamily="monospace"
          fontSize="8"
          letterSpacing="1.5"
        >
          R.210 // 32°N
        </text>
      </svg>
    </div>
  )
}
