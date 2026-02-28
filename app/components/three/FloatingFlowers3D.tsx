"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

/* ── Petal profiles for latheGeometry ── */
type PetalType = "rose" | "daisy" | "tulip";

function makePetalProfile(type: PetalType) {
  const pts: THREE.Vector2[] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let r: number;
    switch (type) {
      case "rose":
        // broad, rounded petal
        r = Math.sin(t * Math.PI) * (1 - t * 0.3) * 0.06;
        break;
      case "daisy":
        // narrow, elongated petal
        r = Math.sin(t * Math.PI) * (1 - t * 0.4) * 0.035;
        break;
      case "tulip":
        // tall, cupped petal
        r = Math.sin(t * Math.PI * 0.85) * (1 - t * 0.2) * 0.055;
        break;
    }
    const y = t * 0.15;
    pts.push(new THREE.Vector2(r, y));
  }
  return pts;
}

const petalProfiles: Record<PetalType, THREE.Vector2[]> = {
  rose: makePetalProfile("rose"),
  daisy: makePetalProfile("daisy"),
  tulip: makePetalProfile("tulip"),
};

const PETAL_CONFIGS: {
  type: PetalType;
  count: number;
  tilt: number;
  spread: number;
}[] = [
  { type: "rose", count: 8, tilt: 0.35, spread: 0.14 },
  { type: "daisy", count: 12, tilt: 0.45, spread: 0.12 },
  { type: "tulip", count: 6, tilt: 0.25, spread: 0.16 },
];

/* ── Leaf shape using ShapeGeometry ── */
function LeafShape() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.04, 0.06, 0.02, 0.14);
    s.quadraticCurveTo(0, 0.16, -0.02, 0.14);
    s.quadraticCurveTo(-0.04, 0.06, 0, 0);
    return s;
  }, []);

  return (
    <shapeGeometry args={[shape]} />
  );
}

function Leaf({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <LeafShape />
      <meshStandardMaterial
        color="#2D5A27"
        side={THREE.DoubleSide}
        roughness={0.5}
        metalness={0.1}
      />
    </mesh>
  );
}

/* ── Single flower with lathe petals ── */
function Flower({
  position,
  petalColor,
  scale = 1,
  configIndex,
}: {
  position: [number, number, number];
  petalColor: string;
  scale?: number;
  configIndex: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const config = PETAL_CONFIGS[configIndex % PETAL_CONFIGS.length];
  const profile = petalProfiles[config.type];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.5 + position[0] * 2) * 0.15;
    }
  });

  const petals = useMemo(() => {
    return Array.from({ length: config.count }, (_, i) => {
      const angle = (i / config.count) * Math.PI * 2;
      return { angle };
    });
  }, [config.count]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 1, 8]} />
        <meshStandardMaterial color="#2D5A27" roughness={0.6} />
      </mesh>

      {/* Leaves — 2 per flower mid-stem */}
      <Leaf
        position={[-0.04, -0.3, 0]}
        rotation={[0, 0, -0.6]}
      />
      <Leaf
        position={[0.04, -0.45, 0]}
        rotation={[0, Math.PI, 0.6]}
      />

      {/* Petals — fanning around Y axis, tilted outward */}
      {petals.map((p, i) => (
        <group
          key={i}
          rotation={[0, p.angle, 0]}
        >
          <group
            position={[config.spread, 0.02, 0]}
            rotation={[config.tilt, 0, 0.2]}
          >
            <mesh>
              <latheGeometry args={[profile, 10]} />
              <meshPhysicalMaterial
                color={petalColor}
                clearcoat={0.6}
                roughness={0.3}
                metalness={0.1}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
        </group>
      ))}

      {/* Center — pistil */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/* ── Bouquet wrapper (cream outer + gold-pink inner + ribbon) ── */
function BouquetWrapper() {
  return (
    <group position={[0, -0.7, 0]}>
      {/* Outer cream paper cone */}
      <mesh>
        <coneGeometry args={[0.65, 0.85, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#FFF8E7"
          clearcoat={0.3}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner accent cone — gold-pink */}
      <mesh position={[0, 0.05, 0]} scale={[0.92, 0.9, 0.92]}>
        <coneGeometry args={[0.65, 0.85, 20, 1, true]} />
        <meshPhysicalMaterial
          color="#E4007C"
          clearcoat={0.5}
          roughness={0.4}
          metalness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>
      {/* Ribbon bow — two small boxes at the cone neck */}
      <mesh position={[-0.08, 0.35, 0.55]} rotation={[0.3, 0.2, 0.5]}>
        <boxGeometry args={[0.12, 0.04, 0.06]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          clearcoat={0.8}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0.08, 0.35, 0.55]} rotation={[0.3, -0.2, -0.5]}>
        <boxGeometry args={[0.12, 0.04, 0.06]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          clearcoat={0.8}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>
      {/* Ribbon knot center */}
      <mesh position={[0, 0.34, 0.58]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshPhysicalMaterial
          color="#D4AF37"
          clearcoat={1}
          roughness={0.15}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

/* ── Full bouquet arrangement ── */
function FlowerBouquet() {
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={[0, -0.2, 0]}>
        {/* 6 flowers at varying depths/heights for natural look */}
        <Flower
          position={[0, 0.35, 0.1]}
          petalColor="#DA70D6"
          scale={1.1}
          configIndex={0}
        />
        <Flower
          position={[-0.45, 0.05, 0.25]}
          petalColor="#E4007C"
          scale={0.9}
          configIndex={1}
        />
        <Flower
          position={[0.45, 0.05, -0.05]}
          petalColor="#FF6B9D"
          scale={0.95}
          configIndex={2}
        />
        <Flower
          position={[-0.15, -0.05, 0.4]}
          petalColor="#DA70D6"
          scale={0.85}
          configIndex={0}
        />
        <Flower
          position={[0.25, 0.2, 0.35]}
          petalColor="#D4AF37"
          scale={0.8}
          configIndex={1}
        />
        <Flower
          position={[0.05, 0.1, -0.2]}
          petalColor="#FF6B9D"
          scale={0.88}
          configIndex={2}
        />

        <BouquetWrapper />

        {/* Gold sparkles floating around */}
        <Sparkles
          count={40}
          scale={2.5}
          size={2}
          speed={0.4}
          color="#FFD700"
        />
      </group>
    </Float>
  );
}

export default function FloatingFlowers3D({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 44 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[3, 3, 4]} intensity={1} color="#FFD700" />
        <pointLight position={[-2, -1, 3]} intensity={0.6} color="#DA70D6" />
        <pointLight position={[0, 2, 2]} intensity={0.5} color="#FF6B9D" />
        {/* Bottom-up fill light for petal undersides */}
        <pointLight position={[0, -2, 2]} intensity={0.4} color="#FFF0F5" />
        {/* Top white highlight */}
        <directionalLight position={[0, 4, 2]} intensity={0.6} color="#FFFFFF" />
        <FlowerBouquet />
      </Canvas>
    </div>
  );
}
