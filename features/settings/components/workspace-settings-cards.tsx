'use client';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import { useSaveWorkspaceSettings, useWorkspaceSettings } from '../queries/use-workspace-settings';
import type {
  UpdateWorkspaceSettingsInput,
  WorkspaceSettings,
  WorkspaceSettingsCardsProps,
} from '@/types/settings';

const tabFields = {
  general: ['name', 'phone', 'email', 'address'],
  billing: ['defaultFeeDueDay', 'gracePeriodDays', 'receiptPrefix'],
  salary: [],
  sms: ['smsDefaultSenderId'],
  reminders: [
    'paymentConfirmationEnabled',
    'paymentReminderEnabled',
    'graceReminderEnabled',
    'overdueWarningEnabled',
    'absenceEmailRecipient',
    'absenceEmailEnabled',
    'absenceSmsEnabled',
    'noticeEmailEnabled',
    'noticeSmsEnabled',
    'noticeRecipient',
    'paymentSmsEnabled',
    'reminderSmsEnabled',
    'overdueSmsEnabled',
    'paymentReminderDaysBefore',
    'graceReminderDaysAfter',
    'overdueWarningDaysAfter',
  ],
} as const satisfies Record<string, readonly (keyof UpdateWorkspaceSettingsInput)[]>;
export function WorkspaceSettingsCards({ workspaceId, tab }: WorkspaceSettingsCardsProps) {
  const query = useWorkspaceSettings(workspaceId);
  const save = useSaveWorkspaceSettings();
  const form = useForm<Partial<WorkspaceSettings>>();
  const absenceEmailRecipient = useWatch({ control: form.control, name: 'absenceEmailRecipient' });
  const values = useWatch({ control: form.control });
  useEffect(() => {
    if (query.data) form.reset(query.data);
  }, [query.data, form]);
  if (query.isPending) return <p>Loading settings…</p>;
  if (query.isError) return <p className="text-destructive">Could not load settings.</p>;
  const submit = (values: Partial<WorkspaceSettings>) => {
    const input = Object.fromEntries(
      tabFields[tab]
        .filter((field) => values[field] !== undefined)
        .map((field) => [field, values[field]])
    ) as UpdateWorkspaceSettingsInput;
    save.mutate(
      { workspaceId, input },
      {
        onSuccess: () => toast.success('Settings saved.'),
        onError: (e: Error) => toast.error(e.message),
      }
    );
  };
  const saveButton = (
    <Button type="submit" disabled={save.isPending || !form.formState.isDirty}>
      {save.isPending ? 'Saving…' : 'Save changes'}
    </Button>
  );
  if (tab === 'salary')
    return (
      <SectionCard
        title="Salary defaults"
        description="Teacher salary amounts and payment history are managed from Salaries."
      >
        <p className="text-sm text-muted-foreground">
          No separate workspace salary defaults are stored in the current model.
        </p>
      </SectionCard>
    );
  if (tab === 'general')
    return (
      <form onSubmit={form.handleSubmit(submit)}>
        <SectionCard
          title="Center information"
          description="Shown on workspace records and receipts."
          action={saveButton}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Center name" {...form.register('name')} />
            <Input placeholder="Phone" {...form.register('phone')} />
            <Input type="email" placeholder="Email" {...form.register('email')} />
            <Input placeholder="Address" {...form.register('address')} />
          </div>
        </SectionCard>
      </form>
    );
  if (tab === 'billing')
    return (
      <form onSubmit={form.handleSubmit(submit)}>
        <SectionCard
          title="Fee and receipt defaults"
          description="Used when generating future student fees and receipts."
          action={saveButton}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="number"
              min="1"
              max="31"
              placeholder="Fee due day"
              {...form.register('defaultFeeDueDay', { valueAsNumber: true })}
            />
            <Input
              type="number"
              min="0"
              max="365"
              placeholder="Grace period days"
              {...form.register('gracePeriodDays', { valueAsNumber: true })}
            />
            <Input placeholder="Receipt prefix" {...form.register('receiptPrefix')} />
          </div>
        </SectionCard>
      </form>
    );
  if (tab === 'sms')
    return (
      <form onSubmit={form.handleSubmit(submit)}>
        <SectionCard
          title="SMS defaults"
          description="Saved for future communication delivery."
          action={saveButton}
        >
          <Input placeholder="Sender ID" {...form.register('smsDefaultSenderId')} />
        </SectionCard>
      </form>
    );
  const setEnabled = (name: keyof WorkspaceSettings, checked: boolean) =>
    form.setValue(name, checked as never, { shouldDirty: true });
  const toggle = (
    name: keyof WorkspaceSettings,
    title: string,
    description: string,
    sms = false
  ) => (
    <Field orientation="horizontal" className="rounded-xl border border-border bg-card/40 p-4">
      <FieldContent>
        <FieldTitle>{title}</FieldTitle>
        <FieldDescription>
          {description}
          {sms ? ' SMS messages use wallet credits.' : ''}
        </FieldDescription>
      </FieldContent>
      <Switch
        checked={Boolean(values[name])}
        onCheckedChange={(checked) => setEnabled(name, checked)}
      />
    </Field>
  );
  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <SectionCard
        title="Notification channels"
        description="Choose exactly how families receive each operational update. Changes apply to future events."
        action={saveButton}
      >
        <FieldGroup>
          <div className="grid gap-3 lg:grid-cols-2">
            {toggle('absenceEmailEnabled', 'Absence email', 'Send an absence update by email.')}
            {toggle('absenceSmsEnabled', 'Absence SMS', 'Send an absence update by text.', true)}
            {toggle('noticeEmailEnabled', 'Notice email', 'Deliver new notices by email.')}
            {toggle('noticeSmsEnabled', 'Notice SMS', 'Deliver new notices by text.', true)}
            {toggle(
              'paymentConfirmationEnabled',
              'Payment confirmation email',
              'Confirm recorded fee payments by email.'
            )}
            {toggle(
              'paymentSmsEnabled',
              'Payment confirmation SMS',
              'Confirm recorded fee payments by text.',
              true
            )}
          </div>
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <p className="font-medium text-foreground">Fee reminder automation</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the events, then set when each one should be evaluated.
            </p>
            <div className="mt-4 grid gap-3 lg:grid-cols-3">
              {toggle('paymentReminderEnabled', 'Due reminder email', 'Email before a fee is due.')}
              {toggle(
                'graceReminderEnabled',
                'Grace reminder email',
                'Email once the grace period begins.'
              )}
              {toggle(
                'overdueWarningEnabled',
                'Overdue warning email',
                'Email when a fee remains unpaid.'
              )}
              {toggle(
                'reminderSmsEnabled',
                'Reminder SMS',
                'Text for due and grace reminders.',
                true
              )}
              {toggle('overdueSmsEnabled', 'Overdue SMS', 'Text for overdue fees.', true)}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Input
                type="number"
                min="0"
                placeholder="Days before due"
                {...form.register('paymentReminderDaysBefore', { valueAsNumber: true })}
              />
              <Input
                type="number"
                min="0"
                placeholder="Days after grace"
                {...form.register('graceReminderDaysAfter', { valueAsNumber: true })}
              />
              <Input
                type="number"
                min="0"
                placeholder="Days after due"
                {...form.register('overdueWarningDaysAfter', { valueAsNumber: true })}
              />
            </div>
          </div>
          <Field
            orientation="responsive"
            className="rounded-xl border border-border bg-card/40 p-4"
          >
            <FieldContent>
              <FieldTitle>Default absence recipient</FieldTitle>
              <FieldDescription>
                Choose who receives absence messages when the event is enabled.
              </FieldDescription>
            </FieldContent>
            <Select
              value={absenceEmailRecipient}
              onValueChange={(value) =>
                form.setValue(
                  'absenceEmailRecipient',
                  value as WorkspaceSettings['absenceEmailRecipient'],
                  { shouldDirty: true }
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Default recipient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </SectionCard>
    </form>
  );
}
