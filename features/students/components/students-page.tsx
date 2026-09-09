'use client';

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
  Pagination,
} from '@/components/dashboard-primitives';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Archive, ChevronRight, Eye, GraduationCap, Plus, UserCheck, UserX } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { STUDENT_STATUSES, type StudentStatus } from '../api/students';
import { useStudentsQuery } from '../queries/use-students-query';
import { StudentSheet } from './student-sheet';

const pageSize = 20;

const statusLabels: Record<StudentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  archived: 'Archived',
};

const statusVisual: Record<StudentStatus, 'success' | 'warning' | 'info'> = {
  active: 'success',
  inactive: 'warning',
  archived: 'info',
};

function page(value: string | null) {
  const result = Number(value);
  return Number.isInteger(result) && result > 0 ? result : 1;
}

function status(value: string | null): StudentStatus | undefined {
  return STUDENT_STATUSES.includes(value as StudentStatus) ? (value as StudentStatus) : undefined;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function StudentsPage({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const params = useMemo(
    () => ({
      page: page(searchParams.get('page')),
      limit: pageSize,
      search: searchParams.get('search') || undefined,
      status: status(searchParams.get('status')),
    }),
    [searchParams]
  );

  const query = useStudentsQuery(workspaceId, params);
  const students = query.data?.data ?? [];
  const meta = query.data?.meta;

  // Unfiltered total counts query for top metrics
  const totalStudentsQuery = useStudentsQuery(workspaceId, {
    page: 1,
    limit: 100,
  });
  const counts = useMemo(() => {
    const allStudentsList = totalStudentsQuery.data?.data ?? [];
    let active = 0;
    let inactive = 0;
    let archived = 0;
    for (const s of allStudentsList) {
      if (s.status === 'active') active++;
      else if (s.status === 'inactive') inactive++;
      else if (s.status === 'archived') archived++;
    }
    return {
      total: totalStudentsQuery.data?.meta.total ?? allStudentsList.length,
      active,
      inactive,
      archived,
    };
  }, [totalStudentsQuery.data]);

  function updateUrl(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key)
    );
    router.replace(next.size ? `${pathname}?${next}` : pathname);
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Students"
        description="Manage the student directory, profiles, enrollments, and tuition fees in this workspace."
        actions={
          <Button onClick={() => setSheetOpen(true)} className="rounded-full shadow-sm">
            <Plus data-icon="inline-start" /> Add student
          </Button>
        }
      />

      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Students</span>
            <GraduationCap className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {counts.total}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Registered coaching profiles</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Students</span>
            <UserCheck className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
            {counts.active}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Eligible for batch enrollments</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Inactive</span>
            <UserX className="size-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-400">
            {counts.inactive}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Temporarily paused students</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Archived</span>
            <Archive className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-muted-foreground">
            {counts.archived}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Historical student records</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        placeholder="Search student name, code, phone, or guardian…"
        searchValue={params.search}
        onSearch={(search) => updateUrl({ search: search || undefined, page: undefined })}
      >
        <Select
          value={params.status ?? 'all'}
          onValueChange={(value) =>
            updateUrl({
              status: value === 'all' ? undefined : (value ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter students by status" className="w-[160px]">
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
              ? 'No student matches your current search or status filter.'
              : 'Add your first student to begin building this workspace directory.'
          }
          action={
            !params.search && !params.status ? (
              <Button onClick={() => setSheetOpen(true)} className="rounded-full shadow-sm">
                <Plus data-icon="inline-start" /> Add student
              </Button>
            ) : undefined
          }
        />
      ) : null}

      {query.isSuccess && students.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Desktop High-Density Data Table */}
          <div className="hidden overflow-x-auto md:block">
            <DataTable>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="min-w-64">Student Name</TableHead>
                  <TableHead>Student Code</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Admission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow
                    key={student.id}
                    className="border-border/40 transition-colors hover:bg-muted/20"
                  >
                    <TableCell className="min-w-64">
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="group flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-lime-500/20 bg-lime-500/10 text-xs font-bold text-lime-400">
                          {initials(student.fullName)}
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate font-semibold text-foreground group-hover:text-lime-400 transition-colors">
                            {student.fullName}
                          </span>
                          {student.guardianName && (
                            <span className="block truncate text-xs text-muted-foreground">
                              Guardian: {student.guardianName}
                            </span>
                          )}
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell>
                      <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                        {student.studentCode}
                      </span>
                    </TableCell>

                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {student.phone ? (
                        <a
                          href={`tel:${student.phone}`}
                          className="hover:text-foreground hover:underline"
                        >
                          {student.phone}
                        </a>
                      ) : (
                        '—'
                      )}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(student.admissionDate)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={statusVisual[student.status]}>
                        {statusLabels[student.status] || student.status}
                      </StatusBadge>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/dashboard/students/${student.id}`} />}
                        className="h-7 rounded-full px-2.5 text-xs"
                      >
                        <Eye className="size-3" />
                        View Profile
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="grid gap-3 md:hidden">
            {students.map((student) => (
              <Link
                key={student.id}
                href={`/dashboard/students/${student.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:border-border"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-lime-500/20 bg-lime-500/10 text-xs font-bold text-lime-400">
                      {initials(student.fullName)}
                    </span>
                    <div>
                      <h4 className="font-semibold text-foreground">{student.fullName}</h4>
                      <p className="font-mono text-xs text-muted-foreground">
                        {student.studentCode}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={statusVisual[student.status]}>
                    {statusLabels[student.status] || student.status}
                  </StatusBadge>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                  <div>
                    <span className="block text-[11px]">Phone</span>
                    <span className="font-mono text-foreground">{student.phone || '—'}</span>
                  </div>
                  <div>
                    <span className="block text-[11px]">Admission Date</span>
                    <span className="text-foreground">{formatDate(student.admissionDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs font-medium text-lime-400">
                  <span>View full profile & fees</span>
                  <ChevronRight className="size-4" />
                </div>
              </Link>
            ))}
          </div>

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
        key={sheetOpen ? 'create-open' : 'create-closed'}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
