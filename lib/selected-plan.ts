import { getPublicPlans } from '@/features/pricing/api/get-public-plans';

export const SELECTED_PLAN_COOKIE = 'eduflow.selectedPlanSlug';
export const SELECTED_PLAN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
};

export async function validateSelectedPlanSlug(slug: string | undefined) {
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const plans = await getPublicPlans();
  return plans?.some((plan) => plan.slug === slug) ? slug : null;
}
