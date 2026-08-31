import { apiRequest } from "@/lib/api/client";
export type OnboardingState = { step: "workspace_created" | "subscription_required" | "payment_pending" | "ready"; workspaceStatus: string; paymentPending: boolean; access: { allowed: boolean; status: string; reason: string; }; };
export type CreateWorkspaceInput = { name: string; slug: string; phone?: string; email?: string; address?: string; };
export const getOnboardingState = (workspaceId: string) => apiRequest<OnboardingState>("/workspaces/onboarding-state", { headers: { "X-Workspace-Id": workspaceId } });
export const createWorkspace = (input: CreateWorkspaceInput) => apiRequest<{ id: string; name: string; slug: string; status: string; }>("/workspaces/onboard", {
  method: "POST",
  body: {
    name: input.name,
    slug: input.slug,
    phone: input.phone || undefined,
    email: input.email || undefined,
    address: input.address || undefined
  }
});
