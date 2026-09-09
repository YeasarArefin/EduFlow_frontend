import { BatchDetailPage } from '@/features/batches/components/batch-detail-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [account, { id }] = await Promise.all([getAccountRoutingState(), params]);
  return account?.workspaceId ? (
    <BatchDetailPage workspaceId={account.workspaceId} id={id} />
  ) : null;
}
