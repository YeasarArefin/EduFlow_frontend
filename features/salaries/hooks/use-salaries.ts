'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  generateSalaries,
  getPayments,
  getSalaries,
  recordPayment,
  type SalaryStatus,
} from '../api/salaries';
const keys = {
  all: ['salaries'] as const,
  list: (w: string, p: unknown) => ['salaries', w, p] as const,
  payments: (w: string, id: string) => ['salaries', w, 'payments', id] as const,
};
export const useSalaries = (
  w: string,
  p: { salaryMonth?: string; status?: SalaryStatus; page?: number; limit?: number; search?: string }
) =>
  useQuery({
    queryKey: keys.list(w, p),
    queryFn: ({ signal }) => getSalaries(w, p, signal),
    enabled: !!w,
  });
export const useSalaryPayments = (w: string, id: string | null) =>
  useQuery({
    queryKey: id ? keys.payments(w, id) : ['disabled'],
    queryFn: () => (id ? getPayments(w, id) : Promise.resolve([])),
    enabled: !!id,
  });
export const useRecordSalaryPayment = (w: string) => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: {
      id: string;
      amount: string;
      paymentMethod: string;
      paymentDate?: string;
      note?: string;
    }) => recordPayment(w, id, input),
    onSuccess: (_, v) => {
      c.invalidateQueries({ queryKey: keys.all });
      c.invalidateQueries({ queryKey: keys.payments(w, v.id) });
    },
  });
};
export const useGenerateSalaries = (w: string) => {
  const c = useQueryClient();
  return useMutation({
    mutationFn: (salaryMonth: string) => generateSalaries(w, salaryMonth),
    onSuccess: () => c.invalidateQueries({ queryKey: keys.all }),
  });
};
