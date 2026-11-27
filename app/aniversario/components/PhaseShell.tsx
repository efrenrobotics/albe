"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "motion/react";
import styles from "../journey.module.css";

interface PhaseShellProps {
  children: ReactNode;
  onAdvance?: () => void;
  canAdvance?: boolean;
  hint?: string;
  className?: string;
  background?: string;
}

const CONTROLS = "button, a, input, [data-no-advance]";

export default function PhaseShell({
  children,
  onAdvance,
  canAdvance = true,
  hint = "Toca para continuar",
  className = "",
  background,
}: PhaseShellProps) {
  const touch = useRef<{ x: number; y: number } | null>(null);
  const advanced = useRef(false);

  const advance = () => {
    if (!canAdvance || !onAdvance || advanced.current) return;
    advanced.current = true;
    onAdvance();
  };

  return (
    <motion.section
      className={`${styles.stage} ${className}`}
      style={{ background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
      onClick={(event) => {
        if (!(event.target as Element).closest(CONTROLS)) advance();
      }}
      onTouchStart={(event) => {
        if (event.touches.length !== 1 || (event.target as Element).closest(CONTROLS)) {
          touch.current = null;
          return;
        }
        const { clientX: x, clientY: y } = event.touches[0];
        touch.current = { x, y };
      }}
      onTouchCancel={() => { touch.current = null; }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const point = event.changedTouches[0];
        const dx = touch.current.x - point.clientX;
        const dy = touch.current.y - point.clientY;
        touch.current = null;
        if (dx > 60 || dy > 60) advance();
      }}
    >
      {children}
      {onAdvance && canAdvance && (
        <button className={styles.advance} type="button" onClick={advance}>
          {hint}<span aria-hidden>→</span>
        </button>
      )}
    </motion.section>
  );
}
