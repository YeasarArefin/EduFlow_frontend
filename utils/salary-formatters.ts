import type { SalaryStatus } from '@/types/salaries';

export const salaryStatusVisual: Record<SalaryStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  paid: 'success',
  waived: 'info',
  pending: 'info',
  partially_paid: 'warning',
  overdue: 'danger',
};

export function formatSalaryMoney(value: string | number) {
  return `৳${Number(value).toLocaleString('en-BD', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrentSalaryMonth() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
}

export function formatSalaryMonth(value: string) {
  return new Date(`${value.slice(0, 7)}-02T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
