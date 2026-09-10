import type { FeeStatus } from '@/types/fees';

export function formatFeeCurrency(amount?: string | number | null) {
  if (amount === undefined || amount === null || amount === '') return '৳0.00';
  const value = typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  if (Number.isNaN(value)) return '৳0.00';
  return `৳${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatFeeMonth(value?: string | null, month: 'short' | 'long' = 'long') {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-US', { month, year: 'numeric' });
  } catch {
    return value;
  }
}

export function formatFeeDate(value?: string | null) {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return value;
  }
}

export function getFeeStatusLabel(status: FeeStatus) {
  return status.replace('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
export function getFeeStatusVisual(status: FeeStatus) {
  return status === 'paid' || status === 'overpaid'
    ? 'success'
    : status === 'partially_paid'
      ? 'warning'
      : status === 'overdue'
        ? 'danger'
        : 'info';
}
export function getDefaultFeeMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}
export function shiftFeeMonth(value: string, delta: number) {
  const [year, month] = value.split('-').map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
}
