import { apiRequest } from '@/lib/api/client';
import type {
  MemberPermissionConfiguration,
  PermissionConfiguration,
  PermissionOverride,
  RoleInput,
  WorkspaceRole,
} from '@/types/staff';
export type {
  MemberPermissionConfiguration,
  Permission,
  PermissionConfiguration,
  WorkspaceRole,
} from '@/types/staff';

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export const getPermissionConfiguration = (workspaceId: string, signal?: AbortSignal) =>
  apiRequest<PermissionConfiguration>('/permission-management', {
    headers: headers(workspaceId),
    signal,
  });
export const createRole = (workspaceId: string, input: RoleInput) =>
  apiRequest<WorkspaceRole>('/permission-management/roles', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const updateRole = (workspaceId: string, roleId: string, input: RoleInput) =>
  apiRequest<PermissionConfiguration>(`/permission-management/roles/${roleId}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
export const deleteRole = (workspaceId: string, roleId: string) =>
  apiRequest<void>(`/permission-management/roles/${roleId}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });
export const getMemberPermissionConfiguration = (
  workspaceId: string,
  memberId: string,
  signal?: AbortSignal
) =>
  apiRequest<MemberPermissionConfiguration>(`/permission-management/members/${memberId}`, {
    headers: headers(workspaceId),
    signal,
  });
export const updateMemberOverrides = (
  workspaceId: string,
  memberId: string,
  overrides: PermissionOverride[]
) =>
  apiRequest<MemberPermissionConfiguration>(`/permission-management/members/${memberId}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { overrides },
  });
export const resetMemberOverrides = (workspaceId: string, memberId: string) =>
  apiRequest<MemberPermissionConfiguration>(`/permission-management/members/${memberId}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });
