import type { StudentStatus } from '@/types/students';

const statusLabels: Record<StudentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};
const statusVisuals: Record<StudentStatus, 'success' | 'warning' | 'info'> = {
  active: 'success',
  inactive: 'warning',
  archived: 'info',
};

export function formatStudentDate(value?: string | null, emptyLabel = 'Not recorded') {
  if (!value) return emptyLabel;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getStudentStatusVisual(status: StudentStatus) {
  return { label: statusLabels[status], tone: statusVisuals[status] };
}

export function getStudentInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
