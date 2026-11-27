"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import ConfettiExplosion from "react-confetti-explosion";
import PhaseShell from "../PhaseShell";
import { aniversarioAudio } from "../../lib/audio";
import { TRIP } from "../../data/trip";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const GlobeCanvas = dynamic(() => import("../three/GlobeCanvas"), {
  ssr: false,
});

interface Props {
  onReplay: () => void;
}

const CONFETTI = [
  "#D4AF37",
  "#E8B84A",
  "#C45C26",
  "#E8A0A0",
  "#0B1A2E",
  "#FFE6A0",
  "#FFD700",
];

export default function Final({ onReplay }: Props) {
  const [burst, setBurst] = useState(true);
  const [burst2, setBurst2] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    aniversarioAudio.swell();
    aniversarioAudio.startMusic();
    const t = window.setTimeout(() => setBurst2(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <PhaseShell
      canAdvance={false}
      showHint={false}
      background="radial-gradient(ellipse at center, #1a1020 0%, #0a0610 70%)"
    >
      <div className="absolute inset-0 z-0 opacity-80">
        {!reduced ? (
          <GlobeCanvas mode="finale" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-soft-gold text-6xl font-serif">∞</span>
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-lg">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none">
          {burst && (
            <ConfettiExplosion
              force={0.6}
              duration={2800}
              particleCount={reduced ? 40 : 100}
              width={480}
              colors={CONFETTI}
              onComplete={() => setBurst(false)}
            />
          )}
          {burst2 && (
            <ConfettiExplosion
              force={0.45}
              duration={2200}
              particleCount={reduced ? 30 : 70}
              width={360}
              colors={CONFETTI}
            />
          )}
        </div>

        <motion.p
          className="font-serif text-2xl sm:text-4xl text-soft-gold leading-snug"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Feliz aniversario, mi amor.
        </motion.p>

        <motion.p
          className="mt-4 font-mono text-sm sm:text-base text-white/70 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {TRIP.rangeLabel}. {TRIP.citiesLabel}.
        </motion.p>

        <motion.p
          className="mt-6 font-serif text-xl sm:text-2xl text-firenze-cream"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          Haz la maleta.
        </motion.p>

        <motion.p
          className="mt-8 font-serif italic text-soft-gold/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          — Freni
        </motion.p>

        <motion.button
          type="button"
          onClick={onReplay}
          className="mt-10 min-h-11 px-8 py-3 rounded-full border border-soft-gold/40 text-soft-gold text-sm tracking-wide cursor-pointer bg-soft-gold/10 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Ver otra vez desde el inicio"
          data-no-advance
        >
          Ver otra vez
        </motion.button>
      </div>
    </PhaseShell>
  );
}
