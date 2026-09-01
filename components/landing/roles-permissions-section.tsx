import {
  Check,
  Crown,
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { PublicContainer } from "@/components/public/public-container";
import { Card } from "@/components/ui/card";

const roles = [
  {
    name: "Workspace Owner",
    badge: "Full Control",
    icon: Crown,
    desc: "The coaching center director or principal.",
    permissions: [
      "View financial profit, dues, and revenue analytics",
      "Manage staff salaries, scholarships, and fee structures",
      "Upgrade workspace plan and manage SMS wallet",
      "Export full student ledgers and audit records",
    ],
  },
  {
    name: "Teacher / Instructor",
    badge: "Classroom Scope",
    icon: GraduationCap,
    desc: "Subject instructors and batch tutors.",
    permissions: [
      "Access assigned batch rosters and schedules",
      "Mark and finalize daily student attendance",
      "Record student progress, exam marks, and internal notes",
      "Zero access to financial balances or system settings",
    ],
  },
  {
    name: "Front-Desk Staff",
    badge: "Operations Scope",
    icon: UserCheck,
    desc: "Receptionists and administrative assistants.",
    permissions: [
      "Enroll new students and assign roll numbers",
      "Collect tuition payments and issue receipts",
      "Send emergency batch announcements and notices",
      "Restricted from altering fee policies or salaries",
    ],
  },
  {
    name: "Platform Admin",
    badge: "Platform Scope",
    icon: ShieldCheck,
    desc: "EduFlow infrastructure operations.",
    permissions: [
      "Multi-tenant isolation and security enforcement",
      "Manual payment verification and subscription provisioning",
      "Entitlement overrides and system health monitoring",
      "No unauthorized access to private student data",
    ],
  },
];

export function RolesPermissionsSection() {
  return (
    <section className="border-b border-border/80 py-20 sm:py-28 lg:py-32">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Granular Security
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Everyone gets the access they need. Nothing they don&apos;t.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Protect financial data and student privacy with strict role-based access control built directly
            into every database query.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card key={role.name} className="flex flex-col justify-between border-border/80 bg-card p-5 shadow-xs hover:border-foreground/30 transition-all">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="flex size-9 items-center justify-center rounded-full bg-surface-soft border border-border text-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="rounded-full bg-surface-soft border border-border px-2.5 py-0.5 text-[10px] font-semibold text-foreground">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground font-heading">
                    {role.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{role.desc}</p>

                  <ul className="mt-4 space-y-2 border-t border-border/60 pt-4 text-xs">
                    {role.permissions.map((perm) => (
                      <li key={perm} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-foreground" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
