"use client";

import Link from "next/link";
import { Archive, ChevronLeft, Pencil, Plus, Search } from "lucide-react";
import { useState } from "react";
import {
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
} from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useArchiveStudentMutation } from "../mutations/use-archive-student-mutation";
import { useUpdateStudentMutation } from "../mutations/use-update-student-mutation";
import { useStudentQuery } from "../queries/use-students-query";
import { StudentSheet } from "./student-sheet";
import { useStudentEnrollments } from "../queries/use-student-enrollments";
import { useBatchesQuery } from "@/features/batches/hooks/use-batches-query";
import { useEnrollStudent } from "@/features/batches/hooks/use-batch-enrollments";

const labels = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
} as const;
const visuals = {
  active: "success",
  inactive: "warning",
  archived: "info",
} as const;
function date(value: string | null) {
  return value
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value))
    : "Not recorded";
}

function taka(minor: string | null) {
  if (minor === null) return "—";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(minor) / 100);
}

export function StudentDetailPage({
  workspaceId,
  studentId,
}: {
  workspaceId: string;
  studentId: string;
}) {
  const query = useStudentQuery(workspaceId, studentId);
  const archive = useArchiveStudentMutation();
  const updateStudent = useUpdateStudentMutation();
  const enrollments = useStudentEnrollments(workspaceId, studentId);
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [batchId, setBatchId] = useState("");
  const [batchSearch, setBatchSearch] = useState("");
  const [joinedAt, setJoinedAt] = useState("");
  const [feeOverrideMinor, setFeeOverrideMinor] = useState("");
  const [discountMinor, setDiscountMinor] = useState("");
  const batches = useBatchesQuery(workspaceId, { page: 1, limit: 100, status: "active" });
  const enroll = useEnrollStudent();
  if (query.isPending) return <LoadingState rows={5} />;
  if (query.isError || !query.data)
    return (
      <ErrorState
        message="Could not load this student. It may no longer be available in this workspace."
        onRetry={() => query.refetch()}
      />
    );
  const student = query.data;
  const activeBatches = (batches.data?.data ?? []).filter((batch) =>
    batch.name.toLocaleLowerCase().includes(batchSearch.toLocaleLowerCase()),
  );
  const closeEnrollment = () => {
    setEnrollOpen(false);
    setBatchId("");
    setBatchSearch("");
    setJoinedAt("");
    setFeeOverrideMinor("");
    setDiscountMinor("");
  };
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title={student.fullName}
        description={`Student code · ${student.studentCode}`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/dashboard/students" />}
            >
              <ChevronLeft data-icon="inline-start" /> Students
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil data-icon="inline-start" /> Edit
            </Button>
            <Button
              variant={student.status === "archived" ? "outline" : "destructive"}
              size="sm"
              onClick={() => setArchiveOpen(true)}
            >
              <Archive data-icon="inline-start" />
              {student.status === "archived" ? "Reactivate" : "Archive"}
            </Button>
          </>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard
          title="Student information"
          action={
            <StatusBadge status={visuals[student.status]}>
              {labels[student.status]}
            </StatusBadge>
          }
        >
          <Details
            rows={[
              ["Student code", student.studentCode],
              ["Phone", student.phone || "Not recorded"],
              [
                "Gender",
                student.gender
                  ? student.gender[0].toUpperCase() + student.gender.slice(1)
                  : "Not recorded",
              ],
              ["Admission date", date(student.admissionDate)],
            ]}
          />
        </SectionCard>
        <SectionCard title="Guardian & address">
          <Details
            rows={[
              ["Guardian name", student.guardianName || "Not recorded"],
              ["Guardian phone", student.guardianPhone || "Not recorded"],
              ["Address", student.address || "Not recorded"],
            ]}
          />
        </SectionCard>
        <SectionCard title="Notes" className="md:col-span-2">
          <p className="whitespace-pre-wrap text-sm leading-6 text-foreground-soft">
            {student.notes || "No notes recorded for this student."}
          </p>
        </SectionCard>
        <SectionCard title="Enrollments" className="md:col-span-2" description="Current and historical batch membership." action={<Button size="sm" onClick={() => setEnrollOpen(true)} disabled={student.status !== "active"}><Plus data-icon="inline-start" /> Enroll</Button>}>
          {enrollments.isPending ? <LoadingState rows={2} /> : null}
          {enrollments.isError ? <ErrorState message="Could not load enrollments." onRetry={() => enrollments.refetch()} /> : null}
          {enrollments.isSuccess && !enrollments.data.length ? <p className="text-sm text-muted-foreground">No batch enrollments yet.</p> : null}
          <div className="space-y-2">{enrollments.data?.map((enrollment) => <div key={enrollment.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"><div><p className="font-medium">{enrollment.batchName}</p><p className="text-sm text-muted-foreground">Joined {date(enrollment.joinedAt)} · Fee override {taka(enrollment.feeOverrideMinor)} · Discount {taka(enrollment.discountMinor)}</p></div><StatusBadge status={enrollment.status === "active" ? "success" : "info"}>{enrollment.status}</StatusBadge></div>)}</div>
        </SectionCard>
      </div>
      <StudentSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        workspaceId={workspaceId}
        student={student}
      />
      <Sheet open={enrollOpen} onOpenChange={(open) => open ? setEnrollOpen(true) : closeEnrollment()}><SheetContent><SheetHeader><SheetTitle>Enroll in a batch</SheetTitle></SheetHeader><div className="space-y-4 p-5"><div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={batchSearch} onChange={(event) => setBatchSearch(event.target.value)} className="pl-9" placeholder="Search active batches" /></div><Select value={batchId} onValueChange={(value) => setBatchId(value ?? "")} disabled={batches.isPending || activeBatches.length === 0}><SelectTrigger className="w-full"><SelectValue placeholder={batches.isPending ? "Loading active batches…" : activeBatches.length ? "Choose an active batch" : "No active batches available"} /></SelectTrigger><SelectContent>{activeBatches.map((batch) => <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>)}</SelectContent></Select><div className="grid gap-4 sm:grid-cols-2"><label className="space-y-2 text-sm font-medium">Joined date<Input type="date" value={joinedAt} onChange={(event) => setJoinedAt(event.target.value)} /></label><label className="space-y-2 text-sm font-medium">Fee override (poisha)<Input inputMode="numeric" value={feeOverrideMinor} onChange={(event) => setFeeOverrideMinor(event.target.value.replace(/\D/g, ""))} placeholder="Optional" /></label><label className="space-y-2 text-sm font-medium sm:col-span-2">Discount (poisha)<Input inputMode="numeric" value={discountMinor} onChange={(event) => setDiscountMinor(event.target.value.replace(/\D/g, ""))} placeholder="Optional" /></label></div>{enroll.isError ? <p className="text-sm text-destructive">Unable to enroll this student. They may already be active in this batch.</p> : null}</div><SheetFooter><Button variant="outline" onClick={closeEnrollment}>Cancel</Button><Button disabled={!batchId || enroll.isPending} onClick={() => enroll.mutate({ workspaceId, batchId, input: { studentId, joinedAt: joinedAt || undefined, feeOverrideMinor: feeOverrideMinor || null, discountMinor: discountMinor || null } }, { onSuccess: () => { closeEnrollment(); enrollments.refetch(); } })}>Enroll student</Button></SheetFooter></SheetContent></Sheet>
      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{student.status === "archived" ? "Reactivate this student?" : "Archive this student?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {student.status === "archived" ? "The student will become active again and can be enrolled into active batches." : "The student will remain in the workspace record but will be marked archived. You can still find archived students through the status filter."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archive.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant={student.status === "archived" ? "default" : "destructive"}
              disabled={archive.isPending || updateStudent.isPending}
              onClick={() =>
                student.status === "archived"
                  ? updateStudent.mutate({ workspaceId, studentId, input: { status: "active" } }, { onSuccess: () => setArchiveOpen(false) })
                  : archive.mutate({ workspaceId, studentId }, { onSuccess: () => setArchiveOpen(false) })
              }
            >
              <Archive data-icon="inline-start" /> {student.status === "archived" ? "Reactivate student" : "Archive student"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
function Details({ rows }: { rows: [string, string][] }) {
  return (
    <dl className="divide-y divide-border">
      {rows.map(([label, value]) => (
        <div key={label} className="grid gap-1 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="text-xs font-medium uppercase tracking-wider text-subtle-foreground">
            {label}
          </dt>
          <dd className="text-sm text-foreground-soft sm:col-span-2">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
