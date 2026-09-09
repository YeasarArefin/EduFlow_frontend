import { AttendancePage } from '@/features/attendance/components/attendance-page';
import { getAccountRoutingState } from '@/lib/auth/post-auth-destination';

export default async function AttendanceRoute() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <AttendancePage workspaceId={account.workspaceId} /> : null;
}
