import { Button } from '@/components/ui/button';
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from '@/components/dashboard/dashboard-primitives';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AttendanceHistoryTableProps } from '@/types/attendance';
import { Filter, History, RotateCcw } from 'lucide-react';
import { AttendanceHistoryRow } from './attendance-history-row';

export function AttendanceHistoryTable({
  sessions,
  batches,
  selectedBatchId,
  onBatchChange,
  selectedDate,
  onDateChange,
  selectedStatus,
  onStatusChange,
  isLoading,
  onOpenSession,
  onRetry,
  isError,
}: AttendanceHistoryTableProps) {
  const hasActiveFilters = selectedBatchId !== 'all' || selectedDate !== '' || selectedStatus !== 'all';

  function resetFilters() {
    onBatchChange('all');
    onDateChange('');
    onStatusChange('all');
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-card/40 p-5 sm:p-6 backdrop-blur-md space-y-5">
      {/* Header & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <History className="size-4 text-primary" />
              <span>Session History & Records</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Browse, filter, and inspect past attendance sessions across batches.
            </p>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={resetFilters}
              className="self-start sm:self-auto h-7 rounded-full text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3 mr-1" />
              Reset filters
            </Button>
          )}
        </div>

        {/* Filters Bar */}
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Batch Filter */}
          <Select value={selectedBatchId} onValueChange={onBatchChange}>
            <SelectTrigger aria-label="Filter by batch" className="h-10 rounded-xl">
              <SelectValue placeholder="All batches" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All batches</SelectItem>
              {batches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            aria-label="Filter by date"
            className="h-10 rounded-xl text-xs"
          />

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger aria-label="Filter by status" className="h-10 rounded-xl">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft sessions</SelectItem>
              <SelectItem value="finalized">Finalized sessions</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content List */}
      {isLoading ? (
        <LoadingState rows={5} />
      ) : isError ? (
        <ErrorState message="Could not load attendance history." onRetry={onRetry} />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="No attendance records found"
          description={
            hasActiveFilters
              ? 'No sessions match your filter criteria. Try adjusting or clearing your filters.'
              : 'Take attendance for an active batch above to create your first session.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={resetFilters} className="rounded-full">
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-2.5">
          {sessions.map((session) => (
            <AttendanceHistoryRow
              key={session.id}
              session={session}
              onOpen={() => onOpenSession(session)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
