"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, LoaderCircle, X } from "lucide-react";
import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterToolbar,
  LoadingState,
  PageHeader,
} from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatBdt } from "@/lib/format-money";
import type { PlatformPayment } from "../api/payments";
import { usePendingPlatformPayments, useReviewPlatformPayment } from "../hooks/use-platform-payments";

const EMPTY_PAYMENTS: PlatformPayment[] = [];

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function paymentStatusTone(status: PlatformPayment["status"]) {
  if (status === "approved") return "success" as const;
  if (status === "rejected") return "danger" as const;
  return "warning" as const;
}

function paymentStatusLabel(status: PlatformPayment["status"]) {
  return status.slice(0, 1).toUpperCase() + status.slice(1);
}

function PaymentActions({ payment }: { payment: PlatformPayment }) {
  const reviewMutation = useReviewPlatformPayment();
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const isReviewing = reviewMutation.isPending;
  const canApprove = payment.purpose === "subscription" && Boolean(payment.plan);

  function approve() {
    reviewMutation.mutate(
      { paymentId: payment.id, action: "approve" },
      { onSuccess: () => setApproveOpen(false), onError: (error) => {
        if (error instanceof Error && "status" in error && error.status === 409) setApproveOpen(false);
      } },
    );
  }

  function reject() {
    reviewMutation.mutate(
      { paymentId: payment.id, action: "reject", rejectionReason: rejectionReason.trim() },
      {
        onSuccess: () => {
          setRejectOpen(false);
          setRejectionReason("");
        },
        onError: (error) => {
          if (error instanceof Error && "status" in error && error.status === 409) setRejectOpen(false);
        },
      },
    );
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <AlertDialog open={approveOpen} onOpenChange={setApproveOpen}>
        <AlertDialogTrigger
          render={<Button size="sm" className="rounded-full" disabled={!canApprove || isReviewing} title={!canApprove ? "Only subscription payments with a plan can be approved." : undefined} />}
        >
          <Check data-icon="inline-start" /> Approve
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve this payment?</AlertDialogTitle>
            <AlertDialogDescription>
              {payment.workspace
                ? "This activates the workspace subscription using the selected plan."
                : "This approves the account purchase and unlocks one workspace creation."} The payment cannot be reviewed again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReviewing}>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={isReviewing} onClick={approve}>
              {isReviewing ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Check data-icon="inline-start" />}
              Approve payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogTrigger render={<Button size="sm" variant="outline" className="rounded-full" disabled={isReviewing} />}>
          <X data-icon="inline-start" /> Reject
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this payment?</AlertDialogTitle>
            <AlertDialogDescription>
              The subscription will remain unchanged. Give the workspace a clear reason for the rejection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel htmlFor={`rejection-${payment.id}`}>Rejection reason</FieldLabel>
            <Input
              id={`rejection-${payment.id}`}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              maxLength={500}
              placeholder="For example, the transaction could not be verified"
              disabled={isReviewing}
            />
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isReviewing}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={isReviewing || !rejectionReason.trim()} onClick={reject}>
              {isReviewing ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <X data-icon="inline-start" />}
              Reject payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function PlatformPaymentsPage() {
  const [search, setSearch] = useState("");
  const paymentQuery = usePendingPlatformPayments();
  const payments = paymentQuery.data ?? EMPTY_PAYMENTS;
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const filteredPayments = useMemo(
    () => payments.filter((payment) =>
      !normalizedSearch || [payment.workspace?.name, payment.workspace?.slug, payment.plan?.name, payment.transactionId, payment.senderNumber, payment.requestedByUserId]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase().includes(normalizedSearch)),
    ),
    [normalizedSearch, payments],
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Payment review" description="Review pending manual payments. Account purchases unlock workspace creation after approval." />
      <FilterToolbar
        placeholder="Search workspace, plan, sender, or transaction"
        searchValue={search}
        onSearch={setSearch}
      />

      {paymentQuery.isLoading ? <LoadingState rows={5} /> : null}
      {paymentQuery.isError ? (
        <ErrorState
          message={paymentQuery.error instanceof Error ? paymentQuery.error.message : "Could not load pending payment requests."}
          onRetry={() => paymentQuery.refetch()}
        />
      ) : null}
      {!paymentQuery.isLoading && !paymentQuery.isError && payments.length === 0 ? (
        <EmptyState title="No pending payments" description="New manual payment requests will appear here for Platform Owner review." />
      ) : null}
      {!paymentQuery.isLoading && !paymentQuery.isError && payments.length > 0 && filteredPayments.length === 0 ? (
        <EmptyState title="No matching payments" description="Try a different workspace, plan, sender number, or transaction ID." />
      ) : null}
      {!paymentQuery.isLoading && !paymentQuery.isError && filteredPayments.length > 0 ? (
        <DataTable>
          <TableHeader>
            <TableRow>
              <TableHead>Account / workspace</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Sender number</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {payment.workspace ? (
                    <Link href={`/platform/workspaces/${payment.workspace.id}`} className="group inline-flex min-w-40 flex-col gap-0.5 font-medium text-foreground hover:text-primary">
                      <span className="inline-flex items-center gap-1.5">{payment.workspace.name ?? "Unnamed workspace"} <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-100" /></span>
                      <span className="font-normal text-xs text-muted-foreground">{payment.workspace.slug ?? payment.workspace.id}</span>
                    </Link>
                  ) : (
                    <div className="flex min-w-40 flex-col gap-0.5">
                      <span className="font-medium">New account</span>
                      <span className="font-mono text-xs text-muted-foreground">{payment.requestedByUserId ?? "Unknown account"}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{payment.plan?.name ?? <span className="text-muted-foreground">No plan</span>}</TableCell>
                <TableCell className="font-medium tabular-nums">{formatBdt(payment.amountMinor)}</TableCell>
                <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                <TableCell className="font-mono text-xs">{payment.senderNumber}</TableCell>
                <TableCell className="font-mono text-xs">{payment.transactionId}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">{formatSubmittedAt(payment.createdAt)}</TableCell>
                <TableCell><StatusBadge status={paymentStatusTone(payment.status)}>{paymentStatusLabel(payment.status)}</StatusBadge></TableCell>
                <TableCell><PaymentActions payment={payment} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      ) : null}
    </div>
  );
}
