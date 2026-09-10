import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PublicContainer } from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import {
  LivePricingCard,
  StaticPricingCard,
  STATIC_TIERS,
} from '@/features/pricing/components/pricing-card';
import type { PricingPreviewSectionProps } from '@/types/pricing';

export function PricingPreviewSection({
  plans,
  isAuthenticated = false,
}: PricingPreviewSectionProps) {
  const hasDynamicPlans = Boolean(plans && plans.length > 0);

  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32 bg-background" id="pricing">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Predictable Pricing
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Transparent plans for coaching centers of any size.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Start with our full-featured 14-day trial. Upgrade only when you are ready to expand
            your batches.
          </p>
        </div>

        {/* Cards */}
        {hasDynamicPlans && plans ? (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <LivePricingCard
                key={plan.id}
                plan={plan}
                index={index}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {STATIC_TIERS.map((tier) => (
              <StaticPricingCard key={tier.name} tier={tier} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        )}

        {/* Compare All Plans Link */}
        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            className="rounded-full text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            render={<Link href="/pricing" />}
          >
            <span>View dedicated Pricing Page &amp; full feature comparison</span>
            <ArrowRight className="size-3.5 text-accent-foreground" data-icon="inline-end" />
          </Button>
        </div>
      </PublicContainer>
    </section>
  );
}
