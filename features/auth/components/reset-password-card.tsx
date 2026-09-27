'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { resetPassword } from '@/lib/auth/client';
import type { ResetPasswordFormValues } from '@/types/auth';

const schema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(128, 'Use 128 characters or fewer.'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type ResetPasswordCardProps = {
  token?: string;
  invalidLink?: boolean;
};

export function ResetPasswordCard({ token, invalidLink = false }: ResetPasswordCardProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [invalid, setInvalid] = useState(invalidLink || !token);
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const submit = async ({ newPassword }: ResetPasswordFormValues) => {
    if (!token) {
      setInvalid(true);
      return;
    }

    const result = await resetPassword({ newPassword, token });
    if (result.error) {
      setInvalid(true);
      return;
    }

    router.replace('/signin?passwordReset=success');
  };

  const passwordType = showPassword ? 'text' : 'password';

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
      <Card className="w-full max-w-md" aria-labelledby="reset-password-title">
        <CardHeader>
          <div
            className="flex size-10 items-center justify-center rounded-full border border-accent-border bg-accent-soft text-primary"
            aria-hidden="true"
          >
            {invalid ? <ShieldAlert className="size-5" /> : <KeyRound className="size-5" />}
          </div>
          <CardTitle id="reset-password-title" className="mt-4 text-3xl font-medium tracking-tight">
            {invalid ? 'This link is no longer valid' : 'Choose a new password'}
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {invalid
              ? 'Reset links expire after 30 minutes and can only be used once.'
              : 'Use at least 8 characters. Signing in elsewhere will require your new password.'}
          </p>
        </CardHeader>
        <CardContent>
          {invalid ? (
            <Alert variant="destructive">
              <ShieldAlert data-icon="inline-start" />
              <AlertTitle>Request a new link</AlertTitle>
              <AlertDescription>
                This reset link may have expired, been used, or been copied incorrectly.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={form.handleSubmit(submit)} noValidate>
              <FieldGroup>
                <Field data-invalid={Boolean(form.formState.errors.newPassword)}>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-pressed={showPassword}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? (
                        <EyeOff data-icon="inline-start" />
                      ) : (
                        <Eye data-icon="inline-start" />
                      )}
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                  </div>
                  <Input
                    id="new-password"
                    type={passwordType}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    aria-invalid={Boolean(form.formState.errors.newPassword)}
                    {...form.register('newPassword')}
                  />
                  <FieldError>{form.formState.errors.newPassword?.message}</FieldError>
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.confirmPassword)}>
                  <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
                  <Input
                    id="confirm-password"
                    type={passwordType}
                    autoComplete="new-password"
                    placeholder="Repeat your new password"
                    aria-invalid={Boolean(form.formState.errors.confirmPassword)}
                    {...form.register('confirmPassword')}
                  />
                  <FieldError>{form.formState.errors.confirmPassword?.message}</FieldError>
                </Field>
                <Button
                  className="h-10 w-full"
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                  Reset password
                  {!form.formState.isSubmitting ? <ArrowRight data-icon="inline-end" /> : null}
                </Button>
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center gap-3">
          {invalid ? (
            <Button onClick={() => router.replace('/forgot-password')}>
              <CheckCircle2 data-icon="inline-start" />
              Request another link
            </Button>
          ) : (
            <Link
              className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-muted-foreground"
              href="/signin"
            >
              Back to sign in
            </Link>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
