"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { PHASE_ORDER, UNLOCK_DATE, type Phase } from "./data/trip";
import { AniversarioAudio } from "./lib/audio";
import MuteToggle from "./components/MuteToggle";
import Countdown from "./components/phases/Countdown";
import Abrir from "./components/phases/Abrir";
import GlobeBackdrop from "./components/GlobeBackdrop";
import styles from "./journey.module.css";

const Aeropuerto = dynamic(() => import("./components/phases/Aeropuerto"));
const Despegue = dynamic(() => import("./components/phases/Despegue"));
const Roma = dynamic(() => import("./components/phases/Roma"));
const Tren = dynamic(() => import("./components/phases/Tren"));
const Florencia = dynamic(() => import("./components/phases/Florencia"));
const VueloViena = dynamic(() => import("./components/phases/VueloViena"));
const Viena = dynamic(() => import("./components/phases/Viena"));
const Recuerdos = dynamic(() => import("./components/phases/Recuerdos"));
const Final = dynamic(() => import("./components/phases/Final"));

function isPhase(value: string | null): value is Phase {
  return PHASE_ORDER.some((phase) => phase === value);
}

const THEMES: Record<Phase, string> = {
  countdown: "tarmac",
  abrir: "tarmac",
  aeropuerto: "terminal",
  despegue: "altitude",
  roma: "roma",
  tren: "roma",
  florencia: "firenze",
  "vuelo-viena": "wien",
  viena: "wien",
  recuerdos: "terminal",
  final: "altitude",
};

function AniversarioInner({ availableAudio }: { availableAudio: string[] }) {
  const searchParams = useSearchParams();
  const bypass = searchParams.get("bypass") === "true";
  const preview = searchParams.get("phase");
  const [phase, setPhase] = useState<Phase>(
    () => bypass && isPhase(preview) ? preview : "countdown",
  );
  const [audio] = useState(() => new AniversarioAudio());
  const [opened, setOpened] = useState(false);
  const [completedFlight, setCompletedFlight] = useState(false);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    if (phase !== "countdown") return;
    const check = () => {
      if (bypass || Date.now() >= UNLOCK_DATE.getTime()) setPhase("abrir");
    };
    check();
    const timer = window.setInterval(check, 250);
    return () => clearInterval(timer);
  }, [bypass, phase]);

  const disposal = useRef<number | undefined>(undefined);
  useEffect(() => {
    window.clearTimeout(disposal.current);
    // Suspense hydration and Strict Mode can reconnect effects on the same journey.
    return () => {
      disposal.current = window.setTimeout(() => audio.dispose(), 0);
    };
  }, [audio]);

  const advance = () => {
    setPhase(PHASE_ORDER[PHASE_ORDER.indexOf(phase) + 1] ?? phase);
  };

  const open = () => {
    audio.unlock(availableAudio);
    audio.startMusic();
    setOpened(true);
    advance();
  };

  const replay = () => {
    audio.reset();
    setOpened(false);
    setCompletedFlight(false);
    setPhase("abrir");
  };

  const finishFlight = useCallback(() => setCompletedFlight(true), []);
  const scene = phase === "despegue" || phase === "final" ? phase : null;

  return (
    <main className={styles.journey} data-theme={THEMES[phase]}>
      <div className={styles.atmosphere} aria-hidden />
      <GlobeBackdrop scene={scene} reduced={reduced} onFlightComplete={finishFlight} />
      {opened && <MuteToggle audio={audio} />}

      <AnimatePresence mode="wait">
        {phase === "countdown" && <Countdown key={phase} />}
        {phase === "abrir" && <Abrir key={phase} onContinue={open} />}
        {phase === "aeropuerto" && <Aeropuerto key={phase} audio={audio} onContinue={advance} />}
        {phase === "despegue" && <Despegue key={phase} audio={audio} done={completedFlight} onContinue={advance} />}
        {phase === "roma" && <Roma key={phase} audio={audio} onContinue={advance} />}
        {phase === "tren" && <Tren key={phase} audio={audio} onContinue={advance} />}
        {phase === "florencia" && <Florencia key={phase} audio={audio} onContinue={advance} />}
        {phase === "vuelo-viena" && <VueloViena key={phase} audio={audio} onContinue={advance} />}
        {phase === "viena" && <Viena key={phase} audio={audio} onContinue={advance} />}
        {phase === "recuerdos" && <Recuerdos key={phase} onContinue={advance} />}
        {phase === "final" && <Final key={phase} audio={audio} onReplay={replay} />}
      </AnimatePresence>
    </main>
  );
}

export default function Journey({ availableAudio }: { availableAudio: string[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <Suspense fallback={<main className={styles.journey} aria-busy="true" />}>
        <AniversarioInner availableAudio={availableAudio} />
      </Suspense>
    </MotionConfig>
  );
}
