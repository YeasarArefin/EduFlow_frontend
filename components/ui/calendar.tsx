'use client';

import { DayPicker, type DayPickerProps } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

function Calendar({ className, classNames, components, ...props }: DayPickerProps) {
  return (
    <DayPicker
      className={cn(
        'rounded-2xl border border-border/80 bg-card/60 p-3 backdrop-blur-xs',
        className
      )}
      classNames={{
        months: 'flex flex-col gap-3',
        month: 'space-y-3',
        month_caption: 'relative flex h-8 items-center justify-center',
        caption_label: 'text-xs font-semibold text-foreground tracking-wide',
        nav: 'flex items-center justify-between absolute inset-x-0 top-0 h-8 px-0.5',
        button_previous: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-7 rounded-lg text-muted-foreground hover:text-foreground z-10'
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-7 rounded-lg text-muted-foreground hover:text-foreground z-10'
        ),
        month_grid: 'w-full border-collapse',
        weekdays: 'flex justify-between',
        weekday: 'w-8 text-center text-[11px] font-semibold text-muted-foreground',
        week: 'mt-1 flex w-full justify-between',
        day: 'size-8 p-0 text-center',
        day_button: cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'size-8 rounded-lg p-0 font-medium text-xs aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:font-bold aria-selected:shadow-xs hover:bg-muted/70 focus-visible:ring-2 focus-visible:ring-ring'
        ),
        today: 'text-primary font-bold',
        selected: 'bg-primary text-primary-foreground font-bold',
        disabled: 'text-muted-foreground/30 opacity-25 cursor-not-allowed pointer-events-none',
        outside: 'text-muted-foreground/30 opacity-25',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }) =>
          orientation === 'left' ? (
            <ChevronLeft {...iconProps} className="size-3.5" />
          ) : (
            <ChevronRight {...iconProps} className="size-3.5" />
          ),
        ...components,
      }}
      {...props}
    />
  );
}

export { Calendar };
