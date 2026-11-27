export default function FirenzeSkyline({
  className,
  fill = "#3D1F2E",
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg
      viewBox="0 0 900 320"
      className={className}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden
    >
      {/* Hills */}
      <path
        d="M0 280 Q150 220 300 250 T600 240 T900 260 L900 320 L0 320 Z"
        fill={fill}
        opacity="0.5"
      />

      {/* Buildings */}
      <g fill={fill}>
        <rect x="120" y="200" width="40" height="100" />
        <rect x="170" y="180" width="50" height="120" />
        <rect x="230" y="210" width="35" height="90" />
        <rect x="580" y="190" width="45" height="110" />
        <rect x="640" y="205" width="55" height="95" />
        <rect x="710" y="175" width="40" height="125" />
      </g>

      {/* Duomo dome */}
      <g fill={fill}>
        <rect x="380" y="160" width="140" height="140" />
        <path d="M370 160 Q450 40 530 160 Z" />
        <rect x="438" y="50" width="24" height="50" />
        <circle cx="450" cy="46" r="10" />
        {/* lantern tip */}
        <rect x="446" y="28" width="8" height="18" />
      </g>

      {/* Campanile */}
      <g fill={fill}>
        <rect x="540" y="80" width="28" height="220" />
        <rect x="534" y="70" width="40" height="20" />
      </g>

      <path
        d="M0 290 L900 290 L900 320 L0 320 Z"
        fill={fill}
        opacity="0.85"
      />
    </svg>
  );
}
