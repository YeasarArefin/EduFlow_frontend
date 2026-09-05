import { Suspense } from "react";
import { SettingsPage } from "@/features/settings/components/settings-page";
import { getAccountRoutingState } from "@/lib/auth/post-auth-destination";

export default async function SettingsRoute() {
  const account = await getAccountRoutingState();
  if (!account?.workspaceId) return null;
  return <Suspense><SettingsPage workspaceId={account.workspaceId} /></Suspense>;
}
