'use client';
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionCard,
} from '@/components/dashboard-primitives';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
} from '../mutations/use-permission-mutations';
import { usePermissionConfigurationQuery } from '../queries/use-permission-queries';

export function PermissionManagementPage({ workspaceId }: { workspaceId: string }) {
  const configuration = usePermissionConfigurationQuery(workspaceId);
  const createRole = useCreateRoleMutation();
  const updateRole = useUpdateRoleMutation();
  const deleteRole = useDeleteRoleMutation();
  const [roleId, setRoleId] = useState('');
  const [name, setName] = useState('');
  const [values, setValues] = useState<Record<number, boolean>>({});
  if (configuration.isPending) return <LoadingState rows={6} />;
  if (configuration.isError)
    return (
      <ErrorState
        message="Could not load workspace roles."
        onRetry={() => configuration.refetch()}
      />
    );
  const roles = configuration.data?.roles ?? [];
  const permissions = configuration.data?.permissions ?? [];
  const selected = roles.find((role) => role.id === roleId);
  const groups = permissions.reduce<Record<string, typeof permissions>>((result, permission) => {
    const moduleName = permission.module ?? 'Other';
    (result[moduleName] ??= []).push(permission);
    return result;
  }, {});
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
  const payload = {
    name: name.trim(),
    permissions: Object.entries(values).map(([permissionCode, allowed]) => ({
      permissionCode: Number(permissionCode),
      allowed,
    })),
  };
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Roles & permissions"
        description="Create roles your workspace understands. The protected Owner always has full access."
      />
      <Tabs defaultValue="roles">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="overrides">Member Overrides</TabsTrigger>
        </TabsList>
        <TabsContent value="roles" className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row">
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Role name, e.g. Office Manager"
            />
            <Select value={roleId || 'new'} onValueChange={chooseRole}>
              <SelectTrigger className="sm:w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New role</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              disabled={!payload.name}
              onClick={() =>
                selected
                  ? updateRole.mutate({
                      workspaceId,
                      roleId: selected.id,
                      ...payload,
                    })
                  : createRole.mutate(
                      { workspaceId, ...payload },
                      { onSuccess: (role) => chooseRole(role.id) }
                    )
              }
            >
              Save role
            </Button>
            {selected ? (
              <Button
                variant="destructive"
                onClick={() =>
                  deleteRole.mutate(
                    { workspaceId, roleId: selected.id },
                    { onSuccess: () => chooseRole('new') }
                  )
                }
              >
                Delete
              </Button>
            ) : null}
          </div>
          {roles.length === 0 ? (
            <EmptyState
              title="Create your first role"
              description="For example: Teacher, Office Manager, or Accounts."
            />
          ) : null}
          {Object.entries(groups).map(([module, items]) => (
            <SectionCard key={module} title={module}>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((permission) => (
                  <label key={permission.code} className="flex gap-3 rounded-lg border p-3 text-sm">
                    <Checkbox
                      checked={values[permission.code] ?? false}
                      onCheckedChange={(checked) =>
                        setValues((current) => ({
                          ...current,
                          [permission.code]: checked === true,
                        }))
                      }
                    />
                    <span>{permission.name ?? permission.key}</span>
                  </label>
                ))}
              </div>
            </SectionCard>
          ))}
        </TabsContent>
        <TabsContent value="overrides" className="mt-5">
          <EmptyState
            title="Member overrides"
            description="Select a member from Staff & Members to manage their individual permission overrides."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
