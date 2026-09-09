import { apiRequest } from '@/lib/api/client';

export type Permission = {
  code: number;
  key: string;
  name: string | null;
  module: string | null;
  description: string | null;
};
export type WorkspaceRole = {
  id: string;
  name: string;
  description: string | null;
};
export type PermissionConfiguration = {
  roles: WorkspaceRole[];
  permissions: Array<Permission & { roles: Record<string, boolean> }>;
};
export type MemberPermissionConfiguration = {
  member: { id: string; roleId: string; name: string; email: string };
  permissions: Array<Permission & { inheritedAllowed: boolean; overrideAllowed: boolean | null }>;
};

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export const getPermissionConfiguration = (workspaceId: string, signal?: AbortSignal) =>
  apiRequest<PermissionConfiguration>('/permission-management', {
    headers: headers(workspaceId),
    signal,
  });
export const createRole = (
  workspaceId: string,
  input: {
    name: string;
    description?: string;
    permissions: { permissionCode: number; allowed: boolean }[];
  }
) =>
  apiRequest<WorkspaceRole>('/permission-management/roles', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const updateRole = (
  workspaceId: string,
  roleId: string,
  input: {
    name: string;
    description?: string;
    permissions: { permissionCode: number; allowed: boolean }[];
  }
) =>
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
  overrides: { permissionCode: number; allowed: boolean }[]
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
