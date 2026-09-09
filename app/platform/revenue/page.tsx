import { Suspense } from 'react';
import { LoadingState } from '@/components/dashboard-primitives';
import { PlatformRevenuePage } from '@/features/platform/components/platform-revenue-page';
export default function PlatformRevenueRoute() {
  return (
    <Suspense fallback={<LoadingState rows={7} />}>
      <PlatformRevenuePage />
    </Suspense>
  );
}
