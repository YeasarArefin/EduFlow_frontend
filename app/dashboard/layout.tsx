import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell, type AppShellNavGroup } from "@/components/app-shell";
import { getServerSession } from "@/lib/auth/server";
import { postAuthDestinations, resolvePostAuthDestination } from "@/lib/auth/post-auth-destination";

const navigation: AppShellNavGroup[] = [
  {
    label: "Coaching Center",
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: <LayoutDashboard className="size-4" />,
      },
      {
        label: "Students",
        href: "/dashboard/students",
        icon: <Users className="size-4" />,
      },
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: <CalendarCheck className="size-4" />,
      },
      {
        label: "Payments",
        href: "/dashboard/payments",
        icon: <CreditCard className="size-4" />,
      },
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="size-4" />,
      },
    ],
  },
];

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, destination] = await Promise.all([
    getServerSession(),
    resolvePostAuthDestination(),
  ]);

  if (destination !== postAuthDestinations.dashboard) redirect(destination);

  return (
    <AppShell
      navigation={navigation}
      productName="EduFlow"
      user={{
        name: session?.user?.name || "Workspace Member",
        email: session?.user?.email ?? undefined,
      }}
    >
      {children}
    </AppShell>
  );
}

