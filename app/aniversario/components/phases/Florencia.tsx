"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";
import FirenzeSkyline from "../svg/FirenzeSkyline";
import { CITIES } from "../../data/trip";
import { aniversarioAudio } from "../../lib/audio";

interface Props {
  onContinue: () => void;
}

export default function Florencia({ onContinue }: Props) {
  const [sunset, setSunset] = useState(0.25);
  const [canAdvance, setCanAdvance] = useState(false);
  const done = sunset >= 0.92;

  useEffect(() => {
    void aniversarioAudio.playAmbient(CITIES.florencia.ambient);
    return () => aniversarioAudio.stopAmbient();
  }, []);

  useEffect(() => {
    if (!done || canAdvance) return;
    const t = window.setTimeout(() => setCanAdvance(true), 1200);
    return () => clearTimeout(t);
  }, [done, canAdvance]);

  const sky = `linear-gradient(180deg,
    hsl(${220 - sunset * 80}, ${40 + sunset * 30}%, ${12 + sunset * 18}%) 0%,
    hsl(${30 + sunset * 10}, ${70 + sunset * 20}%, ${35 + sunset * 25}%) 45%,
    hsl(${15}, ${60 + sunset * 20}%, ${45 + sunset * 15}%) 100%)`;

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={canAdvance}
      hint="Toca para volar a Viena"
      background={sky}
    >
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-lg">
        <motion.h2
          className="font-serif text-5xl sm:text-7xl font-bold text-firenze-cream text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Firenze
        </motion.h2>
        <p className="font-mono text-sm text-firenze-rose mt-2 tracking-widest">
          {CITIES.florencia.dateLabel}
        </p>

        <div className="relative w-full mt-8 h-48 sm:h-56" data-no-advance>
          <FirenzeSkyline
            className="absolute inset-x-0 bottom-0 w-full h-full"
            fill={`rgba(61, 31, 46, ${0.7 + sunset * 0.25})`}
          />
          {/* Sun */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 48 + sunset * 24,
              height: 48 + sunset * 24,
              right: `${20 + sunset * 30}%`,
              top: `${15 + (1 - sunset) * 35}%`,
              background: `radial-gradient(circle, #FFE6A0, #E8B84A 50%, transparent 70%)`,
              boxShadow: `0 0 ${40 + sunset * 60}px rgba(232,184,74,${0.3 + sunset * 0.4})`,
            }}
          />
        </div>

        <div className="w-full max-w-xs mt-6" data-no-advance>
          <label
            htmlFor="sunset-slider"
            className="block text-xs text-white/50 text-center mb-2 tracking-wide"
          >
            Arrastra el atardecer
          </label>
          <input
            id="sunset-slider"
            type="range"
            min={0}
            max={100}
            value={Math.round(sunset * 100)}
            onChange={(e) => setSunset(Number(e.target.value) / 100)}
            className="w-full h-11 accent-firenze-terracotta cursor-pointer"
            aria-label="Controlar el atardecer sobre el Duomo"
            data-no-advance
          />
        </div>

        {done && (
          <motion.p
            className="mt-6 font-serif italic text-firenze-cream text-center text-base sm:text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            El atardecer más bonito... contigo al lado.
          </motion.p>
        )}
      </div>
    </PhaseShell>
  );
}
