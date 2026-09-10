'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAcademicReference,
  getAcademicReferences,
  renameAcademicReference,
  setAcademicReferenceStatus,
} from '../api/academic-references';
import type {
  AcademicResource,
  AcademicReferenceMutationInput,
  CreateAcademicReferenceMutationInput,
  SetAcademicReferenceStatusMutationInput,
} from '@/types/settings';
const key = (workspaceId: string, resource: AcademicResource) =>
  ['academic-references', workspaceId, resource] as const;
export function useAcademicReferences(workspaceId: string, resource: AcademicResource) {
  return useQuery({
    queryKey: key(workspaceId, resource),
    queryFn: ({ signal }) => getAcademicReferences(workspaceId, resource, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}
function useAcademicMutation() {
  const client = useQueryClient();
  return (workspaceId: string, resource: AcademicResource) =>
    client.invalidateQueries({ queryKey: key(workspaceId, resource) });
}
export function useCreateAcademicReference() {
  const invalidate = useAcademicMutation();
  return useMutation({
    mutationFn: ({ workspaceId, resource, name }: CreateAcademicReferenceMutationInput) =>
      createAcademicReference(workspaceId, resource, name),
    onSuccess: (_, variables) => invalidate(variables.workspaceId, variables.resource),
  });
}
export function useRenameAcademicReference() {
  const invalidate = useAcademicMutation();
  return useMutation({
    mutationFn: ({ workspaceId, resource, id, name }: AcademicReferenceMutationInput) =>
      renameAcademicReference(workspaceId, resource, id, name),
    onSuccess: (_, variables) => invalidate(variables.workspaceId, variables.resource),
  });
}
export function useSetAcademicReferenceStatus() {
  const invalidate = useAcademicMutation();
  return useMutation({
    mutationFn: ({
      workspaceId,
      resource,
      id,
      isActive,
    }: SetAcademicReferenceStatusMutationInput) =>
      setAcademicReferenceStatus(workspaceId, resource, id, isActive),
    onSuccess: (_, variables) => invalidate(variables.workspaceId, variables.resource),
  });
}
