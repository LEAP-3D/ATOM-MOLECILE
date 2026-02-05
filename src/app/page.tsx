import { HeroSection } from "./_components/landing/hero-section";
import { ChartMarquee } from "./_components/landing/chart-marquee";
import { IntroSection } from "./_components/landing/intro-section";
import { FeaturesSection } from "./_components/landing/features-section";
import { Footer } from "./_components/landing/footer";
import LandingHeader from "./_components/landing/header";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <ChartMarquee />
      <IntroSection />
      <FeaturesSection />
      <Footer />
    </main>
  );
}
