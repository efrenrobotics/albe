"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import PhaseShell from "../PhaseShell";
import { CITIES, HOOK_LINE, LEGS, TRIP } from "../../data/trip";
import type { AniversarioAudio } from "../../lib/audio";
import styles from "../../journey.module.css";

const DESTINATION = CITIES.roma.name.toLocaleUpperCase("es").split("");
const LYRIC = `«${HOOK_LINE}»`;

export default function Aeropuerto({ audio, onContinue }: { audio: AniversarioAudio; onContinue: () => void }) {
  const [flaps, setFlaps] = useState(0);
  const [typed, setTyped] = useState(0);
  const [canAdvance, setCanAdvance] = useState(false);
  const reduced = useReducedMotion();
  const complete = typed === LYRIC.length;
  const departure = LEGS[0];

  useEffect(() => {
    const timers = DESTINATION.map((_, index) =>
      window.setTimeout(() => {
        setFlaps(index + 1);
        if (!reduced || index === 0) audio.play("flap");
      }, reduced ? 350 : 1500 + index * 210),
    );
    let interval: number | undefined;
    const timer = window.setTimeout(() => {
      if (reduced) {
        setTyped(LYRIC.length);
        return;
      }
      let index = 0;
      interval = window.setInterval(() => {
        index++;
        setTyped(index);
        if (index >= LYRIC.length) clearInterval(interval);
      }, 36);
    }, reduced ? 600 : 2400);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [audio, reduced]);

  useEffect(() => {
    if (!complete) return;
    const timer = window.setTimeout(() => setCanAdvance(true), 800);
    return () => clearTimeout(timer);
  }, [complete]);

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={canAdvance} hint="Despegar">
      <div className="w-full max-w-[31rem]">
        <motion.div className={styles.ticket} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.ticketHead}>
            <span>Pase de abordar</span><span aria-hidden>✦</span>
          </div>
          <motion.div className={styles.ticketRoute}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <span>{CITIES.austin.code}</span>
            <svg viewBox="0 0 44 20" width="44" aria-hidden fill="none" stroke="currentColor">
              <path d="M1 10h39m-7-6 7 6-7 6" />
            </svg>
            <span>{flaps === DESTINATION.length ? CITIES.roma.code : "···"}</span>
          </motion.div>
          <motion.dl className={styles.ticketDetails}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div><dt>Pasajera</dt><dd>{TRIP.passenger}</dd></div>
            <div><dt>Salida</dt><dd>{departure.dateLabel}</dd></div>
            <div><dt>Clase</dt><dd>Primera (en mi corazón)</dd></div>
          </motion.dl>
          <div className={styles.ticketStub}>
            <p className="mb-2 text-[.66rem] uppercase tracking-[.22em]">Destino</p>
            <div className="flex justify-center gap-2" aria-hidden>
              {DESTINATION.map((letter, index) => (
                <div key={index} className={styles.tile}>
                  <motion.span
                    key={index < flaps ? letter : "—"}
                    initial={{ rotateX: reduced ? 0 : -78, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.26, ease: "easeOut" }}
                  >
                    {index < flaps ? letter : "—"}
                  </motion.span>
                </div>
              ))}
            </div>
            <span className="sr-only" role="status">{flaps === DESTINATION.length && CITIES.roma.name}</span>
          </div>
        </motion.div>
        <div className="mt-6 min-h-[6.2rem] text-center">
          <p className="font-serif italic text-lg leading-snug sm:text-xl">
            <span aria-hidden>{LYRIC.slice(0, typed)}</span>
            {complete && <span className="sr-only">{LYRIC}</span>}
          </p>
          {complete && <motion.p className="mt-3 text-sm text-firenze-cream"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            ...y esta vez nos vamos a Europa.
          </motion.p>}
        </div>
      </div>
    </PhaseShell>
  );
}
