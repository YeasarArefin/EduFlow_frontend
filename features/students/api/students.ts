import { apiListRequest, apiRequest } from '@/lib/api/client';
import {
  STUDENT_STATUSES,
  type PaginationMeta,
  type Student,
  type StudentInput,
  type StudentListParams,
  type StudentStatus,
} from '@/types/students';

export { STUDENT_STATUSES };
export type { PaginationMeta, Student, StudentInput, StudentListParams, StudentStatus };
const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export function getStudents(workspaceId: string, params: StudentListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  return apiListRequest<Student[], PaginationMeta>(`/students?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export function getStudent(workspaceId: string, studentId: string, signal?: AbortSignal) {
  return apiRequest<Student>(`/students/${studentId}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export function createStudent(workspaceId: string, input: StudentInput) {
  return apiRequest<Student>('/students', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
}
export function updateStudent(
  workspaceId: string,
  studentId: string,
  input: Partial<StudentInput>
) {
  return apiRequest<Student>(`/students/${studentId}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
}
export function archiveStudent(workspaceId: string, studentId: string) {
  return apiRequest<Student>(`/students/${studentId}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });
}
