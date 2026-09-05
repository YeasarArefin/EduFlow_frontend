"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
  Pagination,
} from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TEACHER_STATUSES, type TeacherStatus } from "../api/teachers";
import { useTeachersQuery } from "../queries/use-teachers-query";
import { TeacherSheet } from "./teacher-sheet";
const money = (value: string) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(Number(value) / 100);
export function TeachersPage({ workspaceId }: { workspaceId: string }) {
  const path = usePathname(),
    router = useRouter(),
    params = useSearchParams(),
    [open, setOpen] = useState(false);
  const page = Number(params.get("page")) || 1,
    status = params.get("status") as TeacherStatus | undefined,
    search = params.get("search") || undefined;
  const query = useTeachersQuery(workspaceId, {
    page,
    limit: 20,
    search,
    status,
  });
  const update = (values: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    router.replace(next.size ? `${path}?${next}` : path);
  };
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records in this workspace."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-full shadow-sm">
            <Plus data-icon="inline-start" /> Add teacher
          </Button>
        }
      />
      <FilterToolbar
        placeholder="Search name, code, phone, or specialty"
        searchValue={search}
        onSearch={(value) =>
          update({ search: value || undefined, page: undefined })
        }
      >
        <Select
          value={status ?? "all"}
          onValueChange={(value) =>
            update({
              status: value === "all" ? undefined : (value ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter teacher status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {TEACHER_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterToolbar>
      {query.isPending ? <LoadingState rows={5} /> : null}
      {query.isError ? (
        <ErrorState
          message="Could not load teachers."
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess && !query.data.data.length ? (
        <EmptyState
          title="No teachers found"
          description="Add a teacher or change the current filters."
          action={
            <Button onClick={() => setOpen(true)} className="rounded-full shadow-sm">
              <Plus data-icon="inline-start" /> Add teacher
            </Button>
          }
        />
      ) : null}
      {query.data?.data.length ? (
        <>
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Default salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.data.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <Link
                      className="font-medium hover:text-accent-foreground"
                      href={`/dashboard/teachers/${t.id}`}
                    >
                      {t.name}
                    </Link>
                  </TableCell>
                  <TableCell>{t.teacherCode}</TableCell>
                  <TableCell>{t.phone ?? "—"}</TableCell>
                  <TableCell>{t.subjectSpecialty ?? "—"}</TableCell>
                  <TableCell>{money(t.defaultSalaryMinor)}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <Pagination
            page={query.data.meta.page}
            pageCount={query.data.meta.totalPages}
            onPageChange={(next) =>
              update({ page: next === 1 ? undefined : String(next) })
            }
          />
        </>
      ) : null}
      <TeacherSheet
        open={open}
        onOpenChange={setOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
