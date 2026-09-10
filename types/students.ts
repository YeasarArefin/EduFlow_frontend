export const STUDENT_STATUSES = ['active', 'inactive', 'archived'] as const;

export type StudentStatus = (typeof STUDENT_STATUSES)[number];

export type Student = {
  id: string;
  studentCode: string;
  fullName: string;
  phone: string | null;
  guardianName: string | null;
  guardianPhone: string | null;
  address: string | null;
  gender: 'male' | 'female' | 'other' | null;
  admissionDate: string | null;
  status: StudentStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StudentInput = {
  studentCode: string;
  fullName: string;
  phone?: string | null;
  guardianName?: string | null;
  guardianPhone?: string | null;
  address?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  admissionDate?: string | null;
  status?: StudentStatus;
  notes?: string | null;
};

export type StudentListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: StudentStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StudentEnrollment = {
  id: string;
  batchId: string;
  batchName: string;
  joinedAt: string;
  status: string;
  feeOverrideMinor: string | null;
  discountMinor: string | null;
};

export type CreateStudentMutationInput = { workspaceId: string; input: StudentInput };
export type UpdateStudentMutationInput = {
  workspaceId: string;
  studentId: string;
  input: Partial<StudentInput>;
};
export type ArchiveStudentMutationInput = { workspaceId: string; studentId: string };
export type StudentSheetFormValues = {
  studentCode: string;
  fullName: string;
  phone: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  gender: 'male' | 'female' | 'other' | '';
  admissionDate: string;
  status: StudentStatus;
  notes: string;
};
export type StudentSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  student?: Student | null;
};
export type StudentsPageProps = { workspaceId: string };
export type StudentDetailPageProps = { workspaceId: string; studentId: string };
export type StudentProfileSectionProps = { student: Student };
export type StudentProfileDetailRowProps = { label: string; children: import('react').ReactNode };
