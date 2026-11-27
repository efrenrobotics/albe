"use client";

import { motion } from "motion/react";
import { aniversarioAudio } from "../../lib/audio";

interface Props {
  onContinue: () => void;
}

export default function Abrir({ onContinue }: Props) {
  const handleOpen = async () => {
    await aniversarioAudio.unlock();
    aniversarioAudio.startMusic();
    onContinue();
  };

  return (
    <motion.section
      className="fixed inset-0 z-10 flex flex-col items-center justify-center bg-warm-black px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.p
        className="font-serif text-3xl sm:text-5xl md:text-6xl text-center text-white/90 mb-12"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        Un año, Albe.
      </motion.p>

      <motion.button
        onClick={handleOpen}
        className="min-h-12 min-w-[8rem] px-10 py-3.5 rounded-full font-semibold text-lg text-warm-black cursor-pointer border border-soft-gold/40"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #E8B84A)",
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir el viaje"
      >
        Abrir
      </motion.button>
    </motion.section>
  );
}
