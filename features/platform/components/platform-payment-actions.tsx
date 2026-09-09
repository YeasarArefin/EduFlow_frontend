'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Check, LoaderCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { PlatformPayment } from '../api/payments';
import { useReviewPlatformPayment } from '../hooks/use-platform-payments';

export function PlatformPaymentActions({ payment }: { payment: PlatformPayment }) {
  const review = useReviewPlatformPayment();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');
  const pending = review.isPending;
  const canApprove = payment.purpose === 'subscription' && Boolean(payment.plan);
  const closeOnConflict = (close: () => void) => ({
    onError: (error: unknown) => {
      if (error instanceof Error && 'status' in error && error.status === 409) close();
    },
  });
  function approve() {
    review.mutate(
      { paymentId: payment.id, action: 'approve' },
      { onSuccess: () => setApproveOpen(false), ...closeOnConflict(() => setApproveOpen(false)) }
    );
  }
  function reject() {
    review.mutate(
      { paymentId: payment.id, action: 'reject', rejectionReason: reason.trim() },
      {
        onSuccess: () => {
          setRejectOpen(false);
          setReason('');
        },
        ...closeOnConflict(() => setRejectOpen(false)),
      }
    );
  }
  return (
    <div className="flex items-center justify-end gap-2">
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogTrigger
          render={
            <Button
              size="sm"
              className="rounded-full"
              disabled={!canApprove || pending}
              title={
                !canApprove ? 'Only subscription payments with a plan can be approved.' : undefined
              }
            />
          }
        >
          <Check data-icon="inline-start" /> Approve
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {payment.workspace
                ? 'This activates the workspace subscription using the selected plan.'
                : 'This approves the account purchase and unlocks one workspace creation.'}{' '}
              The payment cannot be reviewed again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={pending} onClick={approve}>
              {pending ? (
                <LoaderCircle className="animate-spin" data-icon="inline-start" />
              ) : (
                <Check data-icon="inline-start" />
              )}
              Approve payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogTrigger
          render={
            <Button size="sm" variant="outline" className="rounded-full" disabled={pending} />
          }
        >
          <X data-icon="inline-start" /> Reject
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this payment?</AlertDialogTitle>
            <AlertDialogDescription>
              The subscription will remain unchanged. Give the workspace a clear reason for the
              rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel htmlFor={`rejection-${payment.id}`}>Rejection reason</FieldLabel>
            <Input
              id={`rejection-${payment.id}`}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              maxLength={500}
              placeholder="For example, the transaction could not be verified"
              disabled={pending}
            />
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending || !reason.trim()}
              onClick={reject}
            >
              {pending ? (
                <LoaderCircle className="animate-spin" data-icon="inline-start" />
              ) : (
                <X data-icon="inline-start" />
              )}
              Reject payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
