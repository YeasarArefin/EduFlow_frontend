"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent, type StudentInput } from "../api/students";
import { studentKeys } from "../student-query-keys";

export function useUpdateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      studentId,
      input,
    }: {
      workspaceId: string;
      studentId: string;
      input: Partial<StudentInput>;
    }) => updateStudent(workspaceId, studentId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studentKeys.all }),
  });
}
