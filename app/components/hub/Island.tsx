"use client";

import Link from "next/link";
import { motion } from "motion/react";

interface IslandProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  glowColor: string;
  blobColor: string;
  delay?: number;
}

export default function Island({
  href,
  label,
  icon,
  glowColor,
  blobColor,
  delay = 0,
}: IslandProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, type: "spring", stiffness: 80 }}
    >
      <Link href={href} className="group flex flex-col items-center gap-3">
        <motion.div
          className="relative cursor-pointer"
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 4 + delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.08 }}
        >
          {/* Glow effect */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
            style={{ background: glowColor, transform: "scale(1.3)" }}
          />

          {/* Island blob shape */}
          <svg
            viewBox="0 0 200 180"
            className="w-36 h-32 sm:w-44 sm:h-40 md:w-52 md:h-48 relative z-10"
          >
            <defs>
              <linearGradient
                id={`island-grad-${label}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={blobColor} stopOpacity="0.9" />
                <stop offset="100%" stopColor={blobColor} stopOpacity="0.5" />
              </linearGradient>
              <filter id={`shadow-${label}`}>
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="6"
                  floodColor={glowColor}
                  floodOpacity="0.3"
                />
              </filter>
            </defs>
            <path
              d="M100,15 C140,10 185,35 190,75 C195,115 170,155 130,165 C90,175 30,165 15,125 C0,85 60,20 100,15 Z"
              fill={`url(#island-grad-${label})`}
              filter={`url(#shadow-${label})`}
            />
          </svg>

          {/* Icon overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center text-4xl sm:text-5xl">
            {icon}
          </div>
        </motion.div>

        {/* Label */}
        <span className="text-sm sm:text-base font-serif font-semibold text-white/90 tracking-wide group-hover:text-white transition-colors">
          {label}
        </span>
      </Link>
    </motion.div>
  );
}
