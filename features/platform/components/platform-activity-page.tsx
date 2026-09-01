"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { DataTable, EmptyState, ErrorState, FilterToolbar, LoadingState, PageHeader, Pagination } from "@/components/dashboard-primitives";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ActivityListParams } from "../api/activity";
import { usePlatformActivity } from "../hooks/use-platform-activity";

const PAGE_SIZE = 20;
const categories = [
  { value: "all", label: "All activity" },
  { value: "payment", label: "Payments" },
  { value: "plan", label: "Plans" },
  { value: "entitlement", label: "Entitlements" },
  { value: "lifecycle", label: "Lifecycle" }
] as const;

function pageFrom(value: string | null) {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function categoryFrom(value: string | null): ActivityListParams["category"] {
  return categories.some((category) => category.value === value && value !== "all")
    ? value as NonNullable<ActivityListParams["category"]>
    : undefined;
}

function labelAction(action: string) {
  return action.split(".").map((word) => word.replaceAll("_", " ")).join(" · ");
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function metadataSummary(items: Array<{ key: string; value: string }> | null) {
  if (!items?.length) return "—";
  return items.map(({ key, value }) => `${key.replace(/([A-Z])/g, " $1").toLowerCase()}: ${value}`).join(" · ");
}

export function PlatformActivityPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo<ActivityListParams>(() => ({ page: pageFrom(searchParams.get("page")), limit: PAGE_SIZE, search: searchParams.get("search") || undefined, category: categoryFrom(searchParams.get("category")) }), [searchParams]);
  const query = usePlatformActivity(params);
  const activity = query.data?.data ?? [];
  const meta = query.data?.meta;

  function updateUrl(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    router.replace(next.size ? `${pathname}?${next}` : pathname);
  }

  return <div className="flex flex-col gap-6">
    <PageHeader title="Platform activity" description="A privacy-safe record of recent commercial, entitlement, and lifecycle decisions." />
    <FilterToolbar placeholder="Search action, workspace, actor, or target ID" searchValue={params.search} onSearch={(search) => updateUrl({ search: search || undefined, page: undefined })}>
      <Select items={categories.map((item) => ({ label: item.label, value: item.value }))} value={params.category ?? "all"} onValueChange={(value) => updateUrl({ category: value === "all" ? undefined : value ?? undefined, page: undefined })}>
        <SelectTrigger aria-label="Filter activity category"><SelectValue /></SelectTrigger>
        <SelectContent><SelectGroup>{categories.map((item) => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}</SelectGroup></SelectContent>
      </Select>
    </FilterToolbar>
    {query.isPending ? <LoadingState rows={6} /> : null}
    {query.isError ? <ErrorState message="Could not load platform activity. Please try again." onRetry={() => query.refetch()} /> : null}
    {query.isSuccess && !activity.length ? <EmptyState title="No activity found" description="Business-significant actions will appear here as they are performed." /> : null}
    {query.isSuccess && activity.length ? <div className="flex flex-col gap-4"><DataTable><TableHeader><TableRow><TableHead>Action</TableHead><TableHead>Actor</TableHead><TableHead>Workspace</TableHead><TableHead>Target</TableHead><TableHead>Details</TableHead><TableHead>When</TableHead></TableRow></TableHeader><TableBody>{activity.map((entry) => <TableRow key={entry.id}><TableCell className="min-w-36 font-medium capitalize">{labelAction(entry.action)}</TableCell><TableCell>{entry.actor ? <div className="flex min-w-40 flex-col"><span>{entry.actor.name}</span><span className="text-xs text-muted-foreground">{entry.actor.email}</span></div> : <span className="text-muted-foreground">System</span>}</TableCell><TableCell>{entry.workspace ? <Button variant="link" size="sm" className="h-auto px-0" render={<Link href={`/platform/workspaces/${entry.workspace.id}`} />}>{entry.workspace.name ?? entry.workspace.slug ?? "Workspace"}<ExternalLink data-icon="inline-end" /></Button> : <span className="text-muted-foreground">Platform</span>}</TableCell><TableCell className="min-w-36"><span className="block text-muted-foreground">{entry.entityType.replaceAll("_", " ")}</span><span className="block truncate font-mono text-xs text-muted-foreground" title={entry.entityId}>{entry.entityId}</span></TableCell><TableCell className="min-w-52 max-w-80 text-sm text-muted-foreground">{metadataSummary(entry.metadataSummary)}</TableCell><TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(entry.createdAt)}</TableCell></TableRow>)}</TableBody></DataTable><Pagination page={meta?.page ?? params.page} pageCount={meta?.totalPages ?? 1} onPageChange={(page) => updateUrl({ page: page === 1 ? undefined : String(page) })} /></div> : null}
  </div>;
}
