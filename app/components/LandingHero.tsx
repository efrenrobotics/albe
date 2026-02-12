"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import AvilaSilhouette from "./svg/AvilaSilhouette";
import OrchidDecoration from "./svg/OrchidDecoration";

const FloatingHeart3D = dynamic(() => import("./three/FloatingHeart3D"), {
  ssr: false,
  loading: () => <div className="w-40 h-40" />,
});

interface LandingHeroProps {
  onContinue: () => void;
}

export default function LandingHero({ onContinue }: LandingHeroProps) {
  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center relative z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
    >
      {/* Dark cinematic gradient background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(135deg, #1A0A10 0%, #4A0E2E 40%, #2D0A1F 70%, #1A0A10 100%)",
        }}
      />

      {/* El Avila silhouette at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 -z-10"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
      >
        <AvilaSilhouette className="w-full h-auto" />
      </motion.div>

      {/* Orchid decorations */}
      <motion.div
        className="absolute top-8 left-4 sm:top-12 sm:left-8 -z-10 opacity-40"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <OrchidDecoration className="w-16 sm:w-20 h-auto" variant="left" />
      </motion.div>
      <motion.div
        className="absolute top-16 right-4 sm:top-20 sm:right-8 -z-10 opacity-40"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 0.4, x: 0 }}
        transition={{ delay: 1.7, duration: 0.8 }}
      >
        <OrchidDecoration className="w-14 sm:w-18 h-auto" variant="right" />
      </motion.div>

      {/* Venezuelan flag accent stripe */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1 flex"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{ transformOrigin: "left" }}
      >
        <div className="flex-1 bg-venezuela-yellow opacity-60" />
        <div className="flex-1 bg-venezuela-blue opacity-60" />
        <div className="flex-1 bg-venezuela-red opacity-60" />
      </motion.div>

      {/* 3D Heart */}
      <motion.div
        className="mb-4"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          delay: 0.6,
          type: "spring",
          stiffness: 150,
          damping: 15,
        }}
      >
        <FloatingHeart3D className="w-40 h-40 sm:w-48 sm:h-48" />
      </motion.div>

      {/* Title */}
      <motion.h1
        className="font-serif text-5xl md:text-7xl font-bold text-gradient-gold mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Hola, Albeimar...
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-soft-gold/70 mb-12 max-w-md font-serif italic"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      >
        Tengo algo que preguntarte...
      </motion.p>

      {/* CTA Button */}
      <motion.button
        onClick={onContinue}
        className="text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg cursor-pointer relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #E4007C, #FF6B9D, #C84B7A)",
          boxShadow: "0 0 20px rgba(228, 0, 124, 0.3)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, type: "spring", stiffness: 200 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(228, 0, 124, 0.5)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Lista?
      </motion.button>
    </motion.section>
  );
}
