"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import PhaseShell from "../PhaseShell";
import { CITIES } from "../../data/trip";
import styles from "../../journey.module.css";

const PHOTOS = [
  { src: "/photos/cita.JPG", caption: "Qué fácil quererte." },
  { src: "/photos/aniversario/01-flores.png", caption: "Colorcito pa’ el alma." },
  { src: "/photos/aniversario/02-estadio.jpg", caption: "Esa energía contigo." },
  { src: "/photos/aniversario/03-sombreros.jpg", caption: "Risa fácil, siempre." },
  { src: "/photos/aniversario/04-viva-mexico.png", caption: "Corazón a mil." },
  { src: "/photos/aniversario/05-abrazo.png", caption: "Mi lugar seguro." },
  { src: "/photos/drinks.jpg", caption: "Me encanta ser nosotros." },
  { src: "/photos/aniversario/06-vina.png", caption: "Un brindis por nosotros." },
  { src: "/photos/aniversario/07-pinata.png", caption: "Fiesta en los ojos." },
  { src: "/photos/aniversario/08-bus.jpg", caption: "Contigo, cualquier camino." },
  { src: "/photos/aniversario/09-playa.jpg", caption: "Calma que se siente." },
];

const FUTURE = [CITIES.roma.name, CITIES.florencia.name, CITIES.viena.name];

export default function Recuerdos({ onContinue }: { onContinue: () => void }) {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const photo = PHOTOS[index];
  const next = () => setIndex((value) => Math.min(PHOTOS.length, value + 1));

  return (
    <PhaseShell onAdvance={onContinue} canAdvance={!photo} hint="Abrir el final">
      <div className="w-full max-w-lg text-center">
        <h2 className="font-serif text-4xl sm:text-6xl leading-tight">Un año de nosotros</h2>
        <AnimatePresence mode="wait">
          {photo ? <motion.button
            key="stack"
            type="button"
            className={styles.photoStack}
            aria-label={`${photo.caption} Siguiente foto (${index + 1} de ${PHOTOS.length})`}
            onClick={next}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={photo.src}
                className={styles.photo}
                initial={{ opacity: 0, transform: reduced ? undefined : "translateX(-15px) rotate(-5deg)" }}
                animate={{ opacity: 1, transform: reduced ? undefined : "translateX(0) rotate(-2deg)" }}
                exit={{ opacity: 0, transform: reduced ? undefined : "translateX(76px) rotate(11deg)" }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <span className={styles.photoImage}>
                  <Image src={photo.src} alt="" fill sizes="(min-width: 640px) 280px, 255px" />
                </span>
                <span className="mx-auto mt-3 block font-serif italic">{photo.caption}</span>
              </motion.span>
            </AnimatePresence>
          </motion.button> : <motion.div key="future" className="mt-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-3 gap-2.5 sm:gap-5">
              {FUTURE.map((name) => (
                <figure key={name} className={styles.futurePhoto}>
                  <div className="aspect-square rounded-[2px] border border-dashed border-warm-black/55 bg-warm-black/10" />
                  <figcaption className="mt-2 font-serif italic text-xs sm:text-sm">{name}</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-8 font-serif italic text-firenze-cream">Las que nos faltan por tomar.</p>
          </motion.div>}
        </AnimatePresence>
        {photo && <p className="mt-5 font-mono text-xs text-firenze-cream">Toca la foto · {index + 1}/{PHOTOS.length}</p>}
      </div>
    </PhaseShell>
  );
}
