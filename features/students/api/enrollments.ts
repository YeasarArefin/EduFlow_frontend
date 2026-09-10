import { apiRequest } from '@/lib/api/client';
import type { StudentEnrollment } from '@/types/students';

export type { StudentEnrollment };
export const getStudentEnrollments = (
  workspaceId: string,
  studentId: string,
  signal?: AbortSignal
) =>
  apiRequest<StudentEnrollment[]>(`/students/${studentId}/enrollments`, {
    headers: { 'X-Workspace-Id': workspaceId },
    signal,
  });
