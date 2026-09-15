'use client';

import {
  Crown,
  Mail,
  Plus,
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  Users,
  UserX,
  X,
} from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
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
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Pagination,
} from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  MEMBER_STATUSES,
  type MemberStatus,
  type StaffPageProps,
  type WorkspaceMember,
} from '@/types/staff';
import {
  useRemoveMemberMutation,
  useUpdateMemberStatusMutation,
} from '../mutations/use-member-mutations';
import { useMembersQuery } from '../queries/use-members-query';
import { usePermissionConfigurationQuery } from '../queries/use-permission-queries';
import { MemberDialog } from './member-dialog';
import { MemberActions } from './member-actions';
import {
  formatMemberJoinedDate,
  getMemberInitials,
  getMemberStatusVisual,
  isProtectedOwner,
} from '@/utils/staff-formatters';

export function StaffPage({ workspaceId }: StaffPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [dialogMember, setDialogMember] = useState<WorkspaceMember | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    member: WorkspaceMember;
    kind: 'suspend' | 'reactivate' | 'remove';
  }>();

  const page = Number(params.get('page')) || 1;
  const search = params.get('search') || undefined;
  const roleId = params.get('roleId') || undefined;
  const status = params.get('status') as MemberStatus | undefined;

  const query = useMembersQuery(workspaceId, {
    page,
    limit: 20,
    search,
    roleId,
    status,
  });

  const roles = usePermissionConfigurationQuery(workspaceId);
  const statusMutation = useUpdateMemberStatusMutation();
  const removeMutation = useRemoveMemberMutation();
  const isActionPending = statusMutation.isPending || removeMutation.isPending;

  function update(values: Record<string, string | undefined>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    router.replace(next.size ? `${pathname}?${next}` : pathname);
  }

  function resetFilters() {
    router.replace(pathname);
  }

  function openAddDialog() {
    setDialogMember(undefined);
    setDialogOpen(true);
  }

  function openEditDialog(member: WorkspaceMember) {
    setDialogMember(member);
    setDialogOpen(true);
  }

  function confirmAction() {
    if (!pendingAction) return;
    const { member, kind } = pendingAction;
    const options = {
      onSuccess: () => {
        toast.success(
          kind === 'remove'
            ? 'Member removed from the workspace.'
            : kind === 'suspend'
              ? 'Member suspended.'
              : 'Member reactivated.'
        );
        setPendingAction(undefined);
      },
      onError: (error: Error) => toast.error(error.message || 'Could not update this member.'),
    };

    if (kind === 'remove') {
      removeMutation.mutate({ workspaceId, id: member.id }, options);
    } else {
      statusMutation.mutate(
        {
          workspaceId,
          id: member.id,
          status: kind === 'suspend' ? 'suspended' : 'active',
        },
        options
      );
    }
  }

  const actions = (member: WorkspaceMember) => (
    <MemberActions
      member={member}
      onEdit={() => openEditDialog(member)}
      onSuspend={() => setPendingAction({ member, kind: 'suspend' })}
      onReactivate={() => setPendingAction({ member, kind: 'reactivate' })}
      onRemove={() => setPendingAction({ member, kind: 'remove' })}
    />
  );

  const totalMembers = query.data?.meta.total ?? 0;
  const activeCount = query.data?.data.filter((m) => m.status === 'active').length ?? 0;
  const suspendedCount = query.data?.data.filter((m) => m.status === 'suspended').length ?? 0;
  const totalRoles = roles.data?.roles.length ?? 0;
  const hasActiveFilters = Boolean(search || roleId || status);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Header */}
      <PageHeader
        title="Staff & Members"
        description="Manage workspace team members, assign access roles, and control permission accounts."
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              className="gap-2"
              render={<Link href="/dashboard/staff/permissions" />}
            >
              <Shield className="size-4 text-muted-foreground" />
              <span>Roles & permissions</span>
            </Button>
            <Button onClick={openAddDialog} className="gap-2 shadow-sm">
              <Plus className="size-4" />
              <span>Add member</span>
            </Button>
          </div>
        }
      />

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Members */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Members
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {query.isPending ? '—' : totalMembers}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Registered in workspace</p>
          </div>
        </div>

        {/* Active Staff */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Members
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {query.isPending ? '—' : activeCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Currently with active access</p>
          </div>
        </div>

        {/* Configured Roles */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Defined Roles
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {roles.isPending ? '—' : totalRoles}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Workspace permission roles</p>
          </div>
        </div>

        {/* Suspended Members */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Suspended
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <UserX className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {query.isPending ? '—' : suspendedCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Access temporarily revoked</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              defaultValue={search ?? ''}
              placeholder="Search by name or email..."
              className="h-9 w-full rounded-lg border border-border/70 bg-card/70 pl-9 pr-8 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  update({ search: target.value || undefined, page: undefined });
                }
              }}
              onBlur={(e) => {
                if (e.target.value !== (search ?? '')) {
                  update({ search: e.target.value || undefined, page: undefined });
                }
              }}
            />
            {search ? (
              <button
                type="button"
                onClick={() => update({ search: undefined, page: undefined })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          {/* Role Filter */}
          <Select
            value={roleId ?? 'all'}
            onValueChange={(value) =>
              update({
                roleId: value === 'all' ? undefined : (value ?? undefined),
                page: undefined,
              })
            }
          >
            <SelectTrigger className="h-9 w-[160px] text-xs bg-card/70" aria-label="Filter member role">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All roles</SelectItem>
                {roles.data?.roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={status ?? 'all'}
            onValueChange={(value) =>
              update({
                status: value === 'all' ? undefined : (value ?? undefined),
                page: undefined,
              })
            }
          >
            <SelectTrigger className="h-9 w-[140px] text-xs bg-card/70" aria-label="Filter member status">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All statuses</SelectItem>
                {MEMBER_STATUSES.map((item) => (
                  <SelectItem key={item} value={item} className="capitalize">
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {hasActiveFilters ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset filters
            </Button>
          ) : null}
        </div>
      </div>

      {/* Query Status & Data Content */}
      {query.isPending ? <LoadingState rows={5} /> : null}

      {query.isError ? (
        <ErrorState message="Could not load workspace members." onRetry={() => query.refetch()} />
      ) : null}

      {query.isSuccess && !query.data.data.length ? (
        <EmptyState
          title={hasActiveFilters ? 'No matching members found' : 'No staff members added'}
          description={
            hasActiveFilters
              ? 'Try changing or resetting your search and filter criteria.'
              : 'Add members to your workspace to assign roles and manage permissions.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear filters
              </Button>
            ) : (
              <Button onClick={openAddDialog} className="gap-2">
                <Plus className="size-4" /> Add member
              </Button>
            )
          }
        />
      ) : null}

      {query.data?.data.length ? (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <DataTable>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[340px]">Member</TableHead>
                  <TableHead className="w-[180px]">Role</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="w-14 text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.data.map((member) => {
                  const isOwner = isProtectedOwner(member.role);
                  return (
                    <TableRow key={member.id} className="group transition-colors">
                      {/* Member Info & Avatar */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1 transition-all ${
                              isOwner
                                ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                                : 'bg-primary/10 text-primary ring-primary/20'
                            }`}
                          >
                            {getMemberInitials(member.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <span className="truncate">{member.name ?? 'Unnamed member'}</span>
                              {isOwner ? (
                                <Crown className="size-3 text-amber-500 shrink-0" />
                              ) : null}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="size-3 shrink-0 text-muted-foreground/60" />
                              <span className="truncate">{member.email}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Role Badge */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium border ${
                            isOwner
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'border-border/60 bg-muted/60 text-foreground/90'
                          }`}
                        >
                          {isOwner ? <Crown className="size-3 text-amber-500" /> : <Shield className="size-3 text-muted-foreground" />}
                          {member.role}
                        </span>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell>
                        <StatusBadge status={getMemberStatusVisual(member.status)}>
                          {member.status}
                        </StatusBadge>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {formatMemberJoinedDate(member.joinedAt)}
                      </TableCell>

                      {/* Action Menu */}
                      <TableCell className="text-right">{actions(member)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </DataTable>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-3 md:hidden">
            {query.data.data.map((member) => {
              const isOwner = isProtectedOwner(member.role);
              return (
                <Card key={member.id} size="sm" className="relative overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1 ${
                          isOwner
                            ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20'
                            : 'bg-primary/10 text-primary ring-primary/20'
                        }`}
                      >
                        {getMemberInitials(member.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <CardTitle className="truncate text-sm font-semibold">
                            {member.name ?? 'Unnamed member'}
                          </CardTitle>
                          {isOwner ? <Crown className="size-3 text-amber-500 shrink-0" /> : null}
                        </div>
                        <CardDescription className="truncate text-xs">
                          {member.email}
                        </CardDescription>
                      </div>
                      <CardAction>{actions(member)}</CardAction>
                    </div>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3 border-t border-border/40 pt-3 text-xs">
                    <div>
                      <div className="text-[11px] font-medium text-muted-foreground">Role</div>
                      <div className="mt-1 flex items-center gap-1 font-medium text-foreground">
                        {member.role}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium text-muted-foreground">Status</div>
                      <div className="mt-1">
                        <StatusBadge status={getMemberStatusVisual(member.status)}>
                          {member.status}
                        </StatusBadge>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-[11px] font-medium text-muted-foreground">Joined</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {formatMemberJoinedDate(member.joinedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <Pagination
            page={query.data.meta.page}
            pageCount={query.data.meta.totalPages}
            onPageChange={(next) => update({ page: next === 1 ? undefined : String(next) })}
          />
        </>
      ) : null}

      {/* Create / Edit Dialog */}
      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        workspaceId={workspaceId}
        member={dialogMember}
      />

      {/* Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open && !isActionPending) setPendingAction(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.kind === 'remove'
                ? 'Remove member?'
                : pendingAction?.kind === 'suspend'
                  ? 'Suspend member?'
                  : 'Reactivate member?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.kind === 'remove'
                ? `${pendingAction.member.name} will lose workspace access. Their EduFlow account remains intact and can be added again later.`
                : pendingAction?.kind === 'suspend'
                  ? `${pendingAction?.member.name} will be unable to use this workspace until reactivated.`
                  : `${pendingAction?.member.name} will regain access to this workspace.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isActionPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={pendingAction?.kind === 'remove' ? 'destructive' : 'default'}
              disabled={isActionPending}
              onClick={confirmAction}
            >
              {isActionPending
                ? 'Saving...'
                : pendingAction?.kind === 'remove'
                  ? 'Remove member'
                  : pendingAction?.kind === 'suspend'
                    ? 'Suspend member'
                    : 'Reactivate member'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
