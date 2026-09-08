import type { MemberListParams } from "./api/members";

export const memberKeys = {
  all: ["workspace-members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  list: (workspaceId: string, params: MemberListParams) => [...memberKeys.lists(), workspaceId, params] as const,
};
