"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function MusicNote() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1.2}>
        {/* Note head */}
        <mesh position={[-0.5, -0.6, 0]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <MeshDistortMaterial
            color="#FFD700"
            roughness={0.15}
            metalness={0.85}
            distort={0.06}
            speed={2}
          />
        </mesh>
        {/* Second note head */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, 0.3]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <MeshDistortMaterial
            color="#D4AF37"
            roughness={0.15}
            metalness={0.85}
            distort={0.06}
            speed={2}
          />
        </mesh>
        {/* Stem 1 */}
        <mesh position={[-0.2, 0.35, 0]}>
          <boxGeometry args={[0.06, 1.5, 0.06]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Stem 2 */}
        <mesh position={[0.8, 0.95, 0]}>
          <boxGeometry args={[0.06, 1.5, 0.06]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Connecting beam */}
        <mesh position={[0.3, 1.1, 0]} rotation={[0, 0, -0.31]}>
          <boxGeometry args={[1.1, 0.12, 0.06]} />
          <meshStandardMaterial color="#FFD700" metalness={0.7} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  );
}

export default function FloatingGuitar3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[3, 3, 4]} intensity={1.5} color="#FFD700" />
        <pointLight position={[-2, -1, 3]} intensity={0.6} color="#D4AF37" />
        <pointLight position={[0, 2, 2]} intensity={0.4} color="#FFF1A8" />
        <MusicNote />
      </Canvas>
    </div>
  );
}
