import Link from "next/link";
import { ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "./ambient-glow";
import { HeroInteractiveDashboard } from "./hero-interactive-dashboard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b border-border/80">
      <AmbientGlow position="top" />

      <PublicContainer className="flex flex-col items-center text-center">
        {/* Main Headline */}
        <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-6xl sm:leading-[1.1] lg:text-7xl">
          Everything your coaching center needs.{" "}
          <span className="text-muted-foreground block sm:inline">In one workspace.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-8">
          EduFlow helps tutors and coaching centers manage students, batches, fees, attendance,
          schedules, and guardian communications—all from a single, dependable system.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-full px-7 font-medium shadow-sm hover:shadow-md transition-all cursor-pointer"
            render={<Link href="/signup" />}
          >
            <span>Start Free</span>
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full px-6 text-muted-foreground hover:text-foreground cursor-pointer"
            render={<Link href="#how-it-works" />}
          >
            <PlayCircle className="size-4" data-icon="inline-start" />
            <span>See How It Works</span>
          </Button>
        </div>

        {/* Trust Badges under CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-foreground/80" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-foreground/80" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-foreground/80" />
            <span>Instant workspace setup</span>
          </div>
        </div>

        {/* Interactive Product Visualization */}
        <div className="mt-14 w-full" id="interactive-preview">
          <HeroInteractiveDashboard />
        </div>
      </PublicContainer>
    </section>
  );
}
