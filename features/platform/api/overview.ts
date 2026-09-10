import { apiRequest } from '@/lib/api/client';
import { getPlatformWorkspaces } from './workspaces';
import type {
  PlatformOverviewPayment,
  PlatformOverviewPlan,
  PlatformWorkspace,
} from '@/types/platform';
export type Workspace = PlatformWorkspace;
export type Payment = PlatformOverviewPayment;
export type Plan = PlatformOverviewPlan;
export const getPlatformWorkspaceOverview = () => getPlatformWorkspaces({ page: 1, limit: 100 });
export const getPendingPayments = () => apiRequest<Payment[]>('/payment-requests/pending');
export const getPlans = () => apiRequest<Plan[]>('/plans');
