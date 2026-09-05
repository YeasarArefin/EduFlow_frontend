import { TeachersPage } from "@/features/teachers/components/teachers-page";
import { getAccountRoutingState } from "@/lib/auth/post-auth-destination";
export default async function Page() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? (
    <TeachersPage workspaceId={account.workspaceId} />
  ) : null;
}
