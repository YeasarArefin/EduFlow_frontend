import { apiRequest } from '@/lib/api/client';
import type { CreatedWorkspace, CreateWorkspaceInput, OnboardingState } from '@/types/onboarding';

export type { CreateWorkspaceInput, OnboardingState } from '@/types/onboarding';
export const getOnboardingState = (workspaceId: string) =>
  apiRequest<OnboardingState>('/workspaces/onboarding-state', {
    headers: { 'X-Workspace-Id': workspaceId },
  });
export const createWorkspace = (input: CreateWorkspaceInput) =>
  apiRequest<CreatedWorkspace>('/workspaces/onboard', {
    method: 'POST',
    body: {
      name: input.name,
      slug: input.slug,
      phone: input.phone || undefined,
      email: input.email || undefined,
      address: input.address || undefined,
    },
  });
