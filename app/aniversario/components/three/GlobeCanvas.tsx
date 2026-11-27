"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import GlobeScene, { type GlobeMode } from "./GlobeScene";

interface Props {
  mode: GlobeMode;
  onFlightComplete?: () => void;
  className?: string;
}

export default function GlobeCanvas({
  mode,
  onFlightComplete,
  className = "absolute inset-0",
}: Props) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.35, 4.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <GlobeScene mode={mode} onFlightComplete={onFlightComplete} />
        </Suspense>
      </Canvas>
    </div>
  );
}
