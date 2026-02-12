"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function MiniHeart({ position, scale, speed }: { position: [number, number, number]; scale: number; speed: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0, -0.3, -0.5, -0.8, -1, -0.8);
    shape.bezierCurveTo(-1.7, -0.8, -1.7, 0.2, -1.7, 0.2);
    shape.bezierCurveTo(-1.7, 0.7, -1.3, 1.3, 0, 2);
    shape.bezierCurveTo(1.3, 1.3, 1.7, 0.7, 1.7, 0.2);
    shape.bezierCurveTo(1.7, 0.2, 1.7, -0.8, 1, -0.8);
    shape.bezierCurveTo(0.5, -0.8, 0, -0.3, 0, 0);
    return shape;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed * 0.3;
      meshRef.current.rotation.z += delta * speed * 0.1;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} position={position} scale={scale} rotation={[Math.PI, 0, 0]}>
        <extrudeGeometry args={[heartShape, { depth: 0.2, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.05, bevelThickness: 0.05 }]} />
        <meshStandardMaterial
          color="#FF6B9D"
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere({ position, scale, color, speed }: { position: [number, number, number]; scale: number; color: string; speed: number }) {
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.6}
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const items = useMemo(() => {
    const elements: Array<{ type: "heart" | "sphere"; position: [number, number, number]; scale: number; speed: number; color: string }> = [];
    const colors = ["#FF6B9D", "#DA70D6", "#D4AF37", "#E4007C", "#9B5DE5"];

    for (let i = 0; i < 14; i++) {
      elements.push({
        type: i % 3 === 0 ? "heart" : "sphere",
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ],
        scale: 0.06 + Math.random() * 0.12,
        speed: 0.8 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return elements;
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 3, 4]} intensity={0.8} color="#FF6B9D" />
      <pointLight position={[-4, -2, 3]} intensity={0.5} color="#D4AF37" />

      {items.map((item, i) =>
        item.type === "heart" ? (
          <MiniHeart key={i} position={item.position} scale={item.scale} speed={item.speed} />
        ) : (
          <FloatingSphere key={i} position={item.position} scale={item.scale} color={item.color} speed={item.speed} />
        )
      )}
    </>
  );
}

export default function FloatingScene3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
