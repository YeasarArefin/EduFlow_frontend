export type SmsRecipientTarget = 'student' | 'guardian' | 'both';
export type SmsRecipientMode = 'individual' | 'bulk' | 'custom';
export type SmsPreview = {
  characters: number;
  encoding: 'gsm-7' | 'unicode';
  segmentsPerRecipient: number;
  recipientCount: number;
  totalCredits: number;
};
export type SmsWalletSummary = {
  availableCredits: string;
  reservedCredits: string;
  usedCredits: string;
};
export type QueueSmsMessageInput = {
  body: string;
  target: SmsRecipientTarget;
  studentIds?: string[];
  customNumbers?: string[];
};
export type QueuedSmsMessage = {
  id: string;
  status: string;
  recipientCount: number;
  creditsReserved: string;
};
export type CommunicationComposerProps = { workspaceId: string };
export type SmsTemplate = {
  id: string;
  name: string;
  category: string;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
export type SmsTemplateInput = Pick<SmsTemplate, 'name' | 'category' | 'body' | 'isActive'>;
export const SMS_TEMPLATE_VARIABLES = [
  'student_name',
  'guardian_name',
  'batch_name',
  'amount',
  'due_date',
  'workspace_name',
] as const;
