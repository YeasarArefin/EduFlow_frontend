'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import type { AttendanceSessionSelectorProps } from '@/types/attendance';
import {
  formatAttendanceDate,
  formatClassDaysShort,
  formatDateNumeric,
  getLatestClassDateForBatch,
  getTodayDate,
} from '@/utils/attendance-formatters';
import {
  AlertCircle,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isoDate = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function AttendanceSessionSelector({
  batches,
  selectedBatchId,
  onBatchChange,
  sessionDate,
  onDateChange,
  isLoading,
}: AttendanceSessionSelectorProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const activeBatches = batches.filter((b) => b.status === 'active');
  const selectedBatch = activeBatches.find((b) => b.id === selectedBatchId);
  const today = getTodayDate();

  // Selected date day of week
  const selectedDayIndex = useMemo(() => {
    if (!sessionDate) return null;
    const date = new Date(`${sessionDate}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date.getDay();
  }, [sessionDate]);

  const isClassDay = useMemo(() => {
    if (!selectedBatch || selectedDayIndex === null) return true;
    return selectedBatch.classDays.includes(selectedDayIndex);
  }, [selectedBatch, selectedDayIndex]);

  // If there is no class today for this batch, intelligently adapt the date to the latest class date
  useEffect(() => {
    if (!selectedBatch || !selectedBatch.classDays.length) return;
    const todayIndex = new Date().getDay();
    const meetsToday = selectedBatch.classDays.includes(todayIndex);

    // If current sessionDate is today but today is NOT a class day, adapt to latest class day
    if (sessionDate === today && !meetsToday) {
      const latestDate = getLatestClassDateForBatch(selectedBatch.classDays);
      onDateChange(latestDate);
    }
  }, [selectedBatch, sessionDate, today, onDateChange]);

  const latestClassDate = useMemo(() => {
    return selectedBatch ? getLatestClassDateForBatch(selectedBatch.classDays) : today;
  }, [selectedBatch, today]);

  return (
    <div className="rounded-3xl border border-border/80 bg-card/40 p-5 sm:p-6 backdrop-blur-md space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            <span>Attendance Controls</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            Select a batch and pick any scheduled class date to mark or review attendance.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Spinner className="size-3.5 text-primary" />
            <span>Syncing roster…</span>
          </div>
        )}
      </div>

      {/* Main Command Bar */}
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-end">
        {/* Batch Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-muted-foreground" />
              Academic Batch *
            </span>
            {selectedBatch && (
              <span className="text-[11px] font-normal text-muted-foreground font-mono">
                {formatClassDaysShort(selectedBatch.classDays)}
              </span>
            )}
          </label>

          <Select value={selectedBatchId} onValueChange={onBatchChange}>
            <SelectTrigger aria-label="Select batch" className="h-11 w-full rounded-2xl bg-card/60">
              <SelectValue placeholder="Select an active batch…" />
            </SelectTrigger>
            <SelectContent>
              {activeBatches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  <div className="flex items-center justify-between gap-3 py-0.5">
                    <span className="font-semibold">{b.name}</span>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {formatClassDaysShort(b.classDays)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Trigger Pill & Popover (Exactly matching user's requested style) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              Session Date *
            </span>

            {selectedBatch && sessionDate && (
              isClassDay ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                  <CheckCircle2 className="size-3" />
                  Scheduled class day
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500">
                  <AlertCircle className="size-3" />
                  No routine class today
                </span>
              )
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Popover Calendar Trigger Pill */}
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-3 rounded-full border border-border/80 bg-card/70 px-4 py-2 text-sm font-semibold tracking-wide text-foreground shadow-xs transition-all hover:border-primary/50 hover:bg-muted/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                    DATE:
                  </span>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {formatDateNumeric(sessionDate)}
                  </span>
                  <CalendarDays className="size-4 text-muted-foreground/80 transition-colors group-hover:text-primary" />
                </button>
              </PopoverTrigger>

              <PopoverContent align="start" className="w-auto p-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs">
                    <span className="font-semibold text-foreground">Select Class Date</span>
                    <span className="text-[11px] text-muted-foreground">Class days enabled</span>
                  </div>

                  <Calendar
                    mode="single"
                    selected={sessionDate ? new Date(`${sessionDate}T00:00:00`) : undefined}
                    onSelect={(date) => {
                      if (!date) return;
                      onDateChange(isoDate(date));
                      setCalendarOpen(false);
                    }}
                    disabled={(date) =>
                      date > new Date(new Date().setHours(23, 59, 59, 999)) ||
                      !selectedBatch ||
                      !selectedBatch.classDays.includes(date.getDay())
                    }
                  />

                  {/* Quick Shortcuts inside popover */}
                  <div className="flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        onDateChange(today);
                        setCalendarOpen(false);
                      }}
                      disabled={!selectedBatch || !selectedBatch.classDays.includes(new Date().getDay())}
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40"
                    >
                      Today
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onDateChange(latestClassDate);
                        setCalendarOpen(false);
                      }}
                      className="rounded-full px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/10"
                    >
                      Latest Class Day
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Quick date jump pills */}
            {selectedBatch?.classDays.includes(new Date().getDay()) && sessionDate !== today && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDateChange(today)}
                className="h-10 rounded-full px-3.5 text-xs"
              >
                Jump to Today
              </Button>
            )}

            {sessionDate !== latestClassDate && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDateChange(latestClassDate)}
                className="h-10 rounded-full px-3.5 text-xs text-primary border-primary/30 hover:bg-primary/10"
              >
                <CalendarCheck2 className="size-3.5 mr-1" />
                Latest Class ({formatAttendanceDate(latestClassDate).split(',')[0]})
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Routine strip below */}
      {selectedBatch && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/50 bg-muted/20 px-3.5 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground flex items-center gap-1 font-medium">
              <Sparkles className="size-3 text-primary" />
              Class Routine:
            </span>
            <div className="flex items-center gap-1">
              {WEEKDAYS.map((label, day) => {
                const isScheduled = selectedBatch.classDays.includes(day);
                const isSelectedDay = selectedDayIndex === day;
                return (
                  <span
                    key={day}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium border transition-colors ${
                      isSelectedDay && isScheduled
                        ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                        : isScheduled
                          ? 'bg-primary/15 text-primary border-primary/30 font-semibold'
                          : 'bg-muted/40 text-muted-foreground/40 border-transparent'
                    }`}
                  >
                    {label}
                  </span>
                );
              })}
            </div>
          </div>

          <span className="text-muted-foreground">
            Viewing: <strong className="text-foreground">{formatAttendanceDate(sessionDate)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
