import type { ShellBrandProps } from '@/types/app-shell';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function ShellBrand({ productName, isAdmin, isCollapsed = false }: ShellBrandProps) {
  return (
    <Link
      href="/"
      className={cn(
        'flex h-14 items-center gap-2.5 text-base font-semibold tracking-tight text-sidebar-foreground transition-opacity hover:opacity-90',
        isCollapsed ? 'justify-center px-0' : 'px-4'
      )}
    >
      <span className="flex size-7 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
        EF
      </span>
      <span
        className={cn(
          'max-w-32 overflow-hidden whitespace-nowrap font-heading transition-[max-width,opacity] duration-200 ease-out',
          isCollapsed ? 'max-w-0 opacity-0' : 'opacity-100'
        )}
        aria-hidden={isCollapsed}
      >
        {productName}
      </span>
      {isAdmin && (
        <span
          className={cn(
            'ml-auto rounded-full border border-sidebar-border bg-sidebar-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-accent-foreground',
            isCollapsed && 'hidden'
          )}
        >
          Admin
        </span>
      )}
    </Link>
  );
}
