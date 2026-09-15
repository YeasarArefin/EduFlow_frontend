import { NoticesPage } from '@/features/notices/components/notices-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page() { const account = await getAccountRoutingState(); return account?.workspaceId ? <NoticesPage workspaceId={account.workspaceId} /> : null; }
