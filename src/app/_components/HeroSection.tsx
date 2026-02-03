"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";


type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
};
// const colors = [
//   "var(--chart-1)",
//   "var(--chart-2)",
//   "var(--chart-3)",
//   "var(--chart-4)",
//   "var(--chart-5)",
// ];

const colors = [
  "hsl(220, 70%, 50%)", // Blue
  "hsl(280, 65%, 60%)", // Purple
  "hsl(340, 75%, 55%)", // Pink
  "hsl(30, 80%, 55%)", // Orange
  "hsl(160, 60%, 45%)", // Teal
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 10 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(initialParticles);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) => {
          let newX = p.x + p.vx;
          let newY = p.y + p.vy;
          let newVx = p.vx;
          let newVy = p.vy;
          // Bounce off edges
          if (newX < 0 || newX > 100) newVx *= -1;
          if (newY < 0 || newY > 100) newVy *= -1;
          // Mouse interaction - particles move away from cursor
          if (isHovering) {
            const dx = p.x - mousePosition.x;
            const dy = p.y - mousePosition.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 15) {
              newX += (dx / dist) * 3;
              newY += (dy / dist) * 3;
            }
          }

          return {
            ...p,
            x: Math.max(0, Math.min(100, newX)),
            y: Math.max(0, Math.min(100, newY)),
            vx: newVx,
            vy: newVy,
          };
        }),
      );
    }, 50);
    return () => clearInterval(interval);
  }, [mousePosition, isHovering]);
  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-30 transition-all duration-700"
          style={{
            background: `radial-gradient(circle, hsl(220, 70%, 50%), transparent)`,
            left: `${mousePosition.x * 0.4}%`,
            top: `${mousePosition.y * 0.4}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-25 transition-all duration-700 delay-75"
          style={{
            background: `radial-gradient(circle, hsl(280, 65%, 60%), transparent)`,
            right: `${(100 - mousePosition.x) * 0.4}%`,
            bottom: `${(100 - mousePosition.y) * 0.4}%`,
            transform: "translate(50%, 50%)",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, hsl(340, 75%, 55%), transparent)`,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-15 transition-all duration-500"
          style={{
            background: `radial-gradient(circle, hsl(30, 80%, 55%), transparent)`,
            left: `${30 + mousePosition.x * 0.2}%`,
            top: `${70 - mousePosition.y * 0.2}%`,
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full transition-all duration-200 ease-out"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: 0.7,
              transform: `scale(${isHovering ? 1.3 : 1})`,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute w-48 h-48 rounded-full pointer-events-none transition-all duration-150 ease-out"
        style={{
          background: `radial-gradient(circle, hsl(280, 65%, 60%) 0%, transparent 70%)`,
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: "translate(-50%, -50%)",
          opacity: isHovering ? 0.2 : 0,
        }}
      />
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 animate-fade-in-up">
          <span className="text-balance">
            <span className="text-foreground">Excel to </span>
            <span className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
              Beautiful Charts
            </span>
          </span>
        </h1>
        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200 text-pretty">
          Upload your spreadsheet and watch it transform into stunning,
          interactive visualizations in seconds.
        </p>
        <div className="mt-10 flex justify-center">
  
        <Link href="/charts">
        <button
           className="
           px-8 py-4
           rounded-full
           bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3
           text-white
           text-lg font-semibold
           over:scale-105
           transition-transform
           "
          >
          Try Charts
        </button>
       </Link>
</div>

      </div>

    </section>
  );
}
