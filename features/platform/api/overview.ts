import { apiRequest } from "@/lib/api/client"
import { getPlatformWorkspaces, type PlatformWorkspace } from "./workspaces"
export type Workspace = PlatformWorkspace
export type Payment = { id: string; status: string; createdAt: string }
export type Plan = { id: string; active?: boolean; status?: string }
export const getPlatformWorkspaceOverview = () => getPlatformWorkspaces({ page: 1, limit: 100 })
export const getPendingPayments = () => apiRequest<Payment[]>("/payment-requests/pending")
export const getPlans = () => apiRequest<Plan[]>("/plans")
