"use client";

import Link from "next/link";
import { Archive, ChevronLeft, Mail, Pencil, Phone, RefreshCw } from "lucide-react";
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
import {
  useArchiveTeacherMutation,
  useUpdateTeacherMutation,
} from "../mutations/use-teacher-mutations";
import { useTeacherQuery } from "../queries/use-teachers-query";
import { TeacherSheet } from "./teacher-sheet";

const money = (value: string) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value || 0) / 100);

export function TeacherDetailPage({
  workspaceId,
  teacherId,
}: {
  workspaceId: string;
  teacherId: string;
}) {
  const query = useTeacherQuery(workspaceId, teacherId);
  const archiveMutation = useArchiveTeacherMutation();
  const updateMutation = useUpdateTeacherMutation();
  const [edit, setEdit] = useState(false);
  const [confirm, setConfirm] = useState(false);

  if (query.isPending) return <LoadingState rows={5} />;
  if (query.isError || !query.data)
    return (
      <ErrorState
        message="Could not load this teacher record."
        onRetry={() => query.refetch()}
      />
    );

  const t = query.data;
  const isArchived = t.status === "archived";

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link
          href="/dashboard/teachers"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          <span>Teachers</span>
        </Link>
        <span>/</span>
        <span className="text-foreground">{t.name}</span>
      </div>

      <PageHeader
        title={t.name}
        description={`Teacher Code · ${t.teacherCode}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEdit(true)}
            >
              <Pencil data-icon="inline-start" />
              <span>Edit profile</span>
            </Button>
            <Button
              variant={isArchived ? "default" : "destructive"}
              size="sm"
              onClick={() => setConfirm(true)}
            >
              {isArchived ? (
                <>
                  <RefreshCw data-icon="inline-start" />
                  <span>Reactivate</span>
                </>
              ) : (
                <>
                  <Archive data-icon="inline-start" />
                  <span>Archive</span>
                </>
              )}
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SectionCard title="Teacher overview">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <StatusBadge
                status={
                  t.status === "active"
                    ? "success"
                    : t.status === "inactive"
                      ? "warning"
                      : "info"
                }
              >
                {t.status}
              </StatusBadge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Teacher code</span>
              <span className="font-mono font-medium text-foreground">
                {t.teacherCode}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Specialization</span>
              <span className="font-medium text-foreground">
                {t.subjectSpecialty ?? "Not specified"}
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Contact information">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Phone className="size-3.5" />
                <span>Phone</span>
              </span>
              {t.phone ? (
                <a
                  href={`tel:${t.phone}`}
                  className="font-medium text-accent-foreground hover:underline"
                >
                  {t.phone}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Mail className="size-3.5" />
                <span>Email</span>
              </span>
              {t.email ? (
                <a
                  href={`mailto:${t.email}`}
                  className="font-medium text-accent-foreground hover:underline"
                >
                  {t.email}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Compensation">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-muted-foreground">Default base salary</span>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {money(t.defaultSalaryMinor)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per cycle standard rate configured for this instructor.
            </p>
          </div>
        </SectionCard>

        {t.notes ? (
          <div className="md:col-span-2 lg:col-span-3">
            <SectionCard title="Notes & qualifications">
              <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {t.notes}
              </p>
            </SectionCard>
          </div>
        ) : null}
      </div>

      <TeacherSheet
        open={edit}
        onOpenChange={setEdit}
        workspaceId={workspaceId}
        teacher={t}
      />

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isArchived ? "Reactivate teacher?" : "Archive this teacher?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isArchived
                ? `This will restore ${t.name}'s profile to active status in this workspace.`
                : `This will mark ${t.name} as archived. Existing historical assignments and salary records will be preserved.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={isArchived ? "default" : "destructive"}
              onClick={() => {
                if (isArchived)
                  updateMutation.mutate(
                    { workspaceId, id: t.id, input: { status: "active" } },
                    { onSuccess: () => setConfirm(false) },
                  );
                else
                  archiveMutation.mutate(
                    { workspaceId, id: t.id },
                    { onSuccess: () => setConfirm(false) },
                  );
              }}
            >
              {isArchived ? "Reactivate" : "Archive"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
