import { Suspense } from 'react';
import { LoadingState } from '@/components/dashboard/dashboard-primitives';
import { PlatformActivityPage } from '@/features/platform/components/platform-activity-page';

export default function PlatformActivityRoute() {
  return (
    <Suspense fallback={<LoadingState rows={7} />}>
      <PlatformActivityPage />
    </Suspense>
  );
}
