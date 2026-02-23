"use client";

import { motion } from "motion/react";

interface LockedIslandProps {
  label?: string;
  delay?: number;
}

export default function LockedIsland({
  label = "???",
  delay = 0,
}: LockedIslandProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center cursor-not-allowed"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 0.4, y: 0 }}
      transition={{ delay, duration: 0.8, type: "spring", stiffness: 80 }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 5 + delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Island blob shape — desaturated */}
        <svg
          viewBox="0 0 200 180"
          className="w-24 h-22 sm:w-28 sm:h-26 md:w-32 md:h-30"
        >
          <path
            d="M100,15 C140,10 185,35 190,75 C195,115 170,155 130,165 C90,175 30,165 15,125 C0,85 60,20 100,15 Z"
            fill="rgba(60,30,45,0.6)"
            stroke="rgba(100,60,80,0.3)"
            strokeWidth="1"
          />
        </svg>

        {/* Lock icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 sm:w-9 sm:h-9 text-white/30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      </motion.div>

      {/* Label */}
      <span className="mt-2 text-xs sm:text-sm font-serif text-white/30 tracking-wide">
        {label}
      </span>
    </motion.div>
  );
}
