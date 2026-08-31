import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell, type AppShellNavGroup } from "@/components/app-shell";
import { postAuthDestinations, resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";

const navigation: AppShellNavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", href: "/dashboard" },
      { label: "Students", href: "/dashboard/students" },
      { label: "Attendance", href: "/dashboard/attendance" },
      { label: "Payments", href: "/dashboard/payments" },
      { label: "Settings", href: "/dashboard/settings" }
    ]
  }
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const destination = await resolvePostAuthDestination();
  if (destination !== postAuthDestinations.dashboard) redirect(destination);

  return <AppShell navigation={navigation} user={{ name: "Workspace member" }}>{children}</AppShell>;
}
