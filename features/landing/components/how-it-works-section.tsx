import { ArrowRight, CheckCircle2, Laptop, UserPlus, Zap } from 'lucide-react';
import Link from 'next/link';
import { PublicContainer } from '@/components/public/public-container';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    icon: Laptop,
    title: 'Create your workspace',
    description:
      'Set up your coaching center profile, academic terms, and branding in under 2 minutes. Start immediately with a full 14-day trial.',
    details: [
      'Instant workspace provisioning',
      'Custom organization branding',
      'Academic term & holiday setup',
    ],
  },
  {
    number: '02',
    icon: UserPlus,
    title: 'Add students, batches & teachers',
    description:
      'Enroll students, organize classes into morning/evening batches, and assign teachers to their respective subject schedules.',
    details: [
      'Batch capacity management',
      'Teacher subject allocation',
      'Guardian contact directory',
    ],
  },
  {
    number: '03',
    icon: Zap,
    title: 'Run daily operations from EduFlow',
    description:
      'Take 1-click batch attendance, collect tuition with instant digital receipts, and keep parents updated via automated bilingual SMS.',
    details: [
      '1-click roll call & alerts',
      'bKash & cash fee receipts',
      'Real-time revenue overview',
    ],
  },
];

export function HowItWorksSection() {
  return (
    <section className="border-b border-border py-20 sm:py-28 lg:py-32" id="how-it-works">
      <PublicContainer>
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.20em] text-accent-foreground">
            Simple 3-Step Setup
          </p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            From setup to daily operations in minutes.
          </h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg font-light">
            EduFlow replaces scattered tools with one straightforward workflow designed specifically
            for coaching centers.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 hover:border-accent-border hover:bg-accent/40 backdrop-blur-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <span className="font-heading text-3xl font-bold text-foreground/20 group-hover:text-accent-foreground transition-colors">
                      {step.number}
                    </span>
                    <span className="flex size-10 items-center justify-center rounded-xl bg-muted border border-border text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                  </div>

                  <CardTitle className="mt-6 text-xl font-semibold text-foreground font-heading">
                    {step.title}
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="mt-6 space-y-2 border-t border-border pt-4 text-xs">
                    {step.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-center gap-2 text-muted-foreground font-light"
                      >
                        <CheckCircle2 className="size-3.5 text-accent-foreground shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Action */}
        <div className="mt-12 text-center">
          <Button
            size="lg"
            variant="default"
            className="min-h-11 rounded-full px-8 font-semibold shadow-[0_0_20px_rgba(190,242,100,0.25)] cursor-pointer"
            render={<Link href="/signup" />}
          >
            <span>Start Free 14-Day Trial</span>
            <ArrowRight className="size-4" data-icon="inline-end" />
          </Button>
        </div>
      </PublicContainer>
    </section>
  );
}
