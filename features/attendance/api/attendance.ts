import { apiListRequest, apiRequest } from '@/lib/api/client';
import {
  ATTENDANCE_RECORD_STATUSES,
  ATTENDANCE_SESSION_STATUSES,
  type AttendanceRecordInput,
  type AttendanceSession,
  type AttendanceSessionListMeta,
  type AttendanceSessionListParams,
  type AttendanceSessionSummary,
  type CreateAttendanceSessionInput,
} from '@/types/attendance';

export { ATTENDANCE_RECORD_STATUSES, ATTENDANCE_SESSION_STATUSES };
export type {
  AttendanceRecord,
  AttendanceRecordInput,
  AttendanceRecordStatus,
  AttendanceSession,
  AttendanceSessionListMeta,
  AttendanceSessionListParams,
  AttendanceSessionStatus,
  AttendanceSessionSummary,
  CreateAttendanceSessionInput,
} from '@/types/attendance';

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });

export function getAttendanceSessions(
  workspaceId: string,
  params: AttendanceSessionListParams,
  signal?: AbortSignal
) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.batchId) query.set('batchId', params.batchId);
  if (params.sessionDate) query.set('sessionDate', params.sessionDate);
  if (params.status) query.set('status', params.status);

  return apiListRequest<AttendanceSessionSummary[], AttendanceSessionListMeta>(
    `/attendance-sessions?${query}`,
    { headers: headers(workspaceId), signal }
  );
}

export function getAttendanceSession(workspaceId: string, sessionId: string, signal?: AbortSignal) {
  return apiRequest<AttendanceSession>(`/attendance-sessions/${sessionId}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function createAttendanceSession(workspaceId: string, input: CreateAttendanceSessionInput) {
  return apiRequest<AttendanceSession>('/attendance-sessions', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
}

export function saveAttendance(
  workspaceId: string,
  sessionId: string,
  records: AttendanceRecordInput[]
) {
  return apiRequest<AttendanceSession>(`/attendance-sessions/${sessionId}/records`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: { records },
  });
}

export function finalizeAttendanceSession(workspaceId: string, sessionId: string) {
  return apiRequest<AttendanceSession>(`/attendance-sessions/${sessionId}/finalize`, {
    method: 'POST',
    headers: headers(workspaceId),
  });
}
