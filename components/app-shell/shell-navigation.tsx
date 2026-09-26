import { cn } from '@/lib/utils';
import type { ShellNavigationProps } from '@/types/app-shell';
import Link from 'next/link';

export function ShellNavigation({
  groups,
  pathname,
  onNavigate,
  isCollapsed = false,
}: ShellNavigationProps) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Application navigation">
      {groups.map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-0.5">
          {group.label && (
            <p
              className={cn(
                'px-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground',
                isCollapsed && 'sr-only'
              )}
            >
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const isRootSection =
              item.href === '/platform' ||
              item.href === '/workspace/dashboard' ||
              item.href === '/';
            const isActive =
              pathname === item.href || (!isRootSection && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'group relative flex h-9 items-center rounded-lg text-sm font-medium transition-all duration-150 ease-in-out',
                  isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={isCollapsed ? item.label : undefined}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon && (
                  <span
                    className={cn(
                      'size-4 shrink-0 flex items-center justify-center transition-colors',
                      isActive
                        ? 'text-sidebar-accent-foreground'
                        : 'text-subtle-foreground group-hover:text-foreground'
                    )}
                  >
                    {item.icon}
                  </span>
                )}
                <span
                  className={cn(
                    'max-w-36 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out',
                    isCollapsed ? 'max-w-0 opacity-0' : 'opacity-100'
                  )}
                  aria-hidden={isCollapsed}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
