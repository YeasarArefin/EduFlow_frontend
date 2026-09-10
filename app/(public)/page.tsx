import { getPublicPlans } from '@/features/pricing/api/get-public-plans';
import { getServerSession } from '@/lib/auth/server';
import { CommunicationAutomationSection } from '@/features/landing/components/communication-automation-section';
import { CoreWorkflowsSection } from '@/features/landing/components/core-workflows-section';
import { CtaSection } from '@/features/landing/components/cta-section';
import { DashboardIntelligenceSection } from '@/features/landing/components/dashboard-intelligence-section';
import { FaqSection } from '@/features/landing/components/faq-section';
import { HeroSection } from '@/features/landing/components/hero-section';
import { HowItWorksSection } from '@/features/landing/components/how-it-works-section';
import { PricingPreviewSection } from '@/features/pricing/components/pricing-preview-section';
import { ProblemSolutionSection } from '@/features/landing/components/problem-solution-section';
import { RolesPermissionsSection } from '@/features/landing/components/roles-permissions-section';
import { SecurityTrustSection } from '@/features/landing/components/security-trust-section';
import { TrustStrip } from '@/features/landing/components/trust-strip';

import { LandingBackdrop } from '@/features/landing/components/landing-backdrop';
import { PremiumTiltController } from '@/features/landing/components/premium-tilt-controller';

export default async function Home() {
  const [plans, session] = await Promise.all([getPublicPlans(), getServerSession()]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <PremiumTiltController />
      {/* Exact 3-Layer ORBIT Landing Backdrop (Glow + Masked 40px Grid + Noise Grain) */}
      <LandingBackdrop />

      {/* 1. Hero Section with Real UI Live Dashboard Preview */}
      <HeroSection />

      {/* 2. Trust & Capability Strip */}
      <TrustStrip />

      {/* 3. Problem → Solution Comparative Section */}
      <ProblemSolutionSection />

      {/* 4. Core Modules Bento Grid */}
      <CoreWorkflowsSection />

      {/* 5. Dashboard Intelligence & Analytics Overview */}
      <DashboardIntelligenceSection />

      {/* 6. Simple 3-Step Setup Timeline */}
      <HowItWorksSection />

      {/* 7. Role-Based Scoped Experience */}
      <RolesPermissionsSection />

      {/* 8. Automated Communication & Reminders Focal Section */}
      <CommunicationAutomationSection />

      {/* 9. Dynamic Pricing Preview from live database */}
      <PricingPreviewSection plans={plans} isAuthenticated={Boolean(session?.user?.id)} />

      {/* 10. Data Integrity, Privacy & Security Section */}
      <SecurityTrustSection />

      {/* 11. Frequently Asked Questions Glass Accordion */}
      <FaqSection />

      {/* 12. High-Impact Final CTA */}
      <CtaSection />
    </div>
  );
}
