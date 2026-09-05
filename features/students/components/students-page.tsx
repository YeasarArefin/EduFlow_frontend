"use client";

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
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { STUDENT_STATUSES, type StudentStatus } from "../api/students";
import { useStudentsQuery } from "../queries/use-students-query";
import { StudentSheet } from "./student-sheet";

const pageSize = 20;
const statusLabels: Record<StudentStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  archived: "Archived",
};
const statusVisual: Record<StudentStatus, "success" | "warning" | "info"> = {
  active: "success",
  inactive: "warning",
  archived: "info",
};
function page(value: string | null) {
  const result = Number(value);
  return Number.isInteger(result) && result > 0 ? result : 1;
}
function status(value: string | null): StudentStatus | undefined {
  return STUDENT_STATUSES.includes(value as StudentStatus)
    ? (value as StudentStatus)
    : undefined;
}
function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function StudentsPage({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const params = useMemo(
    () => ({
      page: page(searchParams.get("page")),
      limit: pageSize,
      search: searchParams.get("search") || undefined,
      status: status(searchParams.get("status")),
    }),
    [searchParams],
  );
  const query = useStudentsQuery(workspaceId, params);
  const students = query.data?.data ?? [];
  const meta = query.data?.meta;
  function updateUrl(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    );
    router.replace(next.size ? `${pathname}?${next}` : pathname);
  }
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Students"
        description="Manage the student records in this workspace."
        actions={
          <Button onClick={() => setSheetOpen(true)} className="rounded-full shadow-sm">
            <Plus data-icon="inline-start" /> Add student
          </Button>
        }
      />
      <FilterToolbar
        placeholder="Search name, code, phone, or guardian"
        searchValue={params.search}
        onSearch={(search) =>
          updateUrl({ search: search || undefined, page: undefined })
        }
      >
        <Select
          items={[
            { value: "all", label: "All statuses" },
            ...STUDENT_STATUSES.map((item) => ({
              value: item,
              label: statusLabels[item],
            })),
          ]}
          value={params.status ?? "all"}
          onValueChange={(value) =>
            updateUrl({
              status: value === "all" ? undefined : (value ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter students by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {STUDENT_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {statusLabels[item]}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterToolbar>
      {query.isPending ? <LoadingState rows={6} /> : null}
      {query.isError ? (
        <ErrorState
          message="Could not load students. Please try again."
          onRetry={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess && students.length === 0 ? (
        <EmptyState
          title="No students found"
          description={
            params.search || params.status
              ? "Try clearing a search term or filter."
              : "Add your first student to begin building this workspace directory."
          }
          action={
            !params.search && !params.status ? (
              <Button onClick={() => setSheetOpen(true)}>
                <Plus data-icon="inline-start" /> Add student
              </Button>
            ) : undefined
          }
        />
      ) : null}
      {query.isSuccess && students.length ? (
        <div className="flex flex-col gap-4">
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="min-w-64">
                    <Link
                      href={`/dashboard/students/${student.id}`}
                      className="group flex items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-accent text-xs font-semibold text-accent-foreground">
                        {initials(student.fullName)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-foreground group-hover:text-accent-foreground">
                          {student.fullName}
                        </span>
                        {student.guardianName ? (
                          <span className="block truncate text-xs text-muted-foreground">
                            Guardian: {student.guardianName}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>{student.studentCode}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.phone || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={statusVisual[student.status]}>
                      {statusLabels[student.status]}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <Pagination
            page={meta?.page ?? params.page}
            pageCount={Math.max(meta?.totalPages ?? 1, 1)}
            onPageChange={(nextPage) =>
              updateUrl({ page: nextPage === 1 ? undefined : String(nextPage) })
            }
          />
        </div>
      ) : null}
      <StudentSheet
        key={sheetOpen ? "create-open" : "create-closed"}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
