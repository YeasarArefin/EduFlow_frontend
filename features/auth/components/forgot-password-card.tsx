'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { requestPasswordReset } from '@/lib/auth/client';
import type { ForgotPasswordFormValues } from '@/types/auth';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email.'),
});

export function ForgotPasswordCard() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { email: '' },
  });

  const submit = async ({ email }: ForgotPasswordFormValues) => {
    setError(undefined);
    const result = await requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (result.error) {
      setError(
        result.error.status === 429
          ? 'Too many reset requests. Please wait a few minutes before trying again.'
          : 'We could not process that request. Please try again shortly.'
      );
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
      <Card className="w-full max-w-md" aria-labelledby="forgot-password-title">
        <CardHeader>
          <div
            className="flex size-10 items-center justify-center rounded-full border border-accent-border bg-accent-soft text-primary"
            aria-hidden="true"
          >
            {submitted ? <CheckCircle2 className="size-5" /> : <ShieldCheck className="size-5" />}
          </div>
          <CardTitle
            id="forgot-password-title"
            className="mt-4 text-3xl font-medium tracking-tight"
          >
            {submitted ? 'Check your inbox' : 'Reset your password'}
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            {submitted
              ? 'If an EduFlow account uses that email, we sent a secure password reset link.'
              : 'Enter the email address connected to your EduFlow account.'}
          </p>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <Alert>
              <Mail data-icon="inline-start" />
              <AlertTitle>Secure link sent</AlertTitle>
              <AlertDescription>
                Check your inbox and spam folder. The link expires in 30 minutes and can only be
                used once.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={form.handleSubmit(submit)} noValidate>
              <FieldGroup>
                <Field data-invalid={Boolean(form.formState.errors.email)}>
                  <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                  <Input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(form.formState.errors.email)}
                    {...form.register('email')}
                  />
                  <FieldError>{form.formState.errors.email?.message}</FieldError>
                </Field>
                {error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Unable to send the link</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}
                <Button
                  className="h-10 w-full"
                  type="submit"
                  disabled={!form.formState.isValid || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                  Send reset link
                  {!form.formState.isSubmitting ? <ArrowRight data-icon="inline-end" /> : null}
                </Button>
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter className="justify-center">
          <Link
            className="text-sm font-medium underline underline-offset-4 transition-colors hover:text-muted-foreground"
            href="/signin"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
