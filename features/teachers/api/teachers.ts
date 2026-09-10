import { apiListRequest, apiRequest } from '@/lib/api/client';
import {
  TEACHER_STATUSES,
  type PaginationMeta,
  type Teacher,
  type TeacherInput,
  type TeacherListParams,
  type TeacherStatus,
} from '@/types/teachers';

export { TEACHER_STATUSES };
export type { PaginationMeta, Teacher, TeacherInput, TeacherListParams, TeacherStatus };
const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
export function getTeachers(workspaceId: string, params: TeacherListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  return apiListRequest<Teacher[], PaginationMeta>(`/teachers?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export const getTeacher = (workspaceId: string, id: string, signal?: AbortSignal) =>
  apiRequest<Teacher>(`/teachers/${id}`, {
    headers: headers(workspaceId),
    signal,
  });
export const createTeacher = (workspaceId: string, input: TeacherInput) =>
  apiRequest<Teacher>('/teachers', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const updateTeacher = (workspaceId: string, id: string, input: Partial<TeacherInput>) =>
  apiRequest<Teacher>(`/teachers/${id}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
export const archiveTeacher = (workspaceId: string, id: string) =>
  apiRequest<Teacher>(`/teachers/${id}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });
