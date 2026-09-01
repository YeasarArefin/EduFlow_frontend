import { apiRequest } from "@/lib/api/client";

export type PlatformPayment = {
  id: string;
  purpose: "subscription" | "sms_credit";
  amountMinor: string;
  paymentMethod: "cash" | "bkash" | "nagad" | "rocket" | "other";
  senderNumber: string;
  transactionId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  requestedByUserId: string | null;
  workspace: { id: string; name: string | null; slug: string | null } | null;
  plan: { id: string; name: string; slug: string } | null;
};

export function getPendingPlatformPayments(signal?: AbortSignal) {
  return apiRequest<PlatformPayment[]>("/payment-requests/pending", { signal });
}

export function approvePlatformPayment(paymentId: string) {
  return apiRequest<PlatformPayment>(`/payment-requests/${paymentId}/approve`, { method: "POST" });
}

export function rejectPlatformPayment(paymentId: string, rejectionReason: string) {
  return apiRequest<PlatformPayment>(`/payment-requests/${paymentId}/reject`, {
    method: "POST",
    body: { rejectionReason },
  });
}
