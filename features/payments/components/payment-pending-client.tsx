'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Clock3, RefreshCw, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import type { PaymentRequest } from '@/features/payments/api/create-payment-request';
import { useLatestPaymentRequest } from '@/features/payments/queries/use-latest-payment-request';
import { durationLabel, formatBdt } from '@/lib/format-money';

export type PaymentPlanContext = {
  id: string;
  name: string;
  slug: string;
  priceMinor: string;
  durationDays: number;
  trial: { included: boolean; days: number };
};

type PaymentPendingClientProps = {
  initialPayment?: PaymentRequest | null;
  selectedPlan?: PaymentPlanContext;
};

export function PaymentPendingClient({ initialPayment, selectedPlan }: PaymentPendingClientProps) {
  const router = useRouter();
  const paymentQuery = useLatestPaymentRequest(initialPayment);
  const payment = paymentQuery.data;

  useEffect(() => {
    if (payment?.status === 'approved') router.replace('/post-auth');
  }, [payment?.status, router]);

  if (paymentQuery.isPending) return <PendingPaymentLoading />;

  if (paymentQuery.isError) {
    return (
      <PaymentStateLayout>
        <Alert variant="destructive">
          <XCircle />
          <AlertTitle>Payment status could not be loaded</AlertTitle>
          <AlertDescription>
            Try again to check whether your payment request is still awaiting verification.
          </AlertDescription>
        </Alert>
        <Button
          className="mt-6"
          variant="outline"
          onClick={() => void paymentQuery.refetch()}
          disabled={paymentQuery.isFetching}
        >
          {paymentQuery.isFetching ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RefreshCw data-icon="inline-start" />
          )}
          Try again
        </Button>
      </PaymentStateLayout>
    );
  }

  if (!payment) {
    return (
      <PaymentStateLayout>
        <Card>
          <CardHeader>
            <CardTitle>No payment submission found</CardTitle>
            <CardDescription>
              There is no subscription payment request for this account yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button render={<Link href="/pricing" />}>View plans</Button>
            <Button render={<Link href="/account" />} variant="outline">
              Choose a plan
            </Button>
          </CardContent>
        </Card>
      </PaymentStateLayout>
    );
  }

  if (payment.status === 'rejected') {
    return <RejectedPayment payment={payment} selectedPlan={selectedPlan} />;
  }

  return (
    <PaymentStateLayout>
      <div className="max-w-2xl">
        <Badge variant="secondary">
          <Clock3 data-icon="inline-start" /> Pending verification
        </Badge>
        <h1 className="mt-5 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Payment is waiting for verification.
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-7 text-muted-foreground">
          Your request is recorded. EduFlow will update access after the payment has been reviewed.
        </p>
      </div>
      <PaymentDetails payment={payment} selectedPlan={selectedPlan} />
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => void checkPaymentStatus(paymentQuery.refetch, router)}
          disabled={paymentQuery.isFetching}
        >
          {paymentQuery.isFetching ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <RefreshCw data-icon="inline-start" />
          )}
          Check status
        </Button>
        <span className="text-sm text-muted-foreground" role="status" aria-live="polite">
          {paymentQuery.isFetching
            ? 'Checking the latest status…'
            : 'Status refresh is manual to keep the page quiet.'}
        </span>
      </div>
    </PaymentStateLayout>
  );
}

function RejectedPayment({
  payment,
  selectedPlan,
}: {
  payment: PaymentRequest;
  selectedPlan?: PaymentPlanContext;
}) {
  return (
    <PaymentStateLayout>
      <Alert variant="destructive">
        <XCircle />
        <AlertTitle>Payment request was rejected</AlertTitle>
        <AlertDescription>
          {payment.rejectionReason ??
            'The payment could not be verified. Review the details and submit a new request.'}
        </AlertDescription>
      </Alert>
      <div className="mt-6 max-w-2xl">
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Let’s get your subscription moving.
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          You can return to checkout with the current plan or choose another active plan.
        </p>
      </div>
      <PaymentDetails payment={payment} selectedPlan={selectedPlan} />
      <div className="mt-6 flex flex-wrap gap-3">
        {selectedPlan && (
          <Button
            render={<Link href={`/post-auth?plan=${encodeURIComponent(selectedPlan.slug)}`} />}
          >
            Try again with this plan
          </Button>
        )}
        <Button render={<Link href="/pricing" />} variant="outline">
          View active plans
        </Button>
      </div>
    </PaymentStateLayout>
  );
}

function PaymentDetails({
  payment,
  selectedPlan,
}: {
  payment: PaymentRequest;
  selectedPlan?: PaymentPlanContext;
}) {
  const planLabel = selectedPlan?.name ?? 'Selected EduFlow plan';
  const planDescription = selectedPlan
    ? `${formatBdt(selectedPlan.priceMinor)} / ${durationLabel(selectedPlan.durationDays)}`
    : 'Plan details are no longer available in the active public catalog.';

  return (
    <Card className="mt-10 max-w-2xl">
      <CardHeader className="border-b">
        <CardTitle>Payment details</CardTitle>
        <CardDescription>Submission details for this account.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <Detail label="Plan" value={planLabel} description={planDescription} />
          <Detail label="Submitted amount" value={formatBdt(payment.amountMinor)} />
          <Detail label="Transaction ID" value={payment.transactionId} mono />
          <Detail label="Sender number" value={payment.senderNumber} />
          <Detail
            label="Payment status"
            value={payment.status === 'rejected' ? 'Rejected' : 'Pending verification'}
          />
          <Detail label="Submitted" value={formatSubmittedAt(payment.createdAt)} />
          {selectedPlan?.trial.included && (
            <Detail label="Trial" value={`${selectedPlan.trial.days}-day trial included`} />
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

function Detail({
  label,
  value,
  description,
  mono,
}: {
  label: string;
  value: string;
  description?: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className={`mt-1 break-words text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value}</dd>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

function PaymentStateLayout({ children }: { children: ReactNode }) {
  return <section className="w-full max-w-3xl">{children}</section>;
}

function PendingPaymentLoading() {
  return (
    <PaymentStateLayout>
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-5 h-11 w-full max-w-xl" />
      <Skeleton className="mt-4 h-6 w-full max-w-lg" />
      <Skeleton className="mt-10 h-72 w-full" />
    </PaymentStateLayout>
  );
}

async function checkPaymentStatus(
  refetch: () => Promise<{ data?: PaymentRequest | null }>,
  router: ReturnType<typeof useRouter>
) {
  const result = await refetch();
  if (result.data?.status === 'approved') router.replace('/post-auth');
}

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(date)} UTC`;
}
