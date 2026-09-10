'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveTeacher, createTeacher, updateTeacher } from '../api/teachers';
import type {
  ArchiveTeacherMutationInput,
  CreateTeacherMutationInput,
  UpdateTeacherMutationInput,
} from '@/types/teachers';
import { teacherKeys } from '../teacher-query-keys';
const useInvalidate = () => {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: teacherKeys.all });
};
export function useCreateTeacherMutation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, input }: CreateTeacherMutationInput) =>
      createTeacher(workspaceId, input),
    onSuccess: invalidate,
  });
}
export function useUpdateTeacherMutation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, id, input }: UpdateTeacherMutationInput) =>
      updateTeacher(workspaceId, id, input),
    onSuccess: invalidate,
  });
}
export function useArchiveTeacherMutation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, id }: ArchiveTeacherMutationInput) =>
      archiveTeacher(workspaceId, id),
    onSuccess: invalidate,
  });
}
