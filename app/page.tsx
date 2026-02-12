"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import MusicPlayer from "./components/MusicPlayer";
import FloatingHearts from "./components/FloatingHearts";
import CountdownLock from "./components/CountdownLock";
import LandingHero from "./components/LandingHero";
import AskPrompt from "./components/AskPrompt";
import Celebration from "./components/Celebration";
import AdventureReveal from "./components/AdventureReveal";
import PhotoGallery from "./components/PhotoGallery";

type Phase =
  | "countdown"
  | "landing"
  | "ask"
  | "celebration"
  | "adventure"
  | "gallery";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("countdown");

  return (
    <main className="min-h-[100dvh] bg-warm-black relative">
      <MusicPlayer />
      {phase !== "countdown" && <FloatingHearts />}

      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <CountdownLock
            key="countdown"
            onUnlock={() => setPhase("landing")}
          />
        )}

        {phase === "landing" && (
          <LandingHero key="landing" onContinue={() => setPhase("ask")} />
        )}

        {phase === "ask" && (
          <AskPrompt key="ask" onYes={() => setPhase("celebration")} />
        )}

        {phase === "celebration" && (
          <Celebration
            key="celebration"
            onContinue={() => setPhase("adventure")}
          />
        )}

        {phase === "adventure" && (
          <AdventureReveal
            key="adventure"
            onContinue={() => setPhase("gallery")}
          />
        )}

        {phase === "gallery" && <PhotoGallery key="gallery" />}
      </AnimatePresence>
    </main>
  );
}
