"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createWorkspaceEntitlementOverride, getWorkspaceEntitlementOverrides, removeWorkspaceEntitlementOverride, updateWorkspaceEntitlementOverride, type WorkspaceEntitlementOverrideInput } from "../api/entitlement-overrides";
import { platformWorkspaceQueryKeys } from "../workspace-query-keys";

const overrideQueryKey = (workspaceId: string) => [...platformWorkspaceQueryKeys.detail(workspaceId), "entitlement-overrides"] as const;

export function useWorkspaceEntitlementOverrides(workspaceId: string) {
  return useQuery({ queryKey: overrideQueryKey(workspaceId), queryFn: ({ signal }) => getWorkspaceEntitlementOverrides(workspaceId, signal), enabled: Boolean(workspaceId), staleTime: 15_000 });
}

function useInvalidateWorkspaceEntitlements() {
  const queryClient = useQueryClient();
  return (workspaceId: string) => Promise.all([
    queryClient.invalidateQueries({ queryKey: overrideQueryKey(workspaceId) }),
    queryClient.invalidateQueries({ queryKey: platformWorkspaceQueryKeys.detail(workspaceId) }),
  ]);
}

export function useSaveWorkspaceEntitlementOverride() {
  const invalidate = useInvalidateWorkspaceEntitlements();
  return useMutation({
    mutationFn: ({ workspaceId, overrideId, input }: { workspaceId: string; overrideId?: string; input: WorkspaceEntitlementOverrideInput }) => overrideId ? updateWorkspaceEntitlementOverride(workspaceId, overrideId, input) : createWorkspaceEntitlementOverride(workspaceId, input),
    onSuccess: async (_override, variables) => { await invalidate(variables.workspaceId); toast.success(variables.overrideId ? "Workspace override updated." : "Workspace override created."); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not save the workspace override."),
  });
}

export function useRemoveWorkspaceEntitlementOverride() {
  const invalidate = useInvalidateWorkspaceEntitlements();
  return useMutation({
    mutationFn: ({ workspaceId, overrideId }: { workspaceId: string; overrideId: string }) => removeWorkspaceEntitlementOverride(workspaceId, overrideId),
    onSuccess: async (_result, variables) => { await invalidate(variables.workspaceId); toast.success("Override removed. Plan defaults now apply."); },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Could not remove the workspace override."),
  });
}
