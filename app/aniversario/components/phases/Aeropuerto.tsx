"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import PhaseShell from "../PhaseShell";
import { HOOK_LINE, LEGS, TRIP } from "../../data/trip";

interface Props {
  onContinue: () => void;
}

const DEST_LETTERS = "ROMA".split("");

function FlapBoard({ ready }: { ready: boolean }) {
  const [letters, setLetters] = useState(["?", "?", "?", "?"]);

  useEffect(() => {
    if (!ready) return;
    const timers: number[] = [];
    DEST_LETTERS.forEach((ch, i) => {
      // Scramble briefly then land
      let tick = 0;
      const scramble = window.setInterval(() => {
        tick++;
        setLetters((prev) => {
          const next = [...prev];
          next[i] =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[
              Math.floor(Math.random() * 26)
            ];
          return next;
        });
        if (tick > 8 + i * 3) {
          clearInterval(scramble);
          setLetters((prev) => {
            const next = [...prev];
            next[i] = ch;
            return next;
          });
        }
      }, 70);
      timers.push(scramble);
    });
    return () => timers.forEach(clearInterval);
  }, [ready]);

  return (
    <div
      className="flex gap-1.5 justify-center my-3"
      aria-label={`Destino: ${letters.join("")}`}
    >
      {letters.map((ch, i) => (
        <motion.span
          key={i}
          className="w-10 h-12 sm:w-12 sm:h-14 flex items-center justify-center font-mono text-2xl sm:text-3xl font-bold bg-warm-black text-soft-gold rounded border border-soft-gold/40"
          initial={{ rotateX: -90 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: 0.8 + i * 0.15, duration: 0.35 }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {ch}
        </motion.span>
      ))}
    </div>
  );
}

function TypeLine({
  text,
  delayMs,
  onDone,
  className,
}: {
  text: string;
  delayMs: number;
  onDone?: () => void;
  className?: string;
}) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          onDone?.();
        }
      }, 42);
    }, delayMs);
    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, [text, delayMs, onDone]);

  return (
    <p className={className}>
      {shown}
      {shown.length < text.length && (
        <span className="animate-pulse opacity-60">|</span>
      )}
    </p>
  );
}

export default function Aeropuerto({ onContinue }: Props) {
  const [assembled, setAssembled] = useState(0);
  const [ready, setReady] = useState(false);
  const [secondLine, setSecondLine] = useState(false);
  const [canAdvance, setCanAdvance] = useState(false);
  const leg = LEGS[0];

  useEffect(() => {
    const timers = [1, 2, 3, 4].map((n, i) =>
      window.setTimeout(() => setAssembled(n), 400 + i * 450),
    );
    const flap = window.setTimeout(() => setReady(true), 2200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(flap);
    };
  }, []);

  const onHookDone = useCallback(() => {
    setSecondLine(true);
    window.setTimeout(() => setCanAdvance(true), 1800);
  }, []);

  const scratchRef = useRef<HTMLCanvasElement>(null);
  const scratching = useRef(false);

  // Optional scratch overlay on flap destination area (extra delight)
  useEffect(() => {
    const canvas = scratchRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#3a2a18";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(212,175,55,0.35)";
    ctx.font = "12px monospace";
    ctx.textAlign = "center";
    ctx.fillText("arrastra para revelar", w / 2, h / 2);
  }, [ready]);

  const scratch = (x: number, y: number) => {
    const canvas = scratchRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x - rect.left, y - rect.top, 18, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={canAdvance}
      hint="Toca para despegar"
      background="linear-gradient(180deg, #1A0A10 0%, #2A1510 50%, #1A0A10 100%)"
    >
      <div className="w-full max-w-md px-5 relative z-10" data-no-advance>
        <motion.div
          className="glass-card rounded-2xl p-5 sm:p-6 shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-between items-start mb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled >= 1 ? 1 : 0 }}
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-soft-gold/70 font-mono">
                Pase de abordar
              </p>
              <p className="font-serif text-lg text-white/90 mt-1">
                Aniversario · {TRIP.year}
              </p>
            </motion.div>
            <motion.div
              className="text-right"
              initial={{ opacity: 0 }}
              animate={{ opacity: assembled >= 1 ? 1 : 0 }}
            >
              <p className="font-mono text-xs text-white/50">Ruta</p>
              <p className="font-mono text-soft-gold font-bold">
                {leg.routeLabel}
              </p>
            </motion.div>
          </div>

          <motion.div
            className="border-t border-dashed border-soft-gold/25 pt-4 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: assembled >= 2 ? 1 : 0 }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
              Pasajera
            </p>
            <p className="font-serif text-2xl text-white">{TRIP.passenger}</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: assembled >= 3 ? 1 : 0 }}
          >
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                Fecha
              </p>
              <p className="font-mono text-sm text-soft-gold">{leg.dateLabel}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                Clase
              </p>
              <p className="font-mono text-sm text-soft-gold">
                Primera (en mi corazón)
              </p>
            </div>
          </motion.div>

          <motion.div
            className="relative mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: assembled >= 4 ? 1 : 0 }}
          >
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono text-center">
              Destino
            </p>
            <div className="relative">
              <FlapBoard ready={ready} />
              {ready && (
                <canvas
                  ref={scratchRef}
                  className="absolute inset-0 w-full h-full rounded cursor-crosshair touch-none"
                  style={{ touchAction: "none" }}
                  onPointerDown={(e) => {
                    scratching.current = true;
                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                    scratch(e.clientX, e.clientY);
                  }}
                  onPointerMove={(e) => {
                    if (!scratching.current) return;
                    scratch(e.clientX, e.clientY);
                  }}
                  onPointerUp={() => {
                    scratching.current = false;
                  }}
                  aria-label="Rasca para revelar el destino"
                  data-no-advance
                />
              )}
            </div>
          </motion.div>
        </motion.div>

        <div className="mt-8 text-center space-y-3 px-2">
          <TypeLine
            text={`"${HOOK_LINE}"`}
            delayMs={2800}
            onDone={onHookDone}
            className="font-serif italic text-base sm:text-lg text-soft-gold/90"
          />
          {secondLine && (
            <TypeLine
              text="...y esta vez nos vamos a Europa."
              delayMs={200}
              className="font-serif text-sm sm:text-base text-white/70"
            />
          )}
        </div>
      </div>
    </PhaseShell>
  );
}
