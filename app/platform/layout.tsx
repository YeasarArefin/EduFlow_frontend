import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { env } from "@/config/env"
import { AppShell, type AppShellNavGroup } from "@/components/app-shell"
import { getServerSession } from "@/lib/auth/server"
import type { ReactNode } from "react"

const navigation: AppShellNavGroup[] = [
  { label: "Platform", items: [
    { label: "Overview", href: "/platform" },
    { label: "Workspaces", href: "/platform/workspaces" },
    { label: "Payments", href: "/platform/payments" },
    { label: "Plans", href: "/platform/plans" },
    { label: "Entitlements", href: "/platform/entitlements" },
  ] },
]

export default async function PlatformLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession()
  if (!session?.user?.id) redirect("/signin")
  const cookie = (await headers()).get("cookie") ?? ""
  const access = await fetch(`${env.apiBaseUrl}/plans`, { headers: { cookie }, cache: "no-store" })
  if (access.status === 403) redirect("/onboarding")
  if (!access.ok) redirect("/signin")
  return <AppShell navigation={navigation} user={{ name: "Platform Owner" }}>{children}</AppShell>
}
