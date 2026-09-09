import { apiListRequest, apiRequest } from '@/lib/api/client';

export const BATCH_STATUSES = ['active', 'inactive', 'archived'] as const;
export type BatchStatus = (typeof BATCH_STATUSES)[number];

export type AcademicLabel = {
  id: string;
  name: string;
};

export type Batch = {
  id: string;
  name: string;
  classLevelId: string;
  mediumId: string | null;
  academicGroupId: string | null;
  startDate: string | null;
  monthlyFee?: string;
  monthlyFeeMinor: string;
  status: BatchStatus;
  createdAt: string;
  updatedAt: string;
  classLevel?: AcademicLabel;
  medium?: AcademicLabel | null;
  academicGroup?: AcademicLabel | null;
};

export type BatchInput = {
  name: string;
  classLevelId: string;
  mediumId?: string | null;
  academicGroupId?: string | null;
  startDate?: string | null;
  monthlyFee?: number | string;
  monthlyFeeMinor?: string;
  status?: BatchStatus;
};

export type BatchListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: BatchStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

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
