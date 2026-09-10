'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from '../api/students';
import type { CreateStudentMutationInput } from '@/types/students';
import { studentKeys } from '../student-query-keys';

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, input }: CreateStudentMutationInput) =>
      createStudent(workspaceId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: studentKeys.all }),
  });
}
