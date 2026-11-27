"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PhaseShell from "../PhaseShell";
import RomaSkyline from "../svg/RomaSkyline";
import { CITIES } from "../../data/trip";
import type { AniversarioAudio } from "../../lib/audio";
import styles from "../../journey.module.css";

export default function Roma({ audio, onContinue }: { audio: AniversarioAudio; onContinue: () => void }) {
  const [tossed, setTossed] = useState(false);
  const [wish, setWish] = useState(false);
  const reduced = useReducedMotion();
  const city = CITIES.roma;

  useEffect(() => {
    audio.play("bells");
    void audio.playAmbient(city.ambient);
    return () => {
      audio.stopLoops();
      audio.stopAmbient();
    };
  }, [audio, city.ambient]);

  useEffect(() => {
    if (!tossed) return;
    const impact = window.setTimeout(() => {
      audio.play("splash");
      setWish(true);
    }, reduced ? 80 : 530);
    return () => clearTimeout(impact);
  }, [audio, reduced, tossed]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={wish} hint="Seguir en tren">
      <motion.div
        className="absolute inset-x-[-14%] bottom-0 h-[48%] pointer-events-none opacity-70"
        animate={reduced ? undefined : { transform: ["translateX(-1.3%)", "translateX(1.3%)"] }}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      >
        <RomaSkyline className="w-full h-full" />
      </motion.div>
      <div className="relative z-10 w-full max-w-[34rem] text-center">
        <p className={styles.folio}>Fontana di Trevi{city.dateLabel && ` · ${city.dateLabel}`}</p>
        <h2 className="font-serif text-6xl sm:text-8xl leading-none">{city.displayName}</h2>

        <div className="relative mx-auto mt-7 w-full max-w-[27rem]" data-no-advance>
          <svg className="w-full" viewBox="0 0 420 252" aria-hidden>
            <defs>
              <linearGradient id="trevi-stone" x2="0" y2="1">
                <stop stopColor="var(--roma-gold)" stopOpacity=".82" />
                <stop offset="1" stopColor="var(--roma-terracotta)" stopOpacity=".55" />
              </linearGradient>
              <linearGradient id="trevi-water" x2="0" y2="1">
                <stop stopColor="#7eb6ac" />
                <stop offset="1" stopColor="#223738" />
              </linearGradient>
            </defs>
            <path d="M22 190V72h98V44h54l36-26 36 26h54v28h98v118" fill="url(#trevi-stone)" stroke="var(--roma-gold)" strokeWidth="2" />
            <path d="M17 76h386M108 52h204M138 94h144M30 151h360" fill="none" stroke="#ffdfab" opacity=".58" />
            <path d="M173 186v-56a37 37 0 0 1 74 0v56" fill="#643629" stroke="#ffdfab" strokeWidth="2" />
            {[65, 128, 278, 341].map((x) => (
              <g key={x} fill="#eac18a">
                <path d={`M${x} 85h14l-2 94h-10Z`} />
                <path d={`M${x - 4} 81h22v5h-22Z`} />
              </g>
            ))}
            <path d="M203 162q-21-7-13-21l12-18 2-13 10-5 10 8-5 18 9 19 23 17h-78z" fill="#f0d1a0" />
            <path d="M21 188 49 174h57l19-13 39 10 12-5 19 10 27-10 20 7 24-10 26 11h87l23 13-22 17H47Z" fill="#98724f" />
            <ellipse cx="210" cy="209" rx="183" ry="36" fill="#2e201e" stroke="var(--roma-gold)" strokeWidth="2" />
            <ellipse cx="210" cy="207" rx="166" ry="28" fill="url(#trevi-water)" />
            <path d="M73 209q30-9 63-4m129 10q34 4 71-6m-179 7h70" fill="none" stroke="#c3e0c4" opacity=".57" />
            {wish && <motion.ellipse
              cx="210" cy="207" rx="45" ry="8" fill="none" stroke="#e5f4d3" strokeWidth="2"
              initial={{ opacity: 1, rx: 45, ry: 8 }}
              animate={{ opacity: 0, rx: reduced ? 45 : 152, ry: reduced ? 8 : 25 }}
              transition={{ duration: 1.35 }}
            />}
          </svg>
          {!tossed && <motion.button
            type="button"
            className={styles.coin}
            aria-label="Lanza una moneda a la Fontana di Trevi"
            drag={!reduced}
            dragMomentum={false}
            dragSnapToOrigin
            onDragEnd={(_, info) => {
              if (Math.hypot(info.offset.x, info.offset.y) > 24 || Math.abs(info.velocity.y) > 170) setTossed(true);
            }}
            onClick={() => setTossed(true)}
          >✦</motion.button>}
          {tossed && !wish && !reduced && <motion.span
            className={styles.coin} aria-hidden
            initial={{ transform: "translate(0, 0) rotate(0deg)" }}
            animate={{ transform: [
              "translate(0, 0) rotate(0deg)",
              "translate(-17px, -115px) rotate(130deg)",
              "translate(-54px, -42px) rotate(260deg)",
            ] }}
            transition={{ duration: 0.53, ease: "easeOut" }}
          >✦</motion.span>}
        </div>
        <div className="mt-3 min-h-12 font-serif italic text-firenze-cream">
          {wish ? <motion.p role="status" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            Pide un deseo... (el mío ya se cumplió: tú)
          </motion.p> : !tossed && <p className="text-sm">Arrastra o toca la moneda</p>}
        </div>
      </div>
    </PhaseShell>
  );
}
