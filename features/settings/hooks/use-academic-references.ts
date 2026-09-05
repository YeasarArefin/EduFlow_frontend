"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAcademicReference,
  getAcademicReferences,
  renameAcademicReference,
  setAcademicReferenceStatus,
  type AcademicResource,
} from "../api/academic-references";
const key = (workspaceId: string, resource: AcademicResource) =>
  ["academic-references", workspaceId, resource] as const;
export function useAcademicReferences(
  workspaceId: string,
  resource: AcademicResource,
) {
  return useQuery({
    queryKey: key(workspaceId, resource),
    queryFn: ({ signal }) =>
      getAcademicReferences(workspaceId, resource, signal),
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
    mutationFn: ({
      workspaceId,
      resource,
      name,
    }: {
      workspaceId: string;
      resource: AcademicResource;
      name: string;
    }) => createAcademicReference(workspaceId, resource, name),
    onSuccess: (_, variables) =>
      invalidate(variables.workspaceId, variables.resource),
  });
}
export function useRenameAcademicReference() {
  const invalidate = useAcademicMutation();
  return useMutation({
    mutationFn: ({
      workspaceId,
      resource,
      id,
      name,
    }: {
      workspaceId: string;
      resource: AcademicResource;
      id: string;
      name: string;
    }) => renameAcademicReference(workspaceId, resource, id, name),
    onSuccess: (_, variables) =>
      invalidate(variables.workspaceId, variables.resource),
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
    }: {
      workspaceId: string;
      resource: AcademicResource;
      id: string;
      isActive: boolean;
    }) => setAcademicReferenceStatus(workspaceId, resource, id, isActive),
    onSuccess: (_, variables) =>
      invalidate(variables.workspaceId, variables.resource),
  });
}
