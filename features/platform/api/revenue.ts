import { apiRequest } from "@/lib/api/client";

export type RevenueOverview = {
  metrics: { approvedRevenueMinor: string; pendingAmountMinor: string; pendingCount: number; approvedCount: number; rejectedCount: number };
  byPlan: Array<{ plan: { id: string; name: string; slug: string } | null; revenueMinor: string; approvedCount: number }>;
  recent: Array<{ id: string; status: "pending" | "approved" | "rejected"; amountMinor: string; method: string; transactionId: string; createdAt: string; workspace: { id: string; name: string | null; slug: string | null } | null; plan: { id: string; name: string; slug: string } | null }>;
};

export function getRevenueOverview(params: { from?: string; to?: string }, signal?: AbortSignal) {
  const query = new URLSearchParams();
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  return apiRequest<RevenueOverview>(`/payment-requests/revenue-overview${query.size ? `?${query}` : ""}`, { signal });
}
