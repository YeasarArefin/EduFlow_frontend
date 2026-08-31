import { apiRequest } from "@/lib/api/client";
import type { PaymentRequest } from "./create-payment-request";

export async function getLatestPaymentRequest(workspaceId: string) {
  return apiRequest<PaymentRequest | null>("/payment-requests/latest", {
    headers: { "X-Workspace-Id": workspaceId }
  });
}
