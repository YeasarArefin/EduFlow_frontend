import { apiRequest } from '@/lib/api/client';
import type {
  PlatformFeatureCatalogItem,
  PlatformPlan,
  PlatformPlanFeature,
  PlatformPlanInput,
  PlatformPlanDeleteResult,
} from '@/types/platform';
export type {
  PlatformFeatureCatalogItem,
  PlatformPlan,
  PlatformPlanFeature,
  PlatformPlanInput,
} from '@/types/platform';

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

export function deletePlatformPlan(planId: string) {
  return apiRequest<PlatformPlanDeleteResult>(`/plans/${planId}`, { method: 'DELETE' });
}
