import { formatBdt } from '@/lib/format-money';
import type { PlatformPayment } from '@/types/platform';

export function formatPlatformDate(value: string | null, includeTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    ...(includeTime ? { timeStyle: 'short' as const } : {}),
  }).format(date);
}

export function getPlatformPaymentStatusVisual(status: PlatformPayment['status']) {
  if (status === 'approved') return { label: 'Approved', tone: 'success' as const };
  if (status === 'rejected') return { label: 'Rejected', tone: 'danger' as const };
  return { label: 'Pending', tone: 'warning' as const };
}

export function formatPlatformPlanPrice(priceMinor: string) {
  return formatBdt(priceMinor);
}

export function minorToPlatformPriceInput(priceMinor: string) {
  const normalized = priceMinor.replace(/^0+(?=\d)/, '');
  const whole = normalized.length > 2 ? normalized.slice(0, -2) : '0';
  const fraction = normalized.slice(-2).padStart(2, '0');
  return `${whole}.${fraction}`;
}

export function platformPriceToMinor(price: string) {
  const [whole, fraction = ''] = price.trim().split('.');
  return `${whole.replace(/^0+(?=\d)/, '') || '0'}${fraction.padEnd(2, '0')}`.replace(
    /^0+(?=\d)/,
    ''
  );
}
