"use client";

import { motion } from "motion/react";
import OceanBackground from "./OceanBackground";
import Island from "./Island";
import LockedIsland from "./LockedIsland";

export default function IslandHub() {
  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <OceanBackground />

      <div className="relative z-10 flex flex-col items-center px-6 py-12 sm:py-16 md:py-20 min-h-[100dvh]">
        {/* Header */}
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-gold text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          Bienvenida, Albeimar
        </motion.h1>

        <motion.p
          className="mt-4 text-base sm:text-lg md:text-xl text-white/50 font-serif tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Escoge tu aventura...
        </motion.p>

        {/* Island grid */}
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mt-8 sm:mt-12">
          {/* Unlocked islands — top row */}
          <div className="flex flex-wrap justify-center gap-12 sm:gap-16 md:gap-24 mb-12 sm:mb-16">
            <Island
              href="/valentines"
              label="San Valentín"
              icon={<span>💝</span>}
              glowColor="rgba(228,0,124,0.5)"
              blobColor="#8B1A4A"
              delay={0.6}
            />
            <Island
              href="/birthday"
              label="Cumpleaños"
              icon={<span>🎂</span>}
              glowColor="rgba(255,215,0,0.5)"
              blobColor="#6B5B1A"
              delay={0.8}
            />
          </div>

          {/* Locked islands — bottom row */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
            <LockedIsland label="???" delay={1.0} />
            <LockedIsland label="???" delay={1.2} />
            <LockedIsland label="Próximamente..." delay={1.4} />
          </div>
        </div>
      </div>
    </div>
  );
}
