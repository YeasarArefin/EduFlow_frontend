'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { BatchMutationInput, UpdateBatchMutationInput } from '@/types/batches';
import { createBatch, updateBatch } from '../api/batches';
import { batchKeys } from '../batch-query-keys';
const useInvalidate = () => {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: batchKeys.all });
};
export const useCreateBatchMutation = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, input }: BatchMutationInput) => createBatch(workspaceId, input),
    onSuccess: invalidate,
  });
};
export const useUpdateBatchMutation = () => {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, id, input }: UpdateBatchMutationInput) =>
      updateBatch(workspaceId, id, input),
    onSuccess: invalidate,
  });
};
