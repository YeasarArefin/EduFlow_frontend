'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveStudent } from '../api/students';
import type { ArchiveStudentMutationInput } from '@/types/students';
import { studentKeys } from '../student-query-keys';

export function useArchiveStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, studentId }: ArchiveStudentMutationInput) =>
      archiveStudent(workspaceId, studentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentKeys.all }),
  });
}
