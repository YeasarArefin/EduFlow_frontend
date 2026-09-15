import { Suspense } from 'react';
import { StaffPage } from '@/features/staff/components/staff-page';
import { LoadingState } from '@/components/dashboard/dashboard-primitives';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? (
    <Suspense fallback={<LoadingState rows={5} />}>
      <StaffPage workspaceId={account.workspaceId} />
    </Suspense>
  ) : null;
}
