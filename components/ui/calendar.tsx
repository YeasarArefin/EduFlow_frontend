'use client';

import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({ className, classNames, components, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn('rounded-xl border border-border bg-card p-3', className)}
      classNames={{
        months: 'flex flex-col gap-4',
        month: 'space-y-4',
        month_caption: 'relative flex h-8 items-center justify-center',
        caption_label: 'text-sm font-medium text-foreground',
        nav: 'flex items-center gap-1',
        button_previous: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'absolute left-0 size-8'),
        button_next: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'absolute right-0 size-8'),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex',
        weekday: 'w-9 text-center text-xs font-medium text-muted-foreground',
        week: 'mt-1 flex w-full',
        day: 'size-9 p-0 text-center',
        day_button: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-9 rounded-lg p-0 font-normal aria-selected:bg-primary aria-selected:text-primary-foreground'),
        today: 'text-primary',
        selected: 'bg-primary text-primary-foreground',
        disabled: 'text-muted-foreground opacity-40',
        outside: 'text-muted-foreground opacity-40',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }) =>
          orientation === 'left' ? <ChevronLeft {...iconProps} className="size-4" /> : <ChevronRight {...iconProps} className="size-4" />,
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
