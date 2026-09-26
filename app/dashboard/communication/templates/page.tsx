import { TemplatesPage } from '@/features/communication/components/templates-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function TemplatesRoute() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <TemplatesPage workspaceId={account.workspaceId} /> : null;
}
