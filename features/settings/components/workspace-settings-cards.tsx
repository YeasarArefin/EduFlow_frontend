'use client';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  ],
} as const satisfies Record<string, readonly (keyof UpdateWorkspaceSettingsInput)[]>;
export function WorkspaceSettingsCards({ workspaceId, tab }: WorkspaceSettingsCardsProps) {
  const query = useWorkspaceSettings(workspaceId);
  const save = useSaveWorkspaceSettings();
  const form = useForm<Partial<WorkspaceSettings>>();
  const absenceEmailRecipient = useWatch({ control: form.control, name: 'absenceEmailRecipient' });
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
  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <SectionCard
        title="Payment reminders"
        description="Choose which reminder events are enabled."
        action={saveButton}
      >
        <div className="grid gap-3">
          <label>
            <input type="checkbox" {...form.register('paymentConfirmationEnabled')} /> Payment
            confirmation
          </label>
          <label>
            <input type="checkbox" {...form.register('paymentReminderEnabled')} /> Payment reminder
          </label>
          <label>
            <input type="checkbox" {...form.register('graceReminderEnabled')} /> Grace reminder
          </label>
          <label>
            <input type="checkbox" {...form.register('overdueWarningEnabled')} /> Overdue warning
          </label>
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
        </div>
      </SectionCard>
    </form>
  );
}
