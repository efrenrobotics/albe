"use client";

import { motion, useReducedMotion } from "motion/react";
import { CITIES, type Leg } from "../data/trip";

export default function RouteArc({ leg, className }: { leg: Leg; className?: string }) {
  const reduced = useReducedMotion();
  const from = CITIES[leg.from];
  const to = CITIES[leg.to];
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      <path d="M25 59Q111 6 195 46" fill="none" stroke="currentColor" strokeOpacity=".27" strokeWidth="1.2" />
      <motion.path d="M25 59Q111 6 195 46" fill="none" stroke="var(--wien-light)" strokeWidth="2" strokeLinecap="round"
        initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.45 : 2.45, ease: "easeOut" }}
      />
      <circle cx="25" cy="59" r="3.5" fill="var(--wien-light)" />
      <circle cx="195" cy="46" r="3.5" fill="var(--wien-light)" />
      <g fill="currentColor" fontSize="12" textAnchor="middle" className="font-mono">
        <text x="25" y="79">{from.code}</text>
        <text x="195" y="69">{to.code}</text>
      </g>
    </svg>
  );
}
