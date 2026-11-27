"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PhaseShell from "../PhaseShell";
import RomaSkyline from "../svg/RomaSkyline";
import { CITIES } from "../../data/trip";
import { aniversarioAudio } from "../../lib/audio";

interface Props {
  onContinue: () => void;
}

export default function Roma({ onContinue }: Props) {
  const [tossed, setTossed] = useState(false);
  const [wish, setWish] = useState(false);
  const [canAdvance, setCanAdvance] = useState(false);
  const coinRef = useRef<HTMLButtonElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const [coinPos, setCoinPos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState(0);

  useEffect(() => {
    aniversarioAudio.play("bells");
    void aniversarioAudio.playAmbient(CITIES.roma.ambient);
    return () => aniversarioAudio.stopLoops();
  }, []);

  const finishToss = () => {
    if (tossed) return;
    setTossed(true);
    setCoinPos({ x: 0, y: -120 });
    aniversarioAudio.play("splash");
    setRipples(3);
    window.setTimeout(() => setWish(true), 600);
    window.setTimeout(() => setCanAdvance(true), 2200);
  };

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={canAdvance}
      hint="Toca para seguir el viaje"
      background="linear-gradient(180deg, #2A1510 0%, #4a2818 40%, #C45C26 100%)"
    >
      <div className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none">
        <RomaSkyline className="w-full h-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 max-w-lg w-full -mt-16">
        <motion.h2
          className="font-serif text-5xl sm:text-7xl font-bold text-roma-gold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Roma
        </motion.h2>
        <motion.p
          className="font-mono text-sm text-roma-ochre/90 mt-2 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {CITIES.roma.dateLabel}
        </motion.p>

        {/* Trevi fountain interaction */}
        <div
          className="relative mt-10 w-full max-w-xs h-56 flex flex-col items-center"
          data-no-advance
        >
          <motion.div
            className="absolute bottom-8 w-48 h-20 rounded-[50%] border border-roma-gold/30"
            style={{
              background:
                "radial-gradient(ellipse, rgba(100,160,200,0.35), rgba(40,80,120,0.5))",
            }}
            aria-hidden
          >
            {Array.from({ length: ripples }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-[50%] border border-white/40"
                initial={{ scale: 0.3, opacity: 0.7 }}
                animate={{ scale: 1.6 + i * 0.2, opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.15 }}
              />
            ))}
          </motion.div>

          {!tossed ? (
            <motion.button
              ref={coinRef}
              type="button"
              className="absolute bottom-28 w-12 h-12 rounded-full cursor-grab active:cursor-grabbing touch-none z-20"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #F5D76E, #D4AF37 60%, #8a7020)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                x: coinPos.x,
                y: coinPos.y,
              }}
              aria-label="Lanza una moneda a la Fontana di Trevi"
              data-no-advance
              drag
              dragConstraints={{ left: -80, right: 80, top: -160, bottom: 40 }}
              dragElastic={0.2}
              onDragStart={() => {
                drag.current = { x: 0, y: 0 };
              }}
              onDrag={(_, info) => {
                drag.current = { x: info.offset.x, y: info.offset.y };
              }}
              onDragEnd={(_, info) => {
                if (info.offset.y < -40 || info.velocity.y < -200) {
                  finishToss();
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                finishToss();
              }}
              whileTap={{ scale: 0.95 }}
            />
          ) : (
            <motion.div
              className="absolute bottom-24 w-8 h-8 rounded-full opacity-0"
              initial={{ y: -100, opacity: 1, scale: 1 }}
              animate={{ y: 20, opacity: 0, scale: 0.4 }}
              transition={{ duration: 0.55, ease: "easeIn" }}
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #F5D76E, #D4AF37)",
              }}
            />
          )}

          {!tossed && (
            <p className="absolute bottom-0 text-xs text-white/50 text-center">
              Arrastra o toca la moneda
            </p>
          )}
        </div>

        <AnimatePresence>
          {wish && (
            <motion.p
              className="mt-4 font-serif italic text-center text-firenze-cream text-base sm:text-lg max-w-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Pide un deseo... (el mío ya se cumplió: tú)
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </PhaseShell>
  );
}
