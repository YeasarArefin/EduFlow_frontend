'use client';

import {
  ArrowLeft,
  Check,
  Crown,
  KeyRound,
  Plus,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
} from '@/components/dashboard/dashboard-primitives';
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useResetMemberOverridesMutation,
  useUpdateMemberOverridesMutation,
  useUpdateRoleMutation,
} from '../mutations/use-permission-mutations';
import {
  useMemberPermissionConfigurationQuery,
  usePermissionConfigurationQuery,
} from '../queries/use-permission-queries';
import { useMembersQuery } from '../queries/use-members-query';
import { getMemberInitials, isProtectedOwner } from '@/utils/staff-formatters';
import type { PermissionManagementPageProps, PermissionOverride } from '@/types/staff';

export function PermissionManagementPage({ workspaceId }: PermissionManagementPageProps) {
  const configuration = usePermissionConfigurationQuery(workspaceId);
  const createRole = useCreateRoleMutation();
  const updateRole = useUpdateRoleMutation();
  const deleteRole = useDeleteRoleMutation();

  // Role Tab State
  const [roleId, setRoleId] = useState('');
  const [name, setName] = useState('');
  const [values, setValues] = useState<Record<number, boolean>>({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Member Overrides Tab State
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [overrideDrafts, setOverrideDrafts] = useState<Record<number, boolean | null>>({});

  const membersQuery = useMembersQuery(workspaceId, { limit: 100, page: 1 });
  const memberConfigQuery = useMemberPermissionConfigurationQuery(workspaceId, selectedMemberId);
  const updateMemberOverrides = useUpdateMemberOverridesMutation();
  const resetMemberOverrides = useResetMemberOverridesMutation();

  const isRoleSaving = createRole.isPending || updateRole.isPending;
  const isRoleDeleting = deleteRole.isPending;
  const isMemberSaving = updateMemberOverrides.isPending || resetMemberOverrides.isPending;

  const roles = configuration.data?.roles ?? [];
  const permissions = configuration.data?.permissions ?? [];
  const selectedRole = roles.find((role) => role.id === roleId);
  const isSelectedRoleOwner = selectedRole ? isProtectedOwner(selectedRole.name) : false;

  const permissionGroups = useMemo(() => {
    return permissions.reduce<Record<string, typeof permissions>>((acc, permission) => {
      const moduleName = permission.module || 'General';
      (acc[moduleName] ??= []).push(permission);
      return acc;
    }, {});
  }, [permissions]);

  const chooseRole = (value: string) => {
    if (value === 'new') {
      setRoleId('');
      setName('');
      setValues({});
      return;
    }
    const role = roles.find((item) => item.id === value);
    setRoleId(value);
    setName(role?.name ?? '');
    setValues(
      Object.fromEntries(
        permissions.map((permission) => [permission.code, permission.roles[value] ?? false])
      )
    );
  };

  const isRoleDirty = useMemo(() => {
    if (!roleId) return Boolean(name.trim());
    if (selectedRole?.name !== name) return true;
    for (const p of permissions) {
      const original = p.roles[roleId] ?? false;
      const current = values[p.code] ?? false;
      if (original !== current) return true;
    }
    return false;
  }, [name, permissions, roleId, selectedRole, values]);

  function handleSaveRole() {
    if (!name.trim()) {
      toast.error('Please enter a role name.');
      return;
    }

    const payload = {
      name: name.trim(),
      permissions: Object.entries(values).map(([permissionCode, allowed]) => ({
        permissionCode: Number(permissionCode),
        allowed,
      })),
    };

    if (selectedRole) {
      updateRole.mutate(
        { workspaceId, roleId: selectedRole.id, ...payload },
        {
          onSuccess: () => {
            toast.success(`Role "${name}" updated successfully.`);
          },
          onError: (err: Error) => {
            toast.error(err.message || 'Failed to update role.');
          },
        }
      );
    } else {
      createRole.mutate(
        { workspaceId, ...payload },
        {
          onSuccess: (newRole) => {
            toast.success(`Role "${name}" created successfully.`);
            chooseRole(newRole.id);
          },
          onError: (err: Error) => {
            toast.error(err.message || 'Failed to create role.');
          },
        }
      );
    }
  }

  function handleDeleteRole() {
    if (!selectedRole) return;
    deleteRole.mutate(
      { workspaceId, roleId: selectedRole.id },
      {
        onSuccess: () => {
          toast.success(`Role "${selectedRole.name}" deleted.`);
          chooseRole('new');
          setDeleteConfirmOpen(false);
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Failed to delete role.');
        },
      }
    );
  }

  function handleToggleModule(moduleItems: typeof permissions, allow: boolean) {
    if (isSelectedRoleOwner) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const item of moduleItems) {
        next[item.code] = allow;
      }
      return next;
    });
  }

  // Member Overrides Handlers
  const memberPermissions = memberConfigQuery.data?.permissions ?? [];
  const selectedMember = membersQuery.data?.data.find((m) => m.id === selectedMemberId);

  const isMemberOverridesDirty = useMemo(() => {
    return Object.keys(overrideDrafts).length > 0;
  }, [overrideDrafts]);

  function handleMemberOverrideChange(code: number, value: boolean | null) {
    setOverrideDrafts((prev) => ({
      ...prev,
      [code]: value,
    }));
  }

  function handleSaveMemberOverrides() {
    if (!selectedMemberId) return;

    // Combine current server state with drafts
    const combinedOverrides: PermissionOverride[] = [];
    for (const p of memberPermissions) {
      const draftVal = overrideDrafts[p.code];
      const effectiveOverride = draftVal !== undefined ? draftVal : p.overrideAllowed;
      if (effectiveOverride !== null) {
        combinedOverrides.push({
          permissionCode: p.code,
          allowed: effectiveOverride,
        });
      }
    }

    updateMemberOverrides.mutate(
      {
        workspaceId,
        memberId: selectedMemberId,
        overrides: combinedOverrides,
      },
      {
        onSuccess: () => {
          toast.success('Member permission overrides saved.');
          setOverrideDrafts({});
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Failed to save member overrides.');
        },
      }
    );
  }

  function handleResetMemberOverrides() {
    if (!selectedMemberId) return;
    resetMemberOverrides.mutate(
      {
        workspaceId,
        memberId: selectedMemberId,
      },
      {
        onSuccess: () => {
          toast.success('Member overrides reset to role defaults.');
          setOverrideDrafts({});
        },
        onError: (err: Error) => {
          toast.error(err.message || 'Failed to reset member overrides.');
        },
      }
    );
  }

  if (configuration.isPending) return <LoadingState rows={6} />;
  if (configuration.isError) {
    return (
      <ErrorState
        message="Could not load workspace role and permission configuration."
        onRetry={() => configuration.refetch()}
      />
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Header with Back Link */}
      <PageHeader
        title="Roles & Permissions"
        description="Configure workspace roles, grant module-level permissions, and manage individual member overrides."
        actions={
          <Button
            variant="outline"
            className="gap-2"
            render={<Link href="/workspace/staff" />}
          >
            <ArrowLeft className="size-4 text-muted-foreground" />
            <span>Back to staff</span>
          </Button>
        }
      />

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Defined Roles */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Defined Roles
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {roles.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Workspace role profiles</p>
          </div>
        </div>

        {/* System Permissions */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              System Permissions
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <KeyRound className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {permissions.length}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Granular module permissions</p>
          </div>
        </div>

        {/* Protected Owner */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Protected Owner
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Crown className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Full Access
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Immutable root role</p>
          </div>
        </div>

        {/* Security Model */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs transition-colors hover:border-border">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Security Model
            </span>
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="size-4" />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tenant RBAC
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Enforced with PostgreSQL RLS</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="roles" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-80">
          <TabsTrigger value="roles" className="gap-2 text-xs">
            <Shield className="size-3.5" />
            <span>Workspace Roles</span>
          </TabsTrigger>
          <TabsTrigger value="overrides" className="gap-2 text-xs">
            <Users className="size-3.5" />
            <span>Member Overrides</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: WORKSPACE ROLES */}
        <TabsContent value="roles" className="mt-6 flex flex-col gap-6">
          {/* Role Configuration Bar */}
          <Card className="rounded-2xl border border-border/80 bg-card/75 backdrop-blur-sm shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Role Definition</CardTitle>
                  <CardDescription className="text-xs">
                    Select an existing role to edit permissions or create a new custom role.
                  </CardDescription>
                </div>
                {isSelectedRoleOwner ? (
                  <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                    <Crown className="size-3.5" />
                    Protected Owner Role (Immutable)
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-56">
                  <Select value={roleId || 'new'} onValueChange={chooseRole}>
                    <SelectTrigger className="h-10 text-xs bg-background/80 border-border/70">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="new" className="font-medium text-primary">
                          + Create new role
                        </SelectItem>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSelectedRoleOwner || isRoleSaving}
                    placeholder="Role name (e.g. Academic Coordinator, Accounts Manager)"
                    className="h-10 text-xs bg-background/80 border-border/70"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleSaveRole}
                    disabled={!isRoleDirty || !name.trim() || isSelectedRoleOwner || isRoleSaving}
                    className="gap-2 text-xs shadow-sm"
                  >
                    {isRoleSaving ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="size-3.5" />
                        {selectedRole ? 'Save changes' : 'Create role'}
                      </>
                    )}
                  </Button>

                  {selectedRole && !isSelectedRoleOwner ? (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteConfirmOpen(true)}
                      disabled={isRoleDeleting}
                      className="text-destructive hover:bg-destructive/10 border-border/70"
                      title="Delete role"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module-by-Module Permission Grid */}
          <div className="grid gap-5">
            {Object.entries(permissionGroups).map(([moduleName, modulePermissions]) => {
              const grantedCount = modulePermissions.filter(
                (p) => values[p.code] || (isSelectedRoleOwner ? true : false)
              ).length;
              const allGranted = grantedCount === modulePermissions.length;

              return (
                <Card key={moduleName} className="rounded-2xl border border-border/80 bg-card/65 shadow-xs overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {moduleName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold text-foreground">{moduleName}</CardTitle>
                        <CardDescription className="text-[11px] text-muted-foreground">
                          {grantedCount} of {modulePermissions.length} permissions granted
                        </CardDescription>
                      </div>
                    </div>

                    {!isSelectedRoleOwner ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleModule(modulePermissions, true)}
                          disabled={allGranted}
                          className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Select all
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleModule(modulePermissions, false)}
                          disabled={grantedCount === 0}
                          className="h-7 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          Clear all
                        </Button>
                      </div>
                    ) : null}
                  </CardHeader>
                  <CardContent className="p-5">
                    <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                      {modulePermissions.map((permission) => {
                        const isGranted = isSelectedRoleOwner
                          ? true
                          : values[permission.code] ?? false;

                        return (
                          <div
                            key={permission.code}
                            onClick={() => {
                              if (isSelectedRoleOwner) return;
                              setValues((prev) => ({
                                ...prev,
                                [permission.code]: !isGranted,
                              }));
                            }}
                            className={`group relative flex items-start justify-between gap-3.5 rounded-xl border p-4 text-xs transition-all cursor-pointer select-none ${
                              isGranted
                                ? 'border-primary/45 bg-primary/[0.04] text-foreground shadow-xs ring-1 ring-primary/20'
                                : 'border-border/70 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/75'
                            } ${isSelectedRoleOwner ? 'cursor-not-allowed opacity-90' : ''}`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-foreground tracking-tight">
                                  {permission.name || permission.key}
                                </span>
                                <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground border border-border/50">
                                  #{permission.code}
                                </span>
                              </div>
                              {permission.description ? (
                                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                                  {permission.description}
                                </p>
                              ) : (
                                <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">
                                  {permission.key}
                                </p>
                              )}
                            </div>
                            <div className="pt-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <Switch
                                checked={isGranted}
                                disabled={isSelectedRoleOwner}
                                onCheckedChange={(checked) => {
                                  if (isSelectedRoleOwner) return;
                                  setValues((prev) => ({
                                    ...prev,
                                    [permission.code]: checked,
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 2: MEMBER OVERRIDES */}
        <TabsContent value="overrides" className="mt-6 flex flex-col gap-6">
          <Card className="rounded-2xl border border-border/80 bg-card/75 backdrop-blur-sm shadow-xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold">Individual Member Overrides</CardTitle>
              <CardDescription className="text-xs">
                Override specific permissions for an individual member without creating a dedicated role.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-80">
                  <Select
                    value={selectedMemberId}
                    onValueChange={(val) => {
                      setSelectedMemberId(val);
                      setOverrideDrafts({});
                    }}
                  >
                    <SelectTrigger className="h-10 text-xs bg-background/80 border-border/70">
                      <SelectValue placeholder="Select a workspace member..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {membersQuery.data?.data.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.role || 'No role'})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {selectedMember ? (
                  <div className="flex flex-1 items-center gap-2">
                    <Button
                      onClick={handleSaveMemberOverrides}
                      disabled={!isMemberOverridesDirty || isMemberSaving}
                      className="gap-2 text-xs shadow-sm"
                    >
                      {isMemberSaving ? (
                        <>
                          <Spinner data-icon="inline-start" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="size-3.5" />
                          Save overrides
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleResetMemberOverrides}
                      disabled={isMemberSaving}
                      className="gap-2 text-xs border-border/70"
                    >
                      <RotateCcw className="size-3.5 text-muted-foreground" />
                      Reset to role defaults
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Member Overview Strip */}
          {selectedMember ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-card/75 p-4 shadow-xs">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary ring-1 ring-primary/20">
                {getMemberInitials(selectedMember.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{selectedMember.name}</span>
                  <span className="rounded-md border border-border/60 bg-muted/60 px-2 py-0.5 text-xs font-medium">
                    {selectedMember.role || 'No role'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{selectedMember.email}</p>
              </div>
            </div>
          ) : null}

          {/* Permissions Workbench for Selected Member */}
          {!selectedMemberId ? (
            <EmptyState
              title="No member selected"
              description="Choose a team member from the dropdown above to inspect and customize their permission overrides."
            />
          ) : memberConfigQuery.isPending ? (
            <LoadingState rows={4} />
          ) : memberConfigQuery.isError ? (
            <ErrorState
              message="Could not load member permissions."
              onRetry={() => memberConfigQuery.refetch()}
            />
          ) : (
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {memberPermissions.map((permission) => {
                const inherited = permission.inheritedAllowed;
                const draft = overrideDrafts[permission.code];
                const currentOverride = draft !== undefined ? draft : permission.overrideAllowed;
                const effective = currentOverride !== null ? currentOverride : inherited;
                const hasCustomOverride = currentOverride !== null;

                return (
                  <Card
                    key={permission.code}
                    size="sm"
                    className={`rounded-xl border transition-all ${
                      effective
                        ? 'border-primary/45 bg-primary/[0.04] shadow-xs ring-1 ring-primary/20'
                        : 'border-border/80 bg-card/50'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-xs font-semibold text-foreground">
                            {permission.name || permission.key}
                          </CardTitle>
                          <span className="font-mono text-[10px] text-muted-foreground">
                            #{permission.code}
                          </span>
                        </div>
                        {hasCustomOverride ? (
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold border ${
                              currentOverride
                                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                                : 'border-destructive/30 bg-destructive/10 text-destructive'
                            }`}
                          >
                            {currentOverride ? 'Custom Allow' : 'Custom Deny'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            Inherited ({inherited ? 'Allow' : 'Deny'})
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {permission.description ? (
                        <p className="mb-3 text-[11px] text-muted-foreground">
                          {permission.description}
                        </p>
                      ) : null}

                      {/* Override Select Control */}
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant={currentOverride === true ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleMemberOverrideChange(permission.code, true)}
                          className="h-7 flex-1 text-[11px] border-border/70"
                        >
                          Force Allow
                        </Button>
                        <Button
                          variant={currentOverride === false ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleMemberOverrideChange(permission.code, false)}
                          className="h-7 flex-1 text-[11px] border-border/70"
                        >
                          Force Deny
                        </Button>
                        {hasCustomOverride ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMemberOverrideChange(permission.code, null)}
                            className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                            title="Reset to Inherited"
                          >
                            Reset
                          </Button>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Role Alert Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldAlert className="size-5 text-destructive" />
              Delete role "{selectedRole?.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Any members currently assigned to this role will lose their granted permissions until
              a new role is assigned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRoleDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isRoleDeleting}
              onClick={handleDeleteRole}
            >
              {isRoleDeleting ? 'Deleting...' : 'Delete role'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
