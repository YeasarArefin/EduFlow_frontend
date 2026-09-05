"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveEnrollment,
  enroll,
  getEnrollments,
  reactivateEnrollment,
  unenrollStudent,
  updateEnrollment,
} from "../api/batch-enrollments";
import { batchKeys } from "../batch-query-keys";

const key = (w: string, b: string) =>
  [...batchKeys.detail(w, b), "students"] as const;

export const useBatchEnrollments = (w: string, b: string) =>
  useQuery({
    queryKey: key(w, b),
    queryFn: ({ signal }) => getEnrollments(w, b, signal),
    enabled: Boolean(w && b),
    staleTime: 30_000,
  });

const useInvalidate = () => {
  const c = useQueryClient();
  return (w: string, b: string) => c.invalidateQueries({ queryKey: key(w, b) });
};

export const useEnrollStudent = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      batchId,
      input,
    }: {
      workspaceId: string;
      batchId: string;
      input: Parameters<typeof enroll>[2];
    }) => enroll(workspaceId, batchId, input),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useUpdateEnrollment = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      batchId,
      id,
      input,
    }: {
      workspaceId: string;
      batchId: string;
      id: string;
      input: Parameters<typeof updateEnrollment>[3];
    }) => updateEnrollment(workspaceId, batchId, id, input),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useArchiveEnrollment = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      batchId,
      id,
    }: {
      workspaceId: string;
      batchId: string;
      id: string;
    }) => archiveEnrollment(workspaceId, batchId, id),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useReactivateEnrollment = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      batchId,
      id,
    }: {
      workspaceId: string;
      batchId: string;
      id: string;
    }) => reactivateEnrollment(workspaceId, batchId, id),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useUnenrollStudent = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      batchId,
      id,
    }: {
      workspaceId: string;
      batchId: string;
      id: string;
    }) => unenrollStudent(workspaceId, batchId, id),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};
