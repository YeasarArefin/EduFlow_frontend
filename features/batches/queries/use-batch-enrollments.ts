'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveEnrollment,
  enroll,
  getEnrollments,
  reactivateEnrollment,
  unenrollStudent,
  updateEnrollment,
} from '../api/batch-enrollments';
import { batchKeys } from '../batch-query-keys';
import type {
  EnrollmentMutationInput,
  EnrollStudentMutationInput,
  UpdateEnrollmentMutationInput,
} from '@/types/batches';

const key = (w: string, b: string) => [...batchKeys.detail(w, b), 'students'] as const;

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
    mutationFn: ({ workspaceId, batchId, input }: EnrollStudentMutationInput) =>
      enroll(workspaceId, batchId, input),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useUpdateEnrollment = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, id, input }: UpdateEnrollmentMutationInput) =>
      updateEnrollment(workspaceId, batchId, id, input),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useArchiveEnrollment = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, id }: EnrollmentMutationInput) =>
      archiveEnrollment(workspaceId, batchId, id),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useReactivateEnrollment = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, id }: EnrollmentMutationInput) =>
      reactivateEnrollment(workspaceId, batchId, id),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};

export const useUnenrollStudent = () => {
  const i = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, batchId, id }: EnrollmentMutationInput) =>
      unenrollStudent(workspaceId, batchId, id),
    onSuccess: (_, v) => i(v.workspaceId, v.batchId),
  });
};
