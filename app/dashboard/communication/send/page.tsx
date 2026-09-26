import { CommunicationComposer } from '@/features/communication/components/communication-composer';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function SendMessageRoute() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <CommunicationComposer workspaceId={account.workspaceId} /> : null;
}
