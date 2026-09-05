"use client";

import Link from "next/link";
import {
  Archive,
  Calculator,
  Calendar,
  CreditCard,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  EmptyState,
  ErrorState,
  LoadingState,
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useStudentsQuery } from "@/features/students/queries/use-students-query";
import type { Enrollment } from "../api/batch-enrollments";
import {
  useArchiveEnrollment,
  useBatchEnrollments,
  useEnrollStudent,
  useReactivateEnrollment,
  useUnenrollStudent,
} from "../hooks/use-batch-enrollments";

const money = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "number" ? value : Number(value) / 100;
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(num);
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
};

export function BatchStudentsCard({
  workspaceId,
  batchId,
  defaultMonthlyFeeMinor,
  batchName,
}: {
  workspaceId: string;
  batchId: string;
  defaultMonthlyFeeMinor: string;
  batchName: string;
}) {
  const enrollmentsQuery = useBatchEnrollments(workspaceId, batchId);
  const studentsQuery = useStudentsQuery(workspaceId, {
    page: 1,
    limit: 100,
    status: "active",
  });
  const enrollMutation = useEnrollStudent();
  const archiveMutation = useArchiveEnrollment();
  const reactivateMutation = useReactivateEnrollment();
  const unenrollMutation = useUnenrollStudent();

  const [enrollSheetOpen, setEnrollSheetOpen] = useState(false);
  const [searchRoster, setSearchRoster] = useState("");
  const [archiving, setArchiving] = useState<Enrollment | null>(null);
  const [unenrolling, setUnenrolling] = useState<Enrollment | null>(null);

  const pending =
    enrollMutation.isPending ||
    archiveMutation.isPending ||
    reactivateMutation.isPending ||
    unenrollMutation.isPending;

  // Filter the current roster by search
  const filteredRoster = useMemo(() => {
    const list = enrollmentsQuery.data ?? [];
    if (!searchRoster.trim()) return list;
    const q = searchRoster.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.studentCode.toLowerCase().includes(q) ||
        (item.phone && item.phone.includes(q)),
    );
  }, [enrollmentsQuery.data, searchRoster]);

  const activeCount = useMemo(
    () => (enrollmentsQuery.data ?? []).filter((x) => x.status === "active").length,
    [enrollmentsQuery.data],
  );

  function handleArchive() {
    if (!archiving) return;
    archiveMutation.mutate(
      { workspaceId, batchId, id: archiving.id },
      {
        onSuccess: () => {
          toast.success(`${archiving.name} has been archived from this batch.`);
          setArchiving(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Could not archive enrollment.");
        },
      },
    );
  }

  function handleUnenroll() {
    if (!unenrolling) return;
    unenrollMutation.mutate(
      { workspaceId, batchId, id: unenrolling.id },
      {
        onSuccess: () => {
          toast.success(`${unenrolling.name} has been unenrolled from ${batchName}.`);
          setUnenrolling(null);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Could not unenroll student.");
        },
      },
    );
  }

  function handleReactivate(enrollment: Enrollment) {
    reactivateMutation.mutate(
      { workspaceId, batchId, id: enrollment.id },
      {
        onSuccess: () => {
          toast.success(`${enrollment.name} has been reactivated in ${batchName}.`);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Could not reactivate enrollment.");
        },
      },
    );
  }

  return (
    <SectionCard
      title="Enrolled Students"
      description="Manage active student enrollments, customized fees, and batch roster history."
      action={
        <Button
          onClick={() => setEnrollSheetOpen(true)}
          className="rounded-full shadow-sm"
        >
          <Plus data-icon="inline-start" /> Enroll student
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Search Bar for Enrolled Students */}
        {enrollmentsQuery.data && enrollmentsQuery.data.length > 0 ? (
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchRoster}
                onChange={(e) => setSearchRoster(e.target.value)}
                placeholder="Search enrolled students by name, code, or phone..."
                className="h-10 pl-10 rounded-full bg-input/60 border-input-border text-sm"
              />
            </div>
            <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/60">
              {activeCount} active {activeCount === 1 ? "student" : "students"}
            </span>
          </div>
        ) : null}

        {enrollmentsQuery.isPending ? <LoadingState rows={3} /> : null}

        {enrollmentsQuery.isError ? (
          <ErrorState
            message="Could not load batch student enrollments."
            onRetry={() => enrollmentsQuery.refetch()}
          />
        ) : null}

        {enrollmentsQuery.isSuccess && !enrollmentsQuery.data.length ? (
          <EmptyState
            title="No students enrolled yet"
            description="Enroll an active student from your directory to begin building this batch roster."
            action={
              <Button
                onClick={() => setEnrollSheetOpen(true)}
                className="rounded-full shadow-sm"
              >
                <Plus data-icon="inline-start" /> Enroll student
              </Button>
            }
          />
        ) : null}

        {enrollmentsQuery.isSuccess &&
        enrollmentsQuery.data.length > 0 &&
        !filteredRoster.length ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              No students match &ldquo;{searchRoster}&rdquo;.
            </p>
          </div>
        ) : null}

        {/* Student Roster List */}
        <div className="divide-y divide-border/40 rounded-2xl border border-border/80 bg-card/40 overflow-hidden backdrop-blur-xs">
          {filteredRoster.map((enrollment) => {
            const baseFeeMinor =
              enrollment.feeOverrideMinor ?? defaultMonthlyFeeMinor;
            const discountMinor = enrollment.discountMinor ?? "0";
            const netFeeMinor = Math.max(
              0,
              Number(baseFeeMinor) - Number(discountMinor),
            ).toString();

            return (
              <div
                key={enrollment.id}
                className="group flex flex-col gap-3 p-4 transition-colors hover:bg-card/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/dashboard/students/${enrollment.studentId}`}
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      {enrollment.name}
                    </Link>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {enrollment.studentCode}
                    </span>
                    <StatusBadge
                      status={
                        enrollment.status === "active"
                          ? "success"
                          : enrollment.status === "inactive"
                            ? "warning"
                            : "info"
                      }
                    >
                      {enrollment.status}
                    </StatusBadge>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {enrollment.phone ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3 text-muted-foreground" />
                        {enrollment.phone}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-3 text-muted-foreground" />
                      Joined: {formatDate(enrollment.joinedAt)}
                    </span>
                  </div>

                  {/* Fee Badges & Calculation Details */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    {enrollment.feeOverrideMinor ? (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500 border border-amber-500/20">
                        Custom Base: {money(enrollment.feeOverrideMinor)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
                        Standard Base: {money(defaultMonthlyFeeMinor)}
                      </span>
                    )}

                    {enrollment.discountMinor ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 border border-emerald-500/20">
                        Discount: -{money(enrollment.discountMinor)}
                      </span>
                    ) : null}

                    <span className="text-xs font-semibold text-foreground">
                      Net Monthly: {money(netFeeMinor)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {enrollment.status === "archived" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full text-xs font-medium gap-1.5 border-border/80 hover:bg-muted/80"
                      onClick={() => handleReactivate(enrollment)}
                      disabled={pending}
                    >
                      <RefreshCw className="size-3 text-muted-foreground" />
                      Reactivate
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10"
                      aria-label={`Archive ${enrollment.name}`}
                      title={`Archive ${enrollment.name}`}
                      onClick={() => setArchiving(enrollment)}
                      disabled={pending}
                    >
                      <Archive className="size-3.5" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Unenroll ${enrollment.name}`}
                    title={`Unenroll ${enrollment.name}`}
                    onClick={() => setUnenrolling(enrollment)}
                    disabled={pending}
                  >
                    <UserMinus className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enroll Student Sheet */}
      <EnrollStudentSheet
        open={enrollSheetOpen}
        onOpenChange={setEnrollSheetOpen}
        workspaceId={workspaceId}
        batchId={batchId}
        batchName={batchName}
        defaultMonthlyFeeMinor={defaultMonthlyFeeMinor}
        existingEnrollments={enrollmentsQuery.data ?? []}
        allStudents={studentsQuery.data?.data ?? []}
        isLoadingStudents={studentsQuery.isPending}
      />

      {/* Archive Enrollment Confirmation Dialog */}
      <AlertDialog
        open={Boolean(archiving)}
        onOpenChange={(open) => !open && setArchiving(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Archive enrollment for {archiving?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {archiving?.name} will remain in this batch&apos;s historical tuition and attendance records,
              but will no longer be listed as an actively enrolled student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={archiveMutation.isPending}
              className="rounded-full"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={archiveMutation.isPending}
              className="rounded-full bg-amber-600 text-white hover:bg-amber-700 font-semibold shadow-sm"
              onClick={handleArchive}
            >
              {archiveMutation.isPending && <Spinner data-icon="inline-start" />}
              Archive enrollment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unenroll Confirmation Dialog */}
      <AlertDialog
        open={Boolean(unenrolling)}
        onOpenChange={(open) => !open && setUnenrolling(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Unenroll {unenrolling?.name} from {batchName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will completely remove {unenrolling?.name}&apos;s enrollment record from this batch.
              Use Archive if you wish to preserve historical records instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={unenrollMutation.isPending}
              className="rounded-full"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={unenrollMutation.isPending}
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-semibold shadow-sm"
              onClick={handleUnenroll}
            >
              {unenrollMutation.isPending && <Spinner data-icon="inline-start" />}
              Unenroll student
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}

// -------------------------------------------------------------
// Sub-component: Enroll Student Sheet with Intuitive User Flow
// -------------------------------------------------------------
function EnrollStudentSheet({
  open,
  onOpenChange,
  workspaceId,
  batchId,
  batchName,
  defaultMonthlyFeeMinor,
  existingEnrollments,
  allStudents,
  isLoadingStudents,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  batchId: string;
  batchName: string;
  defaultMonthlyFeeMinor: string;
  existingEnrollments: Enrollment[];
  allStudents: Array<{
    id: string;
    studentCode: string;
    fullName: string;
    phone: string | null;
    guardianName: string | null;
    status: string;
  }>;
  isLoadingStudents: boolean;
}) {
  const enrollMutation = useEnrollStudent();

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [joinedAt, setJoinedAt] = useState(() =>
    new Date().toISOString().split("T")[0],
  );
  const [feeOverrideTaka, setFeeOverrideTaka] = useState("");
  const [discountTaka, setDiscountTaka] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Filter available students (exclude actively assigned)
  const availableStudents = useMemo(() => {
    const assignedIds = new Set(
      existingEnrollments
        .filter((e) => e.status === "active")
        .map((e) => e.studentId),
    );
    return allStudents.filter(
      (s) =>
        !assignedIds.has(s.id) &&
        s.status === "active" &&
        (!studentSearch.trim() ||
          `${s.fullName} ${s.studentCode} ${s.phone ?? ""}`
            .toLowerCase()
            .includes(studentSearch.toLowerCase())),
    );
  }, [allStudents, existingEnrollments, studentSearch]);

  const selectedStudent = useMemo(
    () => allStudents.find((s) => s.id === selectedStudentId),
    [allStudents, selectedStudentId],
  );

  // Net calculation in Taka
  const defaultFeeTaka = Number(defaultMonthlyFeeMinor || 0) / 100;
  const effectiveBaseTaka = feeOverrideTaka.trim()
    ? Number(feeOverrideTaka) || 0
    : defaultFeeTaka;
  const discountAmountTaka = Number(discountTaka) || 0;
  const netMonthlyTaka = Math.max(0, effectiveBaseTaka - discountAmountTaka);

  const isFeeValid =
    (!feeOverrideTaka.trim() ||
      (!isNaN(Number(feeOverrideTaka)) && Number(feeOverrideTaka) >= 0)) &&
    (!discountTaka.trim() ||
      (!isNaN(Number(discountTaka)) && Number(discountTaka) >= 0));

  function handleEnroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (!selectedStudentId || !isFeeValid) return;

    const input = {
      studentId: selectedStudentId,
      joinedAt: joinedAt || undefined,
      feeOverrideMinor: feeOverrideTaka.trim()
        ? Math.round(Number(feeOverrideTaka) * 100).toString()
        : null,
      discountMinor: discountTaka.trim()
        ? Math.round(Number(discountTaka) * 100).toString()
        : null,
    };

    enrollMutation.mutate(
      { workspaceId, batchId, input },
      {
        onSuccess: () => {
          toast.success(
            `${selectedStudent?.fullName ?? "Student"} enrolled in ${batchName} successfully.`,
          );
          onOpenChange(false);
          setSelectedStudentId("");
          setFeeOverrideTaka("");
          setDiscountTaka("");
          setStudentSearch("");
          setSubmitted(false);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Could not enroll student in this batch.");
        },
      },
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
        <SheetHeader className="border-b border-border/40 pb-4 pr-12">
          <SheetTitle>Enroll Student in Batch</SheetTitle>
          <SheetDescription>
            Assign an active student to <strong className="text-foreground">{batchName}</strong> and configure their tuition fees.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleEnroll} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            <FieldGroup className="gap-5">
              {/* Step 1: Student Selection */}
              <Field data-invalid={submitted && !selectedStudentId}>
                <FieldLabel htmlFor="select-student">
                  Select Active Student *
                </FieldLabel>

                {/* Filter / Search input if many students exist */}
                <div className="relative mb-2">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Type name, code, or phone to filter list..."
                    className="h-10 pl-10 rounded-full bg-input/60 border-input-border text-sm"
                  />
                </div>

                <Select
                  value={selectedStudentId}
                  onValueChange={(val) => setSelectedStudentId(val ?? "")}
                  disabled={isLoadingStudents || enrollMutation.isPending}
                >
                  <SelectTrigger id="select-student" className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingStudents
                          ? "Loading student directory…"
                          : availableStudents.length
                            ? "Choose student from list"
                            : "No eligible students available"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {availableStudents.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.fullName} ({s.studentCode})
                          {s.phone ? ` · ${s.phone}` : ""}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {submitted && !selectedStudentId && (
                  <FieldError
                    errors={[{ message: "Please select a student to enroll." }]}
                  />
                )}
              </Field>

              {/* Selected Student Information Preview Card */}
              {selectedStudent ? (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 backdrop-blur-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <UserCheck className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">
                        {selectedStudent.fullName}
                      </p>
                      <div className="mt-1 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                        <span>Code: <strong className="text-foreground">{selectedStudent.studentCode}</strong></span>
                        <span>Phone: <strong className="text-foreground">{selectedStudent.phone ?? "None"}</strong></span>
                        {selectedStudent.guardianName && (
                          <span className="sm:col-span-2">Guardian: <strong className="text-foreground">{selectedStudent.guardianName}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Step 2: Joined Date */}
              <Field>
                <FieldLabel htmlFor="enroll-joined-date">
                  Enrollment / Joining Date
                </FieldLabel>
                <Input
                  id="enroll-joined-date"
                  type="date"
                  value={joinedAt}
                  onChange={(e) => setJoinedAt(e.target.value)}
                  className="h-10 rounded-full"
                />
                <FieldDescription>
                  Date the student started attending this batch.
                </FieldDescription>
              </Field>

              {/* Step 3: Fee Configuration & Customization */}
              <div className="rounded-2xl border border-border/80 bg-card/50 p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <CreditCard className="size-4 text-primary" />
                  <span>Fee Customization & Scholarship</span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Standard Batch Fee:</span>
                  <strong className="text-sm font-bold text-foreground">
                    ৳{defaultFeeTaka.toLocaleString("en-BD", { minimumFractionDigits: 2 })} / month
                  </strong>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="enroll-fee-override">
                      Custom Base Fee (BDT ৳)
                    </FieldLabel>
                    <Input
                      id="enroll-fee-override"
                      type="text"
                      inputMode="decimal"
                      value={feeOverrideTaka}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) {
                          setFeeOverrideTaka(v);
                        }
                      }}
                      placeholder={`e.g. ${defaultFeeTaka}`}
                      className="h-10 rounded-full"
                    />
                    <FieldDescription>
                      Leave blank to use standard fee.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="enroll-discount">
                      Monthly Discount (BDT ৳)
                    </FieldLabel>
                    <Input
                      id="enroll-discount"
                      type="text"
                      inputMode="decimal"
                      value={discountTaka}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "" || /^\d*\.?\d{0,2}$/.test(v)) {
                          setDiscountTaka(v);
                        }
                      }}
                      placeholder="e.g. 500"
                      className="h-10 rounded-full"
                    />
                    <FieldDescription>
                      Scholarship or waiver amount.
                    </FieldDescription>
                  </Field>
                </div>

                {/* Live Net Fee Calculation Summary */}
                <div className="rounded-xl border border-primary/20 bg-primary/10 p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calculator className="size-4 text-primary" />
                    <span>Effective Monthly Fee:</span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-bold text-primary">
                      ৳{netMonthlyTaka.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-muted-foreground"> / month</span>
                  </div>
                </div>
              </div>
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={enrollMutation.isPending}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!selectedStudentId || !isFeeValid || enrollMutation.isPending}
              className="rounded-full shadow-sm font-semibold"
            >
              {enrollMutation.isPending && <Spinner data-icon="inline-start" />}
              Enroll student
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
