import type { ActiveSession } from './settings';

export type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

export type ForgotPasswordFormValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordField = keyof ChangePasswordFormValues;
export type PasswordVisibility = Record<ChangePasswordField, boolean>;
export type ChangePasswordFeedback = {
  type: 'success' | 'error';
  message: string;
};

export type AccountInformationFormValues = {
  name: string;
};

export type AccountRoutingState = {
  route: 'dashboard' | 'workspace_creation' | 'payment_pending' | 'account';
  workspaceId?: string;
};

export type SessionLimitReachedErrorData = {
  code: 'SESSION_LIMIT_REACHED';
  message: string;
  activeSessions: ActiveSession[];
  sessionLimit: number;
};

export type SessionTakeoverInput = {
  email: string;
  password: string;
};

export type DeviceLimitDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  activeSessions: ActiveSession[];
  email: string;
  password: string;
  onTakeoverSuccess: () => void;
};
