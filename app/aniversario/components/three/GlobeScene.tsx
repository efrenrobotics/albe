"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferAttribute, CatmullRomCurve3, Group, DoubleSide,
  AdditiveBlending, BackSide, Mesh, Shape, TubeGeometry, Vector3,
} from "three";
import { CITIES, LEGS, type Leg } from "../../data/trip";
import { greatCirclePoints, latLngToVec3 } from "../../lib/geo";
import { isLand } from "../../lib/land";
import type { GlobeSceneName } from "../GlobeBackdrop";

const RADIUS = 1.6;
const SEGMENTS = 96;
const RADIAL_SEGMENTS = 5;
const GOLD = "#ffcd7a";
const WORLD_UP = new Vector3(0, 1, 0);

const AURA_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.);
    vView = normalize(-view.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * view;
  }
`;
const AURA_FRAGMENT = `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(1. - abs(dot(normalize(vNormal), normalize(vView))), 3.);
    gl_FragColor = vec4(vec3(.47, .22, .39), rim * .55);
  }
`;

function landPoints() {
  const points: number[] = [];
  for (let lat = -57; lat <= 82; lat += 1.9) {
    const interval = 1.9 / Math.cos(lat * Math.PI / 180);
    for (let lng = -177; lng < 177; lng += interval) {
      if (isLand(lng, lat)) points.push(...latLngToVec3(lat, lng, RADIUS + 0.005));
    }
  }
  return new Float32Array(points);
}

function routeCurve({ from, to }: Leg, lift: number) {
  const a = CITIES[from];
  const b = CITIES[to];
  return new CatmullRomCurve3(
    greatCirclePoints(a.lat, a.lng, b.lat, b.lng, 1, SEGMENTS).map(
      (point, index) => new Vector3(...point)
        .multiplyScalar(RADIUS + 0.025 + lift * Math.sin(Math.PI * index / SEGMENTS)),
    ),
  );
}

function gridPoints() {
  const points: number[] = [];
  for (let lat = -75; lat <= 75; lat += 15) {
    for (let lng = -180; lng < 180; lng += 4) {
      points.push(...latLngToVec3(lat, lng, RADIUS));
    }
  }
  for (let lng = -180; lng < 180; lng += 20) {
    for (let lat = -80; lat <= 80; lat += 3) {
      points.push(...latLngToVec3(lat, lng, RADIUS));
    }
  }
  return new Float32Array(points);
}

function planeShape() {
  const shape = new Shape();
  shape.moveTo(0, 0.82);
  shape.lineTo(0.13, 0.27);
  shape.lineTo(0.66, -0.17);
  shape.lineTo(0.66, -0.32);
  shape.lineTo(0.13, -0.17);
  shape.lineTo(0.09, -0.53);
  shape.lineTo(0.31, -0.69);
  shape.lineTo(0.31, -0.8);
  shape.lineTo(0, -0.70);
  shape.lineTo(-0.31, -0.8);
  shape.lineTo(-0.31, -0.69);
  shape.lineTo(-0.09, -0.53);
  shape.lineTo(-0.13, -0.17);
  shape.lineTo(-0.66, -0.32);
  shape.lineTo(-0.66, -0.17);
  shape.lineTo(-0.13, 0.27);
  shape.closePath();
  return shape;
}

function FinaleRoute({ progress, cameraAxis }: {
  progress: React.RefObject<number>;
  cameraAxis: Vector3;
}) {
  const loop = useMemo(() => {
    const points = LEGS.flatMap((leg, index) => {
      const path = routeCurve(leg, index === 0 ? 0.18 : index === 3 ? 0.32 : 0.055);
      return path.getPoints(SEGMENTS).slice(0, -1);
    });
    points.push(points[0].clone());
    const right = new Vector3().crossVectors(WORLD_UP, cameraAxis).normalize();
    const up = new Vector3().crossVectors(cameraAxis, right).normalize();
    const front = cameraAxis.clone().multiplyScalar(RADIUS + 0.14);
    const end = points.map((_, index) => {
      const t = 2 * Math.PI * index / (points.length - 1);
      return front.clone()
        .addScaledVector(right, 0.99 * Math.cos(t))
        .addScaledVector(up, 0.37 * Math.sin(2 * t));
    });
    const indices = new Uint16Array((points.length - 1) * 6);
    for (let i = 0; i < points.length - 1; i++) {
      const a = i * 2;
      indices.set([a, a + 2, a + 1, a + 1, a + 2, a + 3], i * 6);
    }
    return { points, end, indices, vertices: new Float32Array(points.length * 6) };
  }, [cameraAxis]);
  const line = useRef<Mesh>(null);
  const { point, prior, next, side } = useMemo(() => ({
    point: new Vector3(), prior: new Vector3(), next: new Vector3(), side: new Vector3(),
  }), []);

  useFrame(() => {
    const geometry = line.current?.geometry;
    if (!geometry) return;
    const time = progress.current;
    const draw = Math.min(time / 2.35, 1);
    const t = Math.min(Math.max((time - 3) / 2.1, 0), 1);
    const mix = t * t * (3 - 2 * t);
    const attr = geometry.getAttribute("position") as BufferAttribute;
    const end = loop.points.length - 1;
    for (let i = 0; i <= end; i++) {
      const previous = i === 0 ? end - 1 : i - 1;
      const following = i === end ? 1 : i + 1;
      point.copy(loop.points[i]).lerp(loop.end[i], mix);
      prior.copy(loop.points[previous]).lerp(loop.end[previous], mix);
      next.copy(loop.points[following]).lerp(loop.end[following], mix);
      side.crossVectors(next.sub(prior), cameraAxis).normalize().multiplyScalar(0.009);
      attr.setXYZ(i * 2, point.x + side.x, point.y + side.y, point.z + side.z);
      attr.setXYZ(i * 2 + 1, point.x - side.x, point.y - side.y, point.z - side.z);
    }
    geometry.setDrawRange(0, Math.ceil(draw * end) * 6);
    attr.needsUpdate = true;
  });

  return (
    <mesh ref={line} frustumCulled={false} renderOrder={2}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[loop.vertices, 3]} />
        <bufferAttribute attach="index" args={[loop.indices, 1]} />
      </bufferGeometry>
      <meshBasicMaterial color={GOLD} side={DoubleSide} depthTest={false} />
    </mesh>
  );
}

export default function GlobeScene({ scene, onFlightComplete }: {
  scene: GlobeSceneName;
  onFlightComplete: () => void;
}) {
  const flight = scene === "despegue";
  const progress = useRef(0);
  const complete = useRef(false);
  const trail = useRef<Mesh<TubeGeometry>>(null);
  const plane = useRef<Group>(null);
  const cityDots = useRef<Group>(null);
  const { points, land, shape, route, axis, cameraTarget, position, bearing, up, right } = useMemo(() => {
    const route = routeCurve(LEGS[0], 0.23);
    return {
      route,
      points: gridPoints(),
      land: landPoints(),
      shape: planeShape(),
      axis: route.getPoint(0.61).normalize(),
      cameraTarget: new Vector3(),
      position: new Vector3(),
      bearing: new Vector3(),
      up: new Vector3(),
      right: new Vector3(),
    };
  }, []);

  useFrame(({ camera, size }, delta) => {
    progress.current += delta;
    const t = flight ? Math.min(progress.current / 6.4, 1) : 1;
    const distance = Math.max(5.6, 5.05 * size.height / size.width);
    cameraTarget.copy(axis);
    if (flight) {
      route.getPointAt(t, position);
      route.getTangentAt(t, bearing);
      cameraTarget.lerp(position.normalize(), 0.5).normalize();
      route.getPointAt(t, position);
    }
    cameraTarget.multiplyScalar(distance);
    if (progress.current < 0.09) camera.position.copy(cameraTarget);
    else camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 2.6));
    camera.lookAt(0, 0, 0);

    if (flight && trail.current && plane.current) {
      trail.current.geometry.setDrawRange(0, Math.ceil(t * SEGMENTS) * RADIAL_SEGMENTS * 6);
      plane.current.position.copy(position);
      plane.current.quaternion.copy(camera.quaternion);
      up.set(0, 1, 0).applyQuaternion(camera.quaternion);
      right.set(1, 0, 0).applyQuaternion(camera.quaternion);
      plane.current.rotateZ(Math.atan2(-bearing.dot(right), bearing.dot(up)));
    }

    if (cityDots.current && !flight) {
      cityDots.current.visible = progress.current < 4;
    }
    if (flight && t >= 1 && !complete.current) {
      complete.current = true;
      onFlightComplete();
    }
  });

  return (
    <>
      <ambientLight intensity={1.0} color="#b89bc1" />
      <directionalLight position={[1, 3, 4]} intensity={1.75} color="#e4966e" />
      <mesh>
        <sphereGeometry args={[RADIUS * 0.996, 48, 32]} />
        <meshStandardMaterial color="#2c243c" roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh>
        <sphereGeometry args={[RADIUS * 1.06, 40, 28]} />
        <shaderMaterial vertexShader={AURA_VERTEX} fragmentShader={AURA_FRAGMENT}
          side={BackSide} depthWrite={false} blending={AdditiveBlending} transparent />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[land, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ffd09c" size={0.014} transparent opacity={0.72} depthWrite={false} />
      </points>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#eab86c" size={0.012} transparent opacity={0.39} depthWrite={false} />
      </points>
      <group ref={cityDots}>
        {(flight ? [CITIES.austin, CITIES.roma] : Object.values(CITIES)).map((city) => (
          <mesh key={city.id} position={latLngToVec3(city.lat, city.lng, RADIUS + 0.018)}>
            <sphereGeometry args={[0.036, 12, 8]} />
            <meshBasicMaterial color="#ffdda0" />
          </mesh>
        ))}
      </group>
      {flight ? (
        <>
          <mesh ref={trail}>
            <tubeGeometry args={[route, SEGMENTS, 0.014, RADIAL_SEGMENTS, false]} />
            <meshBasicMaterial color={GOLD} />
          </mesh>
          <group ref={plane}>
            <mesh scale={0.13} renderOrder={3}>
              <shapeGeometry args={[shape]} />
              <meshBasicMaterial color="#fff0d3" depthTest={false} />
            </mesh>
          </group>
        </>
      ) : <FinaleRoute progress={progress} cameraAxis={axis} />}
    </>
  );
}
