"use client";

import { HeroSection } from "./_components/HeroSection";
import { FeaturesSection } from "./_components/FeatureSection";
import {
  ChartPreviewSection,
  MarqueeDemo,
} from "./_components/ChartPreviewSection";
import { Footer } from "./_features/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ChartPreviewSection />
      <MarqueeDemo />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
