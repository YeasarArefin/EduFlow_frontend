import { Suspense } from 'react';
import { LoadingState } from '@/components/dashboard/dashboard-primitives';
import { PlatformPaymentsPage } from '@/features/platform/components/platform-payments-page';

export default function PlatformPaymentsRoute() {
  return (
    <Suspense fallback={<LoadingState rows={5} />}>
      <PlatformPaymentsPage />
    </Suspense>
  );
}
