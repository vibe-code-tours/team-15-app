interface ReviveIconMarkProps {
  size?: number
  className?: string
}

export function ReviveIconMark({ size = 36, className }: ReviveIconMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ReVive"
    >
      <defs>
        <linearGradient id="riv-g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>

      {/* Faint full ring */}
      <circle cx="32" cy="32" r="28" stroke="url(#riv-g)" strokeWidth="3" fill="none" opacity="0.12" />

      {/* Three arc segments */}
      <circle cx="32" cy="32" r="28" stroke="#34d399" strokeWidth="3.5" fill="none"
        strokeDasharray="43.9 131.9" strokeDashoffset="0" strokeLinecap="round" />
      <circle cx="32" cy="32" r="28" stroke="#22d3ee" strokeWidth="3.5" fill="none"
        strokeDasharray="43.9 131.9" strokeDashoffset="-87.9" strokeLinecap="round" />
      <circle cx="32" cy="32" r="28" stroke="#a78bfa" strokeWidth="3.5" fill="none"
        strokeDasharray="43.9 131.9" strokeDashoffset="-175.9" strokeLinecap="round" />

      {/* Circuit traces */}
      <line x1="32" y1="7" x2="32" y2="21" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="32" y1="43" x2="32" y2="57" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="32" x2="21" y2="32" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="43" y1="32" x2="57" y2="32" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />

      {/* Node dots */}
      <circle cx="32" cy="4" r="3.5" fill="#34d399" />
      <circle cx="60" cy="32" r="3.5" fill="#22d3ee" />
      <circle cx="32" cy="60" r="3.5" fill="#a78bfa" />
      <circle cx="4" cy="32" r="3.5" fill="#34d399" />

      {/* Center chip */}
      <rect x="24" y="24" width="16" height="16" rx="3.5" stroke="url(#riv-g)" strokeWidth="2" fill="none" />
      <circle cx="32" cy="32" r="3" fill="url(#riv-g)" />
    </svg>
  )
}
