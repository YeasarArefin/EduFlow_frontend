import { StudentDetailPage } from '@/features/students/components/student-detail-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function StudentDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const [account, { id }] = await Promise.all([getAccountRoutingState(), params]);
  return account?.workspaceId ? (
    <StudentDetailPage workspaceId={account.workspaceId} studentId={id} />
  ) : null;
}
