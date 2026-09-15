export const TEACHER_STATUSES = ['active', 'inactive', 'archived'] as const;

export type TeacherStatus = (typeof TEACHER_STATUSES)[number];

export type Teacher = {
  id: string;
  teacherCode: string;
  name: string;
  phone: string | null;
  email: string | null;
  subjectSpecialty: string | null;
  defaultSalaryMinor: string;
  status: TeacherStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TeacherInput = {
  teacherCode: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  subjectSpecialty?: string | null;
  defaultSalaryMinor?: string;
  status?: TeacherStatus;
  notes?: string | null;
};

export type TeacherListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: TeacherStatus;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CreateTeacherMutationInput = { workspaceId: string; input: TeacherInput };
export type UpdateTeacherMutationInput = {
  workspaceId: string;
  id: string;
  input: Partial<TeacherInput>;
};
export type ArchiveTeacherMutationInput = { workspaceId: string; id: string };
export type TeacherSheetFormValues = {
  teacherCode: string;
  name: string;
  phone: string;
  email: string;
  subjectSpecialty: string;
  defaultSalaryTaka: string;
  status: TeacherStatus;
  notes: string;
};
export type TeachersPageProps = { workspaceId: string };
export type TeacherDetailPageProps = { workspaceId: string; teacherId: string };
export type TeacherSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  teacher?: Teacher;
};
export type TeacherOverviewCardProps = { teacher: Teacher };
export type TeacherContactCardProps = { teacher: Teacher };
export type TeacherCompensationCardProps = { teacher: Teacher };
export type TeacherNotesCardProps = { notes: string };
export type TeacherProfileSectionProps = { teacher: Teacher };
export type TeacherProfileDetailRowProps = { label: string; children: React.ReactNode };
