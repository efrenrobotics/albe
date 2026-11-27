"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CITIES, LEGS, type City } from "../../data/trip";
import { greatCirclePoints, latLngToVec3 } from "../../lib/geo";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const R = 1.6;

function GridSphere() {
  const points = useMemo(() => {
    const pts: number[] = [];
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let lng = 0; lng < 360; lng += 4) {
        const [x, y, z] = latLngToVec3(lat, lng - 180, R);
        pts.push(x, y, z);
      }
    }
    for (let lng = -180; lng < 180; lng += 20) {
      for (let lat = -80; lat <= 80; lat += 3) {
        const [x, y, z] = latLngToVec3(lat, lng, R);
        pts.push(x, y, z);
      }
    }
    return new Float32Array(pts);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#D4AF37"
        size={0.012}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

function buildCurve(from: City, to: City) {
  const pts = greatCirclePoints(from.lat, from.lng, to.lat, to.lng, R + 0.04, 80);
  const lifted = pts.map((p, i) => {
    const t = i / (pts.length - 1);
    const lift = Math.sin(t * Math.PI) * 0.18;
    const v = new THREE.Vector3(...p);
    v.normalize().multiplyScalar(R + 0.04 + lift);
    return v;
  });
  return new THREE.CatmullRomCurve3(lifted);
}

function Arc({
  from,
  to,
  animated = false,
  progressRef,
  color = "#D4AF37",
}: {
  from: City;
  to: City;
  animated?: boolean;
  progressRef?: React.MutableRefObject<number>;
  color?: string;
}) {
  const curve = useMemo(() => buildCurve(from, to), [from, to]);
  const meshRef = useRef<THREE.Mesh>(null);
  const fullGeo = useMemo(
    () => new THREE.TubeGeometry(curve, 80, 0.012, 6, false),
    [curve],
  );

  useFrame(() => {
    if (!animated || !progressRef || !meshRef.current) return;
    const segs = Math.max(2, Math.floor(80 * Math.max(0.05, progressRef.current)));
    meshRef.current.geometry.dispose();
    meshRef.current.geometry = new THREE.TubeGeometry(
      curve,
      segs,
      0.012,
      6,
      false,
    );
  });

  return (
    <mesh ref={meshRef} geometry={fullGeo}>
      <meshBasicMaterial color={color} transparent opacity={0.9} />
    </mesh>
  );
}

function PlaneMarker({
  from,
  to,
  progressRef,
}: {
  from: City;
  to: City;
  progressRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => buildCurve(from, to), [from, to]);

  useFrame(() => {
    if (!ref.current) return;
    const t = Math.min(1, Math.max(0, progressRef.current));
    const p = curve.getPoint(t);
    ref.current.position.copy(p);
    const tangent = curve.getTangent(t);
    ref.current.lookAt(p.clone().add(tangent));
  });

  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.035, 0.1, 4]} />
      <meshBasicMaterial color="#FFF8E7" />
    </mesh>
  );
}

function CityDots({ ids }: { ids: City["id"][] }) {
  return (
    <>
      {ids.map((id) => {
        const c = CITIES[id];
        const [x, y, z] = latLngToVec3(c.lat, c.lng, R + 0.02);
        return (
          <mesh key={id} position={[x, y, z]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color="#E8B84A" />
          </mesh>
        );
      })}
    </>
  );
}

export type GlobeMode = "aus-roma" | "roma-flr" | "flr-vie" | "finale";

interface GlobeSceneProps {
  mode: GlobeMode;
  onFlightComplete?: () => void;
}

export default function GlobeScene({
  mode,
  onFlightComplete,
}: GlobeSceneProps) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const progressRef = useRef(0);
  const done = useRef(false);
  const camTarget = useRef(new THREE.Vector3(0, 0.3, 4.2));

  const flying =
    mode === "aus-roma" || mode === "roma-flr" || mode === "flr-vie";

  useEffect(() => {
    progressRef.current = 0;
    done.current = false;
  }, [mode]);

  useFrame((state, delta) => {
    if (group.current && !reduced) {
      group.current.rotation.y += delta * 0.04;
    }

    if (flying) {
      if (reduced) {
        progressRef.current = 1;
      } else {
        progressRef.current = Math.min(1, progressRef.current + delta * 0.12);
      }
      if (progressRef.current >= 1 && !done.current) {
        done.current = true;
        onFlightComplete?.();
      }
    }

    if (!reduced) {
      state.camera.position.lerp(camTarget.current, 0.02);
      state.camera.lookAt(0, 0, 0);
    }
  });

  const austin = CITIES.austin;
  const roma = CITIES.roma;
  const flr = CITIES.florencia;
  const vie = CITIES.viena;

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[R * 0.98, 48, 48]} />
        <meshBasicMaterial color="#0d0810" transparent opacity={0.92} />
      </mesh>
      <GridSphere />

      {mode === "aus-roma" && (
        <>
          <Arc from={austin} to={roma} animated progressRef={progressRef} />
          <PlaneMarker from={austin} to={roma} progressRef={progressRef} />
          <CityDots ids={["austin", "roma"]} />
        </>
      )}

      {mode === "roma-flr" && (
        <>
          <Arc from={austin} to={roma} color="#8a7040" />
          <Arc from={roma} to={flr} animated progressRef={progressRef} />
          <PlaneMarker from={roma} to={flr} progressRef={progressRef} />
          <CityDots ids={["austin", "roma", "florencia"]} />
        </>
      )}

      {mode === "flr-vie" && (
        <>
          <Arc from={austin} to={roma} color="#8a7040" />
          <Arc from={roma} to={flr} color="#8a7040" />
          <Arc from={flr} to={vie} animated progressRef={progressRef} />
          <PlaneMarker from={flr} to={vie} progressRef={progressRef} />
          <CityDots ids={["austin", "roma", "florencia", "viena"]} />
        </>
      )}

      {mode === "finale" && (
        <>
          {LEGS.map((leg) => (
            <Arc
              key={`${leg.from}-${leg.to}`}
              from={CITIES[leg.from]}
              to={CITIES[leg.to]}
            />
          ))}
          <CityDots ids={["austin", "roma", "florencia", "viena"]} />
          <InfinityRing />
        </>
      )}
    </group>
  );
}

function InfinityRing() {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      const scale = 0.55;
      const x = (scale * Math.cos(t)) / (1 + Math.sin(t) ** 2);
      const y = (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.sin(t) ** 2);
      pts.push(new THREE.Vector3(x, y + 0.1, R + 0.35));
    }
    const curve = new THREE.CatmullRomCurve3(pts, true);
    return new THREE.TubeGeometry(curve, 200, 0.018, 8, true);
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color="#FFD700" transparent opacity={0.85} />
    </mesh>
  );
}
