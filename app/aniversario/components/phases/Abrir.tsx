"use client";

import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";

export default function Abrir({ onContinue }: { onContinue: () => void }) {
  return (
    <PhaseShell>
      <motion.h1
        className="font-serif text-center text-[clamp(3.1rem,10vw,7.5rem)] leading-tight"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Un año, Albe.
      </motion.h1>
      <motion.button
        type="button"
        onClick={onContinue}
        className="mt-10 min-h-12 rounded-full border border-soft-gold px-10 font-mono text-sm font-semibold uppercase tracking-[.22em] text-warm-black bg-gradient-to-br from-wien-light to-soft-gold cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        whileTap={{ scale: 0.97 }}
      >
        Abrir
      </motion.button>
    </PhaseShell>
  );
}
