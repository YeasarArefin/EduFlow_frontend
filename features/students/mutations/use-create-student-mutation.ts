"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent, type StudentInput } from "../api/students";
import { studentKeys } from "../student-query-keys";

export function useCreateStudentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      input,
    }: {
      workspaceId: string;
      input: StudentInput;
    }) => createStudent(workspaceId, input),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: studentKeys.all }),
  });
}
