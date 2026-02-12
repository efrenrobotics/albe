"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  // Attempt autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;
    audio
      .play()
      .then(() => setStarted(true))
      .catch(() => {
        // Autoplay blocked — start on first user interaction
        const resume = () => {
          audio.play().then(() => setStarted(true));
          window.removeEventListener("click", resume);
          window.removeEventListener("touchstart", resume);
        };
        window.addEventListener("click", resume, { once: true });
        window.addEventListener("touchstart", resume, { once: true });
      });
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) {
      audio.muted = false;
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  }, [muted]);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/se-vienen-cositas.mp3"
        loop
        preload="auto"
      />
      <motion.button
        onClick={toggle}
        className="fixed top-5 right-5 z-[60] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border border-mexican-pink/30 backdrop-blur-sm"
        style={{
          background: "rgba(228, 0, 124, 0.15)",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: !started
            ? [
                "0 0 0 0 rgba(228, 0, 124, 0)",
                "0 0 0 12px rgba(228, 0, 124, 0.25)",
                "0 0 0 0 rgba(228, 0, 124, 0)",
              ]
            : "none",
        }}
        transition={{
          opacity: { delay: 1.2, duration: 0.4 },
          scale: { delay: 1.2, type: "spring", stiffness: 300 },
          boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
      >
        {muted ? (
          // Muted icon
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-mexican-pink"
          >
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // Playing/unmuted icon
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-mexican-pink"
          >
            <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </motion.button>
    </>
  );
}
