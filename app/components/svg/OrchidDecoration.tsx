export default function OrchidDecoration({
  className,
  variant = "left",
}: {
  className?: string;
  variant?: "left" | "right";
}) {
  const flip = variant === "right" ? "scale(-1, 1)" : undefined;

  return (
    <svg
      viewBox="0 0 120 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip }}
    >
      {/* Stem */}
      <path
        d="M60,160 C58,140 55,120 54,100 C53,85 56,70 58,60"
        stroke="#3A7D44"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Leaf */}
      <path
        d="M54,110 C40,105 30,95 28,85 C26,75 35,78 54,100"
        fill="#3A7D44"
        opacity="0.4"
      />
      {/* Back petals */}
      <ellipse cx="45" cy="40" rx="22" ry="14" fill="#B55FBA" opacity="0.5" transform="rotate(-30 45 40)" />
      <ellipse cx="75" cy="40" rx="22" ry="14" fill="#B55FBA" opacity="0.5" transform="rotate(30 75 40)" />
      <ellipse cx="60" cy="25" rx="14" ry="20" fill="#B55FBA" opacity="0.5" />
      {/* Main petals */}
      <ellipse cx="42" cy="45" rx="18" ry="12" fill="#DA70D6" opacity="0.7" transform="rotate(-25 42 45)" />
      <ellipse cx="78" cy="45" rx="18" ry="12" fill="#DA70D6" opacity="0.7" transform="rotate(25 78 45)" />
      <ellipse cx="60" cy="28" rx="12" ry="18" fill="#DA70D6" opacity="0.7" />
      {/* Lip petal (labellum - characteristic of orchids) */}
      <path
        d="M60,48 C50,55 45,65 48,72 C50,76 55,78 60,76 C65,78 70,76 72,72 C75,65 70,55 60,48Z"
        fill="#E4007C"
        opacity="0.8"
      />
      {/* Center details */}
      <circle cx="60" cy="45" r="4" fill="#FFD700" opacity="0.8" />
      <circle cx="58" cy="43" r="1.5" fill="#D4AF37" />
      <circle cx="62" cy="43" r="1.5" fill="#D4AF37" />
    </svg>
  );
}
