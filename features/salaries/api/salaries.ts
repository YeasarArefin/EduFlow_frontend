import { apiListRequest, apiRequest } from '@/lib/api/client';
import type {
  RecordSalaryPaymentInput,
  Salary,
  SalaryGenerationResult,
  SalaryListParams,
  SalaryPaginationMeta,
  SalaryPayment,
} from '@/types/salaries';
export {
  SALARY_STATUSES,
  type Salary,
  type SalaryGenerationResult,
  type SalaryPayment as Payment,
  type SalaryStatus,
} from '@/types/salaries';
const h = (workspaceId: string) => ({ 'X-Workspace-Id': workspaceId });
export function getSalaries(workspaceId: string, p: SalaryListParams, signal?: AbortSignal) {
  const q = new URLSearchParams({ page: String(p.page ?? 1), limit: String(p.limit ?? 20) });
  if (p.salaryMonth) q.set('salaryMonth', p.salaryMonth);
  if (p.status) q.set('status', p.status);
  return apiListRequest<Salary[], SalaryPaginationMeta>(`/teacher-salaries?${q}`, {
    headers: h(workspaceId),
    signal,
  });
}
export const getPayments = (w: string, id: string) =>
  apiRequest<SalaryPayment[]>(`/teacher-salaries/${id}/payments`, { headers: h(w) });
export const recordPayment = (w: string, id: string, input: RecordSalaryPaymentInput) =>
  apiRequest(`/teacher-salaries/${id}/payments`, { method: 'POST', headers: h(w), body: input });
export const generateSalaries = (w: string, salaryMonth: string) =>
  apiRequest<SalaryGenerationResult>('/teacher-salaries/generate', {
    method: 'POST',
    headers: h(w),
    body: { salaryMonth },
  });
