"use client";

import { useState, useRef } from "react";
import HeroVisual from "./HeroVisual";
import HeroContent from "./HeroContent";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
};

const colors = [
  "hsl(220,70%,50%)",
  "hsl(280,65%,60%)",
  "hsl(340,75%,55%)",
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [mousePosition, setMouse] = useState({ x: 50, y: 50 });
  const [isHovering, setHover] = useState(false);
  const [particles] = useState<Particle[]>(() =>
  Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 4,
    color: colors[i % colors.length],
    vx: 0.2,
    vy: 0.2,
  }))
);


  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center"
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setMouse({
          x: ((e.clientX - r.left) / r.width) * 100,
          y: ((e.clientY - r.top) / r.height) * 100,
        });
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <HeroVisual
        mousePosition={mousePosition}
        particles={particles}
        isHovering={isHovering}
      />

      <HeroContent />
    </section>
  );
}

 