"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function HeartMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0,
      y = 0;

    shape.moveTo(x, y);
    shape.bezierCurveTo(x, y - 0.3, x - 0.5, y - 0.8, x - 1, y - 0.8);
    shape.bezierCurveTo(x - 1.7, y - 0.8, x - 1.7, y + 0.2, x - 1.7, y + 0.2);
    shape.bezierCurveTo(x - 1.7, y + 0.7, x - 1.3, y + 1.3, x, y + 2);
    shape.bezierCurveTo(x + 1.3, y + 1.3, x + 1.7, y + 0.7, x + 1.7, y + 0.2);
    shape.bezierCurveTo(x + 1.7, y + 0.2, x + 1.7, y - 0.8, x + 1, y - 0.8);
    shape.bezierCurveTo(x + 0.5, y - 0.8, x, y - 0.3, x, y);

    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.5,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    }),
    []
  );

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <mesh
        ref={meshRef}
        rotation={[Math.PI, 0, 0]}
        scale={0.45}
        position={[0, 0.2, 0]}
      >
        <extrudeGeometry args={[heartShape, extrudeSettings]} />
        <MeshDistortMaterial
          color="#FF6B9D"
          roughness={0.15}
          metalness={0.85}
          distort={0.04}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

export default function FloatingHeart3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 4]} intensity={1.2} color="#FFD700" />
        <pointLight position={[-2, -1, 3]} intensity={0.6} color="#E4007C" />
        <pointLight position={[0, 2, 2]} intensity={0.4} color="#FF6B9D" />
        <HeartMesh />
      </Canvas>
    </div>
  );
}
