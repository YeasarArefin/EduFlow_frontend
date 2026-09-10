import { apiRequest } from '@/lib/api/client';
import type { RevenueOverview } from '@/types/platform';
export type { RevenueOverview } from '@/types/platform';

export function getRevenueOverview(params: { from?: string; to?: string }, signal?: AbortSignal) {
  const query = new URLSearchParams();
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  return apiRequest<RevenueOverview>(
    `/payment-requests/revenue-overview${query.size ? `?${query}` : ''}`,
    { signal }
  );
}
