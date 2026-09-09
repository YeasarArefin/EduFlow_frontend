import type { SalaryStatus } from '../api/salaries';

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
