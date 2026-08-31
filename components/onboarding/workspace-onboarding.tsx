"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCreateWorkspace, useOnboardingState } from "@/features/onboarding/hooks/use-onboarding";

const schema = z.object({
  name: z.string().trim().min(1, "Enter a workspace name."),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  phone: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, "Enter a valid Bangladesh mobile number.").optional().or(z.literal("")),
  email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  address: z.string().max(2000).optional()
});

type Values = z.infer<typeof schema>;

/* eslint-disable react-hooks/set-state-in-effect -- Workspace selection is read once from browser storage after hydration. */

export type SelectedPlanContext = {
  name: string;
  durationDays: number;
  trial: { included: boolean; days: number };
};

export function WorkspaceOnboarding({ selectedPlan }: { selectedPlan?: SelectedPlanContext }) {
  const router = useRouter();
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const state = useOnboardingState(workspaceId);
  const mutation = useCreateWorkspace();
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { name: "", slug: "", phone: "", email: "", address: "" }
  });

  useEffect(() => setWorkspaceId(window.localStorage.getItem("eduflow.workspaceId")), []);

  const submit = (values: Values) => {
    mutation.mutate(values, { onSuccess: () => router.replace("/post-auth") });
  };

  if (state.isLoading) return <Loading />;
  if (state.isError) return <StateError onRetry={() => state.refetch()} />;
  if (state.data?.step === "workspace_created") {
    return <Status selectedPlan={selectedPlan} title="Your workspace is ready for a plan" copy="Choose the plan that fits your coaching center, then continue to payment." />;
  }
  if (state.data?.step === "ready") return <Status selectedPlan={selectedPlan} title="Workspace ready" copy="Your workspace is active and ready to use." />;
  if (state.data?.step === "payment_pending") return <Status selectedPlan={selectedPlan} title="Payment under review" copy="Your payment is pending review. We’ll update your workspace when it is approved." />;
  if (state.data?.step === "subscription_required") return <Status selectedPlan={selectedPlan} title="Choose a plan" copy="Your workspace is created. Select a plan to continue." />;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-xl rounded-xl border border-border bg-card p-8">
        <h1 className="text-3xl font-medium tracking-tight">Create your workspace</h1>
        <p className="mt-2 text-muted-foreground">A workspace keeps your students, classes, and records together.</p>
        <SelectedPlanSummary selectedPlan={selectedPlan} />
        <form className="mt-8" onSubmit={form.handleSubmit(submit)} noValidate>
          <FieldGroup>
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
              <Input id="workspace-name" placeholder="Bright Future Coaching" aria-invalid={Boolean(form.formState.errors.name)} {...form.register("name")} />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.slug)}>
              <FieldLabel htmlFor="workspace-slug">Workspace slug</FieldLabel>
              <Input id="workspace-slug" placeholder="bright-future" aria-invalid={Boolean(form.formState.errors.slug)} {...form.register("slug")} />
              <FieldError>{form.formState.errors.slug?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-phone">Phone <span className="text-muted-foreground">(optional)</span></FieldLabel>
              <Input id="workspace-phone" placeholder="01700000000" {...form.register("phone")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-email">Email <span className="text-muted-foreground">(optional)</span></FieldLabel>
              <Input id="workspace-email" type="email" placeholder="hello@example.com" {...form.register("email")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="workspace-address">Address <span className="text-muted-foreground">(optional)</span></FieldLabel>
              <Input id="workspace-address" placeholder="Dhaka" {...form.register("address")} />
            </Field>
            {mutation.isError && <Alert variant="destructive"><AlertTitle>Couldn’t create workspace</AlertTitle><AlertDescription>{(mutation.error as { message?: string }).message ?? "Please check the details and try again."}</AlertDescription></Alert>}
            <Button className="w-full" type="submit" disabled={!form.formState.isValid || mutation.isPending}>
              {mutation.isPending && <Spinner data-icon="inline-start" />}
              Create workspace
            </Button>
          </FieldGroup>
        </form>
      </section>
    </main>
  );
}

function SelectedPlanSummary({ selectedPlan }: { selectedPlan?: SelectedPlanContext }) {
  if (!selectedPlan) return <p className="mt-4 text-sm text-muted-foreground">You can choose a plan after creating your workspace.</p>;

  const duration = selectedPlan.durationDays === 30 ? "monthly" : `every ${selectedPlan.durationDays} days`;
  const trial = selectedPlan.trial.included ? ` Includes a ${selectedPlan.trial.days}-day trial.` : "";
  return <p className="mt-4 text-sm text-muted-foreground">Selected plan: <span className="font-medium text-foreground">{selectedPlan.name}</span> · {duration}.{trial} <Link className="font-medium text-foreground underline underline-offset-4" href="/pricing">Change plan</Link></p>;
}

function Loading() {
  return <main className="flex min-h-screen items-center justify-center px-6"><Spinner aria-label="Loading onboarding" /></main>;
}

function StateError({ onRetry }: { onRetry: () => void }) {
  return <main className="mx-auto flex min-h-screen max-w-xl items-center px-6"><Alert variant="destructive"><AlertTitle>Couldn’t load onboarding</AlertTitle><AlertDescription><button className="underline" onClick={onRetry}>Try again</button></AlertDescription></Alert></main>;
}

function Status({ title, copy, selectedPlan }: { title: string; copy: string; selectedPlan?: SelectedPlanContext }) {
  return <main className="flex min-h-screen items-center justify-center px-6"><section className="w-full max-w-xl rounded-xl border border-border bg-card p-8"><h1 className="text-3xl font-medium tracking-tight">{title}</h1><p className="mt-2 text-muted-foreground">{copy}</p><SelectedPlanSummary selectedPlan={selectedPlan} /><Button render={<Link href="/pricing" />} className="mt-8">{selectedPlan ? "Change plan" : "Choose a plan"}</Button></section></main>;
}
