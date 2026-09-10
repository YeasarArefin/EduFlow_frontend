import { apiRequest } from '@/lib/api/client';
import type { BatchTeacher } from '@/types/batches';

export type { BatchTeacher };

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
export const getBatchTeachers = (workspaceId: string, batchId: string, signal?: AbortSignal) =>
  apiRequest<BatchTeacher[]>(`/batches/${batchId}/teachers`, {
    headers: headers(workspaceId),
    signal,
  });
export const assignBatchTeacher = (
  workspaceId: string,
  batchId: string,
  input: { teacherId: string; isPrimary: boolean }
) =>
  apiRequest<BatchTeacher[]>(`/batches/${batchId}/teachers`, {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const updateBatchTeacher = (
  workspaceId: string,
  batchId: string,
  teacherId: string,
  isPrimary: boolean
) =>
  apiRequest<BatchTeacher[]>(`/batches/${batchId}/teachers/${teacherId}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { isPrimary },
  });
export const removeBatchTeacher = (workspaceId: string, batchId: string, teacherId: string) =>
  apiRequest<BatchTeacher[]>(`/batches/${batchId}/teachers/${teacherId}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });
