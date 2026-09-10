'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createRole,
  deleteRole,
  resetMemberOverrides,
  updateMemberOverrides,
  updateRole,
} from '../api/permission-management';
import { permissionKeys } from '../permission-query-keys';
import type {
  CreateRoleMutationInput,
  DeleteRoleMutationInput,
  ResetMemberOverridesMutationInput,
  UpdateMemberOverridesMutationInput,
  UpdateRoleMutationInput,
} from '@/types/staff';
const invalidate = (client: ReturnType<typeof useQueryClient>) => () =>
  client.invalidateQueries({ queryKey: permissionKeys.all });
export const useCreateRoleMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, ...input }: CreateRoleMutationInput) =>
      createRole(workspaceId, input),
    onSuccess: invalidate(c),
  });
};
export const useUpdateRoleMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, roleId, ...input }: UpdateRoleMutationInput) =>
      updateRole(workspaceId, roleId, input),
    onSuccess: invalidate(c),
  });
};
export const useDeleteRoleMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, roleId }: DeleteRoleMutationInput) =>
      deleteRole(workspaceId, roleId),
    onSuccess: invalidate(c),
  });
};
export const useUpdateMemberOverridesMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId, overrides }: UpdateMemberOverridesMutationInput) =>
      updateMemberOverrides(workspaceId, memberId, overrides),
    onSuccess: invalidate(c),
  });
};
export const useResetMemberOverridesMutation = () => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, memberId }: ResetMemberOverridesMutationInput) =>
      resetMemberOverrides(workspaceId, memberId),
    onSuccess: invalidate(c),
  });
};
