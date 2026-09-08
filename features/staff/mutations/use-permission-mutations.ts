"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createRole,
  deleteRole,
  resetMemberOverrides,
  updateMemberOverrides,
  updateRole,
} from "../api/permission-management";
import { permissionKeys } from "../permission-query-keys";
const invalidate = (client: ReturnType<typeof useQueryClient>) => () =>
  client.invalidateQueries({ queryKey: permissionKeys.all });
export const useCreateRoleMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      ...input
    }: {
      workspaceId: string;
      name: string;
      description?: string;
      permissions: { permissionCode: number; allowed: boolean }[];
    }) => createRole(workspaceId, input),
    onSuccess: invalidate(c),
  });
};
export const useUpdateRoleMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      roleId,
      ...input
    }: {
      workspaceId: string;
      roleId: string;
      name: string;
      description?: string;
      permissions: { permissionCode: number; allowed: boolean }[];
    }) => updateRole(workspaceId, roleId, input),
    onSuccess: invalidate(c),
  });
};
export const useDeleteRoleMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      roleId,
    }: {
      workspaceId: string;
      roleId: string;
    }) => deleteRole(workspaceId, roleId),
    onSuccess: invalidate(c),
  });
};
export const useUpdateMemberOverridesMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
      overrides,
    }: {
      workspaceId: string;
      memberId: string;
      overrides: { permissionCode: number; allowed: boolean }[];
    }) => updateMemberOverrides(workspaceId, memberId, overrides),
    onSuccess: invalidate(c),
  });
};
export const useResetMemberOverridesMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      memberId,
    }: {
      workspaceId: string;
      memberId: string;
    }) => resetMemberOverrides(workspaceId, memberId),
    onSuccess: invalidate(c),
  });
};
