"use client";

import { useId } from "react";

const STALLS = [
  { x: 50, roof: "#a34333", trees: 1 },
  { x: 191, roof: "#48665d", trees: 2 },
  { x: 330, roof: "#a34333", trees: 1 },
  { x: 472, roof: "#77574b", trees: 2 },
  { x: 612, roof: "#a34333", trees: 1 },
];

export default function WienMarket({ className, litCount }: { className?: string; litCount: number }) {
  const prefix = useId();
  const glow = `${prefix}-glow`;
  const glass = `${prefix}-glass`;

  return (
    <svg viewBox="0 0 780 385" className={className} aria-hidden>
      <defs>
        <radialGradient id={glow}>
          <stop stopColor="var(--wien-light)" stopOpacity=".54" />
          <stop offset=".52" stopColor="#f5a350" stopOpacity=".2" />
          <stop offset="1" stopColor="#f5a350" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={glass} x2="0" y2="1">
          <stop stopColor="var(--wien-light)" />
          <stop offset="1" stopColor="#dc8c46" />
        </linearGradient>
      </defs>

      <circle cx="622" cy="60" r="36" fill="#d9e8f2" opacity=".19" />
      <path d="M0 286v-76l32-20 36 19 39-33 38 22 34-25 37 23 48-23 39 23 40-19 37 22h28l37-22 38 19 43-23 52 19 24-26 39 29 40-30 55 32 33-26v136Z" fill="#14273c" />
      {/* The stepped roof and central tower evoke the Rathaus. */}
      <path d="M106 286V174h28v-44l20-28 20 28v47h24l16-22 18 22h27l14-32 16 32h19v-55l18-34 17 34v62h19v-81l19-26 9-61 10 61 19 26v81h18v-62l17-34 18 34v55h19l16-32 14 32h27l18-22 16 22h24v-47l20-28 20 28v44h28v112Z"
        fill="#213a50" stroke="#7fabc2" strokeOpacity=".58" strokeWidth="1.5" />
      <path d="M150 172h480M133 206h513M110 257h561" stroke="#9cbfd0" opacity=".3" />
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${125 + i * 40} 250v-26q7-12 14 0v26Z`}
          fill={litCount >= 5 ? "#ba8c57" : "#102134"} opacity=".75" />
      ))}
      <path d="M382 178v-50q8-17 16 0v50Z" fill={litCount === 5 ? "#ebbc74" : "#102134"} />
      <path d="M0 324q126-22 251-11t206 2 323-8v53H0Z" fill="#a3bcce" opacity=".17" />

      <path d="M42 211q135 58 267 19t427-19" fill="none" stroke="#9fb0b7" strokeOpacity=".44" />
      {Array.from({ length: 33 }, (_, i) => {
        const x = 47 + i * 21;
        const y = 219 + 23 * Math.sin(i / 32 * Math.PI * 2) + i * 0.11;
        const lit = i < Math.ceil(litCount * 6.6);
        return <g key={i}>
          {lit && <circle cx={x} cy={y} r="13" fill={`url(#${glow})`} />}
          <circle cx={x} cy={y} r="2.5" fill={lit ? "var(--wien-light)" : "#8292a0"} />
        </g>;
      })}

      {STALLS.map(({ x, roof, trees }, index) => {
        const lit = index < litCount;
        return <g key={x} transform={`translate(${x} 254)`}>
          {lit && <ellipse cx="57" cy="52" rx="95" ry="66" fill={`url(#${glow})`} />}
          <path d="M5 24h105v64H5Z" fill={lit ? "#5d382c" : "#233043"} stroke="#818193" strokeOpacity=".55" />
          <path d="M0 29 26 3h61l28 26Z" fill={lit ? roof : "#334257"} stroke="#c8d6dc" strokeOpacity=".55" strokeWidth="1.2" />
          <path d="M25 3h63l7 7-43-2-36 3Z" fill="#c5d6e0" opacity=".7" />
          <path d="M17 38h80v31H17Z" fill={lit ? `url(#${glass})` : "#172738"} />
          <path d="M17 56h80M46 38v31M69 38v31" stroke={lit ? "#956544" : "#34475c"} fill="none" />
          {Array.from({ length: trees }, (_, tree) => (
            <path key={tree} transform={`translate(${29 + tree * 47} 48)`} d="m0 9 7-16 7 16Z" fill={lit ? "#527457" : "#283642"} />
          ))}
          <path d="M7 82h102M16 74h81" stroke="#a88362" opacity=".47" />
        </g>;
      })}
      <path d="M0 355q148-16 253 1t223-1 304 0" fill="none" stroke="#c0cfdd" strokeOpacity=".25" />
    </svg>
  );
}
