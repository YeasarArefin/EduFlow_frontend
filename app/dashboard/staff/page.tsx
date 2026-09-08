import { StaffPage } from "@/features/staff/components/staff-page";
import { getAccountRoutingState } from "@/lib/auth/post-auth-destination";

export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? <StaffPage workspaceId={account.workspaceId} /> : null;
}
