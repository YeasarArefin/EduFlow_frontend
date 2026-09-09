import type { ReactNode } from 'react';

export function StudentProfileDetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 py-3">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="col-span-2 text-foreground">{children}</dd>
    </div>
  );
}
