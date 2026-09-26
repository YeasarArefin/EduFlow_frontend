'use client';

import { StatusBadge } from '@/components/status/status-badge';
import { Button } from '@/components/ui/button';
import type { TodayBatchesProps } from '@/types/dashboard';
import { ArrowRight, BookOpen, CalendarCheck, Clock, Plus } from 'lucide-react';
import Link from 'next/link';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TodayBatches({ summary }: TodayBatchesProps) {
  const batches = summary.operational.today.batches ?? [];
  const scheduledCount = summary.operational.today.scheduledBatchCount ?? batches.length;
  const attendance = summary.operational.today.attendance;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">
            Today&apos;s Class Schedule
          </h3>
          <p className="text-xs text-muted-foreground">
            {scheduledCount} batch{scheduledCount === 1 ? '' : 'es'} scheduled for today
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          render={<Link href="/workspace/attendance" />}
          className="rounded-full text-xs"
        >
          <CalendarCheck data-icon="inline-start" /> Open Attendance
        </Button>
      </div>

      {/* Attendance Stats Bar */}
      {attendance && (attendance.presentCount > 0 || attendance.finalizedSessionCount > 0) ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-border/50 bg-muted/20 px-3.5 py-2 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-medium text-emerald-400">{attendance.presentCount} Present</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{attendance.absentCount} Absent</span>
          </div>
          <div className="text-muted-foreground">
            {attendance.finalizedSessionCount} finalized of {attendance.sessionCount} marked
          </div>
        </div>
      ) : null}

      {/* Batches List */}
      {batches.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 p-8 text-center text-xs text-muted-foreground">
          <BookOpen className="mx-auto mb-2 size-7 opacity-40" />
          <p className="font-medium text-foreground">No classes scheduled for today</p>
          <p className="mt-1 text-muted-foreground">
            Batches matching today&apos;s day of the week will appear here.
          </p>
          <Button
            variant="outline"
            size="sm"
            render={<Link href="/workspace/batches" />}
            className="mt-3 rounded-full text-xs"
          >
            <Plus data-icon="inline-start" /> Manage Batches
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {batches.map((batch) => {
            const isFinalized = batch.status === 'finalized';
            const isDraft = batch.status === 'draft';
            return (
              <div
                key={batch.id}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/10 p-3.5 transition-colors hover:border-border hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{batch.name}</h4>
                    <StatusBadge status={isFinalized ? 'success' : isDraft ? 'warning' : 'info'}>
                      {isFinalized ? 'Finalized' : isDraft ? 'Draft Saved' : 'Not Started'}
                    </StatusBadge>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" /> Routine:
                    </span>
                    <div className="flex gap-1">
                      {batch.classDays.map((day) => (
                        <span
                          key={day}
                          className="rounded bg-muted/60 px-1.5 py-0.2 font-mono text-[10px] text-foreground"
                        >
                          {weekdays[day]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant={isFinalized ? 'outline' : 'default'}
                    size="sm"
                    render={<Link href="/workspace/attendance" />}
                    className="h-7 rounded-full px-3 text-xs"
                  >
                    {isFinalized ? 'Review Attendance' : 'Take Attendance'}
                    <ArrowRight className="size-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
