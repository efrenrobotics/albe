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

export default function VueloViena({ onContinue }: Props) {
  const [canAdvance, setCanAdvance] = useState(false);
  const [arc, setArc] = useState(0);
  const reduced = useReducedMotion();
  const leg = LEGS[2];

  useEffect(() => {
    aniversarioAudio.stopAmbient();
    aniversarioAudio.play("whoosh");
    const t = window.setTimeout(() => setCanAdvance(true), 2800);
    const a = window.setInterval(() => {
      setArc((v) => Math.min(1, v + 0.025));
    }, 40);
    return () => {
      clearTimeout(t);
      clearInterval(a);
    };
  }, []);

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={canAdvance}
      hint="Toca para aterrizar en Wien"
      background="linear-gradient(180deg, #4a3060 0%, #6B8FCE 40%, #c8d8e8 100%)"
    >
      {/* Clouds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/40 blur-md"
            style={{
              width: 120 + i * 40,
              height: 40 + i * 10,
              top: `${15 + i * 18}%`,
            }}
            animate={
              reduced
                ? { x: "30vw" }
                : { x: ["-20vw", "110vw"] }
            }
            transition={
              reduced
                ? { duration: 0 }
                : {
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.8,
                  }
            }
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.p
          className="font-mono text-white tracking-[0.3em] text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {leg.routeLabel}
        </motion.p>

        <svg
          viewBox="0 0 280 80"
          className="w-64 h-20 mt-8"
          aria-label="Arco Florencia a Viena"
        >
          <path
            d="M20 60 Q140 10 260 40"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="2"
          />
          <path
            d="M20 60 Q140 10 260 40"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="2.5"
            strokeDasharray="280"
            strokeDashoffset={280 * (1 - arc)}
            strokeLinecap="round"
          />
          <circle cx="20" cy="60" r="5" fill="#D4AF37" />
          <circle cx="260" cy="40" r="5" fill="#D4AF37" />
          <text
            x="20"
            y="78"
            fill="white"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            FLR
          </text>
          <text
            x="260"
            y="30"
            fill="white"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            VIE
          </text>
        </svg>

        <motion.p
          className="mt-6 font-serif text-white/70 italic text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          El aire se enfría...
        </motion.p>
      </div>
    </PhaseShell>
  );
}
