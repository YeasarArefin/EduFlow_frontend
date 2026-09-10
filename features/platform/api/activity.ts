import { apiListRequest } from '@/lib/api/client';
import type { ActivityListParams, PaginationMeta, PlatformActivity } from '@/types/platform';
export type { ActivityListParams, PlatformActivity } from '@/types/platform';

export function getPlatformActivity(params: ActivityListParams, signal?: AbortSignal) {
  const search = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) search.set('search', params.search);
  if (params.category) search.set('category', params.category);
  return apiListRequest<PlatformActivity[], PaginationMeta>(`/activity?${search}`, { signal });
}
