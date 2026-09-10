'use client';

import { useState } from 'react';
import { Check, LoaderCircle, Pencil, Plus, Trash2 } from 'lucide-react';
import { EmptyState, ErrorState, LoadingState } from '@/components/dashboard/dashboard-primitives';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
import type {
  PlatformEntitlementOverrideDraft,
  PlatformFeatureCatalogItem,
  PlatformPlan,
  WorkspaceEntitlementOverride,
} from '@/types/platform';
import {
  useRemoveWorkspaceEntitlementOverride,
  useSaveWorkspaceEntitlementOverride,
  useWorkspaceEntitlementOverrides,
} from '../queries/use-entitlement-overrides';
import { usePlatformFeatureCatalog, usePlatformPlans } from '../queries/use-platform-plans';

function initialDraft(override?: WorkspaceEntitlementOverride): PlatformEntitlementOverrideDraft {
  return {
    featureKey: override?.featureKey ?? '',
    enabledOverride:
      override?.enabledOverride === null || override?.enabledOverride === undefined
        ? 'default'
        : override.enabledOverride
          ? 'enabled'
          : 'disabled',
    limitOverride: override?.limitOverride ?? '',
    reason: override?.reason ?? '',
    expiresAt: override?.expiresAt ? override.expiresAt.slice(0, 10) : '',
  };
}

function defaultForFeature(plan: PlatformPlan | undefined, featureKey: string) {
  return (
    plan?.features.find((feature) => feature.featureKey === featureKey) ?? {
      enabled: false,
      limitValue: null,
    }
  );
}

function valueLabel(enabled: boolean, limit: string | null) {
  return `${enabled ? 'Enabled' : 'Disabled'} · ${limit ?? 'Unlimited'}`;
}

function OverrideEditor({
  workspaceId,
  catalog,
  plan,
  override,
  onDone,
}: {
  workspaceId: string;
  catalog: PlatformFeatureCatalogItem[];
  plan?: PlatformPlan;
  override?: WorkspaceEntitlementOverride;
  onDone: () => void;
}) {
  const saveMutation = useSaveWorkspaceEntitlementOverride();
  const [draft, setDraft] = useState(() => initialDraft(override));
  const [error, setError] = useState('');
  const isEditing = Boolean(override);
  const selectedDefault = defaultForFeature(plan, draft.featureKey);
  const effectiveEnabled =
    draft.enabledOverride === 'default'
      ? selectedDefault.enabled
      : draft.enabledOverride === 'enabled';
  const effectiveLimit = draft.limitOverride.trim() || selectedDefault.limitValue;

  function save() {
    if (!draft.featureKey) return setError('Choose a feature to override.');
    if (!draft.reason.trim()) return setError('Explain why this workspace needs an exception.');
    if (draft.limitOverride.trim() && !/^\d+$/.test(draft.limitOverride.trim()))
      return setError('Quota must be a non-negative whole number or blank for the plan default.');
    if (
      draft.expiresAt &&
      (Number.isNaN(new Date(`${draft.expiresAt}T23:59:59.999Z`).getTime()) ||
        draft.expiresAt < new Date().toISOString().slice(0, 10))
    )
      return setError('Expiry must be a valid date today or later.');
    if (draft.enabledOverride === 'default' && !draft.limitOverride.trim())
      return setError('Set a feature state or a quota override.');
    setError('');
    saveMutation.mutate(
      {
        workspaceId,
        overrideId: override?.id,
        input: {
          featureKey: draft.featureKey,
          enabledOverride:
            draft.enabledOverride === 'default' ? null : draft.enabledOverride === 'enabled',
          limitOverride: draft.limitOverride.trim() || null,
          reason: draft.reason.trim(),
          expiresAt: draft.expiresAt ? `${draft.expiresAt}T23:59:59.999Z` : null,
        },
      },
      { onSuccess: onDone }
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="overflow-y-auto px-5 pb-5">
        <div className="grid gap-4">
          <Field data-invalid={Boolean(error)}>
            <FieldLabel>Feature</FieldLabel>
            {isEditing ? (
              <Input value={override?.featureKey ?? ''} disabled />
            ) : (
              <Select
                items={catalog.map((feature) => ({ value: feature.key, label: feature.name }))}
                value={draft.featureKey || undefined}
                onValueChange={(featureKey) =>
                  setDraft((current) => ({ ...current, featureKey: featureKey ?? '' }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a catalog feature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {catalog.map((feature) => (
                      <SelectItem key={feature.key} value={feature.key}>
                        {feature.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            <FieldError errors={error ? [{ message: error }] : []} />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel>Feature state</FieldLabel>
              <Select
                items={[
                  { value: 'default', label: 'Plan default' },
                  { value: 'enabled', label: 'Enabled' },
                  { value: 'disabled', label: 'Disabled' },
                ]}
                value={draft.enabledOverride}
                onValueChange={(enabledOverride) =>
                  setDraft((current) => ({
                    ...current,
                    enabledOverride:
                      enabledOverride as PlatformEntitlementOverrideDraft['enabledOverride'],
                  }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="default">Plan default</SelectItem>
                    <SelectItem value="enabled">Enabled</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="override-limit">Quota override</FieldLabel>
              <Input
                id="override-limit"
                inputMode="numeric"
                placeholder="Plan default"
                value={draft.limitOverride}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, limitOverride: event.target.value }))
                }
              />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="override-expiry">Expiry date (optional)</FieldLabel>
            <Input
              id="override-expiry"
              type="date"
              value={draft.expiresAt}
              onChange={(event) =>
                setDraft((current) => ({ ...current, expiresAt: event.target.value }))
              }
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="override-reason">Reason</FieldLabel>
            <Input
              id="override-reason"
              maxLength={500}
              value={draft.reason}
              onChange={(event) =>
                setDraft((current) => ({ ...current, reason: event.target.value }))
              }
              placeholder="For example, temporary capacity extension"
            />
          </Field>
          <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
            <p className="font-medium text-foreground">Resulting effective value</p>
            <p className="mt-1 text-muted-foreground">
              Plan default: {valueLabel(selectedDefault.enabled, selectedDefault.limitValue)}
            </p>
            <p className="text-muted-foreground">
              Workspace override:{' '}
              {draft.enabledOverride === 'default' && !draft.limitOverride.trim()
                ? 'None'
                : valueLabel(
                    draft.enabledOverride === 'default'
                      ? selectedDefault.enabled
                      : draft.enabledOverride === 'enabled',
                    draft.limitOverride.trim() || null
                  )}
            </p>
            <p className="mt-1 font-medium text-foreground">
              Effective: {valueLabel(effectiveEnabled, effectiveLimit)}
            </p>
          </div>
        </div>
      </div>
      <SheetFooter>
        <Button type="button" variant="outline" disabled={saveMutation.isPending} onClick={onDone}>
          Cancel
        </Button>
        <Button type="button" disabled={saveMutation.isPending} onClick={save}>
          {saveMutation.isPending ? (
            <LoaderCircle className="animate-spin" data-icon="inline-start" />
          ) : (
            <Check data-icon="inline-start" />
          )}
          {isEditing ? 'Save override' : 'Create override'}
        </Button>
      </SheetFooter>
    </div>
  );
}

export function WorkspaceEntitlementOverridesSheet({
  open,
  onOpenChange,
  workspaceId,
  planId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  planId: string | null | undefined;
}) {
  const overridesQuery = useWorkspaceEntitlementOverrides(workspaceId);
  const catalogQuery = usePlatformFeatureCatalog();
  const plansQuery = usePlatformPlans();
  const removeMutation = useRemoveWorkspaceEntitlementOverride();
  const [editing, setEditing] = useState<WorkspaceEntitlementOverride | null | undefined>(
    undefined
  );
  const plan = plansQuery.data?.find((item) => item.id === planId);
  const ready = overridesQuery.data && catalogQuery.data && plansQuery.data;
  const closeEditor = () => setEditing(undefined);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Workspace entitlement overrides</SheetTitle>
          <SheetDescription>
            Exceptions apply only to this workspace. Plan defaults and historical records remain
            unchanged.
          </SheetDescription>
        </SheetHeader>
        {!ready && !overridesQuery.isError && !catalogQuery.isError && !plansQuery.isError ? (
          <div className="px-5">
            <LoadingState rows={5} />
          </div>
        ) : null}
        {overridesQuery.isError || catalogQuery.isError || plansQuery.isError ? (
          <div className="px-5">
            <ErrorState
              message="Could not load entitlement configuration."
              onRetry={() => {
                overridesQuery.refetch();
                catalogQuery.refetch();
                plansQuery.refetch();
              }}
            />
          </div>
        ) : null}
        {ready ? (
          editing !== undefined ? (
            <OverrideEditor
              key={editing?.id ?? 'new'}
              workspaceId={workspaceId}
              catalog={catalogQuery.data}
              plan={plan}
              override={editing ?? undefined}
              onDone={closeEditor}
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
              <div className="mb-4 flex justify-end">
                <Button size="sm" className="rounded-full" onClick={() => setEditing(null)}>
                  <Plus data-icon="inline-start" /> New override
                </Button>
              </div>
              {overridesQuery.data.length === 0 ? (
                <EmptyState
                  title="No workspace overrides"
                  description="This workspace currently inherits every plan default."
                />
              ) : (
                <div className="divide-y divide-border rounded-xl border border-border">
                  {overridesQuery.data.map((override) => (
                    <OverrideRow
                      key={override.id}
                      override={override}
                      plan={plan}
                      onEdit={() => setEditing(override)}
                      onRemove={() =>
                        removeMutation.mutate({ workspaceId, overrideId: override.id })
                      }
                      removing={removeMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function OverrideRow({
  override,
  plan,
  onEdit,
  onRemove,
  removing,
}: {
  override: WorkspaceEntitlementOverride;
  plan?: PlatformPlan;
  onEdit: () => void;
  onRemove: () => void;
  removing: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openedAt] = useState(() => Date.now());
  const planDefault = defaultForFeature(plan, override.featureKey);
  const expired = Boolean(override.expiresAt && new Date(override.expiresAt).getTime() <= openedAt);
  const effective = expired
    ? { enabled: planDefault.enabled, limit: planDefault.limitValue }
    : {
        enabled: override.enabledOverride ?? planDefault.enabled,
        limit: override.limitOverride ?? planDefault.limitValue,
      };
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div>
        <p className="font-medium text-foreground">{override.featureKey}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Plan: {valueLabel(planDefault.enabled, planDefault.limitValue)} · Override:{' '}
          {valueLabel(override.enabledOverride ?? planDefault.enabled, override.limitOverride)} ·
          Effective: {valueLabel(effective.enabled, effective.limit)}
          {expired ? ' (expired)' : ''}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {override.reason}
          {override.expiresAt
            ? ` · Expires ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(override.expiresAt))}`
            : ''}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" className="rounded-full" onClick={onEdit}>
          <Pencil data-icon="inline-start" /> Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => setConfirmOpen(true)}
          disabled={removing}
        >
          <Trash2 data-icon="inline-start" /> Remove
        </Button>
      </div>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this override?</AlertDialogTitle>
            <AlertDialogDescription>
              This restores the plan default for this workspace feature. It does not change the
              global plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={removing} onClick={() => onRemove()}>
              Remove override
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
