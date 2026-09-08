import { apiListRequest, apiRequest } from "@/lib/api/client";

export const ATTENDANCE_SESSION_STATUSES = ["draft", "finalized"] as const;
export const ATTENDANCE_RECORD_STATUSES = ["present", "absent"] as const;

export type AttendanceSessionStatus = (typeof ATTENDANCE_SESSION_STATUSES)[number];
export type AttendanceRecordStatus = (typeof ATTENDANCE_RECORD_STATUSES)[number];

export type AttendanceRecord = {
  id: string;
  studentId: string;
  status: AttendanceRecordStatus;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    studentCode: string;
    fullName: string;
    phone: string | null;
  };
};

export type AttendanceSession = {
  id: string;
  batchId: string;
  sessionDate: string;
  status: AttendanceSessionStatus;
  batch: { id: string; name: string };
  records: AttendanceRecord[];
  createdAt: string;
  updatedAt: string;
};

export type AttendanceSessionSummary = Omit<AttendanceSession, "records"> & {
  rosterCount: number;
  presentCount: number;
  absentCount: number;
};

export type AttendanceSessionListParams = {
  batchId?: string;
  sessionDate?: string;
  status?: AttendanceSessionStatus;
  page?: number;
  limit?: number;
};

export type AttendanceSessionListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type AttendanceRecordInput = Pick<AttendanceRecord, "studentId" | "status">;

const headers = (workspaceId: string) => ({ "X-Workspace-Id": workspaceId });

export function getAttendanceSessions(
  workspaceId: string,
  params: AttendanceSessionListParams,
  signal?: AbortSignal,
) {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.batchId) query.set("batchId", params.batchId);
  if (params.sessionDate) query.set("sessionDate", params.sessionDate);
  if (params.status) query.set("status", params.status);

  return apiListRequest<AttendanceSessionSummary[], AttendanceSessionListMeta>(
    `/attendance-sessions?${query}`,
    { headers: headers(workspaceId), signal },
  );
}

export function getAttendanceSession(
  workspaceId: string,
  sessionId: string,
  signal?: AbortSignal,
) {
  return apiRequest<AttendanceSession>(`/attendance-sessions/${sessionId}`, {
    headers: headers(workspaceId),
    signal,
  });
}

export function createAttendanceSession(
  workspaceId: string,
  input: { batchId: string; sessionDate: string },
) {
  return apiRequest<AttendanceSession>("/attendance-sessions", {
    method: "POST",
    headers: headers(workspaceId),
    body: input,
  });
}

export function saveAttendance(
  workspaceId: string,
  sessionId: string,
  records: AttendanceRecordInput[],
) {
  return apiRequest<AttendanceSession>(`/attendance-sessions/${sessionId}/records`, {
    method: "PATCH",
    headers: headers(workspaceId),
    body: { records },
  });
}

export function finalizeAttendanceSession(workspaceId: string, sessionId: string) {
  return apiRequest<AttendanceSession>(`/attendance-sessions/${sessionId}/finalize`, {
    method: "POST",
    headers: headers(workspaceId),
  });
}
