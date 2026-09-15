'use client';

import Link from 'next/link';
import { ArrowRight, Check, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { signIn, signUp } from '@/lib/auth/client';
import { persistSelectedPlan } from '@/lib/actions/selected-plan';
import { clearSelectedWorkspace } from '@/lib/workspace';
import type { AuthFormValues } from '@/types/auth';

const baseSchema = z.object({
  email: z.string().trim().email('Enter a valid email.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
});

const signUpSchema = baseSchema.extend({
  name: z.string().trim().min(2, 'Enter your name.').max(100),
});

const signInSchema = baseSchema.extend({
  name: z.string().optional(),
});

export function AuthForm({
  mode,
  selectedPlanSlug,
}: {
  mode: 'signin' | 'signup';
  selectedPlanSlug?: string;
}) {
  const signup = mode === 'signup';
  const router = useRouter();
  const [error, setError] = useState<string>();
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(signup ? signUpSchema : signInSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '' },
  });

  const submit = async (values: AuthFormValues) => {
    setError(undefined);
    const result = signup
      ? await signUp.email({
          name: values.name ?? '',
          email: values.email,
          password: values.password,
          callbackURL: `${window.location.origin}/verify-email?next=/post-auth`,
        })
      : await signIn.email({
          email: values.email,
          password: values.password,
          callbackURL: `${window.location.origin}/verify-email?next=/post-auth`,
        });

    if (result.error) {
      setError(result.error.message ?? 'Unable to continue.');
      return;
    }

    if (signup) {
      clearSelectedWorkspace();
      await persistSelectedPlan(undefined);
    } else {
      await persistSelectedPlan(selectedPlanSlug);
    }

    router.replace(result.data?.user.emailVerified ? '/post-auth' : '/verify-email');
  };

  const switchHref = selectedPlanSlug
    ? `${signup ? '/signin' : '/signup'}?plan=${encodeURIComponent(selectedPlanSlug)}`
    : signup
      ? '/signin'
      : '/signup';

  return (
    <main className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8 sm:py-16">
      <section
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 sm:p-8"
        aria-labelledby="auth-title"
      >
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold tracking-tight text-primary-foreground"
            aria-hidden="true"
          >
            EF
          </span>
          <span className="font-heading text-base font-semibold tracking-tight">EduFlow</span>
        </div>

        <div className="mt-7">
          <h1
            id="auth-title"
            className="font-heading text-3xl font-medium tracking-tight sm:text-[2rem]"
          >
            {signup ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            {signup
              ? 'Start with an account. Choose a plan when you are ready to create a workspace.'
              : 'Sign in to continue from your account state.'}
          </p>
        </div>

        <form className="mt-8" onSubmit={form.handleSubmit(submit)} noValidate>
          <FieldGroup className="gap-5">
            {signup ? (
              <Field data-invalid={!!form.formState.errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <div className="relative">
                  <UserRound
                    className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="name"
                    className="pl-10"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={!!form.formState.errors.name}
                    {...form.register('name')}
                  />
                </div>
                <FieldError>{form.formState.errors.name?.message}</FieldError>
              </Field>
            ) : null}
            <Field data-invalid={!!form.formState.errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  className="pl-10"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register('email')}
                />
              </div>
              <FieldError>{form.formState.errors.email?.message}</FieldError>
            </Field>
            <Field data-invalid={!!form.formState.errors.password}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  className="pl-10"
                  type="password"
                  autoComplete={signup ? 'new-password' : 'current-password'}
                  placeholder={signup ? 'At least 8 characters' : 'Your password'}
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register('password')}
                />
              </div>
              <FieldError>{form.formState.errors.password?.message}</FieldError>
            </Field>
            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Unable to continue</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
            <Button
              className="mt-1 h-10 w-full"
              type="submit"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner data-icon="inline-start" /> : null}
              {signup ? 'Create account' : 'Sign in'}
              {!form.formState.isSubmitting ? <ArrowRight data-icon="inline-end" /> : null}
            </Button>
          </FieldGroup>
        </form>

        {signup ? (
          <div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground">
            <p className="flex items-start gap-2 leading-6">
              <Check className="mt-1 size-3.5 shrink-0 text-foreground" aria-hidden="true" /> Your
              account stays available even if you choose a plan later.
            </p>
          </div>
        ) : null}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {signup ? 'Already have an account?' : 'New to EduFlow?'}{' '}
          <Link
            className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground"
            href={switchHref}
          >
            {signup ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </section>
    </main>
  );
}
