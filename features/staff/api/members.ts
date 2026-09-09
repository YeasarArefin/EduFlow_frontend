import { apiListRequest, apiRequest } from '@/lib/api/client';

export const MEMBER_STATUSES = ['active', 'suspended', 'removed'] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];
export type WorkspaceMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string | null;
  roleId: string | null;
  roleCode: number;
  status: MemberStatus;
  joinedAt: string | null;
  createdAt: string;
};
export type MemberListParams = {
  page: number;
  limit: number;
  search?: string;
  roleId?: string;
  status?: MemberStatus;
};
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export function getMembers(workspaceId: string, params: MemberListParams, signal?: AbortSignal) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });
  if (params.search) query.set('search', params.search);
  if (params.roleId) query.set('roleId', params.roleId);
  if (params.status) query.set('status', params.status);
  return apiListRequest<WorkspaceMember[], PaginationMeta>(`/members?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export const addMember = (
  workspaceId: string,
  input: { name: string; email: string; password: string; roleId: string }
) =>
  apiRequest<WorkspaceMember>('/members', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const updateMemberRole = (workspaceId: string, id: string, roleId: string) =>
  apiRequest<WorkspaceMember>(`/members/${id}/role`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { roleId },
  });
export const updateMemberStatus = (
  workspaceId: string,
  id: string,
  status: 'active' | 'suspended'
) =>
  apiRequest<WorkspaceMember>(`/members/${id}/status`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { status },
  });
export const removeMember = (workspaceId: string, id: string) =>
  apiRequest<WorkspaceMember>(`/members/${id}`, {
    method: 'DELETE',
    headers: headers(workspaceId),
  });
