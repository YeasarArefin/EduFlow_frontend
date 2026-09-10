export type PaymentMethod = 'bkash';

export type CreatePaymentRequestInput = {
  paymentMethod: PaymentMethod;
  senderNumber: string;
  transactionId: string;
};

export type PaymentRequest = {
  id: string;
  planId: string;
  amountMinor: string;
  paymentMethod: PaymentMethod;
  senderNumber: string;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
};

export type PaymentResponse = { data: PaymentRequest };
export type PaymentErrorResponse = { error?: { code?: string; message?: string } };
export type LatestPaymentResponse = { data?: PaymentRequest | null };
export type ServerLatestPaymentResult =
  { ok: true; payment: PaymentRequest | null } | { ok: false };
