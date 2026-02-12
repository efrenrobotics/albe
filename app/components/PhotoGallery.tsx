"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import OrchidDecoration from "./svg/OrchidDecoration";

interface Photo {
  src: string;
  caption: string;
}

const PHOTOS: Photo[] = [
  { src: "/photos/brazo.jpg", caption: "Nuestra primera aventura" },
  {
    src: "/photos/cangrejo.JPG",
    caption: "Esa vez que nos reimos demasiado",
  },
  { src: "/photos/rooftop.jpg", caption: "Mi vista favorita (eres tu)" },
  { src: "/photos/botas.JPG", caption: "Buenos recuerdos" },
  { src: "/photos/navidad.jpg", caption: "Twins" },
  { src: "/photos/vaqueros.JPG", caption: "Mas por venir... 💕" },
];

function PhotoCard({ photo, index }: { photo: Photo; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="rounded-xl overflow-hidden relative group cursor-pointer"
      style={{
        border: "2px solid rgba(212, 175, 55, 0.25)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
      }}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.9 }
      }
      transition={{
        delay: index * 0.12,
        type: "spring",
        stiffness: 120,
        damping: 15,
      }}
      whileHover={{
        scale: 1.05,
        borderColor: "rgba(212, 175, 55, 0.6)",
        boxShadow: "0 8px 30px rgba(212, 175, 55, 0.15)",
      }}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={photo.src}
          alt={photo.caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      {/* Caption overlay on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p className="text-sm text-white/90 font-serif italic text-center">
          {photo.caption}
        </p>
      </div>
      {/* Always-visible subtle caption for mobile */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 group-hover:opacity-0 transition-opacity duration-300 sm:hidden">
        <p className="text-xs text-white/70 font-serif italic text-center">
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
}

export default function PhotoGallery() {
  return (
    <motion.section
      className="flex flex-col items-center min-h-[100dvh] px-6 py-20 relative z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Dark warm gradient background */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(180deg, #1A0A10 0%, #2D0A1F 30%, #4A0E2E 60%, #2D0A1F 100%)",
        }}
      />

      {/* Orchid accent */}
      <motion.div
        className="absolute top-4 right-4 opacity-25"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ delay: 1 }}
      >
        <OrchidDecoration className="w-16 h-auto" variant="right" />
      </motion.div>

      <motion.h2
        className="font-serif text-4xl md:text-5xl font-bold text-gradient-gold mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Algunos de mis momentos favoritos contigo
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6 max-w-3xl w-full">
        {PHOTOS.map((photo, i) => (
          <PhotoCard key={i} photo={photo} index={i} />
        ))}
      </div>

      <motion.p
        className="text-2xl font-serif text-gradient-gold mt-16 text-center italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Feliz Dia de los Enamorados Albeimar 💖
      </motion.p>

      {/* Venezuelan flag accent stripe at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 flex"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        style={{ transformOrigin: "center" }}
      >
        <div className="flex-1 bg-venezuela-yellow opacity-40" />
        <div className="flex-1 bg-venezuela-blue opacity-40" />
        <div className="flex-1 bg-venezuela-red opacity-40" />
      </motion.div>
    </motion.section>
  );
}
