import type { ShellBrandProps } from '@/types/app-shell';
import Link from 'next/link';

export function ShellBrand({ productName, isAdmin }: ShellBrandProps) {
  return (
    <Link
      href="/"
      className="flex h-14 items-center gap-2.5 px-4 text-base font-semibold tracking-tight text-sidebar-foreground transition-opacity hover:opacity-90"
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
        EF
      </span>
      <span className="font-heading">{productName}</span>
      {isAdmin && (
        <span className="ml-auto rounded-full border border-sidebar-border bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-accent-foreground">
          Admin
        </span>
      )}
    </Link>
  );
}
