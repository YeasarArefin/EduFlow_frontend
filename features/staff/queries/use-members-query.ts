"use client";

import { useQuery } from "@tanstack/react-query";
import { getMembers, type MemberListParams } from "../api/members";
import { memberKeys } from "../member-query-keys";

export const useMembersQuery = (workspaceId: string, params: MemberListParams) =>
  useQuery({
    queryKey: memberKeys.list(workspaceId, params),
    queryFn: ({ signal }) => getMembers(workspaceId, params, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
