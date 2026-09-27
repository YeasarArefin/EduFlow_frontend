'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Eye, EyeOff, KeyRound, LockKeyhole, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { SectionCard } from '@/components/dashboard/dashboard-primitives';
import { changePassword } from '@/lib/auth/client';
import type {
  ChangePasswordFeedback,
  ChangePasswordField,
  ChangePasswordFormValues,
  PasswordVisibility,
} from '@/types/auth';
import { sessionKeys } from '../queries/use-active-sessions';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password.'),
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(128, 'Use 128 characters or fewer.'),
    confirmPassword: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

const hiddenPasswords: PasswordVisibility = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

export function ChangePasswordCard() {
  const queryClient = useQueryClient();
  const [visibility, setVisibility] = useState<PasswordVisibility>(hiddenPasswords);
  const [feedback, setFeedback] = useState<ChangePasswordFeedback>();
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const toggleVisibility = (field: ChangePasswordField) => {
    setVisibility((current) => ({ ...current, [field]: !current[field] }));
  };

  const submit = async ({ currentPassword, newPassword }: ChangePasswordFormValues) => {
    setFeedback(undefined);
    const result = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (result.error) {
      setFeedback({
        type: 'error',
        message:
          result.error.status === 429
            ? 'Too many attempts. Wait a few minutes before trying again.'
            : 'We could not verify your current password. Check it and try again.',
      });
      return;
    }

    form.reset();
    setVisibility(hiddenPasswords);
    setFeedback({
      type: 'success',
      message: 'Your password was changed and your other active sessions were signed out.',
    });
    await queryClient.invalidateQueries({ queryKey: sessionKeys.all });
  };

  return (
    <SectionCard
      title="Change password"
      description="Update your sign-in password and securely end other active sessions."
    >
      <form className="max-w-xl" onSubmit={form.handleSubmit(submit)} noValidate>
        <FieldGroup>
          <Field data-invalid={Boolean(form.formState.errors.currentPassword)}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-controls="current-password"
                aria-pressed={visibility.currentPassword}
                onClick={() => toggleVisibility('currentPassword')}
              >
                {visibility.currentPassword ? (
                  <EyeOff data-icon="inline-start" />
                ) : (
                  <Eye data-icon="inline-start" />
                )}
                {visibility.currentPassword ? 'Hide' : 'Show'}
              </Button>
            </div>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="current-password"
                className="pl-10"
                type={visibility.currentPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your current password"
                aria-invalid={Boolean(form.formState.errors.currentPassword)}
                {...form.register('currentPassword')}
              />
            </div>
            <FieldError>{form.formState.errors.currentPassword?.message}</FieldError>
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.newPassword)}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="settings-new-password">New password</FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-controls="settings-new-password"
                aria-pressed={visibility.newPassword}
                onClick={() => toggleVisibility('newPassword')}
              >
                {visibility.newPassword ? (
                  <EyeOff data-icon="inline-start" />
                ) : (
                  <Eye data-icon="inline-start" />
                )}
                {visibility.newPassword ? 'Hide' : 'Show'}
              </Button>
            </div>
            <div className="relative">
              <KeyRound
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="settings-new-password"
                className="pl-10"
                type={visibility.newPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Create a new password"
                aria-invalid={Boolean(form.formState.errors.newPassword)}
                {...form.register('newPassword')}
              />
            </div>
            <FieldDescription>Use 8–128 characters.</FieldDescription>
            <FieldError>{form.formState.errors.newPassword?.message}</FieldError>
          </Field>

          <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
            <div className="flex items-center justify-between gap-3">
              <FieldLabel htmlFor="confirm-settings-password">Confirm new password</FieldLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-controls="confirm-settings-password"
                aria-pressed={visibility.confirmPassword}
                onClick={() => toggleVisibility('confirmPassword')}
              >
                {visibility.confirmPassword ? (
                  <EyeOff data-icon="inline-start" />
                ) : (
                  <Eye data-icon="inline-start" />
                )}
                {visibility.confirmPassword ? 'Hide' : 'Show'}
              </Button>
            </div>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="confirm-settings-password"
                className="pl-10"
                type={visibility.confirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your new password"
                aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                {...form.register('confirmPassword')}
              />
            </div>
            <FieldError>{form.formState.errors.confirmPassword?.message}</FieldError>
          </Field>

          {feedback ? (
            <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'}>
              {feedback.type === 'error' ? (
                <ShieldAlert data-icon="inline-start" />
              ) : (
                <CheckCircle2 data-icon="inline-start" />
              )}
              <AlertTitle>
                {feedback.type === 'error' ? 'Password not changed' : 'Password changed'}
              </AlertTitle>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          ) : null}

          <Button
            className="w-fit min-w-36"
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <KeyRound data-icon="inline-start" />
            )}
            {form.formState.isSubmitting ? 'Changing password…' : 'Change password'}
          </Button>
        </FieldGroup>
      </form>
    </SectionCard>
  );
}
