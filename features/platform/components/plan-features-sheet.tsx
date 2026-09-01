"use client";

import { useState } from "react";
import { Check, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { EmptyState, ErrorState, LoadingState } from "@/components/dashboard-primitives";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { PlatformFeatureCatalogItem, PlatformPlan, PlatformPlanFeature } from "../api/plans";
import { usePlatformFeatureCatalog, useUpdatePlatformPlanFeatures } from "../hooks/use-platform-plans";

type DraftFeature = PlatformPlanFeature & { quota: string };

function createDraft(catalog: PlatformFeatureCatalogItem[], plan: PlatformPlan): DraftFeature[] {
  return catalog.map((feature) => {
    const saved = plan.features.find((item) => item.featureKey === feature.key);
    return {
      featureKey: feature.key,
      enabled: saved?.enabled ?? false,
      limitValue: saved?.limitValue ?? null,
      quota: saved?.limitValue ?? "",
    };
  });
}

function FeatureEditor({ catalog, plan, onClose }: { catalog: PlatformFeatureCatalogItem[]; plan: PlatformPlan; onClose: () => void }) {
  const updateMutation = useUpdatePlatformPlanFeatures();
  const [draft, setDraft] = useState(() => createDraft(catalog, plan));
  const [quotaErrors, setQuotaErrors] = useState<Record<string, string>>({});
  const [confirmDisable, setConfirmDisable] = useState(false);
  const initial = JSON.stringify(createDraft(catalog, plan).map(({ featureKey, enabled, limitValue }) => ({ featureKey, enabled, limitValue })));
  const current = JSON.stringify(draft.map(({ featureKey, enabled, limitValue }) => ({ featureKey, enabled, limitValue })));
  const isDirty = initial !== current || draft.some((feature) => (feature.quota || null) !== feature.limitValue);

  function updateFeature(featureKey: string, updates: Partial<DraftFeature>) {
    setDraft((currentDraft) => currentDraft.map((feature) => feature.featureKey === featureKey ? { ...feature, ...updates } : feature));
  }

  function validateAndSave() {
    const errors = Object.fromEntries(draft.filter((feature) => feature.quota.trim() && !/^\d+$/.test(feature.quota.trim())).map((feature) => [feature.featureKey, "Use a non-negative whole number or leave blank for unlimited."]));
    setQuotaErrors(errors);
    if (Object.keys(errors).length) return;
    if (draft.some((feature) => plan.features.find((saved) => saved.featureKey === feature.featureKey)?.enabled && !feature.enabled)) {
      setConfirmDisable(true);
      return;
    }
    save();
  }

  function save() {
    updateMutation.mutate({
      planId: plan.id,
      features: draft.map(({ featureKey, enabled, quota }) => ({ featureKey, enabled, limitValue: quota.trim() || null })),
    }, { onSuccess: onClose });
  }

  return (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
        {catalog.length === 0 ? <EmptyState title="No features in the catalog" description="Features must be configured in the backend catalog before they can be included in a plan." /> : <div className="divide-y divide-border rounded-xl border border-border">{catalog.map((feature) => {
          const draftFeature = draft.find((item) => item.featureKey === feature.key)!;
          const error = quotaErrors[feature.key];
          return <div key={feature.key} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"><div><p className="font-medium text-foreground">{feature.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{feature.description ?? feature.key}</p></div><Field className="sm:w-40" data-invalid={Boolean(error)}><FieldLabel htmlFor={`quota-${feature.key}`} className="text-xs">Default quota</FieldLabel><Input id={`quota-${feature.key}`} inputMode="numeric" placeholder="Unlimited" aria-invalid={Boolean(error)} disabled={updateMutation.isPending || !draftFeature.enabled} value={draftFeature.quota} onChange={(event) => updateFeature(feature.key, { quota: event.target.value, limitValue: event.target.value.trim() || null })} /><FieldError errors={error ? [{ message: error }] : []} /></Field><Button type="button" size="sm" variant={draftFeature.enabled ? "default" : "outline"} className="rounded-full" aria-pressed={draftFeature.enabled} disabled={updateMutation.isPending} onClick={() => updateFeature(feature.key, { enabled: !draftFeature.enabled })}>{draftFeature.enabled ? "Enabled" : "Disabled"}</Button></div>;
        })}</div>}
      </div>
      <SheetFooter>
        <Button type="button" variant="outline" disabled={updateMutation.isPending} onClick={onClose}>Cancel</Button>
        <Button type="button" disabled={updateMutation.isPending || !isDirty || catalog.length === 0} onClick={validateAndSave}>{updateMutation.isPending ? <LoaderCircle className="animate-spin" data-icon="inline-start" /> : <Check data-icon="inline-start" />} Save features</Button>
      </SheetFooter>
      <AlertDialog open={confirmDisable} onOpenChange={setConfirmDisable}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Disable plan features?</AlertDialogTitle><AlertDialogDescription>Disabled features are removed from public pricing and future entitlement defaults. Existing subscriptions and payments remain historical records.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={updateMutation.isPending}>Cancel</AlertDialogCancel><AlertDialogAction disabled={updateMutation.isPending} onClick={save}>Disable and save</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}

export function PlanFeaturesSheet({ open, onOpenChange, plan }: { open: boolean; onOpenChange: (open: boolean) => void; plan: PlatformPlan | null }) {
  const catalogQuery = usePlatformFeatureCatalog();
  const close = () => onOpenChange(false);

  return <Sheet open={open} onOpenChange={onOpenChange}><SheetContent><SheetHeader><SheetTitle className="flex items-center gap-2"><SlidersHorizontal /> Plan features & quotas</SheetTitle><SheetDescription>{plan ? `Configure what ${plan.name} includes. A blank quota means unlimited.` : ""}</SheetDescription></SheetHeader>{catalogQuery.isLoading ? <div className="px-5"><LoadingState rows={4} /></div> : null}{catalogQuery.isError ? <div className="px-5"><ErrorState message={catalogQuery.error instanceof Error ? catalogQuery.error.message : "Could not load the feature catalog."} onRetry={() => catalogQuery.refetch()} /></div> : null}{catalogQuery.data && plan ? <FeatureEditor key={`${plan.id}-${catalogQuery.data.map((item) => item.key).join("-")}`} catalog={catalogQuery.data} plan={plan} onClose={close} /> : null}</SheetContent></Sheet>;
}
