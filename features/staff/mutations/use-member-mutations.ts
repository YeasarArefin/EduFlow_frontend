'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addMember, removeMember, updateMemberRole, updateMemberStatus } from '../api/members';
import { memberKeys } from '../member-query-keys';

function useInvalidateMembers() {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: memberKeys.all });
}

export function useAddMemberMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({
      workspaceId,
      name,
      email,
      password,
      roleId,
    }: {
      workspaceId: string;
      name: string;
      email: string;
      password: string;
      roleId: string;
    }) => addMember(workspaceId, { name, email, password, roleId }),
    onSuccess: invalidate,
  });
}
export function useUpdateMemberRoleMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({
      workspaceId,
      id,
      roleId,
    }: {
      workspaceId: string;
      id: string;
      roleId: string;
    }) => updateMemberRole(workspaceId, id, roleId),
    onSuccess: invalidate,
  });
}
export function useUpdateMemberStatusMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({
      workspaceId,
      id,
      status,
    }: {
      workspaceId: string;
      id: string;
      status: 'active' | 'suspended';
    }) => updateMemberStatus(workspaceId, id, status),
    onSuccess: invalidate,
  });
}
export function useRemoveMemberMutation() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      removeMember(workspaceId, id),
    onSuccess: invalidate,
  });
}
