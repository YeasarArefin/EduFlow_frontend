'use client';
import { useQuery } from '@tanstack/react-query';
import { getTeacher, getTeachers } from '../api/teachers';
import type { TeacherListParams } from '@/types/teachers';
import { teacherKeys } from '../teacher-query-keys';
export const useTeachersQuery = (workspaceId: string, params: TeacherListParams) =>
  useQuery({
    queryKey: teacherKeys.list(workspaceId, params),
    queryFn: ({ signal }) => getTeachers(workspaceId, params, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
export const useTeacherQuery = (workspaceId: string, id: string) =>
  useQuery({
    queryKey: teacherKeys.detail(workspaceId, id),
    queryFn: ({ signal }) => getTeacher(workspaceId, id, signal),
    enabled: Boolean(workspaceId && id),
    staleTime: 30_000,
  });
