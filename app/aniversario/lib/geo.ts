/** Great-circle helpers for the procedural globe. Lat/lng in degrees. */

export function latLngToVec3(
  lat: number,
  lng: number,
  radius: number,
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

/** Sample points along the short great-circle arc between two lat/lngs. */
export function greatCirclePoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  radius: number,
  segments = 64,
): [number, number, number][] {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const λ1 = toRad(lng1);
  const φ2 = toRad(lat2);
  const λ2 = toRad(lng2);

  // Convert to cartesian unit vectors
  const a = [
    Math.cos(φ1) * Math.cos(λ1),
    Math.sin(φ1),
    Math.cos(φ1) * Math.sin(λ1),
  ];
  const b = [
    Math.cos(φ2) * Math.cos(λ2),
    Math.sin(φ2),
    Math.cos(φ2) * Math.sin(λ2),
  ];

  const dot = Math.max(
    -1,
    Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  );
  const omega = Math.acos(dot);

  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let x: number, y: number, z: number;
    if (omega < 1e-6) {
      x = a[0];
      y = a[1];
      z = a[2];
    } else {
      const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
      const s2 = Math.sin(t * omega) / Math.sin(omega);
      x = s1 * a[0] + s2 * b[0];
      y = s1 * a[1] + s2 * b[1];
      z = s1 * a[2] + s2 * b[2];
    }
    // Remap geographic cartesian → three.js orientation used by latLngToVec3
    const lat = (Math.asin(y) * 180) / Math.PI;
    const lng = (Math.atan2(z, x) * 180) / Math.PI;
    points.push(latLngToVec3(lat, lng, radius));
  }
  return points;
}
