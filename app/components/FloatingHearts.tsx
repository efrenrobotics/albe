"use client";

import { useEffect, useState } from "react";
import HeartIcon from "./HeartIcon";

interface FloatingElement {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  type: "heart" | "star" | "dot";
  color: string;
}

const COLORS = ["#FF6B9D", "#DA70D6", "#D4AF37", "#E4007C", "#9B5DE5"];

export default function FloatingHearts() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  useEffect(() => {
    const generated: FloatingElement[] = Array.from({ length: 12 }, (_, i) => {
      const types: Array<"heart" | "star" | "dot"> = ["heart", "star", "dot"];
      return {
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 18,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 12,
        opacity: 0.12 + Math.random() * 0.2,
        type: types[i % 3],
        color: COLORS[i % COLORS.length],
      };
    });
    setElements(generated);
  }, []);

  if (elements.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute animate-float-up"
          style={
            {
              left: `${el.left}%`,
              bottom: "-40px",
              "--duration": `${el.duration}s`,
              "--float-opacity": `${el.opacity}`,
              animationDelay: `${el.delay}s`,
              animationIterationCount: "infinite",
            } as React.CSSProperties
          }
        >
          {el.type === "heart" && <HeartIcon size={el.size} color={el.color} />}
          {el.type === "star" && (
            <svg
              width={el.size}
              height={el.size}
              viewBox="0 0 24 24"
              fill={el.color}
              opacity={el.opacity}
            >
              <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
            </svg>
          )}
          {el.type === "dot" && (
            <div
              className="rounded-full"
              style={{
                width: el.size * 0.5,
                height: el.size * 0.5,
                background: `radial-gradient(circle, ${el.color}, transparent)`,
                opacity: el.opacity,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
