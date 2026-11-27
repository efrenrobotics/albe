"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";
import { aniversarioAudio } from "../../lib/audio";
import { LEGS } from "../../data/trip";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  onContinue: () => void;
}

function Hills({ speed, reduced }: { speed: number; reduced: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[0, 1].map((copy) => (
        <motion.div
          key={copy}
          className="absolute inset-y-0 flex"
          style={{ width: "200%" }}
          animate={
            reduced
              ? { x: "0%" }
              : { x: copy === 0 ? ["0%", "-50%"] : ["50%", "0%"] }
          }
          transition={
            reduced
              ? { duration: 0 }
              : { duration: speed, repeat: Infinity, ease: "linear" }
          }
        >
          <svg
            viewBox="0 0 1200 400"
            className="w-1/2 h-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id={`sky-${copy}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6B8FCE" />
                <stop offset="60%" stopColor="#E8B84A" />
                <stop offset="100%" stopColor="#C45C26" />
              </linearGradient>
            </defs>
            <rect width="1200" height="400" fill={`url(#sky-${copy})`} />
            <path
              d="M0 280 Q150 200 300 260 T600 240 T900 270 T1200 250 L1200 400 L0 400 Z"
              fill="#3d5c2e"
            />
            <path
              d="M0 320 Q200 280 400 310 T800 300 T1200 320 L1200 400 L0 400 Z"
              fill="#2a4020"
            />
            {/* Cypress trees */}
            {[80, 220, 380, 520, 700, 860, 1020].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy="270" rx="10" ry="40" fill="#1a2e14" />
                <rect x={x - 3} y="270" width="6" height="30" fill="#1a2e14" />
              </g>
            ))}
          </svg>
          <svg
            viewBox="0 0 1200 400"
            className="w-1/2 h-full"
            preserveAspectRatio="none"
            aria-hidden
          >
            <rect width="1200" height="400" fill={`url(#sky-${copy})`} />
            <path
              d="M0 280 Q150 200 300 260 T600 240 T900 270 T1200 250 L1200 400 L0 400 Z"
              fill="#3d5c2e"
            />
            <path
              d="M0 320 Q200 280 400 310 T800 300 T1200 320 L1200 400 L0 400 Z"
              fill="#2a4020"
            />
            {[100, 260, 420, 580, 740, 900, 1060].map((x) => (
              <g key={x}>
                <ellipse cx={x} cy="265" rx="11" ry="42" fill="#1a2e14" />
                <rect x={x - 3} y="265" width="6" height="35" fill="#1a2e14" />
              </g>
            ))}
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default function Tren({ onContinue }: Props) {
  const [canAdvance, setCanAdvance] = useState(false);
  const [arc, setArc] = useState(0);
  const reduced = useReducedMotion();
  const leg = LEGS[1];

  useEffect(() => {
    aniversarioAudio.stopAmbient();
    aniversarioAudio.play("train");
    const t = window.setTimeout(() => setCanAdvance(true), 3500);
    const a = window.setInterval(() => {
      setArc((v) => Math.min(1, v + 0.02));
    }, 50);
    return () => {
      clearTimeout(t);
      clearInterval(a);
      aniversarioAudio.stopLoops();
    };
  }, []);

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={canAdvance}
      hint="Toca para llegar a Firenze"
      background="#1a1020"
    >
      {/* Train window frame */}
      <div className="relative w-[min(92vw,520px)] h-[min(62vh,420px)] rounded-3xl overflow-hidden border-4 border-warm-black/80 shadow-2xl">
        <Hills speed={18} reduced={reduced} />

        {/* Window reflection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
          }}
        />

        {/* Corner map arc */}
        <div className="absolute top-3 right-3 w-24 h-24 rounded-full bg-warm-black/50 backdrop-blur-sm border border-soft-gold/20 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="rgba(212,175,55,0.2)"
              strokeWidth="1"
            />
            <path
              d="M25 60 Q50 20 75 45"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2"
              strokeDasharray="80"
              strokeDashoffset={80 * (1 - arc)}
              strokeLinecap="round"
            />
            <circle cx="25" cy="60" r="3" fill="#D4AF37" />
            <circle cx="75" cy="45" r="3" fill="#D4AF37" />
          </svg>
        </div>
      </div>

      <motion.p
        className="mt-6 font-mono text-soft-gold tracking-[0.25em] text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {leg.routeLabel}
      </motion.p>
      <motion.p
        className="mt-2 font-serif text-white/60 text-sm italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Toscana pasando por la ventana...
      </motion.p>
    </PhaseShell>
  );
}
