import { SalaryManagementPage } from '@/features/salaries/components/salary-management-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <SalaryManagementPage workspaceId={account.workspaceId} /> : null;
}
