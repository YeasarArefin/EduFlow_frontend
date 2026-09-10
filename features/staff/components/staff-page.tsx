'use client';

import { Plus } from 'lucide-react';
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
  FilterToolbar,
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
import { formatMemberJoinedDate, getMemberStatusVisual } from '@/utils/staff-formatters';

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
    if (kind === 'remove') removeMutation.mutate({ workspaceId, id: member.id }, options);
    else
      statusMutation.mutate(
        {
          workspaceId,
          id: member.id,
          status: kind === 'suspend' ? 'suspended' : 'active',
        },
        options
      );
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

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Staff & members"
        description="Create member accounts and assign workspace-defined roles."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" render={<Link href="/dashboard/staff/permissions" />}>
              Roles & permissions
            </Button>
            <Button onClick={openAddDialog}>
              <Plus data-icon="inline-start" /> Add member
            </Button>
          </div>
        }
      />
      <FilterToolbar
        placeholder="Search name or email"
        searchValue={search}
        onSearch={(value) => update({ search: value || undefined, page: undefined })}
      >
        <Select
          value={roleId ?? 'all'}
          onValueChange={(value) =>
            update({
              roleId: value === 'all' ? undefined : (value ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter member role">
            <SelectValue />
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
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            update({
              status: value === 'all' ? undefined : (value ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter member status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {MEMBER_STATUSES.map((item) => (
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
        <ErrorState message="Could not load workspace members." onRetry={() => query.refetch()} />
      ) : null}
      {query.isSuccess && !query.data.data.length ? (
        <EmptyState
          title="No members found"
          description="Create a workspace role, then create the member's EduFlow account."
          action={
            <Button onClick={openAddDialog}>
              <Plus data-icon="inline-start" /> Add member
            </Button>
          }
        />
      ) : null}
      {query.data?.data.length ? (
        <>
          <div className="hidden md:block">
            <DataTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="w-14">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.data.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <StatusBadge status={getMemberStatusVisual(member.status)}>
                        {member.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{formatMemberJoinedDate(member.joinedAt)}</TableCell>
                    <TableCell>{actions(member)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </DataTable>
          </div>
          <div className="grid gap-3 md:hidden">
            {query.data.data.map((member) => (
              <Card key={member.id} size="sm">
                <CardHeader>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                  <CardAction>{actions(member)}</CardAction>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Role</div>
                    <div className="mt-1 font-medium">{member.role}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="mt-1">
                      <StatusBadge status={getMemberStatusVisual(member.status)}>
                        {member.status}
                      </StatusBadge>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Joined</div>
                    <div className="mt-1 font-medium">
                      {formatMemberJoinedDate(member.joinedAt)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Pagination
            page={query.data.meta.page}
            pageCount={query.data.meta.totalPages}
            onPageChange={(next) => update({ page: next === 1 ? undefined : String(next) })}
          />
        </>
      ) : null}
      <MemberDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        workspaceId={workspaceId}
        member={dialogMember}
      />
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
