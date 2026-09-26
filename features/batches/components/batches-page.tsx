'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
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
import { BATCH_STATUSES, type BatchStatus, type BatchesPageProps } from '@/types/batches';
import { useBatchesQuery } from '../queries/use-batches-query';
import { BatchSheet } from './batch-sheet';
import { formatBatchDate, formatBatchMoney, getBatchStatusVisual } from '@/utils/batch-formatters';

export function BatchesPage({ workspaceId }: BatchesPageProps) {
  const path = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  const page = Number(params.get('page')) || 1;
  const status = params.get('status') as BatchStatus | undefined;
  const search = params.get('search') || undefined;

  const query = useBatchesQuery(workspaceId, { page, limit: 20, search, status });

  const update = (values: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params);
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key)
    );
    router.replace(next.size ? `${path}?${next}` : path);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Batches"
        description="Build the academic batch profiles your coaching center runs on."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-full shadow-sm">
            <Plus data-icon="inline-start" /> Create batch
          </Button>
        }
      />
      <FilterToolbar
        placeholder="Search batch name"
        searchValue={search}
        onSearch={(value) => update({ search: value || undefined, page: undefined })}
      >
        <Select
          value={status ?? 'all'}
          onValueChange={(value) =>
            update({
              status: value === 'all' ? undefined : (value ?? undefined),
              page: undefined,
            })
          }
        >
          <SelectTrigger aria-label="Filter batch status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              {BATCH_STATUSES.map((item) => (
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
        <ErrorState message="Could not load batches." onRetry={() => query.refetch()} />
      ) : null}
      {query.isSuccess && !query.data.data.length ? (
        <EmptyState
          title="No batches found"
          description="Create a batch, or change the current filters."
          action={
            <Button onClick={() => setOpen(true)} className="rounded-full shadow-sm">
              <Plus data-icon="inline-start" /> Create batch
            </Button>
          }
        />
      ) : null}
      {query.data?.data.length ? (
        <>
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Monthly fee</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.data.data.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <Link
                      className="font-medium hover:text-accent-foreground"
                      href={`/workspace/batches/${batch.id}`}
                    >
                      {batch.name}
                    </Link>
                  </TableCell>
                  <TableCell>{formatBatchMoney(batch.monthlyFeeMinor)}</TableCell>
                  <TableCell>
                    <StatusBadge status={getBatchStatusVisual(batch.status)}>
                      {batch.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatBatchDate(batch.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
          <Pagination
            page={query.data.meta.page}
            pageCount={query.data.meta.totalPages}
            onPageChange={(next) => update({ page: next === 1 ? undefined : String(next) })}
          />
        </>
      ) : null}
      <BatchSheet
        key={open ? 'create-open' : 'create-closed'}
        open={open}
        onOpenChange={setOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
}
