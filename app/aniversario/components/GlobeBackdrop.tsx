"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "../journey.module.css";

const GlobeCanvas = dynamic(() => import("./three/GlobeCanvas"), { ssr: false });

export type GlobeSceneName = "despegue" | "final";

function PrintedGlobe({ finale }: { finale: boolean }) {
  return (
    <svg viewBox="0 0 400 400" className="mx-auto size-full max-w-[620px]" fill="none">
      <circle cx="200" cy="200" r="142" fill="#181522" stroke="#f3cb794d" />
      <g stroke="#f3cb793d">
        <ellipse cx="200" cy="200" rx="91" ry="142" />
        <ellipse cx="200" cy="200" rx="43" ry="142" />
        <ellipse cx="200" cy="200" rx="142" ry="87" />
        <ellipse cx="200" cy="200" rx="142" ry="44" />
        <path d="M58 200H342M200 58v284" />
      </g>
      {finale ? (
        <path d="M200 200c-25-35-46-53-70-53a41 41 0 0 0 0 82c25 0 45-21 70-29 25-35 46-53 70-53a41 41 0 0 1 0 82c-25 0-45-21-70-29Z" stroke="#ffe1a0" strokeWidth="3" />
      ) : (
        <g fill="#ffe1a0" stroke="#ffe1a0" strokeWidth="2.5">
          <path d="M87 210Q175 95 280 148" fill="none" />
          <circle cx="87" cy="210" r="4" /><circle cx="280" cy="148" r="4" />
        </g>
      )}
    </svg>
  );
}

export default function GlobeBackdrop({
  scene,
  reduced,
  onFlightComplete,
}: {
  scene: GlobeSceneName | null;
  reduced: boolean;
  onFlightComplete: () => void;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [rendered, setRendered] = useState(false);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (scene !== "despegue" && scene !== "final") return;
    if (reduced || supported !== null) return;
    try {
      const gl = document.createElement("canvas").getContext("webgl2");
      setSupported(Boolean(gl));
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSupported(false);
    }
  }, [scene, reduced, supported]);

  useEffect(() => {
    if (scene && supported && !reduced) setRendered(true);
  }, [scene, supported, reduced]);

  useEffect(() => {
    if (scene !== "despegue") return;
    const timer = window.setTimeout(onFlightComplete, reduced || supported === false ? 850 : 8200);
    return () => clearTimeout(timer);
  }, [scene, supported, reduced, onFlightComplete]);

  return (
    <div className={styles.globe} data-scene={scene} aria-hidden>
      {scene && (!created || reduced) && <PrintedGlobe finale={scene === "final"} />}
      {rendered && !reduced && (
        <GlobeCanvas scene={scene} onReady={() => setCreated(true)} onFlightComplete={onFlightComplete} />
      )}
    </div>
  );
}
