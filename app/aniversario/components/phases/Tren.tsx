"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PhaseShell from "../PhaseShell";
import RouteArc from "../RouteArc";
import { aniversarioAudio } from "../../lib/audio";
import { LEGS } from "../../data/trip";
import styles from "../../journey.module.css";

function TuscanLayer({ foreground }: { foreground: boolean }) {
  return (
    <svg viewBox="0 0 600 250" preserveAspectRatio="none" className="w-1/2 h-full" aria-hidden>
      {foreground ? (
        <>
          <path d="M0 226Q63 199 118 211T230 204 330 225 454 210 600 226V250H0Z" fill="#3d432b" />
          <path d="M0 242Q130 211 258 231T457 229 600 242V250H0Z" fill="#292d20" />
          {[31, 65, 182, 275, 307, 427, 536, 563].map((x, i) => (
            <path key={x} d={`M${x} 239v-19q-13-13 0-${34 + i % 3 * 9} 13 ${34 + i % 3 * 9} 0 ${34 + i % 3 * 9}Z`} fill="#252c22" />
          ))}
        </>
      ) : (
        <>
          <path d="M0 179Q68 135 114 155T218 154 345 163 457 146 600 179V250H0Z" fill="#716556" />
          <path d="M0 196C110 195 143 153 213 169S305 210 366 187 516 172 600 196V250H0Z" fill="#96794c" />
          <path d="M0 211C73 186 143 193 204 204S334 221 399 195 516 193 600 211V250H0Z" fill="#777249" />
          <path d="M50 203q75-19 127-6m271-1q40-12 89 0" stroke="#d4ae70" strokeWidth="2" fill="none" opacity=".6" />
        </>
      )}
    </svg>
  );
}

export default function Tren({ onContinue }: { onContinue: () => void }) {
  const [canAdvance, setCanAdvance] = useState(false);
  const reduced = useReducedMotion();
  const leg = LEGS[1];

  useEffect(() => {
    aniversarioAudio.play("train");
    const timer = window.setTimeout(() => setCanAdvance(true), reduced ? 850 : 3450);
    return () => {
      clearTimeout(timer);
      aniversarioAudio.stopLoops();
    };
  }, [reduced]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={canAdvance} hint="Llegar a Firenze">
      <div className="w-full max-w-[47rem] text-center">
        <p className={styles.folio}>{leg.routeLabel}{leg.dateLabel && ` · ${leg.dateLabel}`}</p>
        <h2 className="font-serif text-5xl sm:text-7xl leading-none">Por la Toscana</h2>
        <div className="relative isolate mt-7 h-[clamp(15rem,40dvh,27rem)] overflow-hidden rounded-[2.4rem] border-[.5rem] border-[#784f39] ring-1 ring-wien-light/45 shadow-2xl bg-firenze-rose">
          <div className="absolute inset-0 bg-gradient-to-b from-[#a1a5bd] via-[#e4b4a0] to-wien-light" />
          <motion.div className="absolute inset-0 bg-gradient-to-b from-firenze-dusk via-firenze-rose to-roma-gold"
            initial={{ opacity: 0 }} animate={{ opacity: 0.92 }} transition={{ duration: reduced ? 0.6 : 6 }} />
          <div className="absolute left-[39%] top-[28%] size-14 rounded-full bg-wien-light/85" />
          {[false, true].map((foreground) => (
            <motion.div key={String(foreground)} className="absolute inset-y-0 left-0 flex w-[200%]"
              animate={reduced ? undefined : { transform: ["translateX(0%)", "translateX(-50%)"] }}
              transition={{ duration: foreground ? 8 : 20, repeat: Infinity, ease: "linear" }}
            >
              <TuscanLayer foreground={foreground} /><TuscanLayer foreground={foreground} />
            </motion.div>
          ))}
          <div className="absolute right-2 top-2 w-32 rounded-xl px-2 bg-warm-black/85 text-wien-light border border-wien-light/30">
            <RouteArc leg={leg} className="w-full" />
          </div>
        </div>
      </div>
    </PhaseShell>
  );
}
