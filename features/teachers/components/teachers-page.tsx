'use client';

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
  Pagination,
} from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
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
import {
  Archive,
  ChevronRight,
  Eye,
  GraduationCap,
  Plus,
  UserCheck,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { TEACHER_STATUSES, type TeacherStatus, type TeachersPageProps } from '@/types/teachers';
import { useTeachersQuery } from '../queries/use-teachers-query';
import { TeacherSheet } from './teacher-sheet';
import {
  formatTeacherSalaryMinor,
  getTeacherInitials,
  getTeacherStatusVisual,
} from '@/utils/teacher-formatters';

const pageSize = 20;

function parsePage(value: string | null) {
  const result = Number(value);
  return Number.isInteger(result) && result > 0 ? result : 1;
}

function parseStatus(value: string | null): TeacherStatus | undefined {
  return TEACHER_STATUSES.includes(value as TeacherStatus) ? (value as TeacherStatus) : undefined;
}

export function TeachersPage({ workspaceId }: TeachersPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const params = useMemo(
    () => ({
      page: parsePage(searchParams.get('page')),
      limit: pageSize,
      search: searchParams.get('search') || undefined,
      status: parseStatus(searchParams.get('status')),
    }),
    [searchParams]
  );

  const query = useTeachersQuery(workspaceId, params);
  const teachers = query.data?.data ?? [];
  const meta = query.data?.meta;

  // Unfiltered query for top metrics
  const totalTeachersQuery = useTeachersQuery(workspaceId, {
    page: 1,
    limit: 100,
  });

  const counts = useMemo(() => {
    const allTeachersList = totalTeachersQuery.data?.data ?? [];
    let active = 0;
    let inactive = 0;
    let archived = 0;
    for (const t of allTeachersList) {
      if (t.status === 'active') active++;
      else if (t.status === 'inactive') inactive++;
      else if (t.status === 'archived') archived++;
    }
    return {
      total: totalTeachersQuery.data?.meta.total ?? allTeachersList.length,
      active,
      inactive,
      archived,
    };
  }, [totalTeachersQuery.data]);

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
        title="Teachers"
        description="Manage instructor profiles, teaching assignments, specialties, and compensation rates."
        actions={
          <Button onClick={() => setSheetOpen(true)} className="rounded-full shadow-sm">
            <Plus data-icon="inline-start" /> Add teacher
          </Button>
        }
      />

      {/* Top 4 Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Teachers</span>
            <GraduationCap className="size-4 text-lime-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">
            {counts.total}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Registered instructor profiles</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Instructors</span>
            <UserCheck className="size-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
            {counts.active}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Eligible for batch assignments</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Inactive</span>
            <UserX className="size-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-amber-400">
            {counts.inactive}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Temporarily paused teachers</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Archived</span>
            <Archive className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-muted-foreground">
            {counts.archived}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Historical teacher records</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <FilterToolbar
        placeholder="Search teacher name, code, phone, or specialty…"
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
          <SelectTrigger aria-label="Filter teachers by status" className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {TEACHER_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {getTeacherStatusVisual(item).label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterToolbar>

      {query.isPending ? <LoadingState rows={6} /> : null}

      {query.isError ? (
        <ErrorState
          message="Could not load teachers. Please try again."
          onRetry={() => query.refetch()}
        />
      ) : null}

      {query.isSuccess && teachers.length === 0 ? (
        <EmptyState
          title="No teachers found"
          description={
            params.search || params.status
              ? 'No teacher matches your current search or status filter.'
              : 'Add your first teacher to begin managing faculty and batch assignments.'
          }
          action={
            !params.search && !params.status ? (
              <Button onClick={() => setSheetOpen(true)} className="rounded-full shadow-sm">
                <Plus data-icon="inline-start" /> Add teacher
              </Button>
            ) : undefined
          }
        />
      ) : null}

      {query.isSuccess && teachers.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* Desktop High-Density Data Table */}
          <div className="hidden overflow-x-auto md:block">
            <DataTable>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="min-w-64">Teacher Name</TableHead>
                  <TableHead>Teacher Code</TableHead>
                  <TableHead>Contact Phone</TableHead>
                  <TableHead>Subject Specialty</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => {
                  const visual = getTeacherStatusVisual(teacher.status);
                  return (
                    <TableRow
                      key={teacher.id}
                      className="border-border/40 transition-colors hover:bg-muted/20"
                    >
                      <TableCell className="min-w-64">
                        <Link
                          href={`/workspace/teachers/${teacher.id}`}
                          className="group flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-lime-500/20 bg-lime-500/10 text-xs font-bold text-lime-400">
                            {getTeacherInitials(teacher.name)}
                          </span>
                          <div className="min-w-0">
                            <span className="block truncate font-semibold text-foreground group-hover:text-lime-400 transition-colors">
                              {teacher.name}
                            </span>
                            {teacher.email && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {teacher.email}
                              </span>
                            )}
                          </div>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-xs font-medium text-foreground">
                          {teacher.teacherCode}
                        </span>
                      </TableCell>

                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {teacher.phone ? (
                          <a
                            href={`tel:${teacher.phone}`}
                            className="hover:text-foreground hover:underline"
                          >
                            {teacher.phone}
                          </a>
                        ) : (
                          '—'
                        )}
                      </TableCell>

                      <TableCell className="text-xs">
                        {teacher.subjectSpecialty ? (
                          <span className="inline-flex items-center rounded-md border border-border/60 bg-muted/30 px-2 py-0.5 text-xs text-foreground">
                            {teacher.subjectSpecialty}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>

                      <TableCell className="font-mono text-xs font-medium text-foreground">
                        {formatTeacherSalaryMinor(teacher.defaultSalaryMinor)}
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={visual.tone}>{visual.label}</StatusBadge>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          render={<Link href={`/workspace/teachers/${teacher.id}`} />}
                          className="h-7 rounded-full px-2.5 text-xs"
                        >
                          <Eye className="size-3" />
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </DataTable>
          </div>

          {/* Mobile Stacked Card View */}
          <div className="grid gap-3 md:hidden">
            {teachers.map((teacher) => {
              const visual = getTeacherStatusVisual(teacher.status);
              return (
                <Link
                  key={teacher.id}
                  href={`/workspace/teachers/${teacher.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/50 p-4 transition-colors hover:border-border"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-lime-500/20 bg-lime-500/10 text-xs font-bold text-lime-400">
                        {getTeacherInitials(teacher.name)}
                      </span>
                      <div>
                        <h4 className="font-semibold text-foreground">{teacher.name}</h4>
                        <p className="font-mono text-xs text-muted-foreground">
                          {teacher.teacherCode}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={visual.tone}>{visual.label}</StatusBadge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2.5 text-xs text-muted-foreground">
                    <div>
                      <span className="block text-[11px]">Phone</span>
                      <span className="font-mono text-foreground">{teacher.phone || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-[11px]">Specialty</span>
                      <span className="text-foreground">{teacher.subjectSpecialty || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-[11px]">Base Salary</span>
                      <span className="font-mono text-foreground">
                        {formatTeacherSalaryMinor(teacher.defaultSalaryMinor)}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[11px]">Email</span>
                      <span className="truncate text-foreground">{teacher.email || '—'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/30 pt-2 text-xs font-medium text-lime-400">
                    <span>View full profile & assignments</span>
                    <ChevronRight className="size-4" />
                  </div>
                </Link>
              );
            })}
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

      <TeacherSheet
        key={sheetOpen ? 'create-open' : 'create-closed'}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
