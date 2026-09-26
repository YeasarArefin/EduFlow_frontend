'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, MessageSquareText, Send } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/dashboard/dashboard-primitives';
import { useStudentsQuery } from '@/features/students/queries/use-students-query';
import { getSmsTemplates } from '../api/sms';
import { useQueueSmsMessage } from '../mutations/use-queue-sms-message';
import { useSmsPreview, useSmsWallet } from '../queries/use-sms-composer';
import { queueSmsMessageSchema } from '../communication.validation';
import type {
  CommunicationComposerProps,
  SmsRecipientMode,
  SmsRecipientTarget,
} from '@/types/communication';

const modes: Array<{ value: SmsRecipientMode; title: string; description: string }> = [
  {
    value: 'individual',
    title: 'Individual student',
    description: 'Choose one student from your directory.',
  },
  { value: 'bulk', title: 'Bulk students', description: 'Select several active students.' },
  { value: 'custom', title: 'Custom numbers', description: 'Enter phone numbers directly.' },
];

export function CommunicationComposer({ workspaceId }: CommunicationComposerProps) {
  const [mode, setMode] = useState<SmsRecipientMode>('individual');
  const [target, setTarget] = useState<SmsRecipientTarget>('student');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [numbersText, setNumbersText] = useState('');
  const [body, setBody] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const students = useStudentsQuery(workspaceId, { page: 1, limit: 100, status: 'active', search });
  const customNumbers = useMemo(
    () =>
      numbersText
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    [numbersText]
  );
  const recipientCount = mode === 'custom' ? new Set(customNumbers).size : selectedIds.length;
  const wallet = useSmsWallet(workspaceId);
  const preview = useSmsPreview(workspaceId, body, recipientCount);
  const queue = useQueueSmsMessage(workspaceId);
  const templates = useQuery({
    queryKey: ['communication', 'templates', workspaceId],
    queryFn: ({ signal }) => getSmsTemplates(workspaceId, signal),
  });
  const required = preview.data?.totalCredits ?? 0;
  const available = Number(wallet.data?.availableCredits ?? 0);
  const insufficient = required > available;
  const toggleStudent = (id: string) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((studentId) => studentId !== id)
        : mode === 'individual'
          ? [id]
          : [...current, id]
    );
  const canSend = Boolean(
    body.trim() && recipientCount && preview.data && !insufficient && !queue.isPending
  );
  async function send() {
    const input = queueSmsMessageSchema.parse({
      body,
      target,
      studentIds: mode === 'custom' ? undefined : selectedIds,
      customNumbers: mode === 'custom' ? customNumbers : undefined,
    });
    const result = await queue.mutateAsync(input);
    setConfirmOpen(false);
    setSuccess(
      `Message queued for ${result.recipientCount} recipient${result.recipientCount === 1 ? '' : 's'}.`
    );
    setBody('');
    setSelectedIds([]);
    setNumbersText('');
  }
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="Send message"
        description="Compose an SMS in Bangla or English. Credits are reserved when you queue it."
      />
      {success && (
        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground">
          {success}
        </div>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <CardDescription>Choose who should receive this message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-3">
                {modes.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setMode(item.value);
                      setSelectedIds([]);
                    }}
                    className={`rounded-xl border p-4 text-left transition-colors ${mode === item.value ? 'border-primary bg-primary/10' : 'border-border bg-muted/20 hover:border-border-strong'}`}
                  >
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
              {mode === 'custom' ? (
                <div className="space-y-2">
                  <Label htmlFor="numbers">Phone numbers</Label>
                  <Textarea
                    id="numbers"
                    value={numbersText}
                    onChange={(event) => setNumbersText(event.target.value)}
                    placeholder={'01700000000\n01800000000'}
                    rows={5}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate each number with a comma or a new line.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search active students"
                    />
                    <Select
                      value={target}
                      onValueChange={(value) => setTarget(value as SmsRecipientTarget)}
                    >
                      <SelectTrigger className="sm:w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="both">Student & guardian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="max-h-72 divide-y divide-border overflow-y-auto rounded-xl border border-border">
                    {students.data?.data.map((student) => (
                      <label
                        key={student.id}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-muted/40"
                      >
                        <Checkbox
                          checked={selectedIds.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-foreground">
                            {student.fullName}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {student.phone ?? 'No student phone'} ·{' '}
                            {student.guardianPhone ?? 'No guardian phone'}
                          </span>
                        </span>
                        {selectedIds.includes(student.id) && (
                          <Check className="size-4 text-primary" />
                        )}
                      </label>
                    )) ?? (
                      <p className="px-4 py-6 text-sm text-muted-foreground">
                        No active students found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Message</CardTitle>
              <CardDescription>
                Unicode is selected automatically when your message includes Bangla or mixed text.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Label htmlFor="template">Template</Label>
                <Select
                  onValueChange={(id) => {
                    const template = templates.data?.find((item) => item.id === id);
                    if (template) setBody(template.body);
                  }}
                >
                  <SelectTrigger id="template" className="sm:w-72">
                    <SelectValue placeholder="Start from a saved template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.data
                      ?.filter((template) => template.isActive)
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Write your message…"
                rows={8}
                maxLength={10000}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="xl:sticky xl:top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="size-5 text-primary" />
              Send summary
            </CardTitle>
            <CardDescription>Review before queueing.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Recipients</dt>
                <dd className="font-medium">{recipientCount}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Characters</dt>
                <dd className="font-medium">{preview.data?.characters ?? body.length}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Encoding</dt>
                <dd className="font-medium uppercase">{preview.data?.encoding ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Segments / recipient</dt>
                <dd className="font-medium">{preview.data?.segmentsPerRecipient ?? '—'}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border pt-3">
                <dt className="font-medium">Credits required</dt>
                <dd className="font-semibold">{required}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Available balance</dt>
                <dd className={insufficient ? 'font-medium text-destructive' : 'font-medium'}>
                  {wallet.isLoading ? '…' : available}
                </dd>
              </div>
            </dl>
            {insufficient && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                Insufficient SMS credits. Recharge your wallet before sending.
              </p>
            )}
            <Button className="w-full" disabled={!canSend} onClick={() => setConfirmOpen(true)}>
              <Send /> Queue message
            </Button>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Queue this SMS?</AlertDialogTitle>
            <AlertDialogDescription>
              This will reserve {required} credit{required === 1 ? '' : 's'} for {recipientCount}{' '}
              recipient{recipientCount === 1 ? '' : 's'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={queue.isPending} onClick={() => void send()}>
              {queue.isPending ? 'Queueing…' : 'Queue message'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
