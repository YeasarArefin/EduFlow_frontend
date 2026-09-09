import type { AttendanceSessionListParams } from './api/attendance';

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (workspaceId: string, params: AttendanceSessionListParams) =>
    [...attendanceKeys.lists(), workspaceId, params] as const,
  detail: (workspaceId: string, sessionId: string) =>
    [...attendanceKeys.all, 'detail', workspaceId, sessionId] as const,
};
