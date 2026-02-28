"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import MusicPlayer from "../components/MusicPlayer";
import BirthdayCountdown from "./components/BirthdayCountdown";
import BirthdayParticles from "./components/BirthdayParticles";
import BirthdayMessage from "./components/BirthdayMessage";
import GiftRevealCake from "./components/GiftRevealCake";
import GiftRevealFlowers from "./components/GiftRevealFlowers";
import GiftRevealConcert from "./components/GiftRevealConcert";
import VideoFinale from "./components/VideoFinale";

type Phase =
  | "countdown"
  | "message"
  | "cake"
  | "flowers"
  | "concert"
  | "video";

export default function BirthdayPage() {
  const [phase, setPhase] = useState<Phase>("countdown");

  return (
    <main className="min-h-[100dvh] bg-warm-black relative">
      {phase !== "countdown" && <MusicPlayer src="/audio/las-mananitas.mp3" />}
      {phase !== "countdown" && <BirthdayParticles />}

      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <BirthdayCountdown
            key="countdown"
            onUnlock={() => setPhase("message")}
          />
        )}

        {phase === "message" && (
          <BirthdayMessage
            key="message"
            onContinue={() => setPhase("cake")}
          />
        )}

        {phase === "cake" && (
          <GiftRevealCake
            key="cake"
            onContinue={() => setPhase("flowers")}
          />
        )}

        {phase === "flowers" && (
          <GiftRevealFlowers
            key="flowers"
            onContinue={() => setPhase("concert")}
          />
        )}

        {phase === "concert" && (
          <GiftRevealConcert
            key="concert"
            onContinue={() => setPhase("video")}
          />
        )}

        {phase === "video" && <VideoFinale key="video" />}
      </AnimatePresence>
    </main>
  );
}
