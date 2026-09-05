import { StudentsPage } from "@/features/students/components/students-page";
import { getAccountRoutingState } from "@/lib/auth/post-auth-destination";

export default async function StudentsRoute() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? (
    <StudentsPage workspaceId={account.workspaceId} />
  ) : null;
}
