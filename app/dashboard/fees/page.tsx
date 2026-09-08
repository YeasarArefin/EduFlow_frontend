import { FeesPage } from "@/features/fees/components/fees-page";
import { getAccountRoutingState } from "@/lib/auth/post-auth-destination";

export default async function FeesRoute() {
  const account = await getAccountRoutingState();
  return account?.workspaceId ? (
    <FeesPage workspaceId={account.workspaceId} />
  ) : null;
}
