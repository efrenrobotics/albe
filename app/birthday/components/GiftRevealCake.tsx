"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ConfettiExplosion from "react-confetti-explosion";
import dynamic from "next/dynamic";
import TypewriterText from "./TypewriterText";

const FloatingCake3D = dynamic(
  () => import("../../components/three/FloatingCake3D"),
  { ssr: false }
);

interface GiftRevealCakeProps {
  onContinue: () => void;
}

const CONFETTI_COLORS = ["#FFD700", "#D4AF37", "#FFF1A8", "#E4007C", "#FF6B9D"];

export default function GiftRevealCake({ onContinue }: GiftRevealCakeProps) {
  const [flipped, setFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const handleOpen = () => {
    setFlipped(true);
    setShowConfetti(true);
    setTimeout(() => setShowButton(true), 2500);
  };

  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-dvh px-6 text-center relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      {showConfetti && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <ConfettiExplosion
            force={0.6}
            duration={2500}
            particleCount={80}
            colors={CONFETTI_COLORS}
            width={400}
          />
        </div>
      )}

      <div className="relative w-full max-w-md" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="wait">
          {!flipped ? (
            <motion.div
              key="front"
              className="glass-card rounded-2xl p-8 sm:p-10 flex flex-col items-center gap-6 animate-border-glow"
              initial={{ opacity: 0, y: -80, scale: 0.7 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                rotateY: 180,
                scale: 0.85,
                filter: "blur(4px)",
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
              }}
            >
              <div className="text-7xl sm:text-8xl animate-gift-shake">
                🎁
              </div>
              <p className="text-xl sm:text-2xl text-white/80 font-serif">
                Tienes un regalo...
              </p>
              <motion.button
                onClick={handleOpen}
                className="text-white font-semibold text-lg px-8 py-3 rounded-full cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #D4AF37, #FFD700)",
                  boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(255, 215, 0, 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                Abrir regalo
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="back"
              className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-4 relative overflow-hidden"
              initial={{
                rotateY: -180,
                scale: 0.85,
                filter: "blur(4px)",
                opacity: 0,
              }}
              animate={{
                rotateY: 0,
                scale: 1,
                filter: "blur(0px)",
                opacity: 1,
              }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 24,
              }}
            >
              {/* Background glow — pink themed */}
              <div
                className="absolute inset-0 -z-10 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(228,0,124,0.15) 0%, transparent 70%)",
                }}
              />
              <FloatingCake3D className="w-full h-64 sm:h-72 md:h-80" />
              <TypewriterText
                text="Una torta de cumpleanos para ti!"
                delay={0.3}
                className="text-xl sm:text-2xl text-white/90 font-serif"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showButton && (
        <motion.button
          onClick={onContinue}
          className="mt-8 text-white font-semibold text-lg px-10 py-4 rounded-full cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #FFD700, #D4AF37)",
            boxShadow: "0 0 20px rgba(255, 215, 0, 0.4)",
          }}
          initial={{ opacity: 0, scale: 0.5, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Siguiente regalo
        </motion.button>
      )}
    </motion.section>
  );
}
