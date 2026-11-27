/** Trip config for the 1-year anniversary journey. Tweak dates/cities here. */

export const UNLOCK_DATE = new Date("2026-12-08T00:00:00-06:00"); // Dec 8, 2026 00:00 CST

export const MUSIC = {
  /** "Aeropuerto" by Camilo — Efren adds the file; fail silent if missing */
  aeropuerto: "/audio/aeropuerto.mp3",
  volume: 0.4,
  duckedVolume: 0.15,
} as const;

export const HOOK_LINE = "Me dicen aeropuerto porque te pongo a viajar";

export interface City {
  id: "austin" | "roma" | "florencia" | "viena";
  name: string;
  displayName: string;
  code: string;
  lat: number;
  lng: number;
  dateLabel: string;
  nights?: number;
  /** Optional ambient track path — used only if the file exists */
  ambient?: string;
}

export const CITIES: Record<City["id"], City> = {
  austin: {
    id: "austin",
    name: "Austin",
    displayName: "Austin",
    code: "AUS",
    lat: 30.27,
    lng: -97.74,
    dateLabel: "9 dic",
  },
  roma: {
    id: "roma",
    name: "Roma",
    displayName: "Roma",
    code: "FCO",
    lat: 41.9,
    lng: 12.5,
    dateLabel: "9–12 dic",
    nights: 3,
    ambient: "/audio/roma-ambient.mp3",
  },
  florencia: {
    id: "florencia",
    name: "Florencia",
    displayName: "Firenze",
    code: "FLR",
    lat: 43.77,
    lng: 11.26,
    dateLabel: "12–15 dic",
    nights: 3,
    ambient: "/audio/firenze-ambient.mp3",
  },
  viena: {
    id: "viena",
    name: "Viena",
    displayName: "Wien",
    code: "VIE",
    lat: 48.21,
    lng: 16.37,
    dateLabel: "15–19 dic",
    nights: 4,
    ambient: "/audio/wien-ambient.mp3",
  },
};

export interface Leg {
  from: City["id"];
  to: City["id"];
  mode: "flight" | "train";
  routeLabel: string;
  dateLabel: string;
}

export const LEGS: Leg[] = [
  {
    from: "austin",
    to: "roma",
    mode: "flight",
    routeLabel: "AUS → FCO",
    dateLabel: "9 dic 2026",
  },
  {
    from: "roma",
    to: "florencia",
    mode: "train",
    routeLabel: "Roma → Firenze",
    dateLabel: "12 dic 2026",
  },
  {
    from: "florencia",
    to: "viena",
    mode: "flight",
    routeLabel: "FLR → VIE",
    dateLabel: "15 dic 2026",
  },
  {
    from: "viena",
    to: "austin",
    mode: "flight",
    routeLabel: "VIE → AUS",
    dateLabel: "19 dic 2026",
  },
];

export const TRIP = {
  anniversary: "8 de diciembre",
  start: "9 de diciembre",
  end: "19 de diciembre",
  year: 2026,
  rangeLabel: "9–19 de diciembre",
  citiesLabel: "Roma, Florencia y Viena",
  passenger: "Albeimar",
} as const;

export type Phase =
  | "countdown"
  | "abrir"
  | "aeropuerto"
  | "despegue"
  | "roma"
  | "tren"
  | "florencia"
  | "vuelo-viena"
  | "viena"
  | "recuerdos"
  | "final";

export const PHASE_ORDER: Phase[] = [
  "countdown",
  "abrir",
  "aeropuerto",
  "despegue",
  "roma",
  "tren",
  "florencia",
  "vuelo-viena",
  "viena",
  "recuerdos",
  "final",
];
