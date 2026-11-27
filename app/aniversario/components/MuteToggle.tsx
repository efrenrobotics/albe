"use client";

import { useState, useCallback } from "react";
import { aniversarioAudio } from "../lib/audio";

export default function MuteToggle() {
  const [muted, setMuted] = useState(() => aniversarioAudio.isMuted());

  const toggle = useCallback(() => {
    const next = !muted;
    setMuted(next);
    aniversarioAudio.setMuted(next);
  }, [muted]);

  return (
    <button
      type="button"
      onClick={toggle}
      className="fixed top-[max(1.25rem,env(safe-area-inset-top))] right-[max(1.25rem,env(safe-area-inset-right))] z-[60] size-12 rounded-full grid place-items-center cursor-pointer border border-mexican-pink/50 bg-[#351824] active:scale-95 transition-transform"
      aria-pressed={muted}
      aria-label={muted ? "Activar sonido" : "Silenciar"}
    >
      {muted ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-valentine-pink"
        >
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-valentine-pink"
        >
          <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
