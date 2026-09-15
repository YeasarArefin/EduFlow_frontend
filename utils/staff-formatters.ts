import type { MemberStatus } from '@/types/staff';

export function formatMemberJoinedDate(value: string | null) {
  if (!value) return 'Not joined yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not joined yet';
  return new Intl.DateTimeFormat('en-BD', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function getMemberStatusVisual(status: MemberStatus) {
  if (status === 'active') return 'success' as const;
  if (status === 'suspended') return 'warning' as const;
  if (status === 'removed') return 'danger' as const;
  return 'info' as const;
}

export function getMemberInitials(name: string | null | undefined): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isProtectedOwner(role: string | null | undefined): boolean {
  return role?.toLowerCase() === 'owner';
}
