'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import type {
  CoachingCenterInformationCardProps,
  CoachingCenterInformationFormValues,
  SettingsFormFeedback,
  UpdateWorkspaceSettingsInput,
} from '@/types/settings';
import { getSettingsErrorMessage } from '@/utils/settings-helpers';
import { useSaveWorkspaceSettings, useWorkspaceSettings } from '../queries/use-workspace-settings';

const bangladeshiMobileNumber = /^(?:\+8801\d{9}|01\d{9})$/;

const coachingCenterInformationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Coaching center name is required.')
    .max(150, 'Use 150 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || bangladeshiMobileNumber.test(value),
      'Enter a valid BD mobile number, such as 01712345678.'
    ),
  email: z
    .string()
    .trim()
    .max(255, 'Use 255 characters or fewer.')
    .refine(
      (value) => value.length === 0 || z.email().safeParse(value).success,
      'Enter a valid email address.'
    ),
  address: z.string().trim().max(1000, 'Use 1,000 characters or fewer.'),
});

const emptyValues: CoachingCenterInformationFormValues = {
  name: '',
  phone: '',
  email: '',
  address: '',
};

export function CoachingCenterInformationCard({ workspaceId }: CoachingCenterInformationCardProps) {
  const router = useRouter();
  const query = useWorkspaceSettings(workspaceId);
  const save = useSaveWorkspaceSettings();
  const [feedback, setFeedback] = useState<SettingsFormFeedback | null>(null);
  const form = useForm<CoachingCenterInformationFormValues>({
    resolver: zodResolver(coachingCenterInformationSchema),
    mode: 'onChange',
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      name: query.data.name ?? '',
      phone: query.data.phone ?? '',
      email: query.data.email ?? '',
      address: query.data.address ?? '',
    });
  }, [form, query.data]);

  const submit = async (values: CoachingCenterInformationFormValues) => {
    setFeedback(null);
    const input: UpdateWorkspaceSettingsInput = {
      name: values.name.trim(),
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      address: values.address.trim() || null,
    };

    try {
      const updated = await save.mutateAsync({ workspaceId, input });
      form.reset({
        name: updated.name ?? '',
        phone: updated.phone ?? '',
        email: updated.email ?? '',
        address: updated.address ?? '',
      });
      setFeedback({
        type: 'success',
        message: 'Your coaching center information is now up to date.',
      });
      toast.success('Coaching center information saved.');
      router.refresh();
    } catch (error) {
      const message = getSettingsErrorMessage(error);
      setFeedback({ type: 'error', message });
      toast.error(message);
    }
  };

  if (query.isPending) {
    return (
      <SectionCard
        title="Coaching Center Information"
        description="Contact details used across your workspace."
        action={<Skeleton className="h-9 w-20" />}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </SectionCard>
    );
  }

  if (query.isError) {
    return (
      <SectionCard
        title="Coaching Center Information"
        description="Contact details used across your workspace."
      >
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Could not load coaching center information</AlertTitle>
          <AlertDescription>
            Check your connection, then try again.
            <Button className="mt-3" size="sm" variant="outline" onClick={() => query.refetch()}>
              Try again
            </Button>
          </AlertDescription>
        </Alert>
      </SectionCard>
    );
  }

  const errors = form.formState.errors;
  const clearFeedback = () => setFeedback(null);

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <SectionCard
        title="Coaching Center Information"
        description="Keep the workspace identity and contact details shown across EduFlow accurate."
        action={
          <Button
            type="submit"
            disabled={!form.formState.isDirty || !form.formState.isValid || save.isPending}
          >
            {save.isPending ? <Spinner data-icon="inline-start" /> : null}
            {save.isPending ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="coaching-center-name">Coaching center name</FieldLabel>
            <Input
              id="coaching-center-name"
              autoComplete="organization"
              maxLength={150}
              aria-invalid={Boolean(errors.name)}
              {...form.register('name', { onChange: clearFeedback })}
            />
            <FieldError errors={[errors.name]} />
          </Field>
          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="coaching-center-phone">Phone</FieldLabel>
            <Input
              id="coaching-center-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="01712345678"
              maxLength={14}
              aria-invalid={Boolean(errors.phone)}
              {...form.register('phone', { onChange: clearFeedback })}
            />
            <FieldDescription>Use 01XXXXXXXXX or +8801XXXXXXXXX.</FieldDescription>
            <FieldError errors={[errors.phone]} />
          </Field>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="coaching-center-email">Email</FieldLabel>
            <Input
              id="coaching-center-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="office@example.com"
              maxLength={255}
              aria-invalid={Boolean(errors.email)}
              {...form.register('email', { onChange: clearFeedback })}
            />
            <FieldError errors={[errors.email]} />
          </Field>
          <Field data-invalid={Boolean(errors.address)}>
            <FieldLabel htmlFor="coaching-center-address">Address</FieldLabel>
            <Textarea
              id="coaching-center-address"
              autoComplete="street-address"
              placeholder="Street, area, district"
              maxLength={1000}
              rows={3}
              aria-invalid={Boolean(errors.address)}
              {...form.register('address', { onChange: clearFeedback })}
            />
            <FieldError errors={[errors.address]} />
          </Field>
        </FieldGroup>
        {feedback ? (
          <Alert className="mt-5" variant={feedback.type === 'error' ? 'destructive' : 'default'}>
            {feedback.type === 'error' ? <AlertCircle /> : <CheckCircle2 />}
            <AlertTitle>
              {feedback.type === 'error' ? 'Could not save' : 'Coaching center saved'}
            </AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        ) : null}
      </SectionCard>
    </form>
  );
}
