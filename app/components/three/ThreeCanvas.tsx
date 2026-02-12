"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

interface ThreeCanvasProps {
  children: React.ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  fov?: number;
}

export default function ThreeCanvas({
  children,
  className,
  cameraPosition = [0, 0, 5],
  fov = 50,
}: ThreeCanvasProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: cameraPosition, fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
