import { NoticeDetailPage } from '@/features/notices/components/notice-detail-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [account, { id }] = await Promise.all([getAccountRoutingState(), params]);
  return account?.workspaceId ? (
    <NoticeDetailPage workspaceId={account.workspaceId} id={id} />
  ) : null;
}
