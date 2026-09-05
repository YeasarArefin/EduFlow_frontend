"use client";

import { Pencil, Plus, Power } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  ErrorState,
  LoadingState,
  SectionCard,
} from "@/components/dashboard-primitives";
import { StatusBadge } from "@/components/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type {
  AcademicResource,
  AcademicReference,
} from "../api/academic-references";
import {
  useAcademicReferences,
  useCreateAcademicReference,
  useRenameAcademicReference,
  useSetAcademicReferenceStatus,
} from "../hooks/use-academic-references";

function message(error: unknown) {
  return (
    (error as { message?: string })?.message ?? "Could not save this reference."
  );
}

const shortUnitLabels: Record<AcademicResource, { singular: string; plural: string }> = {
  "class-levels": { singular: "Class", plural: "Classes" },
  "mediums": { singular: "Medium", plural: "Mediums" },
  "academic-groups": { singular: "Group", plural: "Groups" },
};

export function AcademicReferenceCard({
  workspaceId,
  resource,
  title,
  description,
}: {
  workspaceId: string;
  resource: AcademicResource;
  title: string;
  description: string;
}) {
  const query = useAcademicReferences(workspaceId, resource);
  const create = useCreateAcademicReference();
  const rename = useRenameAcademicReference();
  const status = useSetAcademicReferenceStatus();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<AcademicReference | null>(null);
  const [editName, setEditName] = useState("");
  const [confirming, setConfirming] = useState<AcademicReference | null>(null);

  const singularTitle = shortUnitLabels[resource]?.singular ?? (title.endsWith("s") ? title.slice(0, -1) : title);
  const pluralTitle = shortUnitLabels[resource]?.plural ?? title;

  function add() {
    const value = name.trim();
    if (!value) return;
    create.mutate(
      { workspaceId, resource, name: value },
      {
        onSuccess: () => {
          setName("");
          toast.success(`${singularTitle} "${value}" added successfully.`);
        },
        onError: (err) => {
          toast.error(message(err));
        },
      },
    );
  }

  function saveRename() {
    if (!editing || !editName.trim()) return;
    const newName = editName.trim();
    rename.mutate(
      { workspaceId, resource, id: editing.id, name: newName },
      {
        onSuccess: () => {
          setEditing(null);
          toast.success(`${singularTitle} renamed to "${newName}".`);
        },
        onError: (err) => {
          toast.error(message(err));
        },
      },
    );
  }

  function toggleStatus(item: AcademicReference) {
    status.mutate(
      {
        workspaceId,
        resource,
        id: item.id,
        isActive: !item.isActive,
      },
      {
        onSuccess: () => {
          setConfirming(null);
          toast.success(
            `${item.name} ${item.isActive ? "deactivated" : "reactivated"} successfully.`,
          );
        },
        onError: (err) => {
          toast.error(message(err));
        },
      },
    );
  }

  return (
    <SectionCard
      title={title}
      description={description}
      action={
        query.data ? (
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/60">
            {query.data.length} {query.data.length === 1 ? singularTitle : pluralTitle}
          </span>
        ) : null
      }
    >
      <div className="flex flex-col gap-4">
        {/* Add Input Bar */}
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={`Add ${singularTitle.toLowerCase()}...`}
            className="h-10 rounded-full bg-input/60 border-input-border px-4 text-sm"
            disabled={create.isPending}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
          />
          <Button
            type="button"
            onClick={add}
            disabled={create.isPending || !name.trim()}
            className="h-10 px-5 rounded-full font-semibold shadow-sm shrink-0"
          >
            {create.isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <Plus data-icon="inline-start" />
            )}
            Add
          </Button>
        </div>

        {create.isError ? (
          <p className="text-xs text-destructive">{message(create.error)}</p>
        ) : null}

        {query.isPending ? <LoadingState rows={2} /> : null}

        {query.isError ? (
          <ErrorState
            message="Could not load reference data."
            onRetry={() => query.refetch()}
          />
        ) : null}

        {query.isSuccess && !query.data.length ? (
          <div className="rounded-2xl border border-dashed border-border/70 py-6 text-center">
            <p className="text-sm text-muted-foreground">
              No {title.toLowerCase()} configured yet.
            </p>
          </div>
        ) : null}

        {query.data && query.data.length > 0 ? (
          <div className="flex flex-col gap-2">
            {query.data.map((item) => {
              const isEditingThis = editing?.id === item.id;
              if (isEditingThis) {
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-2xl border border-primary/40 bg-card/90 p-2 shadow-xs backdrop-blur-xs"
                  >
                    <Input
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      autoFocus
                      disabled={rename.isPending}
                      className="h-9 rounded-full bg-input border-input-border px-3.5 text-sm flex-1"
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveRename();
                        } else if (event.key === "Escape") {
                          setEditing(null);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={saveRename}
                      disabled={rename.isPending || !editName.trim()}
                      className="h-9 px-4 rounded-full font-semibold shadow-sm shrink-0"
                    >
                      {rename.isPending && <Spinner data-icon="inline-start" />}
                      Save
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(null)}
                      disabled={rename.isPending}
                      className="h-9 px-3.5 rounded-full shrink-0"
                    >
                      Cancel
                    </Button>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/40 px-4 py-2.5 backdrop-blur-xs transition-all hover:border-border-strong hover:bg-card/70"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full shrink-0",
                        item.isActive ? "bg-primary" : "bg-muted-foreground/50",
                      )}
                    />
                    <span
                      className={cn(
                        "truncate text-sm font-medium",
                        item.isActive
                          ? "text-foreground"
                          : "text-muted-foreground line-through opacity-80",
                      )}
                    >
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusBadge status={item.isActive ? "success" : "info"}>
                      {item.isActive ? "Active" : "Inactive"}
                    </StatusBadge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                      aria-label={`Rename ${item.name}`}
                      title={`Rename ${item.name}`}
                      onClick={() => {
                        setEditing(item);
                        setEditName(item.name);
                      }}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className={cn(
                        "size-8 rounded-full transition-colors",
                        item.isActive
                          ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                      )}
                      aria-label={`${item.isActive ? "Deactivate" : "Reactivate"} ${item.name}`}
                      title={`${item.isActive ? "Deactivate" : "Reactivate"} ${item.name}`}
                      onClick={() => setConfirming(item)}
                    >
                      <Power className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {rename.isError ? (
          <p className="text-xs text-destructive">{message(rename.error)}</p>
        ) : null}
      </div>

      <AlertDialog
        open={Boolean(confirming)}
        onOpenChange={(open) => !open && setConfirming(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirming?.isActive ? "Deactivate" : "Reactivate"}{" "}
              {confirming?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming?.isActive
                ? "Existing records will preserve this reference historically, but it cannot be selected for new records."
                : "This reference will become available for new records again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={status.isPending}
              className="rounded-full"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={status.isPending}
              className={cn(
                "rounded-full font-semibold shadow-sm",
                confirming?.isActive
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary-hover",
              )}
              onClick={() => confirming && toggleStatus(confirming)}
            >
              {status.isPending && <Spinner data-icon="inline-start" />}
              {confirming?.isActive ? "Deactivate" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionCard>
  );
}
