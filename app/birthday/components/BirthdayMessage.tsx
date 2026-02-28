"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ConfettiExplosion from "react-confetti-explosion";
import TypewriterText from "./TypewriterText";

interface BirthdayMessageProps {
  onContinue: () => void;
}

const CONFETTI_COLORS = [
  "#FFD700",
  "#D4AF37",
  "#FFF1A8",
  "#FF6B9D",
  "#E4007C",
  "#9B5DE5",
  "#FFCC00",
  "#00247D",
  "#CF142B",
];

export default function BirthdayMessage({ onContinue }: BirthdayMessageProps) {
  const [showButton, setShowButton] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [burst2, setBurst2] = useState(false);
  const [burst3, setBurst3] = useState(false);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const timer1 = setTimeout(() => setBurst2(true), 600);
    const timer2 = setTimeout(() => setBurst3(true), 1200);
    const timer3 = setTimeout(() => setShowButton(true), 4500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{
          background:
            "radial-gradient(circle at center, #3D2B00 0%, #1A0A10 100%)",
        }}
        animate={{
          background:
            "radial-gradient(circle at center, #3D2B00 0%, #2A1A00 50%, #1A0A10 100%)",
        }}
        transition={{ duration: 1.5 }}
      />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <ConfettiExplosion
          force={0.8}
          duration={3000}
          particleCount={isSmallScreen ? 80 : 150}
          colors={CONFETTI_COLORS}
          width={isSmallScreen ? 300 : 600}
        />
      </div>
      {burst2 && (
        <div className="absolute top-1/4 left-1/4">
          <ConfettiExplosion
            force={0.6}
            duration={2500}
            particleCount={isSmallScreen ? 40 : 80}
            colors={CONFETTI_COLORS}
            width={isSmallScreen ? 200 : 400}
          />
        </div>
      )}
      {burst3 && (
        <div className="absolute top-1/4 right-1/4">
          <ConfettiExplosion
            force={0.6}
            duration={2500}
            particleCount={isSmallScreen ? 40 : 80}
            colors={CONFETTI_COLORS}
            width={isSmallScreen ? 200 : 400}
          />
        </div>
      )}

      <motion.h2
        className="font-serif text-5xl sm:text-6xl md:text-8xl font-bold text-gradient-birthday mb-6"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        Feliz Cumple Albeimar!
      </motion.h2>

      <TypewriterText
        text="Te tengo unas sorpresitas..."
        delay={0.8}
        className="text-xl sm:text-2xl md:text-3xl text-white/90 mb-4 font-serif"
      />

      <motion.p
        className="text-lg text-white/50 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        Porque te mereces todo lo bonito del mundo
      </motion.p>

      {showButton && (
        <motion.button
          onClick={onContinue}
          className="text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Ver mis regalos
        </motion.button>
      )}
    </motion.section>
  );
}
