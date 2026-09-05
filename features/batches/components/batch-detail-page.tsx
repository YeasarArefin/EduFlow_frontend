"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  GraduationCap,
  Pencil,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  ErrorState,
  LoadingState,
} from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { useBatchQuery } from "../hooks/use-batches-query";
import { useBatchEnrollments } from "../hooks/use-batch-enrollments";
import { useBatchTeachersQuery } from "../hooks/use-batch-teachers";
import { BatchSheet } from "./batch-sheet";
import { BatchStudentsCard } from "./batch-students-card";
import { BatchTeachersCard } from "./batch-teachers-card";

const money = (value: string | null | undefined) => {
  if (!value) return "৳0.00";
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(value) / 100);
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-BD", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
};

export function BatchDetailPage({
  workspaceId,
  id,
}: {
  workspaceId: string;
  id: string;
}) {
  const query = useBatchQuery(workspaceId, id);
  const enrollmentsQuery = useBatchEnrollments(workspaceId, id);
  const teachersQuery = useBatchTeachersQuery(workspaceId, id);
  const [open, setOpen] = useState(false);

  if (query.isPending) return <LoadingState rows={5} />;
  if (query.isError)
    return (
      <ErrorState
        message="Could not load this batch profile."
        onRetry={() => query.refetch()}
      />
    );
  if (!query.data) return null;

  const batch = query.data;
  const activeStudentsCount = (enrollmentsQuery.data ?? []).filter(
    (e) => e.status === "active",
  ).length;
  const teachersCount = (teachersQuery.data ?? []).length;

  const academicSummary = [
    batch.classLevel?.name,
    batch.medium?.name,
    batch.academicGroup?.name,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link
          href="/dashboard/batches"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Batches</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">{batch.name}</span>
      </div>

      {/* Unified Batch Profile Hero Card */}
      <div className="rounded-3xl border border-border/80 bg-card/40 p-6 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {batch.name}
              </h1>
              <StatusBadge
                status={
                  batch.status === "active"
                    ? "success"
                    : batch.status === "inactive"
                      ? "warning"
                      : "info"
                }
              >
                {batch.status}
              </StatusBadge>
            </div>
            <p className="text-sm text-muted-foreground">
              {academicSummary || "General Academic Batch"}
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={batch.status === "archived"}
            className="rounded-full shadow-xs shrink-0 self-start sm:self-center"
          >
            <Pencil data-icon="inline-start" /> Edit batch
          </Button>
        </div>

        {/* Essential Academic Metadata Strip with Icons */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border/40 pt-5 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <DollarSign className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block truncate">
                Monthly Tuition
              </span>
              <p className="mt-0.5 text-base font-bold text-foreground truncate">
                {money(batch.monthlyFeeMinor)}
                <span className="text-xs font-normal text-muted-foreground"> / mo</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Calendar className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block truncate">
                Start Date
              </span>
              <p className="mt-0.5 text-base font-semibold text-foreground truncate">
                {formatDate(batch.startDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Users className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block truncate">
                Enrolled Students
              </span>
              <p className="mt-0.5 text-base font-semibold text-foreground truncate">
                {enrollmentsQuery.isPending ? "…" : activeStudentsCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {activeStudentsCount === 1 ? "student" : "students"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text border border-accent-border">
              <GraduationCap className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground block truncate">
                Assigned Faculty
              </span>
              <p className="mt-0.5 text-base font-semibold text-foreground truncate">
                {teachersQuery.isPending ? "…" : teachersCount}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {teachersCount === 1 ? "teacher" : "teachers"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Roster & Faculty Management: Side-by-Side 2-Column Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
        <BatchStudentsCard
          workspaceId={workspaceId}
          batchId={batch.id}
          defaultMonthlyFeeMinor={batch.monthlyFeeMinor}
          batchName={batch.name}
        />

        <BatchTeachersCard workspaceId={workspaceId} batchId={batch.id} />
      </div>

      <BatchSheet
        key={`${batch.id}-${open ? "open" : "closed"}`}
        open={open}
        onOpenChange={setOpen}
        workspaceId={workspaceId}
        batch={batch}
      />
    </div>
  );
}
