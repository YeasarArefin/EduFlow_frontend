'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useCreateWorkspace } from '@/features/onboarding/mutations/use-onboarding';

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a workspace name.'),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.'),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, 'Enter a valid Bangladesh mobile number.')
    .optional()
    .or(z.literal('')),
  email: z.string().email('Enter a valid email.').optional().or(z.literal('')),
  address: z.string().max(2000).optional(),
});

type Values = z.infer<typeof schema>;

export function WorkspaceOnboarding() {
  const router = useRouter();
  const mutation = useCreateWorkspace();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { name: '', slug: '', phone: '', email: '', address: '' },
  });

  const submit = async (values: Values) => {
    try {
      await mutation.mutateAsync(values);
      router.replace('/workspace/dashboard');
      router.refresh();
    } catch {
      // The mutation state renders the persistent, actionable error below the fields.
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-xl rounded-xl border border-border bg-card p-8">
        <h1 className="text-3xl font-medium tracking-tight">Create your workspace</h1>
        <p className="mt-2 text-muted-foreground">
          Your approved plan will be attached when this workspace is created.
        </p>
        <form className="mt-8" onSubmit={form.handleSubmit(submit)} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
              <Input
                id="workspace-name"
                placeholder="Bright Future Coaching"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register('name')}
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.slug)}>
              <FieldLabel htmlFor="workspace-slug">Workspace slug</FieldLabel>
              <Input
                id="workspace-slug"
                placeholder="bright-future"
                aria-invalid={Boolean(form.formState.errors.slug)}
                {...form.register('slug')}
              />
              <FieldError>{form.formState.errors.slug?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-phone">
                Phone <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input id="workspace-phone" placeholder="01700000000" {...form.register('phone')} />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-email">
                Email <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input
                id="workspace-email"
                type="email"
                placeholder="hello@example.com"
                {...form.register('email')}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-address">
                Address <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <Input id="workspace-address" placeholder="Dhaka" {...form.register('address')} />
            </Field>
            {mutation.isError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn’t create workspace</AlertTitle>
                <AlertDescription>
                  {(mutation.error as { message?: string }).message ??
                    'Please check the details and try again.'}
                </AlertDescription>
              </Alert>
            )}
            <Button
              className="w-full"
              type="submit"
              disabled={!form.formState.isValid || mutation.isPending}
            >
              {mutation.isPending && <Spinner data-icon="inline-start" />}
              Create workspace
            </Button>
          </FieldGroup>
        </form>
      </section>
    </main>
  );
}
