"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
import { useBatchesQuery } from "@/features/batches/hooks/use-batches-query";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCheck, CircleCheck, Clock3, Save, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { AttendanceRecord, AttendanceRecordStatus, AttendanceSessionSummary } from "../api/attendance";
import {
  useAttendanceSessionQuery,
  useAttendanceSessionsQuery,
  useCreateAttendanceSessionMutation,
  useFinalizeAttendanceSessionMutation,
  useSaveAttendanceMutation,
} from "../hooks/use-attendance";

const today = () => new Date().toISOString().slice(0, 10);
const emptyRecords: AttendanceRecord[] = [];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function sessionStatus(status: "draft" | "finalized") {
  return status === "finalized" ? "success" : "warning";
}

function statusLabel(status: "draft" | "finalized") {
  return status === "finalized" ? "Finalized" : "Draft";
}

export function AttendancePage({ workspaceId }: { workspaceId: string }) {
  const [batchId, setBatchId] = useState("");
  const [sessionDate, setSessionDate] = useState(today);
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
  const [hasLookedUpSession, setHasLookedUpSession] = useState(false);
  const [historyBatchId, setHistoryBatchId] = useState("all");
  const [historyDate, setHistoryDate] = useState("");
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [draftStatuses, setDraftStatuses] = useState<Record<string, AttendanceRecordStatus>>({});
  const [draftSessionId, setDraftSessionId] = useState<string | null>(null);

  const batchesQuery = useBatchesQuery(workspaceId, { page: 1, limit: 100 });
  const lookupQuery = useAttendanceSessionsQuery(
    workspaceId,
    { batchId: batchId || undefined, sessionDate: sessionDate || undefined, page: 1, limit: 1 },
    Boolean(batchId && sessionDate),
  );
  const historyQuery = useAttendanceSessionsQuery(workspaceId, {
    batchId: historyBatchId === "all" ? undefined : historyBatchId,
    sessionDate: historyDate || undefined,
    page: 1,
    limit: 20,
  });
  const sessionQuery = useAttendanceSessionQuery(workspaceId, loadedSessionId);
  const createMutation = useCreateAttendanceSessionMutation(workspaceId);
  const saveMutation = useSaveAttendanceMutation(workspaceId);
  const finalizeMutation = useFinalizeAttendanceSessionMutation(workspaceId);

  const activeSession = sessionQuery.data;
  const batches = batchesQuery.data?.data ?? [];
  const activeBatches = batches.filter((batch) => batch.status === "active");
  const matchingSession = lookupQuery.data?.data[0];
  const records = activeSession?.records ?? emptyRecords;
  const isFinalized = activeSession?.status === "finalized";

  const changedRecords = useMemo(
    () => draftSessionId === activeSession?.id
      ? records.filter((record) => draftStatuses[record.studentId] !== undefined && draftStatuses[record.studentId] !== record.status)
      : [],
    [activeSession?.id, draftSessionId, draftStatuses, records],
  );
  const isDirty = changedRecords.length > 0;
  const presentCount = records.filter(
    (record) => (draftSessionId === activeSession?.id ? draftStatuses[record.studentId] ?? record.status : record.status) === "present",
  ).length;

  function resetLookup() {
    setLoadedSessionId(null);
    setHasLookedUpSession(false);
  }

  function loadSession() {
    if (!batchId || !sessionDate) {
      toast.error("Choose a batch and date first.");
      return;
    }
    if (lookupQuery.isFetching) return;
    setHasLookedUpSession(true);
    setLoadedSessionId(matchingSession?.id ?? null);
  }

  function openSession(session: AttendanceSessionSummary) {
    setBatchId(session.batchId);
    setSessionDate(session.sessionDate);
    setLoadedSessionId(session.id);
    setHasLookedUpSession(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function createSession() {
    if (!batchId || !sessionDate) return;
    createMutation.mutate(
      { batchId, sessionDate },
      {
        onSuccess: (session) => {
          setLoadedSessionId(session.id);
          setHasLookedUpSession(true);
          toast.success("Attendance session created.");
        },
        onError: (error) => toast.error(error.message || "Could not create the attendance session."),
      },
    );
  }

  function markAllPresent() {
    if (!activeSession) return;
    setDraftSessionId(activeSession.id);
    setDraftStatuses(Object.fromEntries(records.map((record) => [record.studentId, "present"])));
  }

  function setRecordStatus(studentId: string, status: AttendanceRecordStatus) {
    if (!activeSession) return;
    setDraftSessionId(activeSession.id);
    setDraftStatuses((current) => ({ ...current, [studentId]: status }));
  }

  function displayStatus(record: AttendanceRecord) {
    return draftSessionId === activeSession?.id
      ? draftStatuses[record.studentId] ?? record.status
      : record.status;
  }

  async function saveDraft() {
    if (!activeSession || !isDirty) return;
    await saveMutation.mutateAsync({
      sessionId: activeSession.id,
      records: changedRecords.map((record) => ({
        studentId: record.studentId,
        status: draftStatuses[record.studentId] ?? record.status,
      })),
    });
    toast.success("Attendance draft saved.");
  }

  async function finalizeSession() {
    if (!activeSession) return;
    try {
      if (isDirty) await saveDraft();
      await finalizeMutation.mutateAsync(activeSession.id);
      setFinalizeOpen(false);
      toast.success("Attendance session finalized.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not finalize attendance.");
    }
  }

  return (
    <div className="flex w-full max-w-6xl flex-col gap-6">
      <PageHeader
        title="Attendance"
        description="Take daily attendance for active batch enrollments and keep finalized history ready to review."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" /> Take attendance
          </CardTitle>
          <CardDescription>Select a batch and date, then load its existing session or start a new one.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px_auto] sm:items-end">
          <label className="grid gap-1.5 text-sm font-medium text-foreground">
            Batch
            <Select
              value={batchId}
              onValueChange={(value) => {
                setBatchId(value ?? "");
                resetLookup();
              }}
            >
              <SelectTrigger aria-label="Select batch"><SelectValue placeholder="Select an active batch" /></SelectTrigger>
              <SelectContent>
                {activeBatches.map((batch) => <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-foreground">
            Date
            <Input
              type="date"
              value={sessionDate}
              onChange={(event) => { setSessionDate(event.target.value); resetLookup(); }}
              aria-label="Attendance date"
            />
          </label>
          <Button className="h-9" variant="outline" onClick={loadSession} disabled={!batchId || !sessionDate || lookupQuery.isFetching}>
            <Clock3 data-icon="inline-start" /> {lookupQuery.isFetching ? "Loading" : "Load session"}
          </Button>
        </CardContent>
      </Card>

      {hasLookedUpSession && lookupQuery.isError ? (
        <ErrorState message="Could not check for an attendance session." onRetry={() => lookupQuery.refetch()} />
      ) : null}

      {hasLookedUpSession && !loadedSessionId && !lookupQuery.isFetching && !lookupQuery.isError ? (
        <EmptyState
          title="No session for this batch and date"
          description="Create a draft session to load the active enrollment roster and begin marking attendance."
          action={<Button onClick={createSession} disabled={createMutation.isPending}><CalendarDays data-icon="inline-start" /> {createMutation.isPending ? "Creating" : "Create session"}</Button>}
        />
      ) : null}

      {sessionQuery.isPending && loadedSessionId ? <LoadingState rows={6} /> : null}
      {sessionQuery.isError ? <ErrorState message="Could not load this attendance session." onRetry={() => sessionQuery.refetch()} /> : null}

      {activeSession ? (
        <Card>
          <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>{activeSession.batch.name}</CardTitle>
              <CardDescription className="mt-1">{formatDate(activeSession.sessionDate)} · {records.length} enrolled students</CardDescription>
            </div>
            <StatusBadge status={sessionStatus(activeSession.status)}>{statusLabel(activeSession.status)}</StatusBadge>
          </CardHeader>
          <CardContent className="space-y-4">
            {isFinalized ? (
              <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                <p>This session is finalized. Its attendance records are read-only.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">{presentCount} present · {records.length - presentCount} absent{isDirty ? " · unsaved changes" : ""}</p>
                <Button variant="outline" size="sm" onClick={markAllPresent} disabled={records.length === 0}><CheckCheck data-icon="inline-start" /> Mark all present</Button>
              </div>
            )}

            {records.length === 0 ? (
              <EmptyState title="No enrolled students" description="There were no active enrollments for this batch on the selected date." />
            ) : (
              <>
                <div className="hidden overflow-hidden rounded-xl border border-border md:block">
                  <div className="grid grid-cols-[120px_minmax(0,1fr)_250px] items-center gap-4 border-b border-border bg-muted/30 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>Student code</span><span>Student</span><span>Attendance</span>
                  </div>
                  {records.map((record) => <RosterRow key={record.id} record={record} value={displayStatus(record)} disabled={isFinalized} onChange={(status) => setRecordStatus(record.studentId, status)} />)}
                </div>
                <div className="grid gap-3 md:hidden">
                  {records.map((record) => <RosterCard key={record.id} record={record} value={displayStatus(record)} disabled={isFinalized} onChange={(status) => setRecordStatus(record.studentId, status)} />)}
                </div>
              </>
            )}

            {!isFinalized && records.length > 0 ? (
              <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => void saveDraft().catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Could not save attendance."))} disabled={!isDirty || saveMutation.isPending || finalizeMutation.isPending}><Save data-icon="inline-start" /> {saveMutation.isPending ? "Saving" : "Save draft"}</Button>
                <Button onClick={() => setFinalizeOpen(true)} disabled={saveMutation.isPending || finalizeMutation.isPending}><CircleCheck data-icon="inline-start" /> Finalize</Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UsersRound className="size-4 text-primary" /> Attendance history</CardTitle>
          <CardDescription>Filter past sessions by batch or date, then open one to review its roster.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_190px]">
            <Select value={historyBatchId} onValueChange={(value) => setHistoryBatchId(value ?? "all")}>
              <SelectTrigger aria-label="Filter attendance history by batch"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All batches</SelectItem>{batches.map((batch) => <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>)}</SelectContent>
            </Select>
            <Input type="date" value={historyDate} onChange={(event) => setHistoryDate(event.target.value)} aria-label="Filter attendance history by date" />
          </div>
          {historyQuery.isPending ? <LoadingState rows={4} /> : null}
          {historyQuery.isError ? <ErrorState message="Could not load attendance history." onRetry={() => historyQuery.refetch()} /> : null}
          {historyQuery.isSuccess && (historyQuery.data?.data.length ?? 0) === 0 ? <EmptyState title="No attendance history" description="No sessions match these filters yet." /> : null}
          {historyQuery.data?.data.map((session) => <HistoryRow key={session.id} session={session} onOpen={() => openSession(session)} />)}
        </CardContent>
      </Card>

      <AlertDialog open={finalizeOpen} onOpenChange={setFinalizeOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalize attendance?</AlertDialogTitle>
            <AlertDialogDescription>Finalized sessions cannot be edited. Any unsaved roster changes will be saved before the session is finalized.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={finalizeMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void finalizeSession()} disabled={finalizeMutation.isPending}>{finalizeMutation.isPending ? "Finalizing" : "Finalize session"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AttendanceControl({ value, disabled, onChange }: { value: AttendanceRecordStatus; disabled: boolean; onChange: (status: AttendanceRecordStatus) => void }) {
  return <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-border-strong" role="group" aria-label="Attendance status">
    {(["present", "absent"] as const).map((status) => <button key={status} type="button" disabled={disabled} onClick={() => onChange(status)} className={cn("min-h-10 px-3 text-sm font-medium capitalize transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70", status === "present" ? "border-r border-border" : "", value === status ? status === "present" ? "bg-primary text-primary-foreground" : "bg-destructive/15 text-destructive" : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground")}>{status}</button>)}
  </div>;
}

function RosterRow({ record, value, disabled, onChange }: { record: AttendanceRecord; value: AttendanceRecordStatus; disabled: boolean; onChange: (status: AttendanceRecordStatus) => void }) {
  return <div className="grid grid-cols-[120px_minmax(0,1fr)_250px] items-center gap-4 border-b border-border/70 px-4 py-3 last:border-b-0">
    <span className="font-mono text-xs text-muted-foreground">{record.student.studentCode}</span>
    <span className="truncate font-medium text-foreground">{record.student.fullName}</span>
    <AttendanceControl value={value} disabled={disabled} onChange={onChange} />
  </div>;
}

function RosterCard({ record, value, disabled, onChange }: { record: AttendanceRecord; value: AttendanceRecordStatus; disabled: boolean; onChange: (status: AttendanceRecordStatus) => void }) {
  return <div className="rounded-xl border border-border bg-card p-4">
    <div className="mb-3 flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-medium text-foreground">{record.student.fullName}</p><p className="mt-0.5 font-mono text-xs text-muted-foreground">{record.student.studentCode}</p></div></div>
    <AttendanceControl value={value} disabled={disabled} onChange={onChange} />
  </div>;
}

function HistoryRow({ session, onOpen }: { session: AttendanceSessionSummary; onOpen: () => void }) {
  return <button type="button" onClick={onOpen} className="grid w-full gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-accent-border hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
    <div className="min-w-0"><p className="truncate font-medium text-foreground">{session.batch.name}</p><p className="mt-0.5 text-sm text-muted-foreground">{formatDate(session.sessionDate)} · {session.rosterCount} students</p></div>
    <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">{session.presentCount}</span> present · <span className="font-medium text-foreground">{session.absentCount}</span> absent</p>
    <StatusBadge status={sessionStatus(session.status)}>{statusLabel(session.status)}</StatusBadge>
  </button>;
}
