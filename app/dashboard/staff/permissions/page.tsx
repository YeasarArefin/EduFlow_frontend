import { PermissionManagementPage } from '@/features/staff/components/permission-management-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? (
    <PermissionManagementPage workspaceId={account.workspaceId} />
  ) : null;
}
