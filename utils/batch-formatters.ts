import type { Batch, BatchStatus } from '@/types/batches';

export function formatBatchMoney(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return '—';
  const amount = typeof value === 'number' ? value : Number(value) / 100;

  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatBatchDate(value: string | null | undefined, emptyLabel = 'Not set') {
  if (!value) return emptyLabel;

  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  if (Number.isNaN(date.getTime())) return emptyLabel;

  return new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium' }).format(date);
}

export function getBatchStatusVisual(status: BatchStatus) {
  return status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'info';
}

export function getBatchMonthlyFeeInTaka(batch?: Batch) {
  if (!batch) return '';
  if (batch.monthlyFee !== undefined && batch.monthlyFee !== null) return batch.monthlyFee;

  const amount = Number(batch.monthlyFeeMinor || 0);
  if (Number.isNaN(amount) || amount === 0) return '0';
  return (amount / 100).toFixed(2).replace(/\.00$/, '');
}

export function formatBatchTakaPreview(taka: string) {
  const amount = Number(taka.trim() || 0);
  if (Number.isNaN(amount) || amount < 0) return '৳ 0.00';

  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
