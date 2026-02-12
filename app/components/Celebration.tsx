"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ConfettiExplosion from "react-confetti-explosion";

interface CelebrationProps {
  onContinue: () => void;
}

const CONFETTI_COLORS = [
  "#FF6B9D",
  "#C84B7A",
  "#E63946",
  "#FFD700",
  "#9B5DE5",
  "#FFDAB9",
  "#E4007C",
  "#FFCC00", // Venezuelan yellow
  "#00247D", // Venezuelan blue
  "#CF142B", // Venezuelan red
];

function TypewriterText({
  text,
  delay,
  className,
}: {
  text: string;
  delay: number;
  className?: string;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(startTimeout);
  }, [text, delay]);

  return <p className={className}>{displayed}<span className="animate-pulse">|</span></p>;
}

export default function Celebration({ onContinue }: CelebrationProps) {
  const [showButton, setShowButton] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [burst2, setBurst2] = useState(false);
  const [burst3, setBurst3] = useState(false);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 640);
    const timer1 = setTimeout(() => setBurst2(true), 600);
    const timer2 = setTimeout(() => setBurst3(true), 1200);
    const timer3 = setTimeout(() => setShowButton(true), 3500);
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
      {/* Radial explosion background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{
          background:
            "radial-gradient(circle at center, #4A0E2E 0%, #1A0A10 100%)",
        }}
        animate={{
          background:
            "radial-gradient(circle at center, #4A0E2E 0%, #2D0A1F 50%, #1A0A10 100%)",
        }}
        transition={{ duration: 1.5 }}
      />

      {/* Multi-burst confetti */}
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
        className="font-serif text-6xl md:text-8xl font-bold text-gradient-gold mb-6"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        YAY!
      </motion.h2>

      <TypewriterText
        text="Sabía que me dirías que sí!"
        delay={0.6}
        className="text-2xl md:text-3xl text-white/90 mb-4 font-serif"
      />

      <motion.p
        className="text-lg text-white/50 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Soy el más feliz del mundo mundial 💖
      </motion.p>

      {showButton && (
        <motion.button
          onClick={onContinue}
          className="text-white font-semibold text-lg px-10 py-4 rounded-full shadow-lg cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #9B5DE5, #DA70D6, #E4007C)",
            boxShadow: "0 0 20px rgba(155, 93, 229, 0.4)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(155, 93, 229, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Quieres ver qué sigue???
        </motion.button>
      )}
    </motion.section>
  );
}
