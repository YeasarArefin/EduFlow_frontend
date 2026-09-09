import type { ReactNode } from 'react';

export function BatchProfileMetadataItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/40 text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <p className="mt-0.5 truncate text-base font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
