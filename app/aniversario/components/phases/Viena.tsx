"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";
import WienMarket from "../svg/WienMarket";
import { CITIES } from "../../data/trip";
import type { AniversarioAudio } from "../../lib/audio";
import { makeParticles } from "../../lib/seeded";
import styles from "../../journey.module.css";

const STALLS = 5;
const FLAKES = makeParticles(34, 88);
const city = CITIES.viena;

export default function Viena({ audio, onContinue }: { audio: AniversarioAudio; onContinue: () => void }) {
  const [lit, setLit] = useState(0);
  const done = lit === STALLS;

  useEffect(() => {
    audio.play("musicbox");
    void audio.playAmbient(city.ambient);
    return () => {
      audio.stopLoops();
      audio.stopAmbient();
    };
  }, [audio]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={done} hint="Ver nuestros recuerdos">
      <div className={styles.snow} aria-hidden>
        {FLAKES.map((flake) => <i key={flake.id} style={{
          left: `${flake.left}%`,
          width: flake.size,
          height: flake.size,
          opacity: flake.opacity,
          "--duration": `${flake.duration}s`,
          animationDelay: `-${flake.delay}s`,
        } as CSSProperties} />)}
      </div>
      <div className="relative z-10 w-full max-w-[48rem] text-center">
        <p className={styles.folio}>Mercado de Navidad{city.dateLabel && ` · ${city.dateLabel}`}</p>
        <h2 className="font-serif text-6xl sm:text-8xl leading-none text-wien-snow">{city.displayName}</h2>
        <button
          type="button"
          onClick={() => {
            if (done) return;
            setLit((value) => Math.min(STALLS, value + 1));
            audio.play("chime");
          }}
          className="relative mt-2 block w-full min-h-11 rounded-xl cursor-pointer"
          aria-label={done ? "Mercado iluminado" : `Encender luces del mercado, ${lit} de ${STALLS}`}
          aria-disabled={done}
        >
          <WienMarket className="w-full h-auto" litCount={lit} />
        </button>
        <motion.p role="status" className="mt-2 text-sm font-serif italic text-wien-snow" key={done ? "lit" : "dark"} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {done ? "Naguara... qué bonito quedó." : "Toca para encender el mercado"}
        </motion.p>
      </div>
    </PhaseShell>
  );
}
