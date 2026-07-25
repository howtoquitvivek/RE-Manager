import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Workflow } from "@/components/home/Workflow";
import { AIFeatures } from "@/components/home/AIFeatures";
import { MapsSection } from "@/components/home/MapsSection";
import { Showcase } from "@/components/home/Showcase";
import { CTA } from "@/components/home/CTA";
import { Footer } from "@/components/home/Footer";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingFlow />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Workflow />
        <AIFeatures />
        <MapsSection />
        <Showcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

