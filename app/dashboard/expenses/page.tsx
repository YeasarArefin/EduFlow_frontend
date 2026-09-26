import { ExpensesPage } from '@/features/expenses/components/expenses-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <ExpensesPage workspaceId={account.workspaceId} /> : null;
}
