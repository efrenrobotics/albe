"use client";

import { useState } from "react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import NoButton from "./NoButton";
import HeartIcon from "./HeartIcon";

const FloatingScene3D = dynamic(() => import("./three/FloatingScene3D"), {
  ssr: false,
});

interface AskPromptProps {
  onYes: () => void;
}

export default function AskPrompt({ onYes }: AskPromptProps) {
  const [flash, setFlash] = useState(false);

  const handleYes = () => {
    setFlash(true);
    setTimeout(() => onYes(), 250);
  };

  return (
    <motion.section
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center relative z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dark gradient background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(180deg, #1A0A10 0%, #4A0E2E 50%, #2D0A1F 100%)",
        }}
      />

      {/* 3D floating scene background */}
      <FloatingScene3D className="absolute inset-0 -z-10 opacity-60" />

      {/* Screen flash on YES */}
      {flash && (
        <motion.div
          className="fixed inset-0 bg-white z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="mb-6"
      >
        <HeartIcon size={60} color="#E4007C" />
      </motion.div>

      <motion.h2
        className="font-serif text-4xl md:text-6xl font-bold text-gradient-gold mb-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        ¿Quieres ser mi San Valentín?
      </motion.h2>

      <motion.p
        className="text-lg text-white/50 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Escoge bien... 😉
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={handleYes}
          className="text-white font-semibold text-xl px-14 py-5 rounded-full shadow-lg cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #E4007C, #FF6B9D, #D4AF37)",
            boxShadow: "0 0 25px rgba(228, 0, 124, 0.4)",
          }}
          whileHover={{
            scale: 1.12,
            boxShadow: "0 0 40px rgba(228, 0, 124, 0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          animate={{
            scale: [1, 1.06, 1],
          }}
          transition={{
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
          }}
        >
          SI! 💕
        </motion.button>

        <NoButton />
      </motion.div>
    </motion.section>
  );
}
