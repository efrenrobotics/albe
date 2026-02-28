"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ── Teardrop flame profile for latheGeometry ── */
function makeFlameProfile() {
  const pts: THREE.Vector2[] = [];
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // tapered teardrop: wide bottom, pointed top
    const r = Math.sin(t * Math.PI) * (1 - t * 0.6) * 0.06;
    const y = t * 0.18;
    pts.push(new THREE.Vector2(r, y));
  }
  return pts;
}

/* ── Frosting drip profile (inverted teardrop) ── */
function makeDripProfile() {
  const pts: THREE.Vector2[] = [];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const r = Math.sin(t * Math.PI) * (t * 0.7 + 0.3) * 0.025;
    const y = -t * 0.1;
    pts.push(new THREE.Vector2(r, y));
  }
  return pts;
}

const flameProfile = makeFlameProfile();
const dripProfile = makeDripProfile();

/* ── Single candle with teardrop flame + inner core ── */
function CandleFlame({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (flameRef.current) {
      flameRef.current.scale.y = 1 + Math.sin(t * 8 + position[0] * 5) * 0.2;
      flameRef.current.scale.x = 1 + Math.sin(t * 6 + position[2] * 3) * 0.1;
      flameRef.current.position.x =
        position[0] + Math.sin(t * 6 + position[0]) * 0.015;
    }
    if (lightRef.current) {
      lightRef.current.intensity =
        1.2 + Math.sin(t * 10 + position[0] * 4) * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh>
        <cylinderGeometry args={[0.025, 0.028, 0.28, 8]} />
        <meshStandardMaterial color="#FFFDE7" roughness={0.6} />
      </mesh>
      {/* Outer flame — teardrop */}
      <group ref={flameRef} position={[0, 0.2, 0]}>
        <mesh>
          <latheGeometry args={[flameProfile, 12]} />
          <meshStandardMaterial
            color="#FF8C00"
            emissive="#FF6000"
            emissiveIntensity={2.5}
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Inner core flame — pale yellow, smaller */}
        <mesh scale={[0.6, 0.6, 0.6]}>
          <latheGeometry args={[flameProfile, 12]} />
          <meshStandardMaterial
            color="#FFFACD"
            emissive="#FFD700"
            emissiveIntensity={3}
            toneMapped={false}
            transparent
            opacity={0.95}
          />
        </mesh>
      </group>
      {/* Candle glow point light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.25, 0]}
        color="#FF9933"
        intensity={1.2}
        distance={2}
        decay={2}
      />
    </group>
  );
}

/* ── Frosting drips around a tier rim ── */
function FrostingDrips({
  radius,
  y,
  count,
  color,
}: {
  radius: number;
  y: number;
  count: number;
  color: string;
}) {
  const drips = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
      const scaleY = 0.6 + Math.random() * 0.8;
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        rotZ: angle + Math.PI / 2,
        scaleY,
      };
    });
  }, [radius, count]);

  return (
    <group position={[0, y, 0]}>
      {drips.map((d, i) => (
        <mesh
          key={i}
          position={[d.x, 0, d.z]}
          scale={[1, d.scaleY, 1]}
          rotation={[0, d.rotZ, 0]}
        >
          <latheGeometry args={[dripProfile, 8]} />
          <meshPhysicalMaterial
            color={color}
            clearcoat={0.8}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Sprinkles on a tier top face ── */
function Sprinkles({
  radius,
  y,
  count,
}: {
  radius: number;
  y: number;
  count: number;
}) {
  const SPRINKLE_COLORS = [
    "#FF6B9D",
    "#FFD700",
    "#9B5DE5",
    "#00CED1",
    "#FF4500",
    "#32CD32",
    "#FF69B4",
    "#FFA500",
  ];

  const sprinkles = useMemo(() => {
    return Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * radius * 0.85;
      return {
        x: Math.cos(angle) * r,
        z: Math.sin(angle) * r,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        color: SPRINKLE_COLORS[Math.floor(Math.random() * SPRINKLE_COLORS.length)],
      };
    });
  }, [radius, count]);

  return (
    <group position={[0, y, 0]}>
      {sprinkles.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, 0.01, s.z]}
          rotation={[s.rotX, s.rotY, s.rotZ]}
        >
          <cylinderGeometry args={[0.008, 0.008, 0.04, 4]} />
          <meshStandardMaterial color={s.color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Main cake mesh ── */
function CakeMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* ── Bottom tier ── */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
          <meshPhysicalMaterial
            color="#E4007C"
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            roughness={0.15}
            metalness={0.1}
          />
        </mesh>
        {/* Bottom frosting ring */}
        <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.88, 0.06, 8, 32]} />
          <meshPhysicalMaterial
            color="#FFD700"
            clearcoat={0.9}
            roughness={0.2}
            metalness={0.5}
          />
        </mesh>
        {/* Bottom tier drips */}
        <FrostingDrips radius={0.87} y={0.15} count={8} color="#FFD700" />
        {/* Bottom tier sprinkles */}
        <Sprinkles radius={0.85} y={0.26} count={22} />

        {/* ── Top tier ── */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.6, 0.65, 0.4, 32]} />
          <meshPhysicalMaterial
            color="#D4AF37"
            clearcoat={1.0}
            clearcoatRoughness={0.05}
            roughness={0.15}
            metalness={0.15}
          />
        </mesh>
        {/* Top frosting ring */}
        <mesh position={[0, 0.78, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.58, 0.05, 8, 32]} />
          <meshPhysicalMaterial
            color="#E4007C"
            clearcoat={0.9}
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>
        {/* Top tier drips */}
        <FrostingDrips radius={0.57} y={0.62} count={7} color="#E4007C" />
        {/* Top tier sprinkles */}
        <Sprinkles radius={0.55} y={0.76} count={18} />

        {/* ── Candles ── */}
        <CandleFlame position={[-0.2, 0.9, 0]} />
        <CandleFlame position={[0.2, 0.9, 0]} />
        <CandleFlame position={[0, 0.9, 0.2]} />
      </group>
    </Float>
  );
}

export default function FloatingCake3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0.8, 3.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 3, 4]} intensity={1.2} color="#FFD700" />
        <pointLight position={[-2, -1, 3]} intensity={0.6} color="#E4007C" />
        <pointLight position={[0, 2, 2]} intensity={0.8} color="#FF8C00" />
        <CakeMesh />
      </Canvas>
    </div>
  );
}
