import type { PublicPlan } from '@/types/pricing';

export function findPublicPlan(plans: PublicPlan[] | null, slug: string | undefined) {
  return plans?.find((plan) => plan.slug === slug);
}
