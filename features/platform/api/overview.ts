import { apiRequest } from "@/lib/api/client"
export type Workspace = { id: string; access: { status: string }; subscription: unknown }
export type Payment = { id: string; status: string; createdAt: string }
export type Plan = { id: string; active?: boolean; status?: string }
export const getPlatformWorkspaces = () => apiRequest<{ data: Workspace[]; total: number }>("/workspaces?page=1&limit=100")
export const getPendingPayments = () => apiRequest<Payment[]>("/payment-requests/pending")
export const getPlans = () => apiRequest<Plan[]>("/plans")
