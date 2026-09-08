export const permissionKeys = {
  all: ["permission-management"] as const,
  configuration: (workspaceId: string) => [...permissionKeys.all, workspaceId] as const,
  member: (workspaceId: string, memberId: string) => [...permissionKeys.all, workspaceId, "member", memberId] as const,
};
