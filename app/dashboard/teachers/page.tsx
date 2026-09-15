import { Suspense } from 'react';
import { LoadingState } from '@/components/dashboard/dashboard-primitives';
import { TeachersPage } from '@/features/teachers/components/teachers-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? (
    <Suspense fallback={<LoadingState rows={5} />}>
      <TeachersPage workspaceId={account.workspaceId} />
    </Suspense>
  ) : null;
}
