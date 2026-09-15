'use client';

import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from '@/components/dashboard/dashboard-primitives';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useBatchesQuery } from '@/features/batches/queries/use-batches-query';
import type {
  AttendancePageProps,
  AttendanceRecord,
  AttendanceRecordStatus,
  AttendanceSessionSummary,
} from '@/types/attendance';
import { getAttendancePercentage, getTodayDate } from '@/utils/attendance-formatters';
import { CalendarDays, CheckCircle2, History, PlusCircle, TrendingUp, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  useAttendanceSessionQuery,
  useAttendanceSessionsQuery,
  useCreateAttendanceSessionMutation,
  useFinalizeAttendanceSessionMutation,
  useSaveAttendanceMutation,
} from '../queries/use-attendance';
import { AttendanceHistoryTable } from './attendance-history-table';
import { AttendanceSessionSelector } from './attendance-session-selector';
import { AttendanceSessionWorkbench } from './attendance-session-workbench';

const emptyRecords: AttendanceRecord[] = [];

export function AttendancePage({ workspaceId }: AttendancePageProps) {
  const [activeTab, setActiveTab] = useState<'take' | 'history'>('take');
  const [batchId, setBatchId] = useState('');
  const [sessionDate, setSessionDate] = useState(getTodayDate);
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
  const [hasLookedUpSession, setHasLookedUpSession] = useState(false);

  // History Filter State
  const [historyBatchId, setHistoryBatchId] = useState('all');
  const [historyDate, setHistoryDate] = useState('');
  const [historyStatus, setHistoryStatus] = useState('all');

  // Active Draft Session State
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [draftStatuses, setDraftStatuses] = useState<Record<string, AttendanceRecordStatus>>({});
  const [draftSessionId, setDraftSessionId] = useState<string | null>(null);

  // Queries & Mutations
  const batchesQuery = useBatchesQuery(workspaceId, { page: 1, limit: 100 });
  const lookupQuery = useAttendanceSessionsQuery(
    workspaceId,
    { batchId: batchId || undefined, sessionDate: sessionDate || undefined, page: 1, limit: 1 },
    Boolean(batchId && sessionDate)
  );

  const historyQuery = useAttendanceSessionsQuery(workspaceId, {
    batchId: historyBatchId === 'all' ? undefined : historyBatchId,
    sessionDate: historyDate || undefined,
    status: historyStatus === 'all' ? undefined : (historyStatus as 'draft' | 'finalized'),
    page: 1,
    limit: 50,
  });

  const sessionQuery = useAttendanceSessionQuery(workspaceId, loadedSessionId);
  const createMutation = useCreateAttendanceSessionMutation(workspaceId);
  const saveMutation = useSaveAttendanceMutation(workspaceId);
  const finalizeMutation = useFinalizeAttendanceSessionMutation(workspaceId);

  const activeSession = sessionQuery.data;
  const batches = batchesQuery.data?.data ?? [];
  // Auto-select first active batch on load if none selected
  const activeBatches = useMemo(
    () => (batchesQuery.data?.data ?? []).filter((batch) => batch.status === 'active'),
    [batchesQuery.data?.data]
  );

  useEffect(() => {
    if (!batchId && activeBatches.length > 0) {
      setBatchId(activeBatches[0].id);
    }
  }, [activeBatches, batchId]);

  const matchingSession = lookupQuery.data?.data[0];
  const records = activeSession?.records ?? emptyRecords;

  // Reactively sync loaded session whenever lookup query succeeds
  useEffect(() => {
    if (batchId && sessionDate && !lookupQuery.isFetching) {
      setHasLookedUpSession(true);
      setLoadedSessionId(matchingSession?.id ?? null);
    }
  }, [batchId, sessionDate, matchingSession?.id, lookupQuery.isFetching]);

  // Derive high-level workspace stats
  const historySessions = historyQuery.data?.data ?? [];
  const totalHistoryCount = historyQuery.data?.meta.total ?? historySessions.length;

  const averageAttendanceRate = useMemo(() => {
    if (!historySessions.length) return 0;
    const totalPresent = historySessions.reduce((acc, s) => acc + s.presentCount, 0);
    const totalRoster = historySessions.reduce((acc, s) => acc + s.rosterCount, 0);
    return getAttendancePercentage(totalPresent, totalRoster);
  }, [historySessions]);

  const todaySessionsCount = useMemo(() => {
    const today = getTodayDate();
    return historySessions.filter((s) => s.sessionDate === today).length;
  }, [historySessions]);

  // Dirty checking
  const changedRecords = useMemo(
    () =>
      draftSessionId === activeSession?.id
        ? records.filter(
            (record) =>
              draftStatuses[record.studentId] !== undefined &&
              draftStatuses[record.studentId] !== record.status
          )
        : [],
    [activeSession?.id, draftSessionId, draftStatuses, records]
  );
  const isDirty = changedRecords.length > 0;

  function handleBatchChange(newBatchId: string) {
    setBatchId(newBatchId);
    setLoadedSessionId(null);
  }

  function handleDateChange(newDate: string) {
    setSessionDate(newDate);
    setLoadedSessionId(null);
  }

  function openSessionFromHistory(session: AttendanceSessionSummary) {
    setBatchId(session.batchId);
    setSessionDate(session.sessionDate);
    setLoadedSessionId(session.id);
    setHasLookedUpSession(true);
    setActiveTab('take');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function createSession() {
    if (!batchId || !sessionDate) return;
    createMutation.mutate(
      { batchId, sessionDate },
      {
        onSuccess: (session) => {
          setLoadedSessionId(session.id);
          setHasLookedUpSession(true);
          toast.success('Attendance session created.');
        },
        onError: (error) =>
          toast.error(error.message || 'Could not create the attendance session.'),
      }
    );
  }

  function handleStatusChange(studentId: string, status: AttendanceRecordStatus) {
    if (!activeSession) return;
    setDraftSessionId(activeSession.id);
    setDraftStatuses((current) => ({ ...current, [studentId]: status }));
  }

  function handleMarkAll(status: AttendanceRecordStatus) {
    if (!activeSession) return;
    setDraftSessionId(activeSession.id);
    setDraftStatuses(Object.fromEntries(records.map((r) => [r.studentId, status])));
  }

  async function handleSaveDraft() {
    if (!activeSession || !isDirty) return;
    try {
      await saveMutation.mutateAsync({
        sessionId: activeSession.id,
        records: changedRecords.map((record) => ({
          studentId: record.studentId,
          status: draftStatuses[record.studentId] ?? record.status,
        })),
      });
      toast.success('Attendance draft saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save attendance.');
    }
  }

  async function handleFinalize() {
    if (!activeSession) return;
    try {
      if (isDirty) await handleSaveDraft();
      await finalizeMutation.mutateAsync(activeSession.id);
      setFinalizeOpen(false);
      toast.success('Attendance session finalized.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not finalize attendance.');
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Attendance Management"
        description="Record daily batch attendance, track student turnout rates, and inspect finalized session records."
      />

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Batches</span>
            <Users className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{activeBatches.length}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Running this term</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Avg. Attendance</span>
            <TrendingUp className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{averageAttendanceRate}%</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Across logged sessions</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Today&apos;s Sessions</span>
            <CheckCircle2 className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{todaySessionsCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Recorded today</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/40 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Sessions</span>
            <History className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">{totalHistoryCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Historical records</p>
        </div>
      </div>

      {/* Main View Navigation Tabs */}
      <div className="inline-flex rounded-full border border-border/80 bg-muted/20 p-1 self-start">
        <button
          type="button"
          onClick={() => setActiveTab('take')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'take'
              ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CalendarDays className="size-3.5" />
          <span>Mark Attendance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-primary text-primary-foreground shadow-xs shadow-primary/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="size-3.5" />
          <span>Session History & Logs</span>
          <span className="rounded-full bg-muted/60 px-1.5 py-0.2 text-[10px] font-mono">
            {totalHistoryCount}
          </span>
        </button>
      </div>

      {/* TAB 1: Mark Attendance */}
      {activeTab === 'take' && (
        <div className="space-y-6">
          {/* Session Selector Card */}
          <AttendanceSessionSelector
            batches={batches}
            selectedBatchId={batchId}
            onBatchChange={handleBatchChange}
            sessionDate={sessionDate}
            onDateChange={handleDateChange}
            isLoading={lookupQuery.isFetching}
          />

          {/* Lookup Error */}
          {hasLookedUpSession && lookupQuery.isError && (
            <ErrorState
              message="Could not check for an existing attendance session."
              onRetry={() => lookupQuery.refetch()}
            />
          )}

          {/* No Session Found Empty State */}
          {hasLookedUpSession &&
            !loadedSessionId &&
            !lookupQuery.isFetching &&
            !lookupQuery.isError && (
              <EmptyState
                title="No attendance session found"
                description="No session has been recorded for this batch on the selected date. Start a new draft session to take attendance."
                action={
                  <Button
                    onClick={createSession}
                    disabled={createMutation.isPending}
                    className="rounded-full font-semibold shadow-xs"
                  >
                    <PlusCircle data-icon="inline-start" />
                    {createMutation.isPending ? 'Starting session…' : 'Start Attendance Session'}
                  </Button>
                }
              />
            )}

          {/* Loading Session */}
          {sessionQuery.isPending && loadedSessionId && <LoadingState rows={6} />}

          {/* Session Error */}
          {sessionQuery.isError && (
            <ErrorState
              message="Could not load attendance session details."
              onRetry={() => sessionQuery.refetch()}
            />
          )}

          {/* Active Session Workbench */}
          {activeSession && (
            <AttendanceSessionWorkbench
              session={activeSession}
              draftStatuses={draftStatuses}
              onStatusChange={handleStatusChange}
              onMarkAll={handleMarkAll}
              onSaveDraft={() => void handleSaveDraft()}
              onFinalize={() => setFinalizeOpen(true)}
              isSaving={saveMutation.isPending}
              isFinalizing={finalizeMutation.isPending}
              isDirty={isDirty}
            />
          )}
        </div>
      )}

      {/* TAB 2: Session History & Records */}
      {activeTab === 'history' && (
        <AttendanceHistoryTable
          sessions={historySessions}
          batches={batches}
          selectedBatchId={historyBatchId}
          onBatchChange={setHistoryBatchId}
          selectedDate={historyDate}
          onDateChange={setHistoryDate}
          selectedStatus={historyStatus}
          onStatusChange={setHistoryStatus}
          isLoading={historyQuery.isPending}
          onOpenSession={openSessionFromHistory}
          onRetry={() => historyQuery.refetch()}
          isError={historyQuery.isError}
        />
      )}

      {/* Finalize Confirmation Dialog */}
      <AlertDialog open={finalizeOpen} onOpenChange={setFinalizeOpen}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Finalize attendance session?</AlertDialogTitle>
            <AlertDialogDescription>
              Once finalized, attendance records become permanently read-only and immutable for
              official auditing and reporting. Any unsaved changes will be saved automatically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={finalizeMutation.isPending} className="rounded-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleFinalize()}
              disabled={finalizeMutation.isPending}
              className="rounded-full font-semibold shadow-xs"
            >
              {finalizeMutation.isPending ? 'Finalizing…' : 'Finalize Session'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
