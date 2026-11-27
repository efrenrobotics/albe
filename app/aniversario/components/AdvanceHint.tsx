"use client";

import { motion } from "motion/react";

export default function AdvanceHint({
  label = "Toca para continuar",
  visible = true,
}: {
  label?: string;
  visible?: boolean;
}) {
  if (!visible) return null;
  return (
    <motion.p
      className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-0 right-0 text-center text-xs sm:text-sm tracking-[0.2em] uppercase text-white/35 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.25, 0.55, 0.25] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      {label}
    </motion.p>
  );
}
