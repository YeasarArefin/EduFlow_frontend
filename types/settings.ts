export const SETTING_TABS = [
  'general',
  'billing',
  'academic',
  'salary',
  'sms',
  'reminders',
  'security',
  'imports',
] as const;
export type SettingsTab = (typeof SETTING_TABS)[number];
export type WorkspaceSettingsTab = Exclude<SettingsTab, 'academic' | 'security' | 'imports'>;
export type EditableWorkspaceSettingsTab = Exclude<WorkspaceSettingsTab, 'salary'>;

export type WorkspaceSettings = {
  workspaceId: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  defaultFeeDueDay: number | null;
  gracePeriodDays: number;
  receiptPrefix: string | null;
  smsDefaultSenderId: string | null;
  absenceEmailEnabled: boolean;
  absenceEmailRecipient: 'guardian' | 'student' | 'both';
  absenceSmsEnabled: boolean;
  noticeEmailEnabled: boolean;
  noticeSmsEnabled: boolean;
  noticeRecipient: 'guardian' | 'student' | 'both';
  paymentSmsEnabled: boolean;
  reminderSmsEnabled: boolean;
  overdueSmsEnabled: boolean;
  paymentReminderDaysBefore: number;
  graceReminderDaysAfter: number;
  overdueWarningDaysAfter: number;
  paymentConfirmationEnabled: boolean;
  paymentReminderEnabled: boolean;
  graceReminderEnabled: boolean;
  overdueWarningEnabled: boolean;
};
export type UpdateWorkspaceSettingsInput = Partial<Omit<WorkspaceSettings, 'workspaceId'>>;

export const ACADEMIC_RESOURCES = ['class-levels', 'mediums', 'academic-groups'] as const;
export type AcademicResource = (typeof ACADEMIC_RESOURCES)[number];
export type AcademicReference = { id: string; name: string; isActive: boolean };
export type AcademicReferenceMutationInput = {
  workspaceId: string;
  resource: AcademicResource;
  id: string;
  name: string;
};
export type CreateAcademicReferenceMutationInput = Omit<AcademicReferenceMutationInput, 'id'>;
export type SetAcademicReferenceStatusMutationInput = Omit<
  AcademicReferenceMutationInput,
  'name'
> & {
  isActive: boolean;
};
export type SaveWorkspaceSettingsMutationInput = {
  workspaceId: string;
  input: UpdateWorkspaceSettingsInput;
};
export type SettingsPageProps = { workspaceId: string };
export type AcademicSetupProps = { workspaceId: string };
export type AcademicReferenceCardProps = {
  workspaceId: string;
  resource: AcademicResource;
  title: string;
  description: string;
};
export type WorkspaceSettingsCardsProps = { workspaceId: string; tab: WorkspaceSettingsTab };
export type ActiveSession = {
  id: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  ipAddress: string | null;
  userAgent: string | null;
  deviceLabel: string;
  isCurrent: boolean;
};
export type CsvImportKind = 'students' | 'teachers';
export type CsvImportPreviewRow = {
  rowNumber: number;
  values: Record<string, string>;
  errors: { field: string; reason: string }[];
};
export type CsvImportSummary = {
  rows: CsvImportPreviewRow[];
  total: number;
  valid: number;
  invalid: number;
  imported?: number;
  skipped?: number;
};
export type CsvImportPanelProps = { workspaceId: string };
