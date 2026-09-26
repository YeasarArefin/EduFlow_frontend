import { apiListRequest, apiRequest } from '@/lib/api/client';
import type {
  CreateExpenseInput,
  Expense,
  ExpenseCategory,
  ExpenseListMeta,
  ExpenseListParams,
  FinancialOverview,
  UpdateExpenseInput,
} from '@/types/expenses';

const headers = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
export const getExpenseCategories = (workspaceId: string, signal?: AbortSignal) =>
  apiRequest<ExpenseCategory[]>('/expenses/categories', { headers: headers(workspaceId), signal });
export const createExpenseCategory = (
  workspaceId: string,
  input: { name: string; description?: string }
) =>
  apiRequest<ExpenseCategory>('/expenses/categories', {
    method: 'POST',
    headers: headers(workspaceId),
    body: input,
  });
export const getExpenses = (
  workspaceId: string,
  params: ExpenseListParams,
  signal?: AbortSignal
) => {
  const query = new URLSearchParams({
    page: String(params.page ?? 1),
    limit: String(params.limit ?? 20),
  });
  if (params.categoryId) query.set('categoryId', params.categoryId);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.status) query.set('status', params.status);
  return apiListRequest<Expense[], ExpenseListMeta>(`/expenses?${query}`, {
    headers: headers(workspaceId),
    signal,
  });
};
export const createExpense = (workspaceId: string, input: CreateExpenseInput) =>
  apiRequest<Expense>('/expenses', { method: 'POST', headers: headers(workspaceId), body: input });
export const updateExpense = (workspaceId: string, id: string, input: UpdateExpenseInput) =>
  apiRequest<Expense>(`/expenses/${id}`, {
    method: 'PATCH',
    headers: headers(workspaceId),
    body: input,
  });
export const reverseExpense = (workspaceId: string, id: string, reason: string) =>
  apiRequest<Expense>(`/expenses/${id}/reverse`, {
    method: 'POST',
    headers: headers(workspaceId),
    body: { reason },
  });
export const getFinancialOverview = (
  workspaceId: string,
  startDate?: string,
  endDate?: string,
  signal?: AbortSignal
) => {
  const query = new URLSearchParams();
  if (startDate) query.set('startDate', startDate);
  if (endDate) query.set('endDate', endDate);
  return apiRequest<FinancialOverview>(
    `/expenses/finance/overview${query.size ? `?${query}` : ''}`,
    { headers: headers(workspaceId), signal }
  );
};
