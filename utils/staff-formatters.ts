import type { MemberStatus } from '@/types/staff';

export function formatMemberJoinedDate(value: string | null) {
  if (!value) return 'Not joined yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not joined yet';
  return new Intl.DateTimeFormat('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function getMemberStatusVisual(status: MemberStatus) {
  if (status === 'active') return 'success' as const;
  if (status === 'suspended') return 'warning' as const;
  if (status === 'removed') return 'danger' as const;
  return 'info' as const;
}
