"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { aniversarioAudio } from "../lib/audio";

export default function MuteToggle() {
  const [muted, setMuted] = useState(false);

  const toggle = useCallback(() => {
    const next = !muted;
    setMuted(next);
    aniversarioAudio.setMuted(next);
  }, [muted]);

  return (
    <motion.button
      onClick={toggle}
      className="fixed top-5 right-5 z-[60] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border border-soft-gold/30 backdrop-blur-sm"
      style={{ background: "rgba(212, 175, 55, 0.15)" }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { delay: 0.4, duration: 0.4 },
        scale: { delay: 0.4, type: "spring", stiffness: 300 },
      }}
      whileTap={{ scale: 0.9 }}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
    >
      {muted ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-soft-gold"
        >
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-soft-gold"
        >
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </motion.button>
  );
}
