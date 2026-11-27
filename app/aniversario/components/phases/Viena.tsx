"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";
import WienMarket from "../svg/WienMarket";
import { CITIES } from "../../data/trip";
import { aniversarioAudio } from "../../lib/audio";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { makeParticles } from "../../lib/seeded";

interface Props {
  onContinue: () => void;
}

const STALLS = 5;
const FLAKES = makeParticles(40, 88);

export default function Viena({ onContinue }: Props) {
  const [lit, setLit] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    aniversarioAudio.play("musicbox");
    void aniversarioAudio.playAmbient(CITIES.viena.ambient);
    return () => {
      aniversarioAudio.stopLoops();
      aniversarioAudio.stopAmbient();
    };
  }, []);

  useEffect(() => {
    if (lit < STALLS) return;
    const t = window.setTimeout(() => setCanAdvance(true), 1000);
    return () => clearTimeout(t);
  }, [lit]);

  const lightStall = () => {
    if (lit >= STALLS) return;
    setLit((n) => n + 1);
    aniversarioAudio.play("chime");
  };

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={canAdvance}
      hint="Toca para ver nuestros recuerdos"
      background="linear-gradient(180deg, #0B1A2E 0%, #152238 50%, #1a2a40 100%)"
    >
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {FLAKES.map((f) => (
            <div
              key={f.id}
              className="absolute rounded-full bg-wien-snow animate-float-up"
              style={{
                left: `${f.left}%`,
                bottom: "-10px",
                width: f.size,
                height: f.size,
                opacity: f.opacity,
                ["--duration" as string]: `${f.duration}s`,
                ["--float-opacity" as string]: `${f.opacity}`,
                animationDelay: `${f.delay}s`,
                animationIterationCount: "infinite",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-lg">
        <motion.h2
          className="font-serif text-5xl sm:text-7xl font-bold text-wien-snow text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Wien
        </motion.h2>
        <p className="font-mono text-sm text-wien-gold mt-2 tracking-widest">
          {CITIES.viena.dateLabel}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            lightStall();
          }}
          className="relative w-full mt-6 h-52 sm:h-64 cursor-pointer min-h-[44px]"
          aria-label={
            lit >= STALLS
              ? "Mercado iluminado"
              : `Encender luces del mercado, ${lit} de ${STALLS}`
          }
          data-no-advance
        >
          <WienMarket className="w-full h-full" litCount={lit} />
        </button>

        <p className="mt-4 text-xs text-white/45 tracking-wide text-center">
          {lit >= STALLS
            ? "Naguara... qué bonito quedó."
            : "Toca para encender el mercado"}
        </p>
      </div>
    </PhaseShell>
  );
}
