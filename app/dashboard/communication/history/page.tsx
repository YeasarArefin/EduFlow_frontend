'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader, EmptyState, LoadingState } from '@/components/dashboard/dashboard-primitives';
import { apiRequest } from '@/lib/api/client';
import type { AccountRoutingState } from '@/types/auth';
type Message = {
  id: string;
  source: string;
  body: string;
  status: string;
  recipientCount: number;
  creditsUsed: string;
  createdAt: string;
};
function History({ workspaceId }: { workspaceId: string }) {
  const qc = useQueryClient(),
    headers = { 'X-Workspace-Id': workspaceId },
    q = useQuery({
      queryKey: ['communication', 'history', workspaceId],
      queryFn: () => apiRequest<Message[]>('/sms/messages', { headers }),
    }),
    retry = useMutation({
      mutationFn: (id: string) =>
        apiRequest(`/sms/messages/${id}/retry-failed`, { method: 'POST', headers }),
      onSuccess: () =>
        qc.invalidateQueries({ queryKey: ['communication', 'history', workspaceId] }),
    });
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Message history"
        description="Inspect queued delivery results and safely retry failed recipients."
      />
      {q.isLoading ? (
        <LoadingState />
      ) : q.data?.length ? (
        <div className="space-y-3">
          {q.data.map((m) => (
            <Card key={m.id}>
              <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{m.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {m.source} · {new Date(m.createdAt).toLocaleString()} · {m.recipientCount}{' '}
                    recipients · {m.creditsUsed} credits used
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.status === 'failed' ? 'destructive' : 'outline'}>
                    {m.status.replaceAll('_', ' ')}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={m.status !== 'failed' || retry.isPending}
                    onClick={() => retry.mutate(m.id)}
                  >
                    Retry failed
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No messages yet"
          description="Queued SMS messages will appear here with their delivery status."
        />
      )}
    </div>
  );
}
export default function HistoryRoute() {
  const account = useQuery({
    queryKey: ['account-history'],
    queryFn: () => apiRequest<AccountRoutingState>('/account/state'),
  });
  return account.data?.workspaceId ? <History workspaceId={account.data.workspaceId} /> : null;
}
