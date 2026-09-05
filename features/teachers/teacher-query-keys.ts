import type { TeacherListParams } from "./api/teachers";
export const teacherKeys = {
  all: ["teachers"] as const,
  lists: () => [...teacherKeys.all, "list"] as const,
  list: (workspaceId: string, params: TeacherListParams) =>
    [...teacherKeys.lists(), workspaceId, params] as const,
  detail: (workspaceId: string, id: string) =>
    [...teacherKeys.all, "detail", workspaceId, id] as const,
};
