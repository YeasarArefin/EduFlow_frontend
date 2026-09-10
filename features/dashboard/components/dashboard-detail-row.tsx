import type { DashboardDetailRowProps } from '@/types/dashboard';

export function DashboardDetailRow({ label, value }: DashboardDetailRowProps) {
  return (
    <div className="border-b border-border pb-3 last:border-b-0 sm:last:border-b">
      <dt className="text-xs font-medium uppercase tracking-wider text-subtle-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value || 'Not available'}</dd>
    </div>
  );
}
