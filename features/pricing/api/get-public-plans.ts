import { serverEnv } from '@/config/server-env';
import type { PublicPlan, PublicPlansResponse } from '@/types/pricing';

export type { PublicPlan } from '@/types/pricing';

export async function getPublicPlans(): Promise<PublicPlan[] | null> {
  try {
    const response = await fetch(`${serverEnv.apiBaseUrl}/public/plans`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as PublicPlansResponse;
    return Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
}
