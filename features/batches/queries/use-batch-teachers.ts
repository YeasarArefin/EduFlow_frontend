'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  assignBatchTeacher,
  getBatchTeachers,
  removeBatchTeacher,
  updateBatchTeacher,
} from '../api/batch-teachers';
import { batchKeys } from '../batch-query-keys';
import type { BatchTeacherMutationInput, RemoveBatchTeacherMutationInput } from '@/types/batches';

const key = (workspaceId: string, batchId: string) =>
  [...batchKeys.detail(workspaceId, batchId), 'teachers'] as const;
export const useBatchTeachersQuery = (workspaceId: string, batchId: string) =>
  useQuery({
    queryKey: key(workspaceId, batchId),
    queryFn: ({ signal }) => getBatchTeachers(workspaceId, batchId, signal),
    enabled: Boolean(workspaceId && batchId),
    staleTime: 30_000,
  });
function useInvalidateBatchTeachers() {
  const client = useQueryClient();
  return (workspaceId: string, batchId: string) =>
    client.invalidateQueries({ queryKey: key(workspaceId, batchId) });
}
export const useAssignBatchTeacherMutation = () => {
  const invalidate = useInvalidateBatchTeachers();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, teacherId, isPrimary }: BatchTeacherMutationInput) =>
      assignBatchTeacher(workspaceId, batchId, { teacherId, isPrimary }),
    onSuccess: (_, variables) => invalidate(variables.workspaceId, variables.batchId),
  });
};
export const useUpdateBatchTeacherMutation = () => {
  const invalidate = useInvalidateBatchTeachers();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, teacherId, isPrimary }: BatchTeacherMutationInput) =>
      updateBatchTeacher(workspaceId, batchId, teacherId, isPrimary),
    onSuccess: (_, variables) => invalidate(variables.workspaceId, variables.batchId),
  });
};
export const useRemoveBatchTeacherMutation = () => {
  const invalidate = useInvalidateBatchTeachers();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, teacherId }: RemoveBatchTeacherMutationInput) =>
      removeBatchTeacher(workspaceId, batchId, teacherId),
    onSuccess: (_, variables) => invalidate(variables.workspaceId, variables.batchId),
  });
};
