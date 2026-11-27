"use client";

import { useEffect } from "react";
import PhaseShell from "../PhaseShell";
import { aniversarioAudio } from "../../lib/audio";
import { LEGS } from "../../data/trip";
import styles from "../../journey.module.css";

export default function Despegue({ done, onContinue }: { done: boolean; onContinue: () => void }) {
  const leg = LEGS[0];

  useEffect(() => {
    aniversarioAudio.play("engine");
    aniversarioAudio.play("whoosh");
  }, []);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={done} hint="Aterrizar en Roma" className="!justify-end">
      <div className="text-center mb-[4dvh]">
        <p className={styles.folio}>{leg.routeLabel} · {leg.dateLabel}</p>
        <h2 className="font-serif text-5xl sm:text-7xl">{done ? "Ciao, Roma." : "Despegando…"}</h2>
      </div>
    </PhaseShell>
  );
}
