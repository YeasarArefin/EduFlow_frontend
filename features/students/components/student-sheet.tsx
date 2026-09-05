"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import type { Student, StudentInput } from "../api/students";
import { useCreateStudentMutation } from "../mutations/use-create-student-mutation";
import { useUpdateStudentMutation } from "../mutations/use-update-student-mutation";

const phone = /^(?:\+8801\d{9}|01\d{9})$/;
const schema = z.object({
  studentCode: z.string().trim().min(1, "Student code is required.").max(30),
  fullName: z.string().trim().min(1, "Full name is required.").max(150),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => !value || phone.test(value),
      "Enter a valid Bangladeshi mobile number.",
    ),
  guardianName: z.string().trim().max(150),
  guardianPhone: z
    .string()
    .trim()
    .refine(
      (value) => !value || phone.test(value),
      "Enter a valid Bangladeshi mobile number.",
    ),
  address: z.string().trim().max(2000),
  gender: z.enum(["male", "female", "other", ""]),
  admissionDate: z.string(),
  status: z.enum(["active", "inactive", "archived"]),
  notes: z.string().trim().max(5000),
});
type Values = z.infer<typeof schema>;
const emptyValues: Values = {
  studentCode: "",
  fullName: "",
  phone: "",
  guardianName: "",
  guardianPhone: "",
  address: "",
  gender: "",
  admissionDate: "",
  status: "active",
  notes: "",
};
function valuesFromStudent(student?: Student | null): Values {
  return student
    ? {
      studentCode: student.studentCode,
      fullName: student.fullName,
      phone: student.phone ?? "",
      guardianName: student.guardianName ?? "",
      guardianPhone: student.guardianPhone ?? "",
      address: student.address ?? "",
      gender: student.gender ?? "",
      admissionDate: student.admissionDate ?? "",
      status: student.status,
      notes: student.notes ?? "",
    }
    : emptyValues;
}
function toInput(values: Values): StudentInput {
  return {
    studentCode: values.studentCode.trim(),
    fullName: values.fullName.trim(),
    phone: values.phone.trim() || null,
    guardianName: values.guardianName.trim() || null,
    guardianPhone: values.guardianPhone.trim() || null,
    address: values.address.trim() || null,
    gender: values.gender || null,
    admissionDate: values.admissionDate || null,
    status: values.status,
    notes: values.notes.trim() || null,
  };
}

export function StudentSheet({
  open,
  onOpenChange,
  workspaceId,
  student,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  student?: Student | null;
}) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: valuesFromStudent(student),
  });
  const createMutation = useCreateStudentMutation();
  const updateMutation = useUpdateStudentMutation();
  const isEditing = Boolean(student);
  const pending = createMutation.isPending || updateMutation.isPending;
  const gender = useWatch({ control: form.control, name: "gender" });
  const studentStatus = useWatch({ control: form.control, name: "status" });
  useEffect(() => {
    if (open) form.reset(valuesFromStudent(student));
  }, [form, open, student]);
  function submit(values: Values) {
    form.clearErrors("root");
    const input = toInput(values);
    const options = {
      onSuccess: () => {
        toast.success(
          isEditing
            ? "Student record updated."
            : "Student created successfully.",
        );
        onOpenChange(false);
      },
      onError: (error: Error) => {
        const message =
          error instanceof ApiError &&
            error.code === "STUDENT_CODE_ALREADY_EXISTS"
            ? "This student code is already used in this workspace."
            : "Could not save the student. Please try again.";
        form.setError("root", { message });
        toast.error(message);
      },
    };
    if (isEditing)
      updateMutation.mutate(
        { workspaceId, studentId: student!.id, input },
        options,
      );
    else createMutation.mutate({ workspaceId, input }, options);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl lg:max-w-3xl data-[side=right]:w-full data-[side=right]:sm:max-w-2xl data-[side=right]:lg:max-w-3xl">
        <SheetHeader className="border-b border-border/40 pb-4 pr-12">
          <SheetTitle>{isEditing ? "Edit student" : "Add student"}</SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Update this student's profile, contact details, and academic status."
              : "Create a new student profile in this coaching workspace."}
          </SheetDescription>
        </SheetHeader>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <FieldGroup className="gap-5">
              {/* Identity Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.studentCode)}>
                  <FieldLabel htmlFor="student-code">Student Code *</FieldLabel>
                  <Input
                    id="student-code"
                    placeholder="e.g. STU-001"
                    {...form.register("studentCode")}
                    aria-invalid={Boolean(form.formState.errors.studentCode)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.studentCode
                        ? [{ message: form.formState.errors.studentCode.message }]
                        : []
                    }
                  />
                </Field>

                <Field data-invalid={Boolean(form.formState.errors.fullName)}>
                  <FieldLabel htmlFor="student-name">Full Name *</FieldLabel>
                  <Input
                    id="student-name"
                    placeholder="e.g. Tanvir Ahmed"
                    {...form.register("fullName")}
                    aria-invalid={Boolean(form.formState.errors.fullName)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.fullName
                        ? [{ message: form.formState.errors.fullName.message }]
                        : []
                    }
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.phone)}>
                  <FieldLabel htmlFor="student-phone">Student Phone</FieldLabel>
                  <Input
                    id="student-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    {...form.register("phone")}
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

                <Field data-invalid={Boolean(form.formState.errors.guardianPhone)}>
                  <FieldLabel htmlFor="guardian-phone">Guardian Phone</FieldLabel>
                  <Input
                    id="guardian-phone"
                    type="tel"
                    inputMode="tel"
                    placeholder="01XXXXXXXXX"
                    {...form.register("guardianPhone")}
                    aria-invalid={Boolean(form.formState.errors.guardianPhone)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.guardianPhone
                        ? [{ message: form.formState.errors.guardianPhone.message }]
                        : []
                    }
                  />
                </Field>
              </div>

              <Field data-invalid={Boolean(form.formState.errors.guardianName)}>
                <FieldLabel htmlFor="guardian-name">Guardian Name</FieldLabel>
                <Input
                  id="guardian-name"
                  placeholder="e.g. Rafiqul Islam"
                  {...form.register("guardianName")}
                  aria-invalid={Boolean(form.formState.errors.guardianName)}
                />
                <FieldError
                  errors={
                    form.formState.errors.guardianName
                      ? [{ message: form.formState.errors.guardianName.message }]
                      : []
                  }
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.admissionDate)}>
                  <FieldLabel htmlFor="admission-date">Admission Date</FieldLabel>
                  <Input
                    id="admission-date"
                    type="date"
                    {...form.register("admissionDate")}
                    aria-invalid={Boolean(form.formState.errors.admissionDate)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.admissionDate
                        ? [{ message: form.formState.errors.admissionDate.message }]
                        : []
                    }
                  />
                </Field>

                <Field data-invalid={Boolean(form.formState.errors.status)}>
                  <FieldLabel htmlFor="student-status">Status</FieldLabel>
                  <Select
                    value={studentStatus}
                    onValueChange={(value) =>
                      form.setValue("status", value as Values["status"], {
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger id="student-status" className="w-full">
                      <SelectValue />
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={Boolean(form.formState.errors.gender)}>
                  <FieldLabel htmlFor="student-gender">Gender</FieldLabel>
                  <Select
                    value={gender || "unspecified"}
                    onValueChange={(value) =>
                      form.setValue(
                        "gender",
                        (value === "unspecified"
                          ? ""
                          : (value ?? "")) as Values["gender"],
                        { shouldDirty: true },
                      )
                    }
                  >
                    <SelectTrigger id="student-gender" className="w-full">
                      <SelectValue placeholder="Not specified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="unspecified">Not specified</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldError
                    errors={
                      form.formState.errors.gender
                        ? [{ message: form.formState.errors.gender.message }]
                        : []
                    }
                  />
                </Field>

                <Field data-invalid={Boolean(form.formState.errors.address)}>
                  <FieldLabel htmlFor="student-address">Address</FieldLabel>
                  <Input
                    id="student-address"
                    placeholder="e.g. Dhanmondi, Dhaka"
                    {...form.register("address")}
                    aria-invalid={Boolean(form.formState.errors.address)}
                  />
                  <FieldError
                    errors={
                      form.formState.errors.address
                        ? [{ message: form.formState.errors.address.message }]
                        : []
                    }
                  />
                </Field>
              </div>

              <Field data-invalid={Boolean(form.formState.errors.notes)}>
                <FieldLabel htmlFor="student-notes">Notes</FieldLabel>
                <Textarea
                  id="student-notes"
                  placeholder="Internal coaching remarks, previous institution, etc."
                  rows={3}
                  {...form.register("notes")}
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

              <FieldError
                errors={
                  form.formState.errors.root
                    ? [{ message: form.formState.errors.root.message }]
                    : []
                }
              />
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
            <Button
              type="submit"
              disabled={pending || (isEditing && !form.formState.isDirty)}
            >
              {pending && <Spinner data-icon="inline-start" />}
              {isEditing ? "Save changes" : "Create student"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
