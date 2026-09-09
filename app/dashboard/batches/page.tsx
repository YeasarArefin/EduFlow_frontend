import { BatchesPage } from '@/features/batches/components/batches-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <BatchesPage workspaceId={account.workspaceId} /> : null;
}
