export type StaticTier = {
  name: string;
  badge: string;
  price: string;
  period: string;
  desc: string;
  highlight?: boolean;
  features: string[];
};

export type PricingFeature = { key: string; label: string; limit?: string | null };

export type PricingCardShellProps = {
  name: string;
  badge: string;
  desc: string;
  priceDisplay: string;
  periodDisplay: string;
  features: PricingFeature[];
  isPopular: boolean;
  ctaHref: string;
  ctaLabel: string;
};

export type PublicPlanFeature = {
  key: string;
  name: string;
  description: string | null;
  defaultLimit: string | null;
};

export type PublicPlan = {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  durationDays: number;
  trial: { included: boolean; days: number };
  features: PublicPlanFeature[];
  quotas: Record<string, string | null>;
};

export type PublicPlansResponse = { data: PublicPlan[] };
export type LivePricingCardProps = { plan: PublicPlan; index: number; isAuthenticated: boolean };
export type PricingPreviewSectionProps = { plans?: PublicPlan[] | null; isAuthenticated?: boolean };
