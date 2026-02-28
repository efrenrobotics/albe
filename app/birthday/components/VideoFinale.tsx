"use client";

import { motion } from "motion/react";
import TypewriterText from "./TypewriterText";

const PLACEHOLDER_VIDEO_ID = "h87QN4DaUKU";

export default function VideoFinale() {
  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-dvh px-6 py-12 text-center relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gradient-birthday mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Y por ultimo...
      </motion.h2>

      <TypewriterText
        text="Algo muy especial de la gente que mas te quiere"
        delay={0.8}
        className="text-lg sm:text-xl text-white/70 font-serif mb-8 sm:mb-10"
      />

      <motion.div
        className="w-full max-w-2xl glass-card rounded-2xl overflow-hidden animate-border-glow"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6, type: "spring" }}
      >
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${PLACEHOLDER_VIDEO_ID}`}
            title="Birthday video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </motion.div>

      <motion.div
        className="mt-10 sm:mt-12 max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
      >
        <p className="text-2xl sm:text-3xl font-serif text-gradient-birthday font-bold mb-3">
          Feliz cumple mi amor
        </p>
        <p className="text-base sm:text-lg text-white/50">
          Que este nuevo año de vida este lleno de todo lo bonito! Te quiero
          muchisimo.
        </p>
      </motion.div>
    </motion.section>
  );
}
