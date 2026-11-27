export default function WienMarket({
  className,
  litCount = 0,
}: {
  className?: string;
  litCount?: number;
}) {
  const stalls = [
    { x: 80, w: 90 },
    { x: 200, w: 100 },
    { x: 340, w: 110 },
    { x: 490, w: 95 },
    { x: 620, w: 100 },
  ];

  return (
    <svg
      viewBox="0 0 800 360"
      className={className}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      {/* Ground snow */}
      <ellipse cx="400" cy="340" rx="380" ry="30" fill="#F0F4F8" opacity="0.15" />

      {stalls.map((s, i) => {
        const lit = i < litCount;
        return (
          <g key={i} transform={`translate(${s.x}, 200)`}>
            {/* Roof */}
            <path
              d={`M0 40 L${s.w / 2} 0 L${s.w} 40 Z`}
              fill={lit ? "#8B1A1A" : "#1a2433"}
            />
            {/* Body */}
            <rect
              x="8"
              y="40"
              width={s.w - 16}
              height="70"
              fill={lit ? "#2a1a10" : "#121820"}
            />
            {/* Window glow */}
            <rect
              x="20"
              y="55"
              width={s.w - 40}
              height="30"
              rx="2"
              fill={lit ? "#FFE6A0" : "#1a2030"}
              opacity={lit ? 0.9 : 0.4}
            />
            {/* Light string */}
            {lit &&
              Array.from({ length: 5 }).map((_, j) => (
                <circle
                  key={j}
                  cx={16 + j * ((s.w - 32) / 4)}
                  cy="38"
                  r="3"
                  fill="#FFE6A0"
                >
                  <animate
                    attributeName="opacity"
                    values="0.6;1;0.6"
                    dur={`${1.2 + j * 0.2}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
          </g>
        );
      })}

      {/* Tree */}
      <g transform="translate(380, 80)">
        <polygon points="20,0 60,160 -20,160" fill="#0d2a18" />
        <polygon points="20,40 50,140 -10,140" fill="#134020" />
        {litCount >= 5 &&
          [
            [10, 50],
            [30, 70],
            [5, 100],
            [35, 110],
            [20, 90],
            [15, 130],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="4" fill="#D4AF37" />
          ))}
      </g>
    </svg>
  );
}
