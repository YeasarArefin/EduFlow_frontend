import { apiRequest } from '@/lib/api/client';

export type PlatformPlan = {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  durationDays: number;
  trialDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  features: PlatformPlanFeature[];
};

export type PlatformPlanFeature = {
  featureKey: string;
  enabled: boolean;
  limitValue: string | null;
};

export type PlatformFeatureCatalogItem = {
  key: string;
  name: string;
  description: string | null;
};

export type PlatformPlanInput = Pick<
  PlatformPlan,
  'name' | 'slug' | 'priceMinor' | 'durationDays' | 'trialDays'
>;

export function getPlatformPlans(signal?: AbortSignal) {
  return apiRequest<PlatformPlan[]>('/plans', { signal });
}

export function getPlatformFeatureCatalog(signal?: AbortSignal) {
  return apiRequest<PlatformFeatureCatalogItem[]>('/plans/features', { signal });
}

export function createPlatformPlan(input: PlatformPlanInput) {
  return apiRequest<PlatformPlan>('/plans', { method: 'POST', body: input });
}

export function updatePlatformPlan(
  planId: string,
  input: Partial<PlatformPlanInput> & { features?: PlatformPlanFeature[] }
) {
  return apiRequest<PlatformPlan>(`/plans/${planId}`, { method: 'PATCH', body: input });
}

export function setPlatformPlanActive(planId: string, isActive: boolean) {
  return apiRequest<PlatformPlan>(`/plans/${planId}/${isActive ? 'activate' : 'deactivate'}`, {
    method: 'POST',
  });
}
