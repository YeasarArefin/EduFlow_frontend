import { apiRequest } from '@/lib/api/client';

export type Enrollment = {
  id: string;
  studentId: string;
  studentCode: string;
  name: string;
  phone: string | null;
  joinedAt: string;
  status: 'active' | 'inactive' | 'completed' | 'cancelled' | 'archived';
  feeOverrideMinor: string | null;
  discountMinor: string | null;
  createdAt: string;
  updatedAt: string;
};

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export const getEnrollments = (workspaceId: string, batchId: string, signal?: AbortSignal) =>
  apiRequest<Enrollment[]>(`/batches/${batchId}/students`, {
    headers: headers(workspaceId),
    signal,
  });

export const enroll = (
  workspaceId: string,
  batchId: string,
  input: {
    studentId: string;
    joinedAt?: string;
    feeOverrideMinor?: string | null;
    discountMinor?: string | null;
  }
) =>
  apiRequest<Enrollment[]>(`/batches/${batchId}/students`, {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });

export const updateEnrollment = (
  workspaceId: string,
  batchId: string,
  id: string,
  input: Partial<Pick<Enrollment, 'status' | 'joinedAt' | 'feeOverrideMinor' | 'discountMinor'>>
) =>
  apiRequest<Enrollment[]>(`/batches/${batchId}/students/${id}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });

export const unenrollStudent = (workspaceId: string, batchId: string, id: string) =>
  apiRequest<Enrollment[]>(`/batches/${batchId}/students/${id}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });

export const archiveEnrollment = (workspaceId: string, batchId: string, id: string) =>
  updateEnrollment(workspaceId, batchId, id, { status: 'archived' });

export const reactivateEnrollment = (workspaceId: string, batchId: string, id: string) =>
  updateEnrollment(workspaceId, batchId, id, { status: 'active' });
