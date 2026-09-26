'use client';
import { useQuery } from '@tanstack/react-query';
import type { ExpenseListParams } from '@/types/expenses';
import { getExpenseCategories, getExpenses, getFinancialOverview } from '../api/expenses';
import { expenseKeys } from '../expense-query-keys';

export const useExpenseCategories = (workspaceId: string) =>
  useQuery({
    queryKey: expenseKeys.categories(workspaceId),
    queryFn: ({ signal }) => getExpenseCategories(workspaceId, signal),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
export const useExpenses = (workspaceId: string, params: ExpenseListParams) =>
  useQuery({
    queryKey: expenseKeys.list(workspaceId, params),
    queryFn: ({ signal }) => getExpenses(workspaceId, params, signal),
    enabled: Boolean(workspaceId),
    staleTime: 15_000,
  });
export const useFinancialOverview = (workspaceId: string, startDate?: string, endDate?: string) =>
  useQuery({
    queryKey: expenseKeys.finance(workspaceId, startDate, endDate),
    queryFn: ({ signal }) => getFinancialOverview(workspaceId, startDate, endDate, signal),
    enabled: Boolean(workspaceId),
    staleTime: 15_000,
  });
