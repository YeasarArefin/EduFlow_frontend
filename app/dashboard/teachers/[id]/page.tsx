import { TeacherDetailPage } from '@/features/teachers/components/teacher-detail-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const [account, { id }] = await Promise.all([getAccountRoutingState(), params]);
  return account?.workspaceId ? (
    <TeacherDetailPage workspaceId={account.workspaceId} teacherId={id} />
  ) : null;
}
