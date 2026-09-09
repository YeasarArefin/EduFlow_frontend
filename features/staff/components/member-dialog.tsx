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
import { type WorkspaceMember } from '../api/members';
import {
  useAddMemberMutation,
  useUpdateMemberRoleMutation,
} from '../mutations/use-member-mutations';
const schema = z.object({
  name: z.string().trim().min(1, 'Enter a name.'),
  email: z.string().trim().email('Enter a valid email address.'),
  password: z.string().min(12, 'Use at least 12 characters.'),
  roleId: z.string().uuid('Select a role.'),
});
type Values = z.infer<typeof schema>;
export function MemberDialog({
  open,
  onOpenChange,
  workspaceId,
  member,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  member?: WorkspaceMember;
}) {
  const roles = usePermissionConfigurationQuery(workspaceId),
    add = useAddMemberMutation(),
    update = useUpdateMemberRoleMutation(),
    editing = Boolean(member),
    pending = add.isPending || update.isPending;
  const form = useForm<Values>({
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
    if (open)
      form.reset({
        name: member?.name ?? '',
        email: member?.email ?? '',
        password: '',
        roleId: member?.roleId ?? '',
      });
  }, [form, member, open]);
  function submit(values: Values) {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Change member role' : 'Create member account'}</DialogTitle>
          <DialogDescription>
            {editing
              ? `Update ${member?.name}'s workspace role.`
              : 'Create the email and password they will use on the main EduFlow login page.'}
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(submit)}>
          <FieldGroup>
            {!editing ? (
              <>
                <Field data-invalid={Boolean(form.formState.errors.name)}>
                  <FieldLabel htmlFor="member-name">Name</FieldLabel>
                  <Input id="member-name" disabled={pending} {...form.register('name')} />
                  <FieldError
                    errors={
                      form.formState.errors.name
                        ? [{ message: form.formState.errors.name.message }]
                        : []
                    }
                  />
                </Field>
                <Field data-invalid={Boolean(form.formState.errors.email)}>
                  <FieldLabel htmlFor="member-email">Email</FieldLabel>
                  <Input
                    id="member-email"
                    type="email"
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
                  <FieldLabel htmlFor="member-password">Password</FieldLabel>
                  <Input
                    id="member-password"
                    type="password"
                    disabled={pending}
                    {...form.register('password')}
                  />
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
              <FieldLabel htmlFor="member-role">Workspace role</FieldLabel>
              <Select
                value={roleId}
                onValueChange={(value) => form.setValue('roleId', value, { shouldDirty: true })}
                disabled={pending || roles.isPending}
              >
                <SelectTrigger id="member-role" className="w-full">
                  <SelectValue placeholder="Select a role" />
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
          <DialogFooter>
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
                'Create account'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
