'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ApiError } from '@/lib/api/client';
import { useCreatePaymentRequest } from '@/features/payments/hooks/use-create-payment-request';

const schema = z.object({
  senderNumber: z
    .string()
    .trim()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, 'Enter a valid Bangladesh mobile number.'),
  transactionId: z
    .string()
    .trim()
    .min(1, 'Enter the bKash transaction ID.')
    .max(100, 'Transaction ID is too long.'),
});

type Values = z.infer<typeof schema>;

export function ManualPaymentForm() {
  const router = useRouter();
  const mutation = useCreatePaymentRequest();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { senderNumber: '', transactionId: '' },
  });

  const submit = async (values: Values) => {
    try {
      await mutation.mutateAsync({ paymentMethod: 'bkash', ...values });
      router.replace('/post-auth');
    } catch {
      // The mutation state renders the persistent, actionable error below the fields.
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="payment-method">Payment method</FieldLabel>
          <Input
            id="payment-method"
            value="bKash"
            readOnly
            aria-describedby="payment-method-help"
          />
          <FieldDescription id="payment-method-help">
            Manual bKash is the currently supported subscription payment method.
          </FieldDescription>
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.senderNumber)}>
          <FieldLabel htmlFor="sender-number">Sender bKash number</FieldLabel>
          <Input
            id="sender-number"
            inputMode="tel"
            autoComplete="tel"
            placeholder="01700000000"
            aria-invalid={Boolean(form.formState.errors.senderNumber)}
            {...form.register('senderNumber')}
          />
          <FieldError>{form.formState.errors.senderNumber?.message}</FieldError>
        </Field>
        <Field data-invalid={Boolean(form.formState.errors.transactionId)}>
          <FieldLabel htmlFor="transaction-id">Transaction ID</FieldLabel>
          <Input
            id="transaction-id"
            autoComplete="off"
            placeholder="Enter the bKash transaction ID"
            aria-invalid={Boolean(form.formState.errors.transactionId)}
            {...form.register('transactionId')}
          />
          <FieldError>{form.formState.errors.transactionId?.message}</FieldError>
        </Field>
        {mutation.isError && (
          <Alert variant="destructive">
            <AlertTitle>{getPaymentErrorTitle(mutation.error)}</AlertTitle>
            <AlertDescription>{getPaymentErrorMessage(mutation.error)}</AlertDescription>
          </Alert>
        )}
        <Button
          type="submit"
          disabled={!form.formState.isValid || form.formState.isSubmitting || mutation.isPending}
        >
          {mutation.isPending && <Spinner data-icon="inline-start" />}
          Submit payment for review
        </Button>
      </FieldGroup>
    </form>
  );
}

function getPaymentErrorTitle(error: unknown) {
  if (error instanceof ApiError && error.code === 'PAYMENT_TRANSACTION_ALREADY_EXISTS') {
    return 'Transaction ID already submitted';
  }
  return 'Couldn’t submit payment';
}

function getPaymentErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'PAYMENT_TRANSACTION_ALREADY_EXISTS') {
      return 'Use the original transaction details or submit a different bKash transaction ID.';
    }
    if (error.code === 'PAYMENT_AMOUNT_MISMATCH') {
      return 'The plan price changed. Return to pricing and choose the current plan again.';
    }
    if (error.code === 'PAYMENT_PLAN_NOT_PURCHASABLE') {
      return 'This plan is no longer available. Return to pricing to choose an active plan.';
    }
    if (error.code === 'VALIDATION_ERROR') {
      return 'Check the sender number and transaction ID, then try again.';
    }
    if (error.message) {
      return error.message;
    }
  }
  return 'We couldn’t submit the payment request. Please try again.';
}
