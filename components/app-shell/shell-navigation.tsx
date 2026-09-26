import { cn } from '@/lib/utils';
import type { ShellNavigationProps } from '@/types/app-shell';
import Link from 'next/link';

export function ShellNavigation({ groups, pathname, onNavigate }: ShellNavigationProps) {
  return (
    <nav className="flex flex-col gap-6" aria-label="Application navigation">
      {groups.map((group, index) => (
        <div key={group.label ?? index} className="flex flex-col gap-0.5">
          {group.label && (
            <p className="px-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle-foreground">
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
                  'group relative flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150 ease-in-out',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
