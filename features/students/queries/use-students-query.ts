"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getStudent,
  getStudents,
  type StudentListParams,
} from "../api/students";
import { studentKeys } from "../student-query-keys";

export function useStudentsQuery(
  workspaceId: string,
  params: StudentListParams,
) {
  return useQuery({
    queryKey: studentKeys.list(workspaceId, params),
    queryFn: ({ signal }) => getStudents(workspaceId, params, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

export function useStudentQuery(workspaceId: string, studentId: string) {
  return useQuery({
    queryKey: studentKeys.detail(workspaceId, studentId),
    queryFn: ({ signal }) => getStudent(workspaceId, studentId, signal),
    enabled: Boolean(workspaceId && studentId),
    staleTime: 30_000,
  });
}
