"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { noButtonMessages } from "../lib/no-button-messages";

export default function NoButton() {
  const [attempts, setAttempts] = useState(0);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );

  const dodge = useCallback(() => {
    const padding = 60;
    const maxX = window.innerWidth - padding * 2;
    const maxY = window.innerHeight - padding * 2;
    const newX = padding + Math.random() * maxX;
    const newY = padding + Math.random() * maxY;
    setPosition({ x: newX, y: newY });
    setAttempts((prev) => prev + 1);
  }, []);

  const message =
    noButtonMessages[Math.min(attempts, noButtonMessages.length - 1)];

  const getScale = () => {
    if (attempts >= 5) return 0.6;
    if (attempts >= 3) return 0.8;
    return 1;
  };

  if (position) {
    return (
      <motion.button
        className="fixed z-50 bg-white/10 text-white/60 font-mono font-bold rounded-full shadow-lg cursor-pointer whitespace-nowrap px-6 py-3 border border-white/20 backdrop-blur-sm"
        style={{
          left: position.x,
          top: position.y,
          transform: "translate(-50%, -50%)",
        }}
        animate={{ scale: getScale() }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={dodge}
        onMouseEnter={attempts >= 5 ? dodge : undefined}
        onTouchStart={(e) => {
          e.preventDefault();
          dodge();
        }}
      >
        {message}
      </motion.button>
    );
  }

  return (
    <motion.button
      className="bg-white/10 text-white/60 font-semibold text-base px-8 py-3.5 rounded-full shadow-lg cursor-pointer border border-white/20 backdrop-blur-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={dodge}
      onTouchStart={(e) => {
        e.preventDefault();
        dodge();
      }}
    >
      {message}
    </motion.button>
  );
}
