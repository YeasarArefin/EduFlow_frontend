"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAttendanceSession,
  finalizeAttendanceSession,
  getAttendanceSession,
  getAttendanceSessions,
  saveAttendance,
  type AttendanceRecordInput,
  type AttendanceSessionListParams,
} from "../api/attendance";
import { attendanceKeys } from "../attendance-query-keys";

export function useAttendanceSessionsQuery(
  workspaceId: string,
  params: AttendanceSessionListParams,
  enabled = true,
) {
  return useQuery({
    queryKey: attendanceKeys.list(workspaceId, params),
    queryFn: ({ signal }) => getAttendanceSessions(workspaceId, params, signal),
    enabled: Boolean(workspaceId) && enabled,
    staleTime: 15_000,
  });
}

export function useAttendanceSessionQuery(workspaceId: string, sessionId: string | null) {
  return useQuery({
    queryKey: sessionId ? attendanceKeys.detail(workspaceId, sessionId) : ["attendance", "disabled"],
    queryFn: ({ signal }) =>
      sessionId
        ? getAttendanceSession(workspaceId, sessionId, signal)
        : Promise.resolve(null),
    enabled: Boolean(workspaceId && sessionId),
    staleTime: 15_000,
  });
}

function useInvalidateAttendance() {
  const queryClient = useQueryClient();
  return (workspaceId: string, sessionId?: string) => {
    queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() });
    if (sessionId) {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.detail(workspaceId, sessionId) });
    }
  };
}

export function useCreateAttendanceSessionMutation(workspaceId: string) {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: (input: { batchId: string; sessionDate: string }) =>
      createAttendanceSession(workspaceId, input),
    onSuccess: (session) => invalidate(workspaceId, session.id),
  });
}

export function useSaveAttendanceMutation(workspaceId: string) {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: ({ sessionId, records }: { sessionId: string; records: AttendanceRecordInput[] }) =>
      saveAttendance(workspaceId, sessionId, records),
    onSuccess: (session) => invalidate(workspaceId, session.id),
  });
}

export function useFinalizeAttendanceSessionMutation(workspaceId: string) {
  const invalidate = useInvalidateAttendance();
  return useMutation({
    mutationFn: (sessionId: string) => finalizeAttendanceSession(workspaceId, sessionId),
    onSuccess: (session) => invalidate(workspaceId, session.id),
  });
}
