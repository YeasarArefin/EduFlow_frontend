import { apiRequest } from '@/lib/api/client';
export type StudentEnrollment = {
  id: string;
  batchId: string;
  batchName: string;
  joinedAt: string;
  status: string;
  feeOverrideMinor: string | null;
  discountMinor: string | null;
};
export const getStudentEnrollments = (
  workspaceId: string,
  studentId: string,
  signal?: AbortSignal
) =>
  apiRequest<StudentEnrollment[]>(`/students/${studentId}/enrollments`, {
    headers: { 'X-Workspace-Id': workspaceId },
    signal,
  });
