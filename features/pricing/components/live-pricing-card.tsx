import { PricingCardShell } from '@/features/pricing/components/pricing-card-shell';
import type { LivePricingCardProps } from '@/types/pricing';
import { durationLabel, formatBdt } from '@/lib/format-money';

export function LivePricingCard({ plan, index, isAuthenticated }: LivePricingCardProps) {
  const isPopular = index === 1 || plan.slug.includes('standard') || plan.slug.includes('basic');
  const href = isAuthenticated
    ? `/post-auth?plan=${encodeURIComponent(plan.slug)}`
    : `/signup?plan=${encodeURIComponent(plan.slug)}`;

  return (
    <PricingCardShell
      name={plan.name}
      badge={
        plan.trial.included
          ? `${plan.trial.days}-Day Trial`
          : isPopular
            ? 'Recommended'
            : 'Active Plan'
      }
      desc="For coaching centers building a dependable daily rhythm."
      priceDisplay={formatBdt(plan.priceMinor)}
      periodDisplay={`/ ${durationLabel(plan.durationDays)}`}
      features={plan.features.map((feature) => ({
        key: feature.key,
        label: feature.name,
        limit: feature.defaultLimit,
      }))}
      isPopular={isPopular}
      ctaHref={href}
      ctaLabel={`Choose ${plan.name}`}
    />
  );
}
