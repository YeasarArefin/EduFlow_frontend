import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/dashboard/dashboard-primitives';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/status/status-badge';
import type { AttendanceRecord, AttendanceSessionWorkbenchProps } from '@/types/attendance';
import {
  formatAttendanceDate,
  getAttendancePercentage,
  getAttendanceStatusBadge,
  getAttendanceStatusLabel,
} from '@/utils/attendance-formatters';
import {
  CheckCheck,
  CircleAlert,
  CircleCheck,
  Lock,
  Save,
  Search,
  Users,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { AttendanceRosterCard } from './attendance-roster-card';
import { AttendanceRosterRow } from './attendance-roster-row';

export function AttendanceSessionWorkbench({
  session,
  draftStatuses,
  onStatusChange,
  onMarkAll,
  onSaveDraft,
  onFinalize,
  isSaving,
  isFinalizing,
  isDirty,
}: AttendanceSessionWorkbenchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'present' | 'absent'>('all');

  const records = session.records ?? [];
  const isFinalized = session.status === 'finalized';

  function getEffectiveStatus(record: AttendanceRecord) {
    return draftStatuses[record.studentId] ?? record.status;
  }

  const presentCount = useMemo(
    () => records.filter((r) => getEffectiveStatus(r) === 'present').length,
    [records, draftStatuses]
  );
  const absentCount = records.length - presentCount;
  const attendanceRate = getAttendancePercentage(presentCount, records.length);

  // Filtered list based on search and tab
  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const status = getEffectiveStatus(record);
      if (filterTab === 'present' && status !== 'present') return false;
      if (filterTab === 'absent' && status !== 'absent') return false;

      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase().trim();
      return (
        record.student.fullName.toLowerCase().includes(query) ||
        record.student.studentCode.toLowerCase().includes(query) ||
        (record.student.phone && record.student.phone.includes(query))
      );
    });
  }, [records, draftStatuses, filterTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Session Hero Banner */}
      <div className="rounded-3xl border border-border/80 bg-card/40 p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {session.batch.name}
              </h1>
              <StatusBadge status={getAttendanceStatusBadge(session.status)}>
                {getAttendanceStatusLabel(session.status)}
              </StatusBadge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span>{formatAttendanceDate(session.sessionDate)}</span>
              <span>•</span>
              <span>{records.length} enrolled students</span>
            </p>
          </div>

          {/* Finalized Banner or Live Unsaved Pill */}
          {isFinalized ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <Lock className="size-3.5" />
              <span>Finalized & Read-Only</span>
            </div>
          ) : isDirty ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-500 animate-pulse">
              <CircleAlert className="size-3.5" />
              <span>Unsaved changes</span>
            </div>
          ) : null}
        </div>

        {/* Live Attendance Metric Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/40 pt-5">
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground">Attendance Rate</p>
            <p className="mt-0.5 text-lg sm:text-xl font-bold text-foreground">
              {attendanceRate}%
            </p>
          </div>
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-[11px] font-medium text-primary">Present</p>
            <p className="mt-0.5 text-lg sm:text-xl font-bold text-primary">
              {presentCount}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ {records.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-[11px] font-medium text-destructive">Absent</p>
            <p className="mt-0.5 text-lg sm:text-xl font-bold text-destructive">
              {absentCount}{' '}
              <span className="text-xs font-normal text-muted-foreground">/ {records.length}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
            <p className="text-[11px] font-medium text-muted-foreground">Total Roster</p>
            <p className="mt-0.5 text-lg sm:text-xl font-bold text-foreground flex items-center gap-1.5">
              <Users className="size-4 text-muted-foreground" />
              {records.length}
            </p>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Roster Workbench & Controls */}
      <div className="rounded-3xl border border-border/80 bg-card/40 p-5 sm:p-6 backdrop-blur-md space-y-4">
        {/* Search, Filter Tabs & Bulk Actions */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or code…"
                className="h-9 pl-9 rounded-full text-xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="inline-flex rounded-full border border-border/80 bg-muted/20 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  filterTab === 'all'
                    ? 'bg-card text-foreground shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({records.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('present')}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  filterTab === 'present'
                    ? 'bg-primary/20 text-primary shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Present ({presentCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('absent')}
                className={`rounded-full px-3 py-1 font-medium transition-colors ${
                  filterTab === 'absent'
                    ? 'bg-destructive/20 text-destructive shadow-xs font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Absent ({absentCount})
              </button>
            </div>
          </div>

          {/* Bulk Action Buttons */}
          {!isFinalized && records.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onMarkAll('present')}
                className="h-8 rounded-full text-xs"
              >
                <CheckCheck data-icon="inline-start" className="size-3.5" />
                All Present
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onMarkAll('absent')}
                className="h-8 rounded-full text-xs text-muted-foreground hover:text-destructive"
              >
                <XCircle data-icon="inline-start" className="size-3.5" />
                All Absent
              </Button>
            </div>
          )}
        </div>

        {/* Student Roster View */}
        {records.length === 0 ? (
          <EmptyState
            title="No enrolled students"
            description="There are no active enrollments for this batch on this session date."
          />
        ) : filteredRecords.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No students match &ldquo;{searchQuery}&rdquo; in this tab.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card/50 md:block">
              <div className="grid grid-cols-[110px_minmax(0,1fr)_220px] items-center gap-4 border-b border-border/70 bg-muted/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Student Code</span>
                <span>Student Details</span>
                <span>Attendance Status</span>
              </div>
              {filteredRecords.map((record) => (
                <AttendanceRosterRow
                  key={record.id}
                  record={record}
                  value={getEffectiveStatus(record)}
                  disabled={isFinalized}
                  onChange={(status) => onStatusChange(record.studentId, status)}
                />
              ))}
            </div>

            {/* Mobile Card Grid */}
            <div className="grid gap-2.5 md:hidden">
              {filteredRecords.map((record) => (
                <AttendanceRosterCard
                  key={record.id}
                  record={record}
                  value={getEffectiveStatus(record)}
                  disabled={isFinalized}
                  onChange={(status) => onStatusChange(record.studentId, status)}
                />
              ))}
            </div>
          </>
        )}

        {/* Action Buttons / Sticky Footer */}
        {!isFinalized && records.length > 0 && (
          <div className="flex flex-col gap-2.5 border-t border-border/50 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {isDirty ? 'You have unsaved attendance changes.' : 'All changes saved.'}
            </p>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onSaveDraft}
                disabled={!isDirty || isSaving || isFinalizing}
                className="h-10 rounded-full px-5 font-semibold"
              >
                <Save data-icon="inline-start" />
                {isSaving ? 'Saving…' : 'Save Draft'}
              </Button>
              <Button
                type="button"
                onClick={onFinalize}
                disabled={isSaving || isFinalizing}
                className="h-10 rounded-full px-6 font-semibold shadow-xs"
              >
                <CircleCheck data-icon="inline-start" />
                {isFinalizing ? 'Finalizing…' : 'Finalize Session'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
