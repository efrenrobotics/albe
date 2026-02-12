"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

const mysteryCards = [
  { emoji: "🧭", text: "Una ubicación secreta..." },
  { emoji: "🕐", text: "A un tiempo inesperado.." },
  { emoji: "✨", text: "Con una sorpresa que no te esperas..." },
];

interface AdventureRevealProps {
  onContinue: () => void;
}

function GoldDust() {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.4,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            bottom: "-5px",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
            ["--duration" as string]: `${p.duration}s`,
            ["--float-opacity" as string]: `${p.opacity}`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

export default function AdventureReveal({ onContinue }: AdventureRevealProps) {
  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 py-20 text-center relative z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dark background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(180deg, #1A0A10 0%, #2D0A1F 40%, #1A0A10 100%)",
        }}
      />

      {/* Gold dust particles */}
      <GoldDust />

      <motion.h2
        className="font-serif text-4xl md:text-6xl font-bold mb-12 text-gradient-gold animate-shimmer relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Nos espera una aventura...
      </motion.h2>

      <div className="grid gap-6 max-w-md w-full mb-12 relative z-10">
        {mysteryCards.map((card, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-2xl p-6 animate-border-glow"
            style={{ perspective: "800px" }}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            transition={{
              delay: 0.5 + i * 0.4,
              type: "spring",
              stiffness: 120,
              damping: 15,
            }}
          >
            <span className="text-4xl mb-3 block">{card.emoji}</span>
            <p className="text-lg font-serif text-white/70 italic">
              {card.text}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-lg text-white/40 mb-8 italic relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        Mas detalles pronto... solo tenias que confirmarme 😉
      </motion.p>

      <motion.button
        onClick={onContinue}
        className="text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg cursor-pointer relative z-10"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)",
          color: "#1A0A10",
          boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(212, 175, 55, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Aaa y otra cosa... 📸
      </motion.button>
    </motion.section>
  );
}
