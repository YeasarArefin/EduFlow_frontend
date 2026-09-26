'use client';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, Send, Users } from 'lucide-react';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/dashboard/dashboard-primitives';
import {
  useProcessNotice,
  useQueueNotice,
  useRetryNotice,
} from '../mutations/use-notice-mutations';
import { useNotice, useNoticePreview, useNoticeRecipients } from '../queries/use-notices';
const labels = ['queued', 'processing', 'sent', 'failed', 'skipped'] as const;
type NoticeActionMutation = {
  mutate: (
    variables: { workspaceId: string; id: string },
    options: { onSuccess: () => void; onError: (error: Error) => void }
  ) => void;
};
export function NoticeDetailPage({ workspaceId, id }: { workspaceId: string; id: string }) {
  const detail = useNotice(workspaceId, id);
  const preview = useNoticePreview(workspaceId, id);
  const failed = useNoticeRecipients(workspaceId, id, 'failed');
  const queue = useQueueNotice();
  const process = useProcessNotice();
  const retry = useRetryNotice();
  if (detail.isPending)
    return (
      <div className="grid gap-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (detail.isError || !detail.data)
    return <ErrorState message="Could not load this notice." onRetry={() => detail.refetch()} />;
  const notice = detail.data;
  const progress = notice.progress;
  const delivered = progress.sent + progress.failed + progress.skipped;
  const percent = progress.total ? Math.round((delivered / progress.total) * 100) : 0;
  const busy = queue.isPending || process.isPending || retry.isPending;
  const needsRecipientRefresh =
    progress.total === 0 ||
    (progress.queued === 0 && progress.sent === 0 && progress.failed === 0 && progress.skipped > 0);
  const action = (mutation: NoticeActionMutation, success: string) =>
    mutation.mutate(
      { workspaceId, id },
      {
        onSuccess: () => toast.success(success),
        onError: (e) => toast.error(e.message || 'Could not update delivery.'),
      }
    );
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" render={<Link href="/workspace/notices" />}>
          <ArrowLeft data-icon="inline-start" />
          Notices
        </Button>
        <Badge variant="outline">{notice.audience.replace('_', ' ')}</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{notice.subject}</CardTitle>
          <CardDescription>{new Date(notice.createdAt).toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
          {notice.body}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle>Delivery progress</CardTitle>
              <CardDescription>
                {preview.data
                  ? `${preview.data.count} recipients resolved before queueing.`
                  : 'Checking recipient count…'}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {needsRecipientRefresh ? (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button disabled={busy}>
                        <Send data-icon="inline-start" />
                        {progress.total === 0 ? 'Queue notice' : 'Refresh recipients'}
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {progress.total === 0
                          ? 'Queue this notice?'
                          : 'Refresh skipped recipients?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Recipients will be resolved again. Only recipients previously skipped for a
                        missing email can return to the queue; sent recipients remain untouched.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => action(queue, 'Recipients refreshed.')}>
                        {progress.total === 0 ? 'Queue notice' : 'Refresh recipients'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button disabled={busy || progress.queued === 0}>
                        <Play data-icon="inline-start" />
                        {progress.processing > 0 ? 'Resume' : 'Send / resume'}
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Send queued recipients?</AlertDialogTitle>
                      <AlertDialogDescription>
                        The next batch of up to 25 recipients will be processed now. Delivery can be
                        resumed safely until the queue is empty.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => action(process, 'Delivery batch processed.')}
                      >
                        Send batch
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {progress.failed > 0 ? (
                <Button
                  variant="outline"
                  disabled={busy}
                  onClick={() => action(retry, 'Eligible failed recipients were requeued.')}
                >
                  <RefreshCw data-icon="inline-start" />
                  Retry failed
                </Button>
              ) : null}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Delivery completion</span>
            <span className="tabular-nums text-muted-foreground">{percent}%</span>
          </div>
          <Progress value={percent} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {labels.map((status) => (
              <div key={status} className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs capitalize text-muted-foreground">{status}</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{progress[status]}</p>
              </div>
            ))}
          </div>
          {detail.isFetching ? (
            <p className="text-xs text-muted-foreground">Refreshing delivery progress…</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Failed recipients
          </CardTitle>
          <CardDescription>
            Recipients with transient delivery errors can be retried while attempts remain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {failed.isPending ? (
            <Skeleton className="h-20 w-full" />
          ) : failed.data?.length ? (
            <div className="flex flex-col gap-3">
              {failed.data.map((recipient) => (
                <div
                  key={recipient.id}
                  className="rounded-lg border border-destructive/20 bg-destructive/5 p-3"
                >
                  <p className="font-medium">
                    {recipient.recipientName || recipient.recipientEmail || 'Unknown recipient'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {recipient.recipientEmail} · Attempt {recipient.retryCount}
                  </p>
                  <p className="mt-1 text-xs text-destructive">
                    {recipient.lastError || 'Delivery failed.'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No failed recipients.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
