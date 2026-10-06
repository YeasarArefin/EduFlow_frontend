'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useBatchesQuery } from '@/features/batches/queries/use-batches-query';
import { useCreateNotice } from '../mutations/use-notice-mutations';
import { toast } from 'sonner';
const schema = z
  .object({
    subject: z.string().trim().min(1, 'A title is required.').max(200),
    body: z.string().trim().min(1, 'A message is required.').max(20_000),
    audience: z.enum(['batch', 'all_students', 'all_teachers']),
    batchId: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.audience === 'batch' && !v.batchId)
      ctx.addIssue({ code: 'custom', path: ['batchId'], message: 'Select a batch.' });
  });
type Values = z.infer<typeof schema>;
export function NoticeSheet({
  workspaceId,
  open,
  onOpenChange,
  onCreated,
}: {
  workspaceId: string;
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCreated: (id: string) => void;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { subject: '', body: '', audience: 'all_students', batchId: '' },
  });
  const audience = useWatch({ control: form.control, name: 'audience' });
  const batchId = useWatch({ control: form.control, name: 'batchId' });
  const batches = useBatchesQuery(workspaceId, { page: 1, limit: 50, status: 'active' });
  const create = useCreateNotice();
  useEffect(() => {
    if (open) form.reset();
  }, [form, open]);
  const submit = form.handleSubmit((values) =>
    create.mutate(
      {
        workspaceId,
        input: { ...values, batchId: values.audience === 'batch' ? values.batchId : undefined },
      },
      {
        onSuccess: (notice) => {
          toast.success('Notice created. Review recipients before sending.');
          onOpenChange(false);
          onCreated(notice.id);
        },
        onError: (error) => toast.error(error.message || 'Could not create notice.'),
      }
    )
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Create notice</SheetTitle>
          <SheetDescription>
            Draft a message, select its audience, then review the recipient count before queueing.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FieldGroup className="gap-6">
              <Field data-invalid={Boolean(form.formState.errors.subject)}>
                <FieldLabel htmlFor="notice-title">Title</FieldLabel>
                <Input
                  id="notice-title"
                  {...form.register('subject')}
                  placeholder="e.g. Class schedule update"
                  aria-invalid={Boolean(form.formState.errors.subject)}
                />
                <FieldError errors={[form.formState.errors.subject]} />
              </Field>
              <Field data-invalid={Boolean(form.formState.errors.body)}>
                <FieldLabel htmlFor="notice-message">Message</FieldLabel>
                <Textarea
                  id="notice-message"
                  {...form.register('body')}
                  placeholder="Write the message your recipients should receive…"
                  className="min-h-36"
                  aria-invalid={Boolean(form.formState.errors.body)}
                />
                <FieldError errors={[form.formState.errors.body]} />
              </Field>
              <Field>
                <FieldLabel>Audience</FieldLabel>
                <RadioGroup
                  value={audience}
                  onValueChange={(value) =>
                    form.setValue('audience', value as Values['audience'], { shouldDirty: true })
                  }
                  className="grid gap-3 sm:grid-cols-3"
                >
                  {[
                    {
                      value: 'all_students',
                      title: 'All students',
                      text: 'Reach active students.',
                    },
                    {
                      value: 'all_teachers',
                      title: 'All teachers',
                      text: 'Reach active teachers.',
                    },
                    { value: 'batch', title: 'Specific batch', text: 'Choose one active batch.' },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className="flex cursor-pointer gap-3 rounded-xl border border-border bg-card/60 p-3 has-data-checked:border-primary has-data-checked:bg-primary/5"
                    >
                      <RadioGroupItem value={item.value} />
                      <span>
                        <span className="block text-sm font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground">{item.text}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>
              {audience === 'batch' ? (
                <Field data-invalid={Boolean(form.formState.errors.batchId)}>
                  <FieldLabel htmlFor="notice-batch">Batch</FieldLabel>
                  <Select
                    value={batchId || undefined}
                    onValueChange={(value) =>
                      form.setValue('batchId', value ?? '', { shouldDirty: true })
                    }
                    disabled={batches.isPending}
                  >
                    <SelectTrigger id="notice-batch" className="w-full">
                      <SelectValue
                        placeholder={
                          batches.isPending ? 'Loading batches…' : 'Search and choose a batch'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {batches.data?.data.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError errors={[form.formState.errors.batchId]} />
                </Field>
              ) : null}
            </FieldGroup>
          </div>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? <Spinner data-icon="inline-start" /> : null}Create notice
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
