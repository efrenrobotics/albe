"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";

interface CountdownLockProps {
  onUnlock: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const TARGET_DATE = new Date("2026-02-13T13:15:00-06:00"); // 1:15 PM CST

function calcTimeRemaining(): TimeRemaining {
  const now = Date.now();
  const total = TARGET_DATE.getTime() - now;

  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total,
  };
}

function CountdownParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.3,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(228,0,124,${p.opacity}) 0%, transparent 70%)`,
            ["--duration" as string]: `${p.duration}s`,
            ["--float-opacity" as string]: `${p.opacity}`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: "infinite",
          }}
        />
      ))}
    </div>
  );
}

function CountdownDigit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  const formatted = String(value).padStart(2, "0");
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <span
        className="font-mono text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-mexican-pink tabular-nums"
        style={{
          textShadow:
            "0 0 20px rgba(228, 0, 124, 0.4), 0 0 40px rgba(228, 0, 124, 0.15)",
        }}
      >
        {formatted}
      </span>
      <span className="text-xs sm:text-sm uppercase tracking-[0.2em] text-white/40 mt-2 font-sans">
        {label}
      </span>
    </motion.div>
  );
}

function CountdownSeparator({ delay }: { delay: number }) {
  return (
    <motion.span
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono text-mexican-pink/50 self-start mt-2 sm:mt-3 md:mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      :
    </motion.span>
  );
}

function CountdownInner({ onUnlock }: CountdownLockProps) {
  const searchParams = useSearchParams();
  const [time, setTime] = useState<TimeRemaining>(calcTimeRemaining);
  const [showButton, setShowButton] = useState(false);

  // Dev override
  useEffect(() => {
    if (searchParams.get("bypass") === "true") {
      onUnlock();
    }
  }, [searchParams, onUnlock]);

  // Countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calcTimeRemaining();
      setTime(remaining);

      if (remaining.total <= 0) {
        clearInterval(interval);
        setTimeout(() => setShowButton(true), 1500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const isExpired = time.total <= 0;

  return (
    <motion.section
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-warm-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8 }}
    >
      <CountdownParticles />

      <div className="relative z-10 flex flex-col items-center px-6">
        {/* Title */}
        <motion.h1
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-mexican-pink text-center mb-12 sm:mb-16 animate-glow-pulse"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          Se Vienen Cositas
        </motion.h1>

        {/* Countdown digits */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <CountdownDigit value={time.days} label="dias" delay={0.4} />
          <CountdownSeparator delay={0.5} />
          <CountdownDigit value={time.hours} label="horas" delay={0.6} />
          <CountdownSeparator delay={0.7} />
          <CountdownDigit value={time.minutes} label="minutos" delay={0.8} />
          <CountdownSeparator delay={0.9} />
          <CountdownDigit value={time.seconds} label="segundos" delay={1.0} />
        </div>

        {/* Enter button (shown when expired) */}
        <AnimatePresence>
          {isExpired && showButton && (
            <motion.button
              onClick={onUnlock}
              className="mt-12 sm:mt-16 px-12 py-4 rounded-full text-white font-semibold text-lg sm:text-xl cursor-pointer relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #E4007C, #FF6B9D, #D4AF37)",
              }}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(228, 0, 124, 0.5)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Entrar
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default function CountdownLock({ onUnlock }: CountdownLockProps) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-warm-black flex items-center justify-center">
          <div className="animate-pulse-heart text-mexican-pink text-4xl">
            &#10084;
          </div>
        </div>
      }
    >
      <CountdownInner onUnlock={onUnlock} />
    </Suspense>
  );
}
