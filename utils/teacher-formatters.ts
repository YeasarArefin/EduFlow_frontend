import type { TeacherStatus } from '@/types/teachers';

export function teacherTakaFromMinor(minor: string) {
  const value = Number(minor || 0);
  return !Number.isFinite(value) || value === 0
    ? '0'
    : (value / 100).toFixed(2).replace(/\.00$/, '');
}

export function teacherMinorFromTaka(taka: string) {
  const value = Number(taka.trim());
  return !Number.isFinite(value) || value < 0 ? '0' : Math.round(value * 100).toString();
}

export function formatTeacherSalaryMinor(minor: string | null | undefined) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(minor || 0) / 100);
}

export function formatTeacherTakaPreview(taka: string) {
  const value = Number(taka.trim() || 0);
  return !Number.isFinite(value) || value < 0
    ? '৳ 0.00'
    : new Intl.NumberFormat('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
}

export function getTeacherInitials(name: string | null | undefined): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getTeacherStatusVisual(status: TeacherStatus): {
  tone: 'success' | 'warning' | 'info';
  label: string;
} {
  switch (status) {
    case 'active':
      return { tone: 'success', label: 'Active' };
    case 'inactive':
      return { tone: 'warning', label: 'Inactive' };
    case 'archived':
      return { tone: 'info', label: 'Archived' };
    default:
      return { tone: 'info', label: status };
  }
}

export function formatTeacherDate(value?: string | null, fallback = '—'): string {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
