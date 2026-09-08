import {
  CalendarCheck,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  GraduationCap,
  Layers3,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell, type AppShellNavGroup } from "@/components/app-shell";
import { getServerSession } from "@/lib/auth/server";
import {
  postAuthDestinations,
  resolvePostAuthDestination,
} from "@/lib/auth/post-auth-destination";

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
        label: "Teachers",
        href: "/dashboard/teachers",
        icon: <GraduationCap className="size-4" />,
      },
      { label: "Batches", href: "/dashboard/batches", icon: <Layers3 className="size-4" /> },
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: <CalendarCheck className="size-4" />,
      },
      {
        label: "Fees & Payments",
        href: "/dashboard/fees",
        icon: <CreditCard className="size-4" />,
      },
      {
        label: "Teacher Salaries",
        href: "/dashboard/salaries",
        icon: <Wallet className="size-4" />,
      },
      {
        label: "Staff & Members",
        href: "/dashboard/staff",
        icon: <ShieldCheck className="size-4" />,
      },

      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: <Settings className="size-4" />,
      },
    ],
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
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
