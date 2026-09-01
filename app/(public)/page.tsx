import { getPublicPlans } from "@/features/pricing/api/get-public-plans";
import { getServerSession } from "@/lib/auth/server";
import { AutomationSection } from "@/components/landing/automation-section";
import { CoreWorkflowsSection } from "@/components/landing/core-workflows-section";
import { CtaSection } from "@/components/landing/cta-section";
import { GrainOverlay } from "@/components/landing/grain-overlay";
import { HeroSection } from "@/components/landing/hero-section";
import { InteractiveFeatureShowcase } from "@/components/landing/interactive-feature-showcase";
import { OneWorkspaceSection } from "@/components/landing/one-workspace-section";
import { PricingPreviewSection } from "@/components/landing/pricing-preview-section";
import { ProblemSolutionSection } from "@/components/landing/problem-solution-section";
import { RolesPermissionsSection } from "@/components/landing/roles-permissions-section";
import { TrustStrip } from "@/components/landing/trust-strip";

export default async function Home() {
  const [plans, session] = await Promise.all([
    getPublicPlans(),
    getServerSession(),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      {/* Subtle Grain Overlay */}
      <GrainOverlay />

      {/* 1. Hero Section with Interactive Live Dashboard */}
      <HeroSection />

      {/* 2. Trust & Capability Strip */}
      <TrustStrip />

      {/* 3. Problem → Solution Comparative Section */}
      <ProblemSolutionSection />

      {/* 4. Core Workflows (Students, Batches, Fees, Communication, Workspace) */}
      <CoreWorkflowsSection />

      {/* 5. Interactive Feature Showcase (Tab Switcher + Dynamic Preview) */}
      <InteractiveFeatureShowcase />

      {/* 6. One Workspace Ecosystem Flow */}
      <OneWorkspaceSection />

      {/* 7. Automated Operational Pipelines */}
      <AutomationSection />

      {/* 8. Role-Based Scoped Security */}
      <RolesPermissionsSection />

      {/* 9. Dynamic Pricing Preview from live database */}
      <PricingPreviewSection plans={plans} isAuthenticated={Boolean(session?.user?.id)} />

      {/* 10. High-Impact Final CTA */}
      <CtaSection />
    </div>
  );
}
