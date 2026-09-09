import { Check, Crown, GraduationCap, ShieldCheck, UserCheck } from 'lucide-react';
import { PublicContainer } from '@/components/public/public-container';
import { Card } from '@/components/ui/card';

const roles = [
  {
    name: 'Workspace Owner',
    badge: 'Full Authority',
    icon: Crown,
    desc: 'Coaching center owner, founder, or managing director.',
    permissions: [
      'Complete visibility over fees, revenue, and finances',
      'Configure subscription plans and SMS packages',
      'Manage staff salaries, scholarships, and fee structures',
      'Access immutable audit logs and workspace settings',
    ],
  },
  {
    name: 'Admin',
    badge: 'Operations Scope',
    icon: ShieldCheck,
    desc: 'Academic coordinators and operational managers.',
    permissions: [
      'Manage batch creation, room allocations, and schedules',
      'Supervise student admissions and roll allocations',
      'Generate monthly fee invoices and overdue payment lists',
      'Restricted from changing master workspace ownership',
    ],
  },
  {
    name: 'Teacher',
    badge: 'Classroom Scope',
    icon: GraduationCap,
    desc: 'Subject instructors and batch tutors.',
    permissions: [
      'View assigned batch rosters and class schedules',
      'Mark and finalize daily student attendance in 1-click',
      'Record internal student progress notes and marks',
      'Zero access to financial balances or staff payroll',
    ],
  },
  {
    name: 'Staff',
    badge: 'Front-Desk Scope',
    icon: UserCheck,
    desc: 'Front-desk receptionists and assistants.',
    permissions: [
      'Collect tuition payments and issue instant digital receipts',
      'Register new student inquiries and basic profiles',
      'Send emergency batch notices and announcements',
      'Restricted from altering fee policies or discount rates',
    ],
  },
];

export function RolesPermissionsSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Granular Security
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Everyone gets the access they need. Nothing they don&apos;t.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Protect financial data and student privacy with strict role-based access control built
            directly into every database query.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.name}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-accent-border hover:bg-accent/30 backdrop-blur-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-muted border border-border text-accent-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground font-heading">
                    {role.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground font-light">{role.desc}</p>

                  <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs">
                    {role.permissions.map((perm) => (
                      <li
                        key={perm}
                        className="flex items-start gap-2 text-muted-foreground font-light"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-accent-foreground" />
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
