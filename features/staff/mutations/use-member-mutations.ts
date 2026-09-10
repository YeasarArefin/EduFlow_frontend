'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMember, removeMember, updateMemberRole, updateMemberStatus } from '../api/members';
import type {
  AddMemberMutationInput,
  RemoveMemberMutationInput,
  UpdateMemberRoleMutationInput,
  UpdateMemberStatusMutationInput,
} from '@/types/staff';
import { memberKeys } from '../member-query-keys';

function useInvalidateMembers() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: memberKeys.all });
}

export function useAddMemberMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ workspaceId, name, email, password, roleId }: AddMemberMutationInput) =>
      addMember(workspaceId, { name, email, password, roleId }),
    onSuccess: invalidate,
  });
}
export function useUpdateMemberRoleMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ workspaceId, id, roleId }: UpdateMemberRoleMutationInput) =>
      updateMemberRole(workspaceId, id, roleId),
    onSuccess: invalidate,
  });
}
export function useUpdateMemberStatusMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ workspaceId, id, status }: UpdateMemberStatusMutationInput) =>
      updateMemberStatus(workspaceId, id, status),
    onSuccess: invalidate,
  });
}
export function useRemoveMemberMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ workspaceId, id }: RemoveMemberMutationInput) => removeMember(workspaceId, id),
    onSuccess: invalidate,
  });
}
