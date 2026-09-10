'use client';

import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api/client';
import type {
  Teacher,
  TeacherInput,
  TeacherSheetFormValues,
  TeacherSheetProps,
  TeacherStatus,
} from '@/types/teachers';
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from '../mutations/use-teacher-mutations';
import { TEACHER_STATUSES } from '@/types/teachers';
import {
  formatTeacherTakaPreview,
  teacherMinorFromTaka,
  teacherTakaFromMinor,
} from '@/utils/teacher-formatters';

const phonePattern = /^(?:\+8801\d{9}|01\d{9})$/;
const currencyPattern = /^\d*(?:\.\d{0,2})?$/;

const schema = z.object({
  teacherCode: z
    .string()
    .trim()
    .min(1, 'Teacher code is required.')
    .max(30, 'Teacher code cannot exceed 30 characters.'),
  name: z
    .string()
    .trim()
    .min(1, 'Teacher name is required.')
    .max(150, 'Teacher name cannot exceed 150 characters.'),
  phone: z
    .string()
    .trim()
    .refine(
      (val) => !val || phonePattern.test(val),
      'Enter a valid Bangladeshi mobile number (e.g. 01712345678 or +8801712345678).'
    ),
  email: z
    .string()
    .trim()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      'Enter a valid email address.'
    ),
  subjectSpecialty: z.string().trim().max(100, 'Specialty cannot exceed 100 characters.'),
  defaultSalaryTaka: z
    .string()
    .trim()
    .refine(
      (val) => !val || currencyPattern.test(val),
      'Enter a valid salary amount (e.g. 15000 or 15000.50).'
    ),
  status: z.enum(TEACHER_STATUSES),
  notes: z.string().trim().max(2000, 'Notes cannot exceed 2000 characters.'),
});

function defaultValuesFromTeacher(teacher?: Teacher): TeacherSheetFormValues {
  if (teacher) {
    return {
      teacherCode: teacher.teacherCode,
      name: teacher.name,
      phone: teacher.phone ?? '',
      email: teacher.email ?? '',
      subjectSpecialty: teacher.subjectSpecialty ?? '',
      defaultSalaryTaka: teacherTakaFromMinor(teacher.defaultSalaryMinor),
      status: teacher.status,
      notes: teacher.notes ?? '',
    };
  }
  return {
    teacherCode: '',
    name: '',
    phone: '',
    email: '',
    subjectSpecialty: '',
    defaultSalaryTaka: '0',
    status: 'active',
    notes: '',
  };
}

export function TeacherSheet({ open, onOpenChange, workspaceId, teacher }: TeacherSheetProps) {
  const createMutation = useCreateTeacherMutation();
  const updateMutation = useUpdateTeacherMutation();
  const isEditing = Boolean(teacher);
  const pending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<TeacherSheetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValuesFromTeacher(teacher),
  });

  const salaryTaka = useWatch({
    control: form.control,
    name: 'defaultSalaryTaka',
  });
  const currentStatus = useWatch({
    control: form.control,
    name: 'status',
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValuesFromTeacher(teacher));
    }
  }, [form, open, teacher]);

  function submit(values: TeacherSheetFormValues) {
    form.clearErrors('root');
    const input: TeacherInput = {
      teacherCode: values.teacherCode,
      name: values.name,
      phone: values.phone || null,
      email: values.email || null,
      subjectSpecialty: values.subjectSpecialty || null,
      defaultSalaryMinor: teacherMinorFromTaka(values.defaultSalaryTaka),
      status: values.status,
      notes: values.notes || null,
    };

    const options = {
      onSuccess: () => {
        toast.success(
          isEditing ? 'Teacher record updated successfully.' : 'Teacher created successfully.'
        );
        onOpenChange(false);
      },
      onError: (error: Error) => {
        const message =
          error instanceof ApiError && error.code === 'TEACHER_CODE_ALREADY_EXISTS'
            ? 'This teacher code is already assigned to another teacher in this workspace.'
            : error.message || 'Could not save teacher record. Please try again.';
        form.setError('root', { message });
        toast.error(message);
      },
    };

    if (isEditing && teacher) {
      updateMutation.mutate({ workspaceId, id: teacher.id, input }, options);
    } else {
      createMutation.mutate({ workspaceId, input }, options);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
        <SheetHeader className="border-b border-border/40 pb-4 pr-12">
          <SheetTitle>{isEditing ? 'Edit teacher' : 'Add teacher'}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update teacher profile, contact details, subject specialization, and compensation.'
              : 'Register a new instructor or tutor into this coaching workspace.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={form.handleSubmit(submit)} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FieldGroup className="gap-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.teacherCode)}>
                  <FieldLabel htmlFor="teacher-code">Teacher Code *</FieldLabel>
                  <Input
                    id="teacher-code"
                    placeholder="e.g. T-101"
                    disabled={pending}
                    {...form.register('teacherCode')}
                    aria-invalid={Boolean(form.formState.errors.teacherCode)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.teacherCode
                        ? [{ message: form.formState.errors.teacherCode.message }]
                        : []
                    }
                  />
                </Field>

                <Field data-invalid={Boolean(form.formState.errors.name)}>
                  <FieldLabel htmlFor="teacher-name">Full Name *</FieldLabel>
                  <Input
                    id="teacher-name"
                    placeholder="e.g. Prof. Rafiqul Islam"
                    disabled={pending}
                    {...form.register('name')}
                    aria-invalid={Boolean(form.formState.errors.name)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.name
                        ? [{ message: form.formState.errors.name.message }]
                        : []
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.phone)}>
                  <FieldLabel htmlFor="teacher-phone">Phone Number</FieldLabel>
                  <Input
                    id="teacher-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    disabled={pending}
                    {...form.register('phone')}
                    aria-invalid={Boolean(form.formState.errors.phone)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.phone
                        ? [{ message: form.formState.errors.phone.message }]
                        : []
                    }
                  />
                </Field>

                <Field data-invalid={Boolean(form.formState.errors.email)}>
                  <FieldLabel htmlFor="teacher-email">Email Address</FieldLabel>
                  <Input
                    id="teacher-email"
                    type="email"
                    placeholder="teacher@example.com"
                    disabled={pending}
                    {...form.register('email')}
                    aria-invalid={Boolean(form.formState.errors.email)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.email
                        ? [{ message: form.formState.errors.email.message }]
                        : []
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.subjectSpecialty)}>
                  <FieldLabel htmlFor="teacher-specialty">Subject Specialty</FieldLabel>
                  <Input
                    id="teacher-specialty"
                    placeholder="e.g. Higher Mathematics, Physics"
                    disabled={pending}
                    {...form.register('subjectSpecialty')}
                    aria-invalid={Boolean(form.formState.errors.subjectSpecialty)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.subjectSpecialty
                        ? [{ message: form.formState.errors.subjectSpecialty.message }]
                        : []
                    }
                  />
                </Field>

                {isEditing ? (
                  <Field>
                    <FieldLabel htmlFor="teacher-status">Status</FieldLabel>
                    <Select
                      value={currentStatus}
                      onValueChange={(val) => {
                        if (val)
                          form.setValue('status', val as TeacherStatus, { shouldDirty: true });
                      }}
                      disabled={pending}
                    >
                      <SelectTrigger id="teacher-status" className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldError
                      errors={
                        form.formState.errors.status
                          ? [{ message: form.formState.errors.status.message }]
                          : []
                      }
                    />
                  </Field>
                ) : null}
              </div>

              <Field data-invalid={Boolean(form.formState.errors.defaultSalaryTaka)}>
                <FieldLabel htmlFor="teacher-salary">Default Salary (BDT ৳)</FieldLabel>
                <Input
                  id="teacher-salary"
                  inputMode="decimal"
                  placeholder="0.00"
                  disabled={pending}
                  {...form.register('defaultSalaryTaka')}
                  aria-invalid={Boolean(form.formState.errors.defaultSalaryTaka)}
                />
                <div className="mt-1 flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-1.5 text-xs text-muted-foreground">
                  <span>Formatted Monthly Compensation</span>
                  <span className="font-semibold text-foreground">
                    {formatTeacherTakaPreview(salaryTaka || '0')}
                  </span>
                </div>
                <FieldError
                  errors={
                    form.formState.errors.defaultSalaryTaka
                      ? [{ message: form.formState.errors.defaultSalaryTaka.message }]
                      : []
                  }
                />
              </Field>

              <Field data-invalid={Boolean(form.formState.errors.notes)}>
                <FieldLabel htmlFor="teacher-notes">Notes & Observations</FieldLabel>
                <Textarea
                  id="teacher-notes"
                  placeholder="Add educational qualifications, schedule availability, or contract notes..."
                  className="min-h-24"
                  rows={3}
                  disabled={pending}
                  {...form.register('notes')}
                  aria-invalid={Boolean(form.formState.errors.notes)}
                />
                <FieldError
                  errors={
                    form.formState.errors.notes
                      ? [{ message: form.formState.errors.notes.message }]
                      : []
                  }
                />
              </Field>

              {form.formState.errors.root ? (
                <FieldError errors={[{ message: form.formState.errors.root.message }]} />
              ) : null}
            </FieldGroup>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending || (isEditing && !form.formState.isDirty)}>
              {pending ? (
                <>
                  <Spinner className="size-4" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                'Save changes'
              ) : (
                'Create teacher'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
