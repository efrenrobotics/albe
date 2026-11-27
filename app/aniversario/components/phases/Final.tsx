"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import ConfettiExplosion from "react-confetti-explosion";
import PhaseShell from "../PhaseShell";
import { aniversarioAudio } from "../../lib/audio";
import { CITIES, TRIP } from "../../data/trip";
import styles from "../../journey.module.css";

const COLORS = ["#D4AF37", "#E8B84A", "#C45C26", "#E8A0A0", "#FFE6A0"];

export default function Final({ onReplay }: { onReplay: () => void }) {
  const [burst, setBurst] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    aniversarioAudio.swell();
    if (reduced) return;
    const timer = window.setTimeout(() => setBurst(true), 3900);
    return () => clearTimeout(timer);
  }, [reduced]);

  return (
    <PhaseShell className="!justify-end">
      <motion.div
        className="relative w-full max-w-[41rem] text-center mb-[1dvh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.65 }}
      >
        {burst && <div className="pointer-events-none absolute left-1/2 top-0" aria-hidden>
          <ConfettiExplosion force={0.6} duration={2650} particleCount={80} width={430} colors={COLORS} onComplete={() => setBurst(false)} />
        </div>}
        <p className={styles.folio}>
          {CITIES.austin.code} → {CITIES.roma.name} → {CITIES.florencia.name} → {CITIES.viena.name} → {CITIES.austin.code}
        </p>
        <h2 className="font-serif text-4xl sm:text-6xl leading-[1.08]">Feliz aniversario, mi amor.</h2>
        <p className="mt-3 text-sm sm:text-base text-firenze-cream">
          {TRIP.rangeLabel}. {TRIP.citiesLabel}.
        </p>
        <p className="mt-3 font-serif text-xl sm:text-2xl">Haz la maleta.</p>
        <p className="mt-2 font-serif italic text-wien-light">— Freni</p>
        <button
          type="button"
          onClick={onReplay}
          className="mt-5 min-h-11 rounded-full border border-soft-gold/60 px-6 text-sm text-wien-light bg-warm-black/70 cursor-pointer"
        >
          Ver otra vez
        </button>
      </motion.div>
    </PhaseShell>
  );
}
