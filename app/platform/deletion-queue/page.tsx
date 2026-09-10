import { Suspense } from 'react';
import { LoadingState } from '@/components/dashboard/dashboard-primitives';
import { PlatformDeletionQueuePage } from '@/features/platform/components/platform-deletion-queue-page';

export default function PlatformDeletionQueueRoute() {
  return (
    <Suspense fallback={<LoadingState rows={6} />}>
      <PlatformDeletionQueuePage />
    </Suspense>
  );
}
