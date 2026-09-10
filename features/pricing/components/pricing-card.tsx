import type { StaticTier } from '@/types/pricing';

export type { StaticTier } from '@/types/pricing';
export { LivePricingCard } from '@/features/pricing/components/live-pricing-card';
export { StaticPricingCard } from '@/features/pricing/components/static-pricing-card';

export const STATIC_TIERS: StaticTier[] = [
  {
    name: 'Starter',
    badge: '14-Day Free Trial',
    price: '৳1,500',
    period: 'per month',
    desc: 'Ideal for individual tutors and private batch instructors.',
    highlight: false,
    features: [
      'Up to 50 Active Students',
      'Up to 4 Batches',
      '1 Staff Seat (Owner)',
      'Daily Attendance & Reports',
      '500 Free SMS / month',
      'Email & Community Support',
    ],
  },
  {
    name: 'Standard',
    badge: 'Most Popular',
    price: '৳3,500',
    period: 'per month',
    desc: 'For growing coaching centers with multiple instructors.',
    highlight: true,
    features: [
      'Up to 200 Active Students',
      'Unlimited Batches & Schedules',
      '5 Staff & Teacher Seats',
      'Automated Fee Receipts & Dues',
      '2,000 Free SMS / month',
      'Bilingual Parent SMS Templates',
      'Priority WhatsApp Support',
    ],
  },
  {
    name: 'Pro',
    badge: 'Maximum Scale',
    price: '৳7,000',
    period: 'per month',
    desc: 'For established institutes needing full operational automation.',
    highlight: false,
    features: [
      'Unlimited Students',
      'Unlimited Batches & Branches',
      'Unlimited Staff & Instructors',
      'Advanced Fee & Salary Payroll',
      '5,000 Free SMS / month',
      'Custom SMS Sender ID',
      'Dedicated Account Manager',
    ],
  },
];
