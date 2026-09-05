import { apiListRequest, apiRequest } from "@/lib/api/client";

export const STUDENT_STATUSES = ["active", "inactive", "archived"] as const;
export type StudentStatus = (typeof STUDENT_STATUSES)[number];
export type Student = {
  id: string;
  studentCode: string;
  fullName: string;
  phone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  address: string | null;
  gender: "male" | "female" | "other" | null;
  admissionDate: string | null;
  status: StudentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
export type StudentInput = {
  studentCode: string;
  fullName: string;
  phone?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  gender?: "male" | "female" | "other" | null;
  admissionDate?: string | null;
  status?: StudentStatus;
  notes?: string | null;
};
export type StudentListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: StudentStatus;
};
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
const headers = (workspaceId: string) => ({ "X-Workspace-Id": workspaceId });

export function getStudents(
  workspaceId: string,
  params: StudentListParams,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  return apiListRequest<Student[], PaginationMeta>(`/students?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export function getStudent(
  workspaceId: string,
  studentId: string,
  signal?: AbortSignal,
) {
  return apiRequest<Student>(`/students/${studentId}`, {
    headers: headers(workspaceId),
    signal,
  });
}
export function createStudent(workspaceId: string, input: StudentInput) {
  return apiRequest<Student>("/students", {
    method: "POST",
    headers: headers(workspaceId),
    body: input,
  });
}
export function updateStudent(
  workspaceId: string,
  studentId: string,
  input: Partial<StudentInput>,
) {
  return apiRequest<Student>(`/students/${studentId}`, {
    method: "PATCH",
    headers: headers(workspaceId),
    body: input,
  });
}
export function archiveStudent(workspaceId: string, studentId: string) {
  return apiRequest<Student>(`/students/${studentId}`, {
    method: "DELETE",
    headers: headers(workspaceId),
  });
}
