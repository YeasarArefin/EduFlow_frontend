import type { ExpenseListParams } from '@/types/expenses';

export const expenseKeys = {
  all: ['expenses'] as const,
  categories: (workspaceId: string) => [...expenseKeys.all, 'categories', workspaceId] as const,
  list: (workspaceId: string, params: ExpenseListParams) =>
    [...expenseKeys.all, 'list', workspaceId, params] as const,
  finance: (workspaceId: string, startDate?: string, endDate?: string) =>
    [...expenseKeys.all, 'finance', workspaceId, startDate, endDate] as const,
};
