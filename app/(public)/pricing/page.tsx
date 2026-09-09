import { GrainOverlay } from '@/components/landing/grain-overlay';
import {
  LivePricingCard,
  STATIC_TIERS,
  StaticPricingCard,
} from '@/components/pricing/pricing-card';
import { PublicContainer } from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import { getPublicPlans } from '@/features/pricing/api/get-public-plans';
import { getServerSession } from '@/lib/auth/server';
import { ArrowRight, Check, HelpCircle } from 'lucide-react';
import Link from 'next/link';

/* ─── comparison table ────────────────────────────────────────── */

const COMPARISON_ROWS = [
  { feature: 'Active Students', starter: '50', standard: '200', pro: 'Unlimited' },
  { feature: 'Batches', starter: '4', standard: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Staff Seats', starter: '1 (Owner)', standard: '5', pro: 'Unlimited' },
  { feature: 'Attendance Tracking', starter: '✓', standard: '✓', pro: '✓' },
  { feature: 'Fee Management', starter: 'Basic', standard: 'Full', pro: 'Full + Payroll' },
  { feature: 'SMS per month', starter: '500', standard: '2,000', pro: '5,000' },
  { feature: 'Custom SMS Sender ID', starter: '—', standard: '—', pro: '✓' },
  { feature: 'Bilingual SMS Templates', starter: '—', standard: '✓', pro: '✓' },
  { feature: 'Parent Portal', starter: '—', standard: '✓', pro: '✓' },
  { feature: 'Advanced Reports', starter: '—', standard: '✓', pro: '✓' },
  { feature: 'Multiple Branches', starter: '—', standard: '—', pro: '✓' },
  { feature: 'Dedicated Account Manager', starter: '—', standard: '—', pro: '✓' },
  { feature: 'Support', starter: 'Email', standard: 'Priority WhatsApp', pro: 'Dedicated' },
];

/* ─── FAQ ─────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — every paid plan includes a 14-day full-featured trial. No credit card is required to start.',
  },
  {
    q: 'Can I change my plan later?',
    a: 'Absolutely. You can upgrade or downgrade at any time from your workspace settings. Changes take effect at the next billing cycle.',
  },
  {
    q: 'What counts as an active student?',
    a: "An active student is any student enrolled in at least one batch and not archived. Archived students don't count toward your limit.",
  },
  {
    q: 'Are SMS credits included in the plan?',
    a: 'Yes. Each plan includes a monthly SMS credit allowance. Additional SMS can be purchased through the SMS Wallet top-up in your dashboard.',
  },
  {
    q: 'What currencies do you accept?',
    a: 'Pricing is in Bangladeshi Taka (BDT). We accept all major payment methods available through our payment gateway.',
  },
  {
    q: 'Is my data secure?',
    a: 'Your data is stored on encrypted servers, isolated per workspace, and never shared with third parties. We follow OWASP security best practices.',
  },
];

/* ─── page ────────────────────────────────────────────────────── */

export default async function PricingPage() {
  const [plans, session] = await Promise.all([getPublicPlans(), getServerSession()]);
  const isAuthenticated = Boolean(session?.user?.id);
  const hasDynamicPlans = Boolean(plans && plans.length > 0);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* <LandingBackdrop /> */}
      <GrainOverlay />

      {/* ── Hero ──────────────────────────────────────────────── */}
      {/* <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-32  border-b border-border">
        <PublicContainer>

        </PublicContainer>
      </section> */}

      {/* ── Plan Cards ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 border-b border-border">
        <PublicContainer>
          <div className="mx-auto max-w-3xl text-center mb-8">
            <h1 className="font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-6xl sm:leading-[1.05] mb-2">
              Pricing{' '}
            </h1>
            <p className="bg-gradient-to-r from-foreground via-foreground/80 to-primary bg-clip-text text-transparent text-lg lg:text-2xl">
              Start for free and scale as you grow.
            </p>
          </div>

          {plans === null ? (
            <div className="mx-auto max-w-md rounded-2xl border border-border bg-card backdrop-blur-md px-8 py-12 text-center">
              <HelpCircle className="mx-auto mb-4 size-8 text-muted-foreground" />
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Plans temporarily unavailable
              </h2>
              <p className="mt-2 text-sm text-muted-foreground font-light">
                We couldn&apos;t load current plans. Please try again shortly.
              </p>
              <Button variant="glass" className="mt-6 rounded-full" render={<Link href="/" />}>
                Back to Home
              </Button>
            </div>
          ) : hasDynamicPlans && plans ? (
            <div className="grid gap-8 lg:grid-cols-3 pt-6">
              {plans.map((plan, index) => (
                <LivePricingCard
                  key={plan.id}
                  plan={plan}
                  index={index}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-3 pt-6">
              {STATIC_TIERS.map((tier) => (
                <StaticPricingCard key={tier.name} tier={tier} isAuthenticated={isAuthenticated} />
              ))}
            </div>
          )}

          <p className="mt-10 text-center text-xs text-muted-foreground">
            Prices shown in Bangladeshi Taka (BDT). VAT may apply.{' '}
            <Link href="/faq" className="text-accent-foreground hover:underline underline-offset-2">
              View billing FAQ →
            </Link>
          </p>
        </PublicContainer>
      </section>

      {/* ── Feature Comparison Table ──────────────────────────── */}
      <section className="py-20 sm:py-28 border-b border-border">
        <PublicContainer>
          <div className="mx-auto max-w-3xl text-center mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
              Full Comparison
            </p>
            <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              What&apos;s in each plan?
            </h2>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[0.15em] text-subtle-foreground">
                    Feature
                  </th>
                  {['Starter', 'Standard', 'Pro'].map((tier) => (
                    <th
                      key={tier}
                      className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-subtle-foreground"
                    >
                      {tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-border last:border-0 transition-colors hover:bg-table-row-hover ${
                      i % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                    }`}
                  >
                    <td className="px-5 py-3.5 font-medium text-foreground-soft">{row.feature}</td>
                    {[row.starter, row.standard, row.pro].map((val, j) => (
                      <td key={j} className="px-5 py-3.5 text-center">
                        {val === '✓' ? (
                          <Check className="mx-auto size-4 text-accent-foreground" />
                        ) : val === '—' ? (
                          <span className="text-recessed-foreground">—</span>
                        ) : (
                          <span
                            className={
                              j === 1
                                ? 'text-accent-foreground font-medium'
                                : 'text-foreground-soft'
                            }
                          >
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PublicContainer>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 border-b border-border">
        <PublicContainer>
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
                Common Questions
              </p>
              <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                Pricing FAQ
              </h2>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-xl border border-border bg-card backdrop-blur-md px-6 py-4 open:bg-card-strong transition-all"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground select-none">
                    {item.q}
                    <span className="shrink-0 text-accent-foreground transition-transform group-open:rotate-45">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M7 1v12M1 7h12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed border-t border-border pt-3">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </PublicContainer>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <PublicContainer>
          <div className="mx-auto max-w-2xl rounded-2xl border border-accent-border bg-gradient-to-b from-accent/20 to-transparent backdrop-blur-md px-8 py-14 text-center shadow-[0_0_60px_rgba(190,242,100,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.20em] text-accent-foreground mb-3">
              Ready to start?
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              14 days free. No credit card needed.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground font-light">
              Set up your workspace in under 5 minutes and run your first batch today.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full px-8 font-semibold shadow-[0_0_24px_rgba(190,242,100,0.25)] cursor-pointer"
                render={<Link href={isAuthenticated ? '/post-auth' : '/signup'} />}
              >
                <span>{isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}</span>
                <ArrowRight className="size-4" data-icon="inline-end" />
              </Button>
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto rounded-full px-7 cursor-pointer"
                render={<Link href="/#features" />}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </PublicContainer>
      </section>
    </div>
  );
}
