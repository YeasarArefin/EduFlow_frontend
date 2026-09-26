'use client';

import { Moon, Sun } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useTheme } from '@/components/theme/theme-provider';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  const isDark = isMounted ? resolvedTheme === 'dark' : false;
  const nextTheme = isDark ? 'light' : 'dark';
  const Icon = isDark ? Moon : Sun;

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} theme`}
      onClick={() => setTheme(nextTheme)}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    >
      <Icon
        key={nextTheme}
        className="size-4 animate-in fade-in-0 zoom-in-75 duration-150"
        aria-hidden="true"
      />
    </button>
  );
}
