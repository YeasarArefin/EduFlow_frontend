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
import { updateUser, useSession } from '@/lib/auth/client';
import type { AccountInformationFormValues } from '@/types/auth';
import type { SettingsFormFeedback } from '@/types/settings';

const accountInformationSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(100, 'Use 100 characters or fewer.'),
});

export function AccountInformationCard() {
  const router = useRouter();
  const session = useSession();
  const [feedback, setFeedback] = useState<SettingsFormFeedback | null>(null);
  const form = useForm<AccountInformationFormValues>({
    resolver: zodResolver(accountInformationSchema),
    mode: 'onChange',
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!session.data?.user) return;
    form.reset({ name: session.data.user.name });
  }, [form, session.data?.user]);

  const submit = async (values: AccountInformationFormValues) => {
    setFeedback(null);
    const name = values.name.trim();
    const result = await updateUser({ name });

    if (result.error) {
      const message = result.error.message || 'We could not update your account. Please try again.';
      setFeedback({ type: 'error', message });
      toast.error(message);
      return;
    }

    form.reset({ name });
    setFeedback({ type: 'success', message: 'Your account information has been updated.' });
    toast.success('Account information saved.');
    router.refresh();
  };

  if (session.isPending) {
    return (
      <SectionCard
        title="Account Information"
        description="Your personal details for this EduFlow account."
        action={<Skeleton className="h-9 w-20" />}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </SectionCard>
    );
  }

  if (!session.data?.user) {
    return (
      <SectionCard
        title="Account Information"
        description="Your personal details for this EduFlow account."
      >
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Account information is unavailable</AlertTitle>
          <AlertDescription>Sign in again, then return to Settings.</AlertDescription>
        </Alert>
      </SectionCard>
    );
  }

  const nameError = form.formState.errors.name;

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate>
      <SectionCard
        title="Account Information"
        description="Update the name shown across your EduFlow account."
        action={
          <Button
            type="submit"
            disabled={
              !form.formState.isDirty || !form.formState.isValid || form.formState.isSubmitting
            }
          >
            {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : null}
            {form.formState.isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        }
      >
        <FieldGroup className="grid gap-5 md:grid-cols-2">
          <Field data-invalid={Boolean(nameError)}>
            <FieldLabel htmlFor="account-name">Name</FieldLabel>
            <Input
              id="account-name"
              autoComplete="name"
              maxLength={100}
              aria-invalid={Boolean(nameError)}
              {...form.register('name', { onChange: () => setFeedback(null) })}
            />
            <FieldError errors={[nameError]} />
          </Field>
          <Field data-disabled>
            <FieldLabel htmlFor="account-email">Email</FieldLabel>
            <Input
              id="account-email"
              type="email"
              value={session.data.user.email}
              readOnly
              aria-describedby="account-email-description"
            />
            <FieldDescription id="account-email-description">
              Email changes are disabled until a verified change flow is available.
            </FieldDescription>
          </Field>
        </FieldGroup>
        {feedback ? (
          <Alert className="mt-5" variant={feedback.type === 'error' ? 'destructive' : 'default'}>
            {feedback.type === 'error' ? <AlertCircle /> : <CheckCircle2 />}
            <AlertTitle>
              {feedback.type === 'error' ? 'Could not save' : 'Account saved'}
            </AlertTitle>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        ) : null}
      </SectionCard>
    </form>
  );
}
