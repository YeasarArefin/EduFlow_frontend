'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStudent } from '../api/students';
import type { UpdateStudentMutationInput } from '@/types/students';
import { studentKeys } from '../student-query-keys';

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, studentId, input }: UpdateStudentMutationInput) =>
      updateStudent(workspaceId, studentId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentKeys.all }),
  });
}
