"use client";

import { useMemo } from "react";

const PARTICLE_COLORS = [
  "#FFD700", // gold
  "#D4AF37", // soft-gold
  "#E4007C", // mexican-pink
  "#DA70D6", // orchid
  "#FF6B9D", // valentine-pink
];

const PARTICLE_CHARS = ["●", "✦", "✧", "●", "●", "✦"];

export default function BirthdayParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 45 }, (_, i) => {
        const color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        const opacity = 0.15 + Math.random() * 0.35;
        const char = PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)];
        const isShape = char !== "●";
        return {
          id: i,
          left: Math.random() * 100,
          size: isShape ? 8 + Math.random() * 10 : 2 + Math.random() * 5,
          duration: 8 + Math.random() * 12,
          delay: Math.random() * 10,
          opacity,
          color,
          char,
          isShape,
        };
      }),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) =>
        p.isShape ? (
          <div
            key={p.id}
            className="absolute animate-float-up"
            style={{
              left: `${p.left}%`,
              bottom: "-10px",
              fontSize: p.size,
              color: p.color,
              opacity: p.opacity,
              ["--duration" as string]: `${p.duration}s`,
              ["--float-opacity" as string]: `${p.opacity}`,
              animationDelay: `${p.delay}s`,
              animationIterationCount: "infinite",
            }}
          >
            {p.char}
          </div>
        ) : (
          <div
            key={p.id}
            className="absolute rounded-full animate-float-up"
            style={{
              left: `${p.left}%`,
              bottom: "-10px",
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
              ["--duration" as string]: `${p.duration}s`,
              ["--float-opacity" as string]: `${p.opacity}`,
              animationDelay: `${p.delay}s`,
              animationIterationCount: "infinite",
            }}
          />
        )
      )}
    </div>
  );
}
