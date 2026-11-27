"use client";

import { useEffect, useState } from "react";
import PhaseShell from "../PhaseShell";
import { TRIP, UNLOCK_DATE } from "../../data/trip";
import styles from "../../journey.module.css";

const UNITS = ["días", "horas", "min", "seg"] as const;

export default function Countdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, Math.ceil((+UNLOCK_DATE - Date.now()) / 1000)));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const parts = remaining === null ? null : [
    Math.floor(remaining / 86400),
    Math.floor(remaining / 3600) % 24,
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ];

  return (
    <PhaseShell>
      <div className="w-full max-w-lg text-center">
        <p className={styles.folio}>{TRIP.anniversary}</p>
        <h1 className="font-serif text-5xl sm:text-7xl leading-[1.06]">Nuestro primer año</h1>
        <div className="mx-auto mt-10 grid max-w-sm grid-cols-4 divide-x divide-soft-gold/25 rounded-2xl py-5 glass-card" role="timer">
          {UNITS.map((unit, index) => (
            <div key={unit}>
              <p className="font-mono text-3xl sm:text-5xl tabular-nums text-firenze-cream">
                {parts ? String(parts[index]).padStart(2, "0") : "–"}
              </p>
              <p className="mt-2 font-mono text-[.65rem] uppercase tracking-widest text-firenze-cream/85">{unit}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 font-serif italic text-firenze-cream/85">Guardé algo para ti, Albe.</p>
      </div>
    </PhaseShell>
  );
}
