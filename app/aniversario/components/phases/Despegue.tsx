"use client";

import { useEffect } from "react";
import PhaseShell from "../PhaseShell";
import type { AniversarioAudio } from "../../lib/audio";
import { LEGS } from "../../data/trip";
import styles from "../../journey.module.css";

export default function Despegue({ audio, done, onContinue }: { audio: AniversarioAudio; done: boolean; onContinue: () => void }) {
  const leg = LEGS[0];

  useEffect(() => {
    audio.play("engine");
    audio.play("whoosh");
  }, [audio]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={done} hint="Aterrizar en Roma" className="!justify-end">
      <div className="text-center mb-[4dvh]">
        <p className={styles.folio}>{leg.routeLabel} · {leg.dateLabel}</p>
        <h2 className="font-serif text-5xl sm:text-7xl">{done ? "Ciao, Roma." : "Despegando…"}</h2>
      </div>
    </PhaseShell>
  );
}
