import { PricingCardShell } from '@/features/pricing/components/pricing-card-shell';
import type { StaticTier } from '@/types/pricing';

export function StaticPricingCard({
  tier,
  isAuthenticated,
}: {
  tier: StaticTier;
  isAuthenticated: boolean;
}) {
  return (
    <PricingCardShell
      name={tier.name}
      badge={tier.badge}
      desc={tier.desc}
      priceDisplay={tier.price}
      periodDisplay={tier.period}
      features={tier.features.map((feature) => ({ key: feature, label: feature }))}
      isPopular={tier.highlight ?? false}
      ctaHref={isAuthenticated ? '/post-auth' : '/signup'}
      ctaLabel="Start Free Trial"
    />
  );
}
