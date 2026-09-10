import { Suspense } from 'react';
import { LoadingState } from '@/components/dashboard/dashboard-primitives';
import { PlatformSubscriptionsPage } from '@/features/platform/components/platform-subscriptions-page';

export default function PlatformSubscriptionsRoute() {
  return (
    <Suspense fallback={<LoadingState rows={6} />}>
      <PlatformSubscriptionsPage />
    </Suspense>
  );
}
