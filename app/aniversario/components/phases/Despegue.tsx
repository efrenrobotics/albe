"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";
import { aniversarioAudio } from "../../lib/audio";
import { LEGS } from "../../data/trip";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const GlobeCanvas = dynamic(() => import("../three/GlobeCanvas"), {
  ssr: false,
});

interface Props {
  onContinue: () => void;
}

export default function Despegue({ onContinue }: Props) {
  const [flightDone, setFlightDone] = useState(false);
  const reduced = useReducedMotion();
  const leg = LEGS[0];

  useEffect(() => {
    aniversarioAudio.play("engine");
    aniversarioAudio.play("whoosh");
  }, []);

  useEffect(() => {
    if (!reduced) return;
    const t = window.setTimeout(() => setFlightDone(true), 1200);
    return () => clearTimeout(t);
  }, [reduced]);

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={flightDone}
      hint="Toca para aterrizar en Roma"
      background="radial-gradient(ellipse at center, #1a1020 0%, #0a0610 70%)"
    >
      <div className="absolute inset-0 z-0">
        {!reduced ? (
          <GlobeCanvas
            mode="aus-roma"
            onFlightComplete={() => setFlightDone(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-48 h-48 rounded-full border border-soft-gold/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          </div>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center pointer-events-none mt-auto mb-[20vh] px-6">
        <motion.p
          className="font-mono text-soft-gold text-sm sm:text-base tracking-[0.3em]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {leg.routeLabel}
        </motion.p>
        <motion.p
          className="font-serif text-white/80 text-lg sm:text-xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Despegando...
        </motion.p>
      </div>
    </PhaseShell>
  );
}
