'use client';
import { useQuery } from '@tanstack/react-query';
import {
  getMemberPermissionConfiguration,
  getPermissionConfiguration,
} from '../api/permission-management';
import { permissionKeys } from '../permission-query-keys';
export const usePermissionConfigurationQuery = (workspaceId: string) =>
  useQuery({
    queryKey: permissionKeys.configuration(workspaceId),
    queryFn: ({ signal }) => getPermissionConfiguration(workspaceId, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
export const useMemberPermissionConfigurationQuery = (workspaceId: string, memberId: string) =>
  useQuery({
    queryKey: permissionKeys.member(workspaceId, memberId),
    queryFn: ({ signal }) => getMemberPermissionConfiguration(workspaceId, memberId, signal),
    enabled: Boolean(workspaceId && memberId),
    staleTime: 30_000,
  });
