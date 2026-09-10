import { Database, FileCheck, History, Lock } from 'lucide-react';
import { PublicContainer } from '@/components/public/public-container';
import { Card, CardTitle } from '@/components/ui/card';

const pillars = [
  {
    icon: Database,
    title: 'Workspace Isolation',
    description:
      'Every coaching center runs within a strictly scoped database tenant. Cross-tenant queries are blocked at both the middleware and database levels.',
  },
  {
    icon: Lock,
    title: 'Controlled Permissions',
    description:
      'Numeric role hierarchies and per-member permission overrides ensure teachers, staff, and owners only view data authorized for their role.',
  },
  {
    icon: FileCheck,
    title: 'Preserved Financial History',
    description:
      'Fee receipts, payments, and discounts are stored in immutable ledgers with exact minor-unit accounting—never overwritten or lost.',
  },
  {
    icon: History,
    title: 'Auditability of Actions',
    description:
      'Sensitive operations such as fee adjustments, subscription approvals, and permission changes are recorded in append-only audit logs.',
  },
];

export function SecurityTrustSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32" id="security">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Data Integrity &amp; Trust
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Built for operational reliability and privacy.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            Your students&apos; personal records and your center&apos;s financial balances are
            protected by strict architecture, not afterthought security patches.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.title}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 backdrop-blur-md hover:border-accent-border hover:bg-accent/30 transition-all"
              >
                <div>
                  <span className="flex size-10 items-center justify-center rounded-xl bg-muted border border-border text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <CardTitle className="mt-4 text-base font-semibold text-foreground font-heading">
                    {pillar.title}
                  </CardTitle>
                  <p className="mt-2 text-xs text-muted-foreground font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </PublicContainer>
    </section>
  );
}
