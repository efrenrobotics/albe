"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PhaseShell from "../PhaseShell";
import FirenzeSkyline from "../svg/FirenzeSkyline";
import { CITIES } from "../../data/trip";
import { aniversarioAudio } from "../../lib/audio";
import styles from "../../journey.module.css";

export default function Florencia({ onContinue }: { onContinue: () => void }) {
  const [sunset, setSunset] = useState(0);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();
  const city = CITIES.florencia;

  useEffect(() => {
    void aniversarioAudio.playAmbient(city.ambient);
    return () => {
      aniversarioAudio.stopAmbient();
      aniversarioAudio.setSunset(0);
    };
  }, [city.ambient]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={done} hint="Volar a Viena">
      <div className="relative z-10 w-full max-w-[46rem] text-center">
        <p className={styles.folio}>Piazzale Michelangelo{city.dateLabel && ` · ${city.dateLabel}`}</p>
        <h2 className="font-serif text-6xl leading-none sm:text-8xl">{city.displayName}</h2>
        <div className="relative isolate mt-7 mx-auto overflow-hidden rounded-t-[48%] border border-firenze-cream/30 aspect-[1.7] max-w-[39rem] bg-firenze-night" data-no-advance>
          <div className="absolute inset-0 bg-gradient-to-b from-wien-twilight to-firenze-rose/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-firenze-dusk via-firenze-rose to-roma-gold" style={{ opacity: sunset }} />
          <div
            className="absolute left-[29%] top-[22%] size-[19%] rounded-full bg-wien-light blur-md"
            style={{ opacity: 0.26 + sunset * 0.52, transform: reduced ? undefined : `translate(${sunset * 85}%, ${sunset * 145}%)` }}
          />
          <div
            className="absolute left-[32%] top-[27%] aspect-square w-[13%] rounded-full bg-wien-light"
            style={{ transform: reduced ? undefined : `translate(${sunset * 123}%, ${sunset * 216}%)` }}
          />
          <FirenzeSkyline className="absolute inset-x-0 bottom-0 h-[79%] w-full" fill="var(--firenze-dusk)" />
          <div className="absolute bottom-0 inset-x-0 h-[12%] bg-firenze-dusk" />
        </div>
        <div className="mx-auto mt-5 max-w-[21rem]" data-no-advance>
          <label htmlFor="sunset-slider" className="block font-mono text-xs uppercase tracking-widest text-firenze-cream">
            Arrastra el atardecer
          </label>
          <input id="sunset-slider" type="range" min={0} max={100} value={Math.round(sunset * 100)}
            onChange={(event) => {
              const next = Number(event.currentTarget.value) / 100;
              setSunset(next);
              aniversarioAudio.setSunset(next);
              if (next >= 0.92) setDone(true);
            }}
            className="w-full min-h-11 accent-wien-light cursor-pointer"
          />
        </div>
        <div className="min-h-7 text-center">
          {done && <motion.p role="status" className="font-serif italic text-firenze-cream" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            El atardecer más bonito... contigo al lado.
          </motion.p>}
        </div>
      </div>
    </PhaseShell>
  );
}
