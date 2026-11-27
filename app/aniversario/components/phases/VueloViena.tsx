"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PhaseShell from "../PhaseShell";
import RouteArc from "../RouteArc";
import type { AniversarioAudio } from "../../lib/audio";
import { LEGS } from "../../data/trip";
import styles from "../../journey.module.css";

const CLOUDS = [
  { y: "18%", x: "8%", width: "41vw", speed: 20 },
  { y: "42%", x: "57%", width: "63vw", speed: 16 },
  { y: "74%", x: "-15%", width: "91vw", speed: 12 },
  { y: "82%", x: "50%", width: "72vw", speed: 14 },
];

export default function VueloViena({ audio, onContinue }: { audio: AniversarioAudio; onContinue: () => void }) {
  const [canAdvance, setCanAdvance] = useState(false);
  const reduced = useReducedMotion();
  const leg = LEGS[2];

  useEffect(() => {
    audio.play("whoosh");
    const timer = window.setTimeout(() => setCanAdvance(true), reduced ? 850 : 2800);
    return () => clearTimeout(timer);
  }, [audio, reduced]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={canAdvance} hint="Aterrizar en Wien">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-wien-midnight via-firenze-dusk to-firenze-rose opacity-65" aria-hidden />
      <motion.div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-wien-midnight via-wien-twilight to-[#9facbf]"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ duration: reduced ? 0.55 : 3.4 }} aria-hidden />
      {CLOUDS.map(({ y, x, width, speed }) => (
        <motion.svg key={y} className="pointer-events-none absolute blur-[2px]" viewBox="0 0 400 100"
          style={{ left: x, top: y, width }}
          animate={reduced ? undefined : { transform: ["translateX(-25vw)", "translateX(110vw)"] }}
          transition={{ duration: speed, repeat: Infinity, ease: "linear" }} aria-hidden>
          <path d="M0 84Q23 70 54 71 77 44 113 46 133 16 184 27 210 5 263 36 283 40 308 58 365 58 400 83Z" fill="var(--wien-snow)" opacity=".23" />
          <path d="M0 89Q53 72 88 76 122 51 157 55 178 42 205 47 256 54 281 71 352 71 400 91Z" fill="var(--wien-snow)" opacity=".27" />
        </motion.svg>
      ))}
      <div className="relative z-10 w-full max-w-[33rem] text-center drop-shadow-[0_2px_10px_#131c34]">
        <p className={styles.folio}>{leg.routeLabel}{leg.dateLabel && ` · ${leg.dateLabel}`}</p>
        <h2 className="font-serif text-5xl sm:text-7xl leading-none">Rumbo a Viena</h2>
        <RouteArc leg={leg} className="mx-auto mt-3 w-3/4 max-w-72 text-wien-snow" />
      </div>
    </PhaseShell>
  );
}
