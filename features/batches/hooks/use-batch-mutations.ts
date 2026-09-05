"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBatch, updateBatch, type BatchInput } from "../api/batches";
import { batchKeys } from "../batch-query-keys";
const useInvalidate = () => { const client = useQueryClient(); return () => client.invalidateQueries({ queryKey: batchKeys.all }); };
export const useCreateBatchMutation = () => { const invalidate = useInvalidate(); return useMutation({ mutationFn: ({ workspaceId, input }: { workspaceId: string; input: BatchInput }) => createBatch(workspaceId, input), onSuccess: invalidate }); };
export const useUpdateBatchMutation = () => { const invalidate = useInvalidate(); return useMutation({ mutationFn: ({ workspaceId, id, input }: { workspaceId: string; id: string; input: Partial<BatchInput> }) => updateBatch(workspaceId, id, input), onSuccess: invalidate }); };
