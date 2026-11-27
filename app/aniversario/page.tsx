import type { Viewport } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { CITIES, MUSIC } from "./data/trip";
import Journey from "./Journey";

export const viewport: Viewport = { viewportFit: "cover" };

export default function AniversarioPage() {
  const configuredAudio = [
    MUSIC.aeropuerto,
    ...Object.values(CITIES).map((city) => city.ambient),
  ];
  const availableAudio = configuredAudio.filter(
    (path): path is string => Boolean(path && existsSync(join(process.cwd(), "public", path))),
  );

  return <Journey availableAudio={availableAudio} />;
}
