"use client";

import { Canvas } from "@react-three/fiber";
import GlobeScene from "./GlobeScene";
import type { GlobeSceneName } from "../GlobeBackdrop";

export default function GlobeCanvas({
  scene,
  onReady,
  onFlightComplete,
}: {
  scene: GlobeSceneName | null;
  onReady: () => void;
  onFlightComplete: () => void;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ fov: 39, near: 0.1, far: 40 }}
        dpr={[1, 2]}
        frameloop={scene ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
        onCreated={onReady}
      >
        {scene && <GlobeScene key={scene} scene={scene} onFlightComplete={onFlightComplete} />}
      </Canvas>
    </div>
  );
}
