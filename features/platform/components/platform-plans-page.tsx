'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Check,
  LoaderCircle,
  Pencil,
  Plus,
  Power,
  PowerOff,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DataTable,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from '@/components/dashboard/dashboard-primitives';
import { StatusBadge } from '@/components/status/status-badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { PlatformPlan, PlatformPlanFormValues } from '@/types/platform';
import {
  usePlatformPlans,
  useSavePlatformPlan,
  useSetPlatformPlanActive,
} from '../queries/use-platform-plans';
import { PlanFeaturesSheet } from './plan-features-sheet';
import {
  formatPlatformPlanPrice,
  minorToPlatformPriceInput,
  platformPriceToMinor,
} from '@/utils/platform-formatters';

const pricePattern = /^\d+(?:\.\d{1,2})?$/;
const nonNegativeIntegerPattern = /^\d+$/;

const planFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter a plan name.')
    .max(80, 'Plan names must be 80 characters or fewer.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Enter a slug.')
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens only.'),
  price: z
    .string()
    .trim()
    .regex(pricePattern, 'Use a non-negative amount with up to two decimal places.'),
  durationDays: z.string().trim().regex(nonNegativeIntegerPattern, 'Use a whole number of days.'),
  trialDays: z.string().trim().regex(nonNegativeIntegerPattern, 'Use a whole number of days.'),
});

function defaultValues(plan?: PlatformPlan): PlatformPlanFormValues {
  return plan
    ? {
        name: plan.name,
        slug: plan.slug,
        price: minorToPlatformPriceInput(plan.priceMinor),
        durationDays: String(plan.durationDays),
        trialDays: String(plan.trialDays),
      }
    : { name: '', slug: '', price: '0.00', durationDays: '30', trialDays: '0' };
}

function PlanEditorSheet({
  open,
  onOpenChange,
  plan,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlatformPlan | null;
}) {
  const saveMutation = useSavePlatformPlan();
  const form = useForm<PlatformPlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: defaultValues(plan ?? undefined),
  });
  const isEditing = Boolean(plan);

  function submit(values: PlatformPlanFormValues) {
    saveMutation.mutate(
      {
        planId: plan?.id,
        input: {
          name: values.name.trim(),
          slug: values.slug.trim(),
          priceMinor: platformPriceToMinor(values.price),
          durationDays: Number(values.durationDays),
          trialDays: Number(values.trialDays),
        },
      },
      { onSuccess: () => onOpenChange(false) }
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditing ? 'Edit plan' : 'Create plan'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the commercial terms for future subscriptions. Existing history remains unchanged.'
              : 'Set the commercial terms for a new SaaS plan. Feature and quota setup comes next.'}
          </SheetDescription>
        </SheetHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={form.handleSubmit(submit)}>
          <FieldGroup className="overflow-y-auto px-5 py-1">
            <Field data-invalid={Boolean(form.formState.errors.name)}>
              <FieldLabel htmlFor="plan-name">Name</FieldLabel>
              <Input
                id="plan-name"
                aria-invalid={Boolean(form.formState.errors.name)}
                disabled={saveMutation.isPending}
                {...form.register('name')}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.slug)}>
              <FieldLabel htmlFor="plan-slug">Slug</FieldLabel>
              <Input
                id="plan-slug"
                aria-invalid={Boolean(form.formState.errors.slug)}
                disabled={saveMutation.isPending}
                {...form.register('slug')}
              />
              <FieldDescription>
                Lowercase letters, numbers, and hyphens. This is used in plan links.
              </FieldDescription>
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.price)}>
              <FieldLabel htmlFor="plan-price">Price (BDT)</FieldLabel>
              <Input
                id="plan-price"
                inputMode="decimal"
                aria-invalid={Boolean(form.formState.errors.price)}
                disabled={saveMutation.isPending}
                {...form.register('price')}
              />
              <FieldDescription>
                Stored exactly in poisha. Enter up to two decimal places; no floating-point
                conversion is used.
              </FieldDescription>
              <FieldError errors={[form.formState.errors.price]} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={Boolean(form.formState.errors.durationDays)}>
                <FieldLabel htmlFor="plan-duration">Duration (days)</FieldLabel>
                <Input
                  id="plan-duration"
                  inputMode="numeric"
                  aria-invalid={Boolean(form.formState.errors.durationDays)}
                  disabled={saveMutation.isPending}
                  {...form.register('durationDays')}
                />
                <FieldError errors={[form.formState.errors.durationDays]} />
              </Field>
              <Field data-invalid={Boolean(form.formState.errors.trialDays)}>
                <FieldLabel htmlFor="plan-trial">Trial (days)</FieldLabel>
                <Input
                  id="plan-trial"
                  inputMode="numeric"
                  aria-invalid={Boolean(form.formState.errors.trialDays)}
                  disabled={saveMutation.isPending}
                  {...form.register('trialDays')}
                />
                <FieldError errors={[form.formState.errors.trialDays]} />
              </Field>
            </div>
          </FieldGroup>
          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              disabled={saveMutation.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending || (isEditing && !form.formState.isDirty)}
            >
              {saveMutation.isPending ? (
                <LoaderCircle className="animate-spin" data-icon="inline-start" />
              ) : (
                <Check data-icon="inline-start" />
              )}
              {isEditing ? 'Save changes' : 'Create plan'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function PlanStateAction({ plan }: { plan: PlatformPlan }) {
  const mutation = useSetPlatformPlanActive();
  const [open, setOpen] = useState(false);
  const nextState = !plan.isActive;
  const action = nextState ? 'Activate' : 'Deactivate';

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            size="sm"
            variant={plan.isActive ? 'outline' : 'default'}
            className="rounded-full"
            disabled={mutation.isPending}
          />
        }
      >
        {plan.isActive ? <PowerOff data-icon="inline-start" /> : <Power data-icon="inline-start" />}{' '}
        {action}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action} {plan.name}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            {nextState
              ? 'This plan will become available on public pricing and checkout.'
              : 'This removes the plan from public pricing and future checkout choices. Historical subscriptions and payments are preserved.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={mutation.isPending}
            onClick={() =>
              mutation.mutate(
                { planId: plan.id, isActive: nextState },
                { onSuccess: () => setOpen(false) }
              )
            }
          >
            {mutation.isPending ? (
              <LoaderCircle className="animate-spin" data-icon="inline-start" />
            ) : nextState ? (
              <Power data-icon="inline-start" />
            ) : (
              <PowerOff data-icon="inline-start" />
            )}
            {action} plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function PlatformPlansPage() {
  const planQuery = usePlatformPlans();
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlatformPlan | null>(null);
  const [featurePlan, setFeaturePlan] = useState<PlatformPlan | null>(null);
  const plans = planQuery.data ?? [];

  function openCreate() {
    setSelectedPlan(null);
    setEditorOpen(true);
  }
  function openEdit(plan: PlatformPlan) {
    setSelectedPlan(plan);
    setEditorOpen(true);
  }
  function handleEditorOpenChange(open: boolean) {
    setEditorOpen(open);
    if (!open) setSelectedPlan(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Plans"
        description="Manage commercial terms and public availability. Existing subscription and payment history is never deleted."
        actions={
          <Button className="rounded-full" onClick={openCreate}>
            <Plus data-icon="inline-start" /> Create plan
          </Button>
        }
      />
      {planQuery.isLoading ? <LoadingState rows={5} /> : null}
      {planQuery.isError ? (
        <ErrorState
          message={
            planQuery.error instanceof Error ? planQuery.error.message : 'Could not load plans.'
          }
          onRetry={() => planQuery.refetch()}
        />
      ) : null}
      {!planQuery.isLoading && !planQuery.isError && plans.length === 0 ? (
        <EmptyState
          title="No plans yet"
          description="Create your first SaaS plan to make it available for future subscriptions."
          action={
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" /> Create plan
            </Button>
          }
        />
      ) : null}
      {!planQuery.isLoading && !planQuery.isError && plans.length > 0 ? (
        <DataTable>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Trial</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell>
                  <div className="flex min-w-40 flex-col">
                    <span className="font-medium text-foreground">{plan.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{plan.slug}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium tabular-nums">
                  {formatPlatformPlanPrice(plan.priceMinor)}
                </TableCell>
                <TableCell>{plan.durationDays} days</TableCell>
                <TableCell>{plan.trialDays ? `${plan.trialDays} days` : 'No trial'}</TableCell>
                <TableCell>
                  <StatusBadge status={plan.isActive ? 'success' : 'info'}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
                    new Date(plan.updatedAt)
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => openEdit(plan)}
                    >
                      <Pencil data-icon="inline-start" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setFeaturePlan(plan)}
                    >
                      <SlidersHorizontal data-icon="inline-start" /> Features
                    </Button>
                    <PlanStateAction plan={plan} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      ) : null}
      {editorOpen ? (
        <PlanEditorSheet
          key={selectedPlan?.id ?? 'new'}
          open={editorOpen}
          onOpenChange={handleEditorOpenChange}
          plan={selectedPlan}
        />
      ) : null}
      {featurePlan ? (
        <PlanFeaturesSheet
          open={Boolean(featurePlan)}
          onOpenChange={(open) => {
            if (!open) setFeaturePlan(null);
          }}
          plan={featurePlan}
        />
      ) : null}
    </div>
  );
}
