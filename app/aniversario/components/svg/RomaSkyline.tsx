export default function RomaSkyline({
  className,
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 800 280"
      className={className}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      {/* Distant pines */}
      <g opacity={opacity * 0.45} fill="#1a0e0a">
        <ellipse cx="80" cy="220" rx="18" ry="50" />
        <rect x="76" y="220" width="8" height="40" />
        <ellipse cx="720" cy="210" rx="16" ry="45" />
        <rect x="716" y="210" width="8" height="50" />
        <ellipse cx="680" cy="225" rx="12" ry="35" />
        <rect x="677" y="225" width="6" height="35" />
      </g>

      {/* Domes */}
      <g opacity={opacity * 0.7} fill="#2A1510">
        <path d="M200 260 L200 180 Q240 120 280 180 L280 260 Z" />
        <ellipse cx="240" cy="180" rx="42" ry="28" />
        <rect x="232" y="140" width="16" height="30" />
        <circle cx="240" cy="136" r="8" />
      </g>

      {/* Colosseum arches */}
      <g opacity={opacity} fill="#3a2218">
        <rect x="340" y="160" width="220" height="100" rx="8" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M${360 + i * 34} 250 L${360 + i * 34} 190 Q${377 + i * 34} 170 ${394 + i * 34} 190 L${394 + i * 34} 250 Z`}
            fill="#1a0e0a"
          />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={`t${i}`}
            d={`M${360 + i * 34} 185 L${360 + i * 34} 155 Q${377 + i * 34} 140 ${394 + i * 34} 155 L${394 + i * 34} 185 Z`}
            fill="#1a0e0a"
          />
        ))}
      </g>

      {/* Foreground ground */}
      <path
        d="M0 260 Q200 245 400 255 T800 250 L800 280 L0 280 Z"
        fill="#1a0e0a"
        opacity={opacity}
      />
    </svg>
  );
}
