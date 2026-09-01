import { Suspense } from "react";
import { LoadingState } from "@/components/dashboard-primitives";
import { PlatformWorkspacesPage } from "@/features/platform/components/platform-workspaces-page";

export default function PlatformWorkspacesRoute() {
  return (
    <Suspense fallback={<LoadingState rows={6} />}>
      <PlatformWorkspacesPage />
    </Suspense>
  );
}
