import { auth } from "@/auth";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { FloatingNavbar } from "@/components/ui/floating-navbar";
import { GradientOrbs } from "@/components/ui/gradient-orbs";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LiveDemoSection } from "@/components/landing/live-demo-section";
import { TechStackSection } from "@/components/landing/tech-stack-section";
import { CTASection } from "@/components/landing/cta-section";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden noise">
      {/* Background Effects */}
      <BackgroundBeams className="opacity-30" />
      <GradientOrbs />

      {/* Navigation */}
      <FloatingNavbar isLoggedIn={!!session} />

      {/* Hero Section */}
      <HeroSection />

      {/* Live Demo Preview */}
      <LiveDemoSection />

      {/* Features */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Tech Stack */}
      <TechStackSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <span className="text-xs font-bold text-white">J</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2025 Jback. 
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="streaming-dot" />
              <span>Real-time Cultural Intelligence Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
