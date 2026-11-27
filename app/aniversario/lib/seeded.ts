/** Deterministic pseudo-random for particle layouts (lint-safe, stable across renders). */
export function seeded(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function makeParticles(
  count: number,
  seed: number,
): Array<{
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}> {
  const rnd = seeded(seed);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rnd() * 100,
    size: 2 + rnd() * 4,
    duration: 6 + rnd() * 10,
    delay: rnd() * 10,
    opacity: 0.15 + rnd() * 0.4,
  }));
}
