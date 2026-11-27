"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import { PHASE_ORDER, type Phase } from "./data/trip";
import { aniversarioAudio } from "./lib/audio";
import MuteToggle from "./components/MuteToggle";
import Countdown from "./components/phases/Countdown";
import Abrir from "./components/phases/Abrir";
import Aeropuerto from "./components/phases/Aeropuerto";
import Despegue from "./components/phases/Despegue";
import Roma from "./components/phases/Roma";
import Tren from "./components/phases/Tren";
import Florencia from "./components/phases/Florencia";
import VueloViena from "./components/phases/VueloViena";
import Viena from "./components/phases/Viena";
import Recuerdos from "./components/phases/Recuerdos";
import Final from "./components/phases/Final";

function isPhase(value: string | null): value is Phase {
  return !!value && (PHASE_ORDER as string[]).includes(value);
}

function AniversarioInner() {
  const searchParams = useSearchParams();
  const bypass = searchParams.get("bypass") === "true";
  const phaseParam = searchParams.get("phase");
  const initial: Phase =
    bypass && isPhase(phaseParam)
      ? phaseParam
      : bypass
        ? "abrir"
        : "countdown";

  const [phase, setPhase] = useState<Phase>(initial);

  useEffect(() => {
    if (bypass && isPhase(phaseParam) && phaseParam !== phase) {
      setPhase(phaseParam);
    }
  }, [bypass, phaseParam, phase]);

  useEffect(() => {
    return () => {
      aniversarioAudio.dispose();
    };
  }, []);

  const go = useCallback((p: Phase) => setPhase(p), []);

  const replay = useCallback(() => {
    aniversarioAudio.stopLoops();
    aniversarioAudio.stopAmbient();
    setPhase("abrir");
  }, []);

  const showMute = phase !== "countdown";

  return (
    <main className="min-h-[100dvh] bg-warm-black relative overflow-hidden">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.06), transparent 55%), #1A0A10",
        }}
        aria-hidden
      />

      {showMute && <MuteToggle />}

      <AnimatePresence mode="wait">
        {phase === "countdown" && (
          <Countdown key="countdown" onUnlock={() => go("abrir")} />
        )}
        {phase === "abrir" && (
          <Abrir key="abrir" onContinue={() => go("aeropuerto")} />
        )}
        {phase === "aeropuerto" && (
          <Aeropuerto key="aeropuerto" onContinue={() => go("despegue")} />
        )}
        {phase === "despegue" && (
          <Despegue key="despegue" onContinue={() => go("roma")} />
        )}
        {phase === "roma" && (
          <Roma key="roma" onContinue={() => go("tren")} />
        )}
        {phase === "tren" && (
          <Tren key="tren" onContinue={() => go("florencia")} />
        )}
        {phase === "florencia" && (
          <Florencia key="florencia" onContinue={() => go("vuelo-viena")} />
        )}
        {phase === "vuelo-viena" && (
          <VueloViena key="vuelo-viena" onContinue={() => go("viena")} />
        )}
        {phase === "viena" && (
          <Viena key="viena" onContinue={() => go("recuerdos")} />
        )}
        {phase === "recuerdos" && (
          <Recuerdos key="recuerdos" onContinue={() => go("final")} />
        )}
        {phase === "final" && <Final key="final" onReplay={replay} />}
      </AnimatePresence>
    </main>
  );
}

export default function AniversarioPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] bg-warm-black" aria-busy="true" />
      }
    >
      <AniversarioInner />
    </Suspense>
  );
}
