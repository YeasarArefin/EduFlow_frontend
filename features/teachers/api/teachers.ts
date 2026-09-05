import { apiListRequest, apiRequest } from "@/lib/api/client";
export const TEACHER_STATUSES = ["active", "inactive", "archived"] as const;
export type TeacherStatus = (typeof TEACHER_STATUSES)[number];
export type Teacher = {
  id: string;
  teacherCode: string;
  name: string;
  phone: string | null;
  email: string | null;
  subjectSpecialty: string | null;
  defaultSalaryMinor: string;
  status: TeacherStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
export type TeacherInput = {
  teacherCode: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  subjectSpecialty?: string | null;
  defaultSalaryMinor?: string;
  status?: TeacherStatus;
  notes?: string | null;
};
export type TeacherListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: TeacherStatus;
};
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
const headers = (workspaceId: string) => ({ "X-Workspace-Id": workspaceId });
export function getTeachers(
  workspaceId: string,
  params: TeacherListParams,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  return apiListRequest<Teacher[], PaginationMeta>(`/teachers?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export const getTeacher = (
  workspaceId: string,
  id: string,
  signal?: AbortSignal,
) =>
  apiRequest<Teacher>(`/teachers/${id}`, {
    headers: headers(workspaceId),
    signal,
  });
export const createTeacher = (workspaceId: string, input: TeacherInput) =>
  apiRequest<Teacher>("/teachers", {
    method: "POST",
    headers: headers(workspaceId),
    body: input,
  });
export const updateTeacher = (
  workspaceId: string,
  id: string,
  input: Partial<TeacherInput>,
) =>
  apiRequest<Teacher>(`/teachers/${id}`, {
    method: "PATCH",
    headers: headers(workspaceId),
    body: input,
  });
export const archiveTeacher = (workspaceId: string, id: string) =>
  apiRequest<Teacher>(`/teachers/${id}`, {
    method: "DELETE",
    headers: headers(workspaceId),
  });
