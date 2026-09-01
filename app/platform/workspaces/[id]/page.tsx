import { PlatformWorkspaceDetailPage } from "@/features/platform/components/platform-workspace-detail-page";

export default async function PlatformWorkspaceDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlatformWorkspaceDetailPage workspaceId={id} />;
}
