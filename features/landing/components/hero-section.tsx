import Link from 'next/link';
import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { PublicContainer } from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import { AmbientGlow } from './ambient-glow';
import { HeroInteractiveDashboard } from './hero-interactive-dashboard';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 border-b border-border">
      <AmbientGlow position="top" withGrid={true} />

      <PublicContainer className="flex flex-col items-center text-center">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground backdrop-blur-md mb-6">
          <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(190,242,100,0.8)] animate-pulse" />
          <span>Built for modern coaching centers</span>
        </div>

        {/* Main Headline */}
        <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl sm:leading-[1.05] lg:text-7xl">
          Run your entire coaching center from{' '}
          <span className="block sm:inline bg-gradient-to-r from-foreground via-foreground/80 to-primary bg-clip-text text-transparent">
            one intelligent workspace.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-8 font-light">
          EduFlow brings students, batches, attendance, fees, teachers, schedules, and communication
          into one synchronized operational system.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row w-full sm:w-auto">
          <Button
            size="lg"
            className="min-h-11 w-full sm:w-auto rounded-full px-8 font-semibold shadow-[0_0_20px_rgba(190,242,100,0.2)] hover:shadow-[0_0_30px_rgba(190,242,100,0.4)] transition-all cursor-pointer"
            render={<Link href="/signup" />}
          >
            <span>Start Free</span>
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>

          <Button
            variant="glass"
            size="lg"
            className="min-h-11 w-full sm:w-auto rounded-full px-7 text-muted-foreground hover:text-foreground cursor-pointer"
            render={<Link href="#features" />}
          >
            <PlayCircle className="size-4 text-primary" data-icon="inline-start" />
            <span>Explore EduFlow</span>
          </Button>
        </div>

        {/* Trust Badges under CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="size-3.5 text-primary" />
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
