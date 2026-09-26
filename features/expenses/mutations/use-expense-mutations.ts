'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateExpenseInput, UpdateExpenseInput } from '@/types/expenses';
import {
  createExpense,
  createExpenseCategory,
  reverseExpense,
  updateExpense,
} from '../api/expenses';
import { expenseKeys } from '../expense-query-keys';

const refresh = (client: ReturnType<typeof useQueryClient>) =>
  client.invalidateQueries({ queryKey: expenseKeys.all });
export const useCreateExpense = (workspaceId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateExpenseInput) => createExpense(workspaceId, input),
    onSuccess: () => refresh(client),
  });
};
export const useUpdateExpense = (workspaceId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateExpenseInput }) =>
      updateExpense(workspaceId, id, input),
    onSuccess: () => refresh(client),
  });
};
export const useReverseExpense = (workspaceId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      reverseExpense(workspaceId, id, reason),
    onSuccess: () => refresh(client),
  });
};
export const useCreateExpenseCategory = (workspaceId: string) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; description?: string }) =>
      createExpenseCategory(workspaceId, input),
    onSuccess: () => refresh(client),
  });
};
