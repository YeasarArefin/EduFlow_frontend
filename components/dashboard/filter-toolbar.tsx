'use client';

import { Search } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useDebouncedValue } from '@/utils/use-debounced-value';

export function FilterToolbar({
  placeholder = 'Search',
  children,
  onSearch,
  searchValue,
  singleRow,
}: {
  placeholder?: string;
  children?: ReactNode;
  onSearch?: (value: string) => void;
  searchValue?: string;
  singleRow?: boolean;
}) {
  const [draftSearch, setDraftSearch] = useState(searchValue ?? '');

  useEffect(() => {
    const timer = window.setTimeout(() => setDraftSearch(searchValue ?? ''), 0);
    return () => window.clearTimeout(timer);
  }, [searchValue]);

  const debouncedSearch = useDebouncedValue(draftSearch);

  useEffect(() => {
    if (debouncedSearch !== (searchValue ?? '')) onSearch?.(debouncedSearch);
  }, [debouncedSearch, onSearch, searchValue]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs sm:shrink-0">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 pl-9 pr-4 text-sm"
          placeholder={placeholder}
          value={draftSearch}
          onChange={(event) => setDraftSearch(event.target.value)}
        />
      </div>
      <div className={cn('flex flex-wrap items-center gap-2.5', singleRow && 'sm:flex-nowrap')}>
        {children}
      </div>
    </div>
  );
}
