import type { StudentListParams } from './api/students';

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (workspaceId: string, params: StudentListParams) =>
    [...studentKeys.lists(), workspaceId, params] as const,
  detail: (workspaceId: string, studentId: string) =>
    [...studentKeys.all, 'detail', workspaceId, studentId] as const,
};
