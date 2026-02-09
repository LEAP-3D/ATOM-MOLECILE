"use client";

import { HeroBackground } from "./hero-background";
import { HeroContent } from "./hero-content";
import { HeroScrollIndicator } from "./hero-scroll-indicator";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <HeroBackground />
      <HeroContent />
      <HeroScrollIndicator />
    </section>
  );
}
