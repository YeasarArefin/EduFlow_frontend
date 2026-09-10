import { apiListRequest, apiRequest } from '@/lib/api/client';
import {
  BATCH_STATUSES,
  type AcademicLabel,
  type Batch,
  type BatchInput,
  type BatchListParams,
  type BatchStatus,
  type PaginationMeta,
} from '@/types/batches';

export { BATCH_STATUSES };
export type { AcademicLabel, Batch, BatchInput, BatchListParams, BatchStatus, PaginationMeta };

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export function getBatches(workspaceId: string, params: BatchListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({ page: String(params.page), limit: String(params.limit) });
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  return apiListRequest<Batch[], PaginationMeta>(`/batches?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export const getBatch = (workspaceId: string, id: string, signal?: AbortSignal) =>
  apiRequest<Batch>(`/batches/${id}`, { headers: headers(workspaceId), signal });

export const createBatch = (workspaceId: string, input: BatchInput) =>
  apiRequest<Batch>('/batches', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });

export const updateBatch = (workspaceId: string, id: string, input: Partial<BatchInput>) =>
  apiRequest<Batch>(`/batches/${id}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
