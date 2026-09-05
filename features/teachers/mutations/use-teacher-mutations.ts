"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveTeacher,
  createTeacher,
  updateTeacher,
  type TeacherInput,
} from "../api/teachers";
import { teacherKeys } from "../teacher-query-keys";
const useInvalidate = () => {
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: teacherKeys.all });
};
export function useCreateTeacherMutation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      input,
    }: {
      workspaceId: string;
      input: TeacherInput;
    }) => createTeacher(workspaceId, input),
    onSuccess: invalidate,
  });
}
export function useUpdateTeacherMutation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({
      workspaceId,
      id,
      input,
    }: {
      workspaceId: string;
      id: string;
      input: Partial<TeacherInput>;
    }) => updateTeacher(workspaceId, id, input),
    onSuccess: invalidate,
  });
}
export function useArchiveTeacherMutation() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ workspaceId, id }: { workspaceId: string; id: string }) =>
      archiveTeacher(workspaceId, id),
    onSuccess: invalidate,
  });
}
