export type OnboardingState = {
  step: 'workspace_created' | 'subscription_required' | 'payment_pending' | 'ready';
  workspaceStatus: string;
  paymentPending: boolean;
  access: { allowed: boolean; status: string; reason: string };
};

export type CreateWorkspaceInput = {
  name: string;
  slug: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type CreatedWorkspace = { id: string; name: string; slug: string; status: string };
