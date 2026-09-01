"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { type KeyboardEvent, useMemo } from "react";
import { ExternalLink } from "lucide-react";
import { DataTable, EmptyState, ErrorState, FilterToolbar, LoadingState, PageHeader, Pagination } from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  PLATFORM_ACCESS_STATUSES,
  PLATFORM_SUBSCRIPTION_STATUSES,
  PLATFORM_WORKSPACE_STATUSES,
  type PlatformWorkspaceListParams,
} from "../api/workspaces";
import { usePlatformWorkspaces } from "../hooks/use-workspaces";

const PAGE_SIZE = 20;

const workspaceStatusLabels = {
  pending: "Pending",
  active: "Active",
  locked: "Locked",
  suspended: "Suspended",
  scheduled_deletion: "Scheduled for deletion",
  deleted: "Deleted",
} as const;

const subscriptionStatusLabels = {
  trial: "Trial",
  pending: "Pending",
  active: "Active",
  renewal_due: "Renewal due",
  expired: "Expired",
  cancelled: "Cancelled",
  suspended: "Suspended",
} as const;

const accessStatusLabels = {
  verification_pending: "Verification pending",
  payment_pending: "Payment pending",
  trial: "Trial",
  active: "Active",
  renewal_due: "Renewal due",
  subscription_expired: "Subscription expired",
  locked: "Locked",
  scheduled_for_deletion: "Scheduled for deletion",
  suspended: "Suspended",
} as const;

function statusTone(status: string): "success" | "warning" | "danger" | "info" {
  if (status === "active") return "success";
  if (["locked", "suspended", "deleted", "expired", "cancelled", "subscription_expired"].includes(status)) return "danger";
  if (["pending", "renewal_due", "payment_pending", "verification_pending", "scheduled_deletion", "scheduled_for_deletion"].includes(status)) return "warning";
  return "info";
}

function getPositivePage(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function formatCreatedDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function PlatformWorkspacesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo<PlatformWorkspaceListParams>(() => ({
    page: getPositivePage(searchParams.get("page")),
    limit: PAGE_SIZE,
    search: searchParams.get("search") || undefined,
    workspaceStatus: PLATFORM_WORKSPACE_STATUSES.find((status) => status === searchParams.get("workspaceStatus")),
    subscriptionStatus: PLATFORM_SUBSCRIPTION_STATUSES.find((status) => status === searchParams.get("subscriptionStatus")),
    accessStatus: PLATFORM_ACCESS_STATUSES.find((status) => status === searchParams.get("accessStatus")),
  }), [searchParams]);
  const workspaceQuery = usePlatformWorkspaces(params);
  const workspaces = workspaceQuery.data?.data ?? [];
  const meta = workspaceQuery.data?.meta;

  function updateUrl(updates: Record<string, string | undefined>) {
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    }
    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname);
  }

  function openWorkspace(id: string) {
    router.push(`/platform/workspaces/${id}`);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, id: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openWorkspace(id);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Workspaces" description="Browse tenant workspaces, subscription coverage, and current access." />
      <FilterToolbar
        placeholder="Search by workspace name or identifier"
        searchValue={params.search}
        onSearch={(search) => updateUrl({ search: search || undefined, page: undefined })}
      >
        <Select
          items={[{ label: "All workspace states", value: null }, ...PLATFORM_WORKSPACE_STATUSES.map((value) => ({ label: workspaceStatusLabels[value], value }))]}
          value={params.workspaceStatus ?? null}
          onValueChange={(workspaceStatus) => updateUrl({ workspaceStatus: workspaceStatus ?? undefined, page: undefined })}
        >
          <SelectTrigger aria-label="Filter by workspace status"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{[null, ...PLATFORM_WORKSPACE_STATUSES].map((value) => <SelectItem key={value ?? "all"} value={value}>{value ? workspaceStatusLabels[value] : "All workspace states"}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
        <Select
          items={[{ label: "All subscription states", value: null }, ...PLATFORM_SUBSCRIPTION_STATUSES.map((value) => ({ label: subscriptionStatusLabels[value], value }))]}
          value={params.subscriptionStatus ?? null}
          onValueChange={(subscriptionStatus) => updateUrl({ subscriptionStatus: subscriptionStatus ?? undefined, page: undefined })}
        >
          <SelectTrigger aria-label="Filter by subscription status"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{[null, ...PLATFORM_SUBSCRIPTION_STATUSES].map((value) => <SelectItem key={value ?? "all"} value={value}>{value ? subscriptionStatusLabels[value] : "All subscription states"}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
        <Select
          items={[{ label: "All access states", value: null }, ...PLATFORM_ACCESS_STATUSES.map((value) => ({ label: accessStatusLabels[value], value }))]}
          value={params.accessStatus ?? null}
          onValueChange={(accessStatus) => updateUrl({ accessStatus: accessStatus ?? undefined, page: undefined })}
        >
          <SelectTrigger aria-label="Filter by access status"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{[null, ...PLATFORM_ACCESS_STATUSES].map((value) => <SelectItem key={value ?? "all"} value={value}>{value ? accessStatusLabels[value] : "All access states"}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </FilterToolbar>

      {workspaceQuery.isPending ? <LoadingState rows={6} /> : null}
      {workspaceQuery.isError ? <ErrorState message="Could not load workspaces. Please try again." onRetry={() => workspaceQuery.refetch()} /> : null}
      {workspaceQuery.isSuccess && workspaces.length === 0 ? <EmptyState title="No workspaces found" description="Try changing your search or filters to see more workspaces." /> : null}
      {workspaceQuery.isSuccess && workspaces.length > 0 ? (
        <div className="flex flex-col gap-4">
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Workspace</TableHead><TableHead>Identifier</TableHead><TableHead>Workspace status</TableHead><TableHead>Plan</TableHead><TableHead>Subscription</TableHead><TableHead>Access</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((workspace) => (
                <TableRow key={workspace.id} role="link" tabIndex={0} className="cursor-pointer" onClick={() => openWorkspace(workspace.id)} onKeyDown={(event) => handleRowKeyDown(event, workspace.id)} aria-label={`Open ${workspace.name ?? workspace.slug ?? "workspace"}`}>
                  <TableCell className="font-medium">{workspace.name ?? "Untitled workspace"}</TableCell>
                  <TableCell className="text-muted-foreground">{workspace.slug ?? workspace.id}</TableCell>
                  <TableCell><StatusBadge status={statusTone(workspace.workspaceStatus)}>{workspaceStatusLabels[workspace.workspaceStatus]}</StatusBadge></TableCell>
                  <TableCell>{workspace.subscription?.plan?.name ?? "No plan"}</TableCell>
                  <TableCell>{workspace.subscription ? <StatusBadge status={statusTone(workspace.subscription.status)}>{subscriptionStatusLabels[workspace.subscription.status]}</StatusBadge> : <span className="text-muted-foreground">No subscription</span>}</TableCell>
                  <TableCell><StatusBadge status={statusTone(workspace.access.status)}>{accessStatusLabels[workspace.access.status]}</StatusBadge></TableCell>
                  <TableCell className="text-muted-foreground">{formatCreatedDate(workspace.createdAt)}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={(event) => { event.stopPropagation(); openWorkspace(workspace.id); }}><ExternalLink data-icon="inline-end" /> Details</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <Pagination page={meta?.page ?? params.page} pageCount={Math.max(meta?.totalPages ?? 1, 1)} onPageChange={(page) => updateUrl({ page: page === 1 ? undefined : String(page) })} />
        </div>
      ) : null}
    </div>
  );
}
