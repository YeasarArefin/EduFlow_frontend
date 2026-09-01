import type { ReactNode } from "react";
import { AlertCircle, Inbox, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2.5">
          {actions}
        </div>
      )}
    </header>
  );
}

export function StatCard({
  label,
  value,
  detail,
  status,
}: {
  label: string;
  value: ReactNode;
  detail?: string;
  status?: "success" | "warning" | "danger" | "info";
}) {
  return (
    <Card className="transition-colors hover:border-border/80">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardDescription>
        <CardTitle className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      {(detail || status) && (
        <CardContent className="flex items-center justify-between gap-2 pt-0 text-xs text-muted-foreground">
          {detail && <span>{detail}</span>}
          {status && <StatusBadge status={status}>{status}</StatusBadge>}
        </CardContent>
      )}
    </Card>
  );
}

export function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight text-foreground">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="mt-0.5 text-sm text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function DataTable({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[640px] text-sm">
        {children}
      </table>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/80 bg-muted/10 px-6 py-12 text-center">
      <Inbox className="size-8 text-muted-foreground" />
      <div>
        <h3 className="font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-label="Loading">
      <Skeleton className="h-9 w-1/3 rounded-full" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-10 text-center">
      <AlertCircle className="size-8 text-destructive" />
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="rounded-full mt-1" onClick={onRetry}>
          <RefreshCw data-icon="inline-start" /> Try again
        </Button>
      )}
    </div>
  );
}

export function FilterToolbar({
  placeholder = "Search",
  children,
  onSearch,
  searchValue,
}: {
  placeholder?: string;
  children?: ReactNode;
  onSearch?: (value: string) => void;
  searchValue?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 pl-9 pr-4 text-sm"
          placeholder={placeholder}
          value={searchValue ?? ""}
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {children}
      </div>
    </div>
  );
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          disabled={page >= pageCount}
          onClick={() => onPageChange?.(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
