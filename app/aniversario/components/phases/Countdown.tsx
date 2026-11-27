"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { UNLOCK_DATE } from "../../data/trip";
import { makeParticles } from "../../lib/seeded";

const PARTICLES = makeParticles(28, 42);

interface Props {
  onUnlock: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calcTimeRemaining(): TimeRemaining {
  const total = UNLOCK_DATE.getTime() - Date.now();
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

function Particles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle, rgba(212,175,55,${p.opacity}) 0%, transparent 70%)`,
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

function Digit({
  value,
  label,
  delay,
}: {
  value: number;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <span
        className="font-mono text-5xl sm:text-7xl md:text-8xl font-bold tabular-nums text-soft-gold"
        style={{
          textShadow:
            "0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.15)",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mt-2">
        {label}
      </span>
    </motion.div>
  );
}

function Inner({ onUnlock }: Props) {
  const searchParams = useSearchParams();
  const [time, setTime] = useState<TimeRemaining>(calcTimeRemaining);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (searchParams.get("bypass") === "true") onUnlock();
  }, [searchParams, onUnlock]);

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
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <Particles />
      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.h1
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-soft-gold text-center mb-10 sm:mb-14 animate-glow-pulse-yellow"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          Un año
        </motion.h1>

        <div className="flex items-center gap-2 sm:gap-4 md:gap-5">
          <Digit value={time.days} label="dias" delay={0.4} />
          <motion.span
            className="text-3xl sm:text-5xl font-mono text-soft-gold/50 self-start mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            :
          </motion.span>
          <Digit value={time.hours} label="horas" delay={0.6} />
          <motion.span
            className="text-3xl sm:text-5xl font-mono text-soft-gold/50 self-start mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            :
          </motion.span>
          <Digit value={time.minutes} label="minutos" delay={0.8} />
          <motion.span
            className="text-3xl sm:text-5xl font-mono text-soft-gold/50 self-start mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            :
          </motion.span>
          <Digit value={time.seconds} label="segundos" delay={1.0} />
        </div>

        <AnimatePresence>
          {isExpired && showButton && (
            <motion.button
              onClick={onUnlock}
              className="mt-12 sm:mt-16 min-h-11 px-12 py-4 rounded-full text-warm-black font-semibold text-lg cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #E8B84A, #D4AF37)",
              }}
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
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

export default function Countdown({ onUnlock }: Props) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 z-50 bg-warm-black flex items-center justify-center">
          <div className="animate-pulse text-soft-gold text-4xl">∞</div>
        </div>
      }
    >
      <Inner onUnlock={onUnlock} />
    </Suspense>
  );
}
