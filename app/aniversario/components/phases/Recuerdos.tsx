"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import PhaseShell from "../PhaseShell";

interface Props {
  onContinue: () => void;
}

/** 9 filled polaroids from public/photos/aniversario/ — feeling captions only */
const POLAROIDS = [
  {
    src: "/photos/aniversario/01-flores.png",
    caption: "Colorcito pa' el alma",
  },
  {
    src: "/photos/aniversario/02-estadio.jpg",
    caption: "Esa energia contigo",
  },
  {
    src: "/photos/aniversario/03-sombreros.jpg",
    caption: "Risa facil, siempre",
  },
  {
    src: "/photos/aniversario/04-viva-mexico.png",
    caption: "Corazon a mil",
  },
  {
    src: "/photos/aniversario/05-abrazo.png",
    caption: "Mi lugar seguro",
  },
  {
    src: "/photos/aniversario/06-vina.png",
    caption: "Un brindis por nosotros",
  },
  {
    src: "/photos/aniversario/07-pinata.png",
    caption: "Fiesta en los ojos",
  },
  {
    src: "/photos/aniversario/08-bus.jpg",
    caption: "Contigo, cualquier camino",
  },
  {
    src: "/photos/aniversario/09-playa.jpg",
    caption: "Calma que se siente",
  },
];

const FUTURE = [
  { label: "Roma", tip: -8 },
  { label: "Florencia", tip: 4 },
  { label: "Viena", tip: -3 },
];

export default function Recuerdos({ onContinue }: Props) {
  const [index, setIndex] = useState(0);
  const [showFuture, setShowFuture] = useState(false);

  const next = () => {
    if (index < POLAROIDS.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setShowFuture(true);
    }
  };

  return (
    <PhaseShell
      onAdvance={onContinue}
      canAdvance={showFuture}
      hint="Toca para el final"
      showHint={showFuture}
      background="linear-gradient(180deg, #1A0A10 0%, #2D0A1F 50%, #1A0A10 100%)"
    >
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-md">
        <motion.h2
          className="font-serif text-3xl sm:text-4xl font-bold text-gradient-gold text-center mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Un año de nosotros
        </motion.h2>

        <div className="relative w-64 h-80 sm:w-72 sm:h-96" data-no-advance>
          <AnimatePresence mode="popLayout">
            {!showFuture &&
              POLAROIDS.slice(index)
                .reverse()
                .map((p, i, arr) => {
                  const depth = arr.length - 1 - i;
                  return (
                    <motion.button
                      key={p.src}
                      type="button"
                      className="absolute inset-0 bg-[#f5efe3] p-3 pb-14 shadow-xl cursor-pointer text-left"
                      style={{
                        rotate: (depth - 1) * 3,
                        zIndex: 10 - depth,
                      }}
                      initial={{ opacity: 0, y: 40, scale: 0.9 }}
                      animate={{
                        opacity: 1,
                        y: depth * 4,
                        scale: 1 - depth * 0.03,
                        x: depth * 6,
                      }}
                      exit={{ x: 200, opacity: 0, rotate: 15 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 22,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        next();
                      }}
                      aria-label={`Foto: ${p.caption}. Toca para la siguiente.`}
                      data-no-advance
                    >
                      <img
                        src={p.src}
                        alt={p.caption}
                        className="w-full h-[78%] object-cover"
                      />
                      <p className="mt-3 font-serif italic text-sm text-warm-black/80 text-center">
                        {p.caption}
                      </p>
                    </motion.button>
                  );
                })}
          </AnimatePresence>

          {showFuture && (
            <div className="flex gap-3 justify-center items-end h-full">
              {FUTURE.map((f, i) => (
                <motion.div
                  key={f.label}
                  className="w-24 sm:w-28 bg-[#f5efe3]/20 border border-dashed border-soft-gold/40 p-2 pb-8 flex flex-col items-center"
                  style={{ rotate: f.tip }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i }}
                >
                  <div className="w-full aspect-square bg-white/5 flex items-center justify-center">
                    <span className="text-soft-gold/50 text-2xl">+</span>
                  </div>
                  <p className="mt-3 font-serif text-xs text-soft-gold text-center">
                    {f.label}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {showFuture && (
          <motion.p
            className="mt-8 font-serif italic text-white/60 text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Las que nos faltan por tomar.
          </motion.p>
        )}

        {!showFuture && (
          <p className="mt-6 text-xs text-white/40 tracking-wide">
            Toca la foto · {index + 1}/{POLAROIDS.length}
          </p>
        )}
      </div>
    </PhaseShell>
  );
}
