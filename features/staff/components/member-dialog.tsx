'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
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
import { usePermissionConfigurationQuery } from '../queries/use-permission-queries';
import type { MemberDialogProps, MemberFormValues } from '@/types/staff';
import {
  useAddMemberMutation,
  useUpdateMemberRoleMutation,
} from '../mutations/use-member-mutations';
import { getMemberInitials } from '@/utils/staff-formatters';

const schema = z.object({
  name: z.string().trim().min(1, 'Enter a name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  roleId: z.string().uuid('Select a role.'),
});

export function MemberDialog({ open, onOpenChange, workspaceId, member }: MemberDialogProps) {
  const roles = usePermissionConfigurationQuery(workspaceId);
  const add = useAddMemberMutation();
  const update = useUpdateMemberRoleMutation();
  const editing = Boolean(member);
  const pending = add.isPending || update.isPending;

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: member?.name ?? '',
      email: member?.email ?? '',
      password: '',
      roleId: member?.roleId ?? '',
    },
  });

  const roleId = useWatch({ control: form.control, name: 'roleId' });

  useEffect(() => {
    if (open) {
      form.reset({
        name: member?.name ?? '',
        email: member?.email ?? '',
        password: '',
        roleId: member?.roleId ?? '',
      });
    }
  }, [form, member, open]);

  function submit(values: MemberFormValues) {
    const options = {
      onSuccess: () => {
        toast.success(editing ? 'Member role updated.' : 'Account and workspace member created.');
        onOpenChange(false);
      },
      onError: (error: Error) => {
        form.setError('root', {
          message: error.message || 'Could not save this member.',
        });
      },
    };
    if (member) update.mutate({ workspaceId, id: member.id, roleId: values.roleId }, options);
    else add.mutate({ workspaceId, ...values }, options);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{editing ? 'Change member role' : 'Create member account'}</DialogTitle>
          <DialogDescription>
            {editing
              ? `Update role permissions and access level for ${member?.name}.`
              : 'Add a new team member and grant them access to this workspace.'}
          </DialogDescription>
        </DialogHeader>

        {editing && member ? (
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-semibold text-primary">
              {getMemberInitials(member.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
              <p className="truncate text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
        ) : null}

        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(submit)}>
          <FieldGroup className="gap-3.5">
            {!editing ? (
              <>
                <Field data-invalid={Boolean(form.formState.errors.name)}>
                  <FieldLabel htmlFor="member-name">Full name</FieldLabel>
                  <Input
                    id="member-name"
                    placeholder="e.g. Sarah Jenkins"
                    disabled={pending}
                    {...form.register('name')}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.name
                        ? [{ message: form.formState.errors.name.message }]
                        : []
                    }
                  />
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.email)}>
                  <FieldLabel htmlFor="member-email">Email address</FieldLabel>
                  <Input
                    id="member-email"
                    type="email"
                    placeholder="sarah@example.com"
                    disabled={pending}
                    {...form.register('email')}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.email
                        ? [{ message: form.formState.errors.email.message }]
                        : []
                    }
                  />
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.password)}>
                  <FieldLabel htmlFor="member-password">Initial password</FieldLabel>
                  <Input
                    id="member-password"
                    type="password"
                    placeholder="At least 8 characters"
                    disabled={pending}
                    {...form.register('password')}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Must be at least 8 characters. The member can change this upon sign in.
                  </p>
                  <FieldError
                    errors={
                      form.formState.errors.password
                        ? [{ message: form.formState.errors.password.message }]
                        : []
                    }
                  />
                </Field>
              </>
            ) : null}
            <Field data-invalid={Boolean(form.formState.errors.roleId)}>
              <FieldLabel htmlFor="member-role">Assigned role</FieldLabel>
              <Select
                value={roleId}
                onValueChange={(value) => form.setValue('roleId', value, { shouldDirty: true })}
                disabled={pending || roles.isPending}
              >
                <SelectTrigger id="member-role" className="w-full">
                  <SelectValue placeholder="Select a workspace role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {roles.data?.roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  form.formState.errors.roleId
                    ? [{ message: form.formState.errors.roleId.message }]
                    : []
                }
              />
            </Field>
            {form.formState.errors.root ? (
              <FieldError errors={[{ message: form.formState.errors.root.message }]} />
            ) : null}
          </FieldGroup>
          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                pending || roles.data?.roles.length === 0 || (editing && !form.formState.isDirty)
              }
            >
              {pending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving...
                </>
              ) : editing ? (
                'Save role'
              ) : (
                'Create member'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
