"use client";

import { ExternalLink } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataTable, EmptyState, ErrorState, FilterToolbar, LoadingState, PageHeader, Pagination } from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PLATFORM_ACCESS_STATUSES, type PlatformWorkspace, type PlatformWorkspaceListParams } from "../api/workspaces";
import { usePlatformWorkspaces } from "../hooks/use-workspaces";

const PAGE_SIZE = 20;

const reviewGroups = [
  { value: "all", label: "All subscriptions" },
  { value: "trial", label: "Trial" },
  { value: "active", label: "Active" },
  { value: "renewal_due", label: "Renewal due" },
  { value: "expired", label: "Expired" },
  { value: "locked", label: "Locked workspace" },
  { value: "scheduled_deletion", label: "Scheduled deletion" },
] as const;

type ReviewGroup = (typeof reviewGroups)[number]["value"];

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

const subscriptionStatusLabels = {
  trial: "Trial",
  pending: "Pending",
  active: "Active",
  renewal_due: "Renewal due",
  expired: "Expired",
  cancelled: "Cancelled",
  suspended: "Suspended",
} as const;

const workspaceStatusLabels = {
  pending: "Pending",
  active: "Active",
  locked: "Locked",
  suspended: "Suspended",
  scheduled_deletion: "Scheduled for deletion",
  deleted: "Deleted",
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

function getReviewGroup(value: string | null): ReviewGroup {
  return reviewGroups.some((group) => group.value === value) ? (value as ReviewGroup) : "all";
}

function paramsForGroup(group: ReviewGroup): Pick<PlatformWorkspaceListParams, "workspaceStatus" | "subscriptionStatus"> {
  if (group === "locked" || group === "scheduled_deletion") return { workspaceStatus: group };
  if (group === "all") return {};
  return { subscriptionStatus: group };
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function endDateForSubscription(subscription: PlatformWorkspace["subscription"]) {
  if (!subscription) return null;
  return subscription.status === "trial" ? subscription.trialEndsAt : subscription.expiresAt;
}

function countdownLabel(endDate: string | null) {
  if (!endDate) return "—";
  const timestamp = new Date(endDate).getTime();
  if (Number.isNaN(timestamp)) return "—";
  const dayDifference = Math.ceil((timestamp - Date.now()) / 86_400_000);
  if (dayDifference > 0) return `${dayDifference} day${dayDifference === 1 ? "" : "s"} remaining`;
  if (dayDifference === 0) return "Due today";
  const overdue = Math.abs(dayDifference);
  return `${overdue} day${overdue === 1 ? "" : "s"} overdue`;
}

export function PlatformSubscriptionsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const group = getReviewGroup(searchParams.get("group"));
  const params = useMemo<PlatformWorkspaceListParams>(() => ({
    page: getPositivePage(searchParams.get("page")),
    limit: PAGE_SIZE,
    search: searchParams.get("search") || undefined,
    accessStatus: PLATFORM_ACCESS_STATUSES.find((status) => status === searchParams.get("accessStatus")),
    ...paramsForGroup(group),
  }), [group, searchParams]);
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

  function selectGroup(nextGroup: string | null) {
    const value = getReviewGroup(nextGroup);
    updateUrl({ group: value === "all" ? undefined : value, page: undefined });
  }

  function openWorkspace(workspaceId: string) {
    router.push(`/platform/workspaces/${workspaceId}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Subscription monitoring" description="Review coverage, access risk, and workspaces that need lifecycle attention." />
      <FilterToolbar placeholder="Search by workspace name or identifier" searchValue={params.search} onSearch={(search) => updateUrl({ search: search || undefined, page: undefined })}>
        <Select items={reviewGroups.map((item) => ({ label: item.label, value: item.value }))} value={group} onValueChange={selectGroup}>
          <SelectTrigger aria-label="Filter by subscription review group"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{reviewGroups.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
        <Select items={[{ label: "All access states", value: null }, ...PLATFORM_ACCESS_STATUSES.map((value) => ({ label: accessStatusLabels[value], value }))]} value={params.accessStatus ?? null} onValueChange={(accessStatus) => updateUrl({ accessStatus: accessStatus ?? undefined, page: undefined })}>
          <SelectTrigger aria-label="Filter by access state"><SelectValue /></SelectTrigger>
          <SelectContent><SelectGroup>{[null, ...PLATFORM_ACCESS_STATUSES].map((value) => <SelectItem key={value ?? "all"} value={value}>{value ? accessStatusLabels[value] : "All access states"}</SelectItem>)}</SelectGroup></SelectContent>
        </Select>
      </FilterToolbar>

      {workspaceQuery.isPending ? <LoadingState rows={6} /> : null}
      {workspaceQuery.isError ? <ErrorState message="Could not load subscription monitoring. Please try again." onRetry={() => workspaceQuery.refetch()} /> : null}
      {workspaceQuery.isSuccess && workspaces.length === 0 ? <EmptyState title="No subscriptions found" description="Try changing the review group, access filter, or search phrase." /> : null}
      {workspaceQuery.isSuccess && workspaces.length > 0 ? (
        <div className="flex flex-col gap-4">
          <DataTable>
            <TableHeader><TableRow><TableHead>Workspace</TableHead><TableHead>Plan</TableHead><TableHead>Subscription / access</TableHead><TableHead>Started</TableHead><TableHead>Coverage ends</TableHead><TableHead>Time remaining</TableHead><TableHead>Workspace status</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
            <TableBody>
              {workspaces.map((workspace) => {
                const endDate = endDateForSubscription(workspace.subscription);
                return (
                  <TableRow key={workspace.id}>
                    <TableCell className="min-w-48"><div className="flex flex-col gap-0.5"><span className="font-medium">{workspace.name ?? "Untitled workspace"}</span><span className="text-xs text-muted-foreground">{workspace.slug ?? workspace.id}</span></div></TableCell>
                    <TableCell>{workspace.subscription?.plan?.name ?? "No plan"}</TableCell>
                    <TableCell><div className="flex min-w-36 flex-col gap-1.5">{workspace.subscription ? <StatusBadge status={statusTone(workspace.subscription.status)}>{subscriptionStatusLabels[workspace.subscription.status]}</StatusBadge> : <span className="text-muted-foreground">No subscription</span>}<StatusBadge status={statusTone(workspace.access.status)}>{accessStatusLabels[workspace.access.status]}</StatusBadge></div></TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(workspace.subscription?.startsAt ?? null)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(endDate)}</TableCell>
                    <TableCell className="font-medium text-foreground">{countdownLabel(endDate)}</TableCell>
                    <TableCell><StatusBadge status={statusTone(workspace.workspaceStatus)}>{workspaceStatusLabels[workspace.workspaceStatus]}</StatusBadge></TableCell>
                    <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => openWorkspace(workspace.id)}><ExternalLink data-icon="inline-end" /> Details</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </DataTable>
          <Pagination page={meta?.page ?? params.page} pageCount={Math.max(meta?.totalPages ?? 1, 1)} onPageChange={(page) => updateUrl({ page: page === 1 ? undefined : String(page) })} />
        </div>
      ) : null}
    </div>
  );
}
