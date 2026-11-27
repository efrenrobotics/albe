"use client";

import { useRef, useCallback, type ReactNode } from "react";
import { motion } from "motion/react";
import AdvanceHint from "./AdvanceHint";

interface PhaseShellProps {
  children: ReactNode;
  onAdvance?: () => void;
  /** When false, taps/swipes won't advance (interaction phases) */
  canAdvance?: boolean;
  hint?: string;
  showHint?: boolean;
  className?: string;
  background?: string;
}

export default function PhaseShell({
  children,
  onAdvance,
  canAdvance = true,
  hint,
  showHint = true,
  className = "",
  background,
}: PhaseShellProps) {
  const startY = useRef<number | null>(null);
  const advanced = useRef(false);

  const tryAdvance = useCallback(() => {
    if (!canAdvance || !onAdvance || advanced.current) return;
    advanced.current = true;
    onAdvance();
  }, [canAdvance, onAdvance]);

  return (
    <motion.section
      className={`fixed inset-0 z-10 flex flex-col items-center justify-center overflow-hidden touch-pan-y ${className}`}
      style={{ background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onClick={(e) => {
        const t = e.target as HTMLElement;
        if (t.closest("button, a, input, [role='button'], [data-no-advance]"))
          return;
        tryAdvance();
      }}
      onTouchStart={(e) => {
        startY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        if (startY.current == null) return;
        const dy = startY.current - e.changedTouches[0].clientY;
        startY.current = null;
        if (dy > 60) tryAdvance();
      }}
      role="region"
    >
      {children}
      <AdvanceHint label={hint} visible={showHint && canAdvance} />
    </motion.section>
  );
}
