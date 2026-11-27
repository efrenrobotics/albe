"use client";

import { motion } from "motion/react";
import { seeded } from "../../lib/seeded-random";

const WAVES = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  y: 60 + i * 10,
  duration: 12 + i * 4,
  delay: i * 1.5,
  opacity: 0.04 + i * 0.015,
}));

const random = seeded(2026);
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: random() * 100,
  top: random() * 100,
  size: 1 + random() * 3,
  duration: 6 + random() * 8,
  delay: random() * 6,
  opacity: 0.1 + random() * 0.25,
}));

export default function OceanBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #2D0A1F 0%, #1A0A10 50%, #0D0508 100%)",
        }}
      />

      {/* Animated wave layers */}
      {WAVES.map((wave) => (
        <motion.div
          key={wave.id}
          className="absolute left-0 right-0"
          style={{
            top: `${wave.y}%`,
            height: "40%",
            background: `linear-gradient(180deg, transparent 0%, rgba(228,0,124,${wave.opacity}) 30%, rgba(75,20,60,${wave.opacity * 0.6}) 60%, transparent 100%)`,
            borderRadius: "50% 50% 0 0",
          }}
          animate={{
            x: ["-5%", "5%", "-5%"],
            scaleY: [1, 1.15, 1],
          }}
          transition={{
            duration: wave.duration,
            delay: wave.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Floating light particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [p.opacity, p.opacity * 1.8, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
